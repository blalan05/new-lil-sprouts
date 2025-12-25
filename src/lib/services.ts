import { query, action } from "@solidjs/router";
import { db } from "./db";

// Get all active services
export const getServices = query(async () => {
  "use server";
  const services = await db.service.findMany({
    where: {
      isActive: true,
    },
    orderBy: {
      name: "asc",
    },
  });
  return services;
}, "services");

// Get all services (including inactive) for management
export const getAllServices = query(async () => {
  "use server";
  const services = await db.service.findMany({
    orderBy: {
      name: "asc",
    },
  });
  return services;
}, "all-services");

// Get a single service by ID
export const getService = query(async (id: string) => {
  "use server";
  const service = await db.service.findUnique({
    where: { id },
  });
  if (!service) throw new Error("Service not found");
  return service;
}, "service");

// Get service by code (for backward compatibility)
export const getServiceByCode = query(async (code: string) => {
  "use server";
  const service = await db.service.findUnique({
    where: { code },
  });
  return service;
}, "service-by-code");

// Create a new service
export const createService = action(async (formData: FormData) => {
  "use server";
  try {
    const name = String(formData.get("name"));
    const code = String(formData.get("code"));
    const description = String(formData.get("description") || "");
    const defaultHourlyRate = String(formData.get("defaultHourlyRate") || "");
    const pricingType = String(formData.get("pricingType") || "FLAT");
    const requiresChildren = formData.get("requiresChildren") === "true";

    if (!name || !code) {
      return new Error("Name and code are required");
    }

    // Check if code already exists
    const existing = await db.service.findUnique({
      where: { code },
    });

    if (existing) {
      return new Error("Service with this code already exists");
    }

    const service = await db.service.create({
      data: {
        name,
        code: code.toUpperCase(),
        description: description || null,
        defaultHourlyRate: defaultHourlyRate ? parseFloat(defaultHourlyRate) : null,
        pricingType,
        requiresChildren,
      },
    });

    return { success: true, service };
  } catch (err) {
    console.error("Error creating service:", err);
    return new Error(err instanceof Error ? err.message : "Failed to create service");
  }
});

// Update a service
export const updateService = action(async (formData: FormData) => {
  "use server";
  try {
    const id = String(formData.get("id"));
    const name = String(formData.get("name"));
    const description = String(formData.get("description") || "");
    const defaultHourlyRate = String(formData.get("defaultHourlyRate") || "");
    const pricingType = String(formData.get("pricingType") || "FLAT");
    const requiresChildren = formData.get("requiresChildren") === "true";
    const isActive = formData.get("isActive") === "true";

    if (!name) {
      return new Error("Name is required");
    }

    await db.service.update({
      where: { id },
      data: {
        name,
        description: description || null,
        defaultHourlyRate: defaultHourlyRate ? parseFloat(defaultHourlyRate) : null,
        pricingType,
        requiresChildren,
        isActive,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Error updating service:", err);
    return new Error(err instanceof Error ? err.message : "Failed to update service");
  }
});

// Calculate rate for a service based on pricing type
export const calculateServiceRate = async (
  serviceId: string,
  childCount: number = 0
): Promise<number | null> => {
  "use server";
  const service = await db.service.findUnique({
    where: { id: serviceId },
  });

  if (!service || !service.defaultHourlyRate) {
    return null;
  }

  if (service.pricingType === "PER_CHILD") {
    return service.defaultHourlyRate * childCount;
  }

  return service.defaultHourlyRate;
};

