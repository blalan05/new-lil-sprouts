import { action, query, redirect, reload } from "@solidjs/router";
import { db } from "./db";

// Helper function to format parent names
export function formatParentNames(
  parentFirstName: string,
  parentLastName: string,
  familyMembers?: Array<{ firstName: string; lastName: string; relationship: string }>
): string {
  // Find spouse/partner (family member with PARENT relationship)
  const spouse = familyMembers?.find(
    (member) => member.relationship === "PARENT"
  );

  if (spouse && spouse.lastName === parentLastName) {
    // Same last name - format as "First1 & First2 Last"
    return `${parentFirstName} & ${spouse.firstName} ${parentLastName}`;
  } else if (spouse) {
    // Different last names - format as "First1 Last1 & First2 Last2"
    return `${parentFirstName} ${parentLastName} & ${spouse.firstName} ${spouse.lastName}`;
  }

  // No spouse found - just return main parent
  return `${parentFirstName} ${parentLastName}`;
}

export const getFamilies = query(async () => {
  "use server";
  const families = await db.family.findMany({
    include: {
      children: {
        orderBy: {
          firstName: "asc",
        },
      },
      familyMembers: {
        where: {
          relationship: "PARENT", // Only get spouse/partner
        },
        select: {
          firstName: true,
          lastName: true,
          relationship: true,
        },
      },
      _count: {
        select: {
          children: true,
        },
      },
    },
    orderBy: {
      familyName: "asc",
    },
  });

  // Calculate amount owed for each family
  const familiesWithAmountOwed = await Promise.all(
    families.map(async (family) => {
      // Get all confirmed unpaid sessions for this family
      const unpaidSessions = await db.careSession.findMany({
        where: {
          familyId: family.id,
          isConfirmed: true,
          status: {
            in: ["SCHEDULED", "COMPLETED"],
          },
        },
        include: {
          payments: {
            where: {
              status: "PAID",
            },
          },
        },
      });

      // Filter out sessions that already have a PAID payment
      const trulyUnpaid = unpaidSessions.filter((session) => session.payments.length === 0);

      // Calculate total amount owed
      // Note: hourlyRate is already the total rate (per-child rate * number of children)
      let amountOwed = 0;
      for (const session of trulyUnpaid) {
        const startTime = new Date(session.scheduledStart).getTime();
        const endTime = new Date(session.scheduledEnd).getTime();
        const hours = (endTime - startTime) / (1000 * 60 * 60);
        const rate = session.hourlyRate || 0;
        amountOwed += hours * rate;
      }

      return {
        ...family,
        amountOwed,
        unpaidSessionCount: trulyUnpaid.length,
      };
    })
  );

  return familiesWithAmountOwed;
}, "families");

export const getFamily = query(async (id: string) => {
  "use server";
  const family = await db.family.findUnique({
    where: { id },
    include: {
      children: {
        orderBy: {
          firstName: "asc",
        },
      },
      familyMembers: {
        where: {
          relationship: "PARENT", // Only get spouse/partner
        },
        select: {
          firstName: true,
          lastName: true,
          relationship: true,
        },
      },
      careSessions: {
        include: {
          children: true,
        },
        orderBy: {
          scheduledStart: "desc",
        },
        take: 10,
      },
      payments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      },
      services: {
        include: {
          service: {
            select: {
              id: true,
              name: true,
              code: true,
            },
          },
        },
      },
    },
  });
  if (!family) throw new Error("Family not found");
  return family;
}, "family");

