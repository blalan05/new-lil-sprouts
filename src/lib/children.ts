import { action, query, redirect, reload } from "@solidjs/router";
import { db } from "./db";

export const getChildren = query(async (familyId: string) => {
  "use server";
  const children = await db.child.findMany({
    where: { familyId },
    orderBy: {
      firstName: "asc",
    },
  });
  return children;
}, "children");

export const getChild = query(async (id: string) => {
  "use server";
  const child = await db.child.findUnique({
    where: { id },
    include: {
      family: true,
      careSessions: {
        orderBy: {
          scheduledStart: "desc",
        },
        take: 10,
      },
    },
  });
  if (!child) throw new Error("Child not found");
  return child;
}, "child");

export const getAllChildren = query(async () => {
  "use server";
  const children = await db.child.findMany({
    include: {
      family: {
        select: {
          id: true,
          familyName: true,
        },
      },
    },
    orderBy: {
      firstName: "asc",
    },
  });
  return children;
}, "all-children");

export const createChild = action(async (formData: FormData) => {
  "use server";
  try {
    const familyId = String(formData.get("familyId"));
    const firstName = String(formData.get("firstName"));
    const lastName = String(formData.get("lastName"));
    const dateOfBirth = String(formData.get("dateOfBirth"));
    const gender = String(formData.get("gender") || "");
    const allergies = String(formData.get("allergies") || "");
    const medications = String(formData.get("medications") || "");
    const specialNeeds = String(formData.get("specialNeeds") || "");
    const schoolName = String(formData.get("schoolName") || "");
    const schoolGrade = String(formData.get("schoolGrade") || "");
    const schoolTeacher = String(formData.get("schoolTeacher") || "");
    const notes = String(formData.get("notes") || "");

    if (!firstName || !lastName) {
      return new Error("First and last name are required");
    }

    if (!dateOfBirth) {
      return new Error("Date of birth is required");
    }

    await db.child.create({
      data: {
        familyId,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender: (gender as any) || null,
        allergies: allergies || null,
        medications: medications || null,
        specialNeeds: specialNeeds || null,
        schoolName: schoolName || null,
        schoolGrade: schoolGrade || null,
        schoolTeacher: schoolTeacher || null,
        notes: notes || null,
      },
    });

    return redirect(`/families/${familyId}`);
  } catch (err) {
    console.error("Error creating child:", err);
    return new Error(err instanceof Error ? err.message : "Failed to create child");
  }
});

export const updateChild = action(async (formData: FormData) => {
  "use server";
  try {
    const id = String(formData.get("id"));
    const familyId = String(formData.get("familyId"));
    const firstName = String(formData.get("firstName"));
    const lastName = String(formData.get("lastName"));
    const dateOfBirth = String(formData.get("dateOfBirth"));
    const gender = String(formData.get("gender") || "");
    const allergies = String(formData.get("allergies") || "");
    const medications = String(formData.get("medications") || "");
    const specialNeeds = String(formData.get("specialNeeds") || "");
    const schoolName = String(formData.get("schoolName") || "");
    const schoolGrade = String(formData.get("schoolGrade") || "");
    const schoolTeacher = String(formData.get("schoolTeacher") || "");
    const notes = String(formData.get("notes") || "");

    if (!firstName || !lastName) {
      return new Error("First and last name are required");
    }

    if (!dateOfBirth) {
      return new Error("Date of birth is required");
    }

    await db.child.update({
      where: { id },
      data: {
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender: (gender as any) || null,
        allergies: allergies || null,
        medications: medications || null,
        specialNeeds: specialNeeds || null,
        schoolName: schoolName || null,
        schoolGrade: schoolGrade || null,
        schoolTeacher: schoolTeacher || null,
        notes: notes || null,
      },
    });

    return redirect(`/families/${familyId}`);
  } catch (err) {
    console.error("Error updating child:", err);
    return new Error(err instanceof Error ? err.message : "Failed to update child");
  }
});

export const deleteChild = action(async (id: string) => {
  "use server";
  try {
    await db.child.delete({
      where: { id },
    });
    return reload();
  } catch (err) {
    console.error("Error deleting child:", err);
    return new Error(err instanceof Error ? err.message : "Failed to delete child");
  }
});
