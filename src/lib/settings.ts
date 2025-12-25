import { action, query } from "@solidjs/router";
import { db } from "./db";

// Get a setting value by key
export const getSetting = query(async (key: string) => {
  "use server";
  const setting = await db.setting.findUnique({
    where: { key },
  });
  return setting;
}, "setting");

// Get all settings
export const getAllSettings = query(async () => {
  "use server";
  const settings = await db.setting.findMany({
    orderBy: { key: "asc" },
  });
  return settings;
}, "settings");

// Get setting value with type conversion
export const getSettingValue = async (key: string, defaultValue?: any) => {
  "use server";
  const setting = await db.setting.findUnique({
    where: { key },
  });
  
  if (!setting) return defaultValue;
  
  switch (setting.type) {
    case "number":
      return parseFloat(setting.value) || defaultValue;
    case "boolean":
      return setting.value === "true";
    case "json":
      try {
        return JSON.parse(setting.value);
      } catch {
        return defaultValue;
      }
    default:
      return setting.value || defaultValue;
  }
};

// Set a setting value
export const setSetting = action(async (formData: FormData) => {
  "use server";
  try {
    const key = String(formData.get("key"));
    const value = String(formData.get("value"));
    const type = String(formData.get("type") || "string");

    if (!key) {
      return new Error("Setting key is required");
    }

    await db.setting.upsert({
      where: { key },
      update: {
        value,
        type,
      },
      create: {
        key,
        value,
        type,
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Error setting setting:", err);
    return new Error(err instanceof Error ? err.message : "Failed to set setting");
  }
});

// Helper function to get default hourly rate (query for client-side)
export const getDefaultHourlyRate = query(async () => {
  "use server";
  const rate = await getSettingValue("defaultHourlyRate", null);
  return rate;
}, "defaultHourlyRate");

// Helper function to get default piano lesson rate
export const getDefaultPianoLessonRate = query(async () => {
  "use server";
  const rate = await getSettingValue("defaultPianoLessonRate", null);
  return rate;
}, "defaultPianoLessonRate");

