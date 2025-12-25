import { action, query, redirect, reload } from "@solidjs/router";
import { db } from "./db";
import type { MemberRelationship } from "@prisma/client";

export const getFamilyMembers = query(async (familyId: string) => {
  "use server";
  const members = await db.familyMember.findMany({
    where: { familyId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          username: true,
        },
      },
    },
    orderBy: {
      lastName: "asc",
    },
  });
  return members;
}, "family-members");

export const getFamilyMember = query(async (id: string) => {
  "use server";
  const member = await db.familyMember.findUnique({
    where: { id },
    include: {
      family: true,
      user: {
        select: {
          id: true,
          email: true,
          username: true,
        },
      },
    },
  });
  if (!member) throw new Error("Family member not found");
  return member;
}, "family-member");

export const createFamilyMember = action(async (formData: FormData) => {
  "use server";
  try {
    const familyId = String(formData.get("familyId"));
    const firstName = String(formData.get("firstName"));
    const lastName = String(formData.get("lastName"));
    const relationship = String(formData.get("relationship")) as MemberRelationship;
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const canPickup = formData.get("canPickup") === "true";
    const allergies = String(formData.get("allergies") || "");
    const notes = String(formData.get("notes") || "");

    if (!firstName || !lastName) {
      return new Error("First and last name are required");
    }

    if (!relationship) {
      return new Error("Relationship is required");
    }

    const member = await db.familyMember.create({
      data: {
        familyId,
        firstName,
        lastName,
        relationship,
        email: email || null,
        phone: phone || null,
        canPickup,
        allergies: allergies || null,
        notes: notes || null,
      },
    });

    return redirect(`/families/${familyId}`);
  } catch (err) {
    console.error("Error creating family member:", err);
    return new Error(err instanceof Error ? err.message : "Failed to create family member");
  }
});

export const updateFamilyMember = action(async (formData: FormData) => {
  "use server";
  try {
    const id = String(formData.get("id"));
    const familyId = String(formData.get("familyId"));
    const firstName = String(formData.get("firstName"));
    const lastName = String(formData.get("lastName"));
    const relationship = String(formData.get("relationship")) as MemberRelationship;
    const email = String(formData.get("email") || "");
    const phone = String(formData.get("phone") || "");
    const canPickup = formData.get("canPickup") === "true";
    const allergies = String(formData.get("allergies") || "");
    const notes = String(formData.get("notes") || "");

    if (!firstName || !lastName) {
      return new Error("First and last name are required");
    }

    if (!relationship) {
      return new Error("Relationship is required");
    }

    await db.familyMember.update({
      where: { id },
      data: {
        firstName,
        lastName,
        relationship,
        email: email || null,
        phone: phone || null,
        canPickup,
        allergies: allergies || null,
        notes: notes || null,
      },
    });

    return redirect(`/families/${familyId}`);
  } catch (err) {
    console.error("Error updating family member:", err);
    return new Error(err instanceof Error ? err.message : "Failed to update family member");
  }
});

export const deleteFamilyMember = action(async (id: string) => {
  "use server";
  try {
    await db.familyMember.delete({
      where: { id },
    });
    return reload();
  } catch (err) {
    console.error("Error deleting family member:", err);
    return new Error(err instanceof Error ? err.message : "Failed to delete family member");
  }
});

export const inviteFamilyMember = action(async (formData: FormData) => {
  "use server";
  try {
    const memberId = String(formData.get("memberId"));
    const username = String(formData.get("username"));
    const password = String(formData.get("password"));

    const member = await db.familyMember.findUnique({
      where: { id: memberId },
    });

    if (!member) {
      return new Error("Family member not found");
    }

    if (!member.email) {
      return new Error("Family member must have an email address to receive an invite");
    }

    if (member.userId) {
      return new Error("This family member already has app access");
    }

    // Check if username is already taken
    const existingUser = await db.user.findUnique({ where: { username } });
    if (existingUser) {
      return new Error("Username already exists");
    }

    // Check if email is already taken
    const existingEmail = await db.user.findUnique({ where: { email: member.email } });
    if (existingEmail) {
      return new Error("Email already registered");
    }

    // Create user account
    const user = await db.user.create({
      data: {
        email: member.email,
        username,
        password, // In production, this should be hashed
        firstName: member.firstName,
        lastName: member.lastName,
        phone: member.phone,
        isOwner: false,
      },
    });

    // Link user to family member
    await db.familyMember.update({
      where: { id: memberId },
      data: {
        userId: user.id,
      },
    });

    return { success: true, message: "Family member invited successfully" };
  } catch (err) {
    console.error("Error inviting family member:", err);
    return new Error(err instanceof Error ? err.message : "Failed to invite family member");
  }
});

export const revokeAccess = action(async (memberId: string) => {
  "use server";
  try {
    const member = await db.familyMember.findUnique({
      where: { id: memberId },
      include: { user: true },
    });

    if (!member || !member.userId) {
      return new Error("Family member does not have app access");
    }

    // Unlink user from family member
    await db.familyMember.update({
      where: { id: memberId },
      data: {
        userId: null,
      },
    });

    // Optionally delete the user account
    if (member.user && !member.user.isOwner) {
      await db.user.delete({
        where: { id: member.userId },
      });
    }

    return reload();
  } catch (err) {
    console.error("Error revoking access:", err);
    return new Error(err instanceof Error ? err.message : "Failed to revoke access");
  }
});