export const createFamily = action(async (formData: FormData) => {
  "use server";
  try {
    const familyName = String(formData.get("familyName"));
    const parentFirstName = String(formData.get("parentFirstName"));
    const parentLastName = String(formData.get("parentLastName"));
    const email = String(formData.get("email"));
    const phone = String(formData.get("phone") || "");
    const address = String(formData.get("address") || "");
    const city = String(formData.get("city") || "");
    const state = String(formData.get("state") || "");
    const zipCode = String(formData.get("zipCode") || "");
    const emergencyContact = String(formData.get("emergencyContact") || "");
    const emergencyPhone = String(formData.get("emergencyPhone") || "");
    const notes = String(formData.get("notes") || "");

    // Spouse/Partner information (optional)
    const spouseFirstName = String(formData.get("spouseFirstName") || "");
    const spouseLastName = String(formData.get("spouseLastName") || "");
    const spouseEmail = String(formData.get("spouseEmail") || "");
    const spousePhone = String(formData.get("spousePhone") || "");

    // Children information (optional) - collect all children from form data
    const children: Array<{
      firstName: string;
      lastName: string;
      dateOfBirth: string;
      gender: string;
    }> = [];
    
    let childIndex = 0;
    while (true) {
      const firstName = String(formData.get(`childFirstName_${childIndex}`) || "");
      const lastName = String(formData.get(`childLastName_${childIndex}`) || "");
      const dateOfBirth = String(formData.get(`childDateOfBirth_${childIndex}`) || "");
      const gender = String(formData.get(`childGender_${childIndex}`) || "");
      
      if (!firstName && !lastName && !dateOfBirth) {
        break; // No more children
      }
      
      if (firstName && lastName && dateOfBirth) {
        children.push({ firstName, lastName, dateOfBirth, gender });
      }
      
      childIndex++;
    }

    // Get selected service IDs
    const selectedServiceIds = formData.getAll("serviceIds") as string[];

    if (!familyName) {
      return new Error("Family name is required");
    }

    if (!parentFirstName || !parentLastName) {
      return new Error("Parent first and last name are required");
    }

    if (!email) {
      return new Error("Email is required");
    }

    const family = await db.family.create({
      data: {
        familyName,
        parentFirstName,
        parentLastName,
        email,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null,
        notes: notes || null,
        services: {
          create: selectedServiceIds.map((serviceId) => ({
            serviceId,
          })),
        },
      },
    });

    // Create spouse/partner as family member if information is provided
    if (spouseFirstName && spouseLastName) {
      await db.familyMember.create({
        data: {
          familyId: family.id,
          firstName: spouseFirstName,
          lastName: spouseLastName,
          relationship: "PARENT", // Spouse/partner is also a parent
          email: spouseEmail || null,
          phone: spousePhone || null,
          canPickup: true, // Default to authorized for pickup
        },
      });
    }

    // Create children if information is provided
    for (const child of children) {
      await db.child.create({
        data: {
          familyId: family.id,
          firstName: child.firstName,
          lastName: child.lastName,
          dateOfBirth: new Date(child.dateOfBirth),
          gender: (child.gender as any) || null,
        },
      });
    }

    return redirect(`/families/${family.id}`);
  } catch (err) {
    console.error("Error creating family:", err);
    return new Error(err instanceof Error ? err.message : "Failed to create family");
  }
});

export const updateFamily = action(async (formData: FormData) => {
  "use server";
  try {
    const id = String(formData.get("id"));
    const familyName = String(formData.get("familyName"));
    const parentFirstName = String(formData.get("parentFirstName"));
    const parentLastName = String(formData.get("parentLastName"));
    const email = String(formData.get("email"));
    const phone = String(formData.get("phone") || "");
    const address = String(formData.get("address") || "");
    const city = String(formData.get("city") || "");
    const state = String(formData.get("state") || "");
    const zipCode = String(formData.get("zipCode") || "");
    const emergencyContact = String(formData.get("emergencyContact") || "");
    const emergencyPhone = String(formData.get("emergencyPhone") || "");
    const notes = String(formData.get("notes") || "");

    // Get selected service IDs
    const selectedServiceIds = formData.getAll("serviceIds") as string[];

    if (!familyName) {
      return new Error("Family name is required");
    }

    if (!parentFirstName || !parentLastName) {
      return new Error("Parent first and last name are required");
    }

    if (!email) {
      return new Error("Email is required");
    }

    await db.family.update({
      where: { id },
      data: {
        familyName,
        parentFirstName,
        parentLastName,
        email,
        phone: phone || null,
        address: address || null,
        city: city || null,
        state: state || null,
        zipCode: zipCode || null,
        emergencyContact: emergencyContact || null,
        emergencyPhone: emergencyPhone || null,
        notes: notes || null,
        services: {
          deleteMany: {}, // Remove all existing assignments
          create: selectedServiceIds.map((serviceId) => ({
            serviceId,
          })),
        },
      },
    });

    return redirect(`/families/${id}`);
  } catch (err) {
    console.error("Error updating family:", err);
    return new Error(err instanceof Error ? err.message : "Failed to update family");
  }
});

export const deleteFamily = action(async (id: string) => {
  "use server";
  try {
    await db.family.delete({
      where: { id },
    });
    return reload();
  } catch (err) {
    console.error("Error deleting family:", err);
    return new Error(err instanceof Error ? err.message : "Failed to delete family");
  }
});
