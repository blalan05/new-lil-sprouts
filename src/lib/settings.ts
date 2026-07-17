import { action, query, revalidate } from "@solidjs/router";
import { db } from "./db";
import { requireOwner } from "./auth";
import { serverRedirect } from "./server-redirect";

// Get a setting value by key
export const getSetting = query(async (key: string) => {
  "use server";
  await requireOwner();
  const setting = await db.setting.findUnique({
    where: { key },
  });
  return setting;
}, "setting");

// Get all settings
export const getAllSettings = query(async () => {
  "use server";
  await requireOwner();
  const settings = await db.setting.findMany({
    orderBy: { key: "asc" },
  });
  return settings;
}, "settings");

// Get setting value with type conversion (server-only)
export const getSettingValue = async (key: string, defaultValue?: unknown) => {
  "use server";
  await requireOwner();
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

async function upsertNumberSetting(key: string, rawValue: string) {
  const value = rawValue.trim();
  if (!value) {
    throw new Error(`${key} is required`);
  }
  const parsed = Number(value);
  if (Number.isNaN(parsed) || parsed < 0) {
    throw new Error(`${key} must be a valid non-negative number`);
  }

  await db.setting.upsert({
    where: { key },
    update: { value, type: "number" },
    create: { key, value, type: "number" },
  });
}

// Set a single setting value (legacy)
export const setSetting = action(async (formData: FormData) => {
  "use server";
  await requireOwner();
  try {
    const key = String(formData.get("key"));
    const value = String(formData.get("value") ?? "").trim();
    const type = String(formData.get("type") || "string");

    if (!key) {
      return new Error("Setting key is required");
    }
    if (type === "number") {
      await upsertNumberSetting(key, value);
    } else {
      await db.setting.upsert({
        where: { key },
        update: { value, type },
        create: { key, value, type },
      });
    }

    revalidate("defaultHourlyRate");
    revalidate("defaultPianoLessonRate");
    return serverRedirect("/account");
  } catch (err) {
    console.error("Error setting setting:", err);
    return new Error(err instanceof Error ? err.message : "Failed to set setting");
  }
});

export const saveBusinessSettings = action(async (formData: FormData) => {
  "use server";
  await requireOwner();
  try {
    const hourlyRate = String(formData.get("defaultHourlyRate") ?? "").trim();
    const pianoRate = String(formData.get("defaultPianoLessonRate") ?? "").trim();

    await upsertNumberSetting("defaultHourlyRate", hourlyRate);
    await upsertNumberSetting("defaultPianoLessonRate", pianoRate);

    revalidate("defaultHourlyRate");
    revalidate("defaultPianoLessonRate");
    return serverRedirect("/account");
  } catch (err) {
    console.error("Error saving business settings:", err);
    return new Error(err instanceof Error ? err.message : "Failed to save business settings");
  }
});

// Helper function to get default hourly rate (query for client-side)
export const getDefaultHourlyRate = query(async () => {
  "use server";
  await requireOwner();
  return getSettingValue("defaultHourlyRate", null);
}, "defaultHourlyRate");

// Helper function to get default piano lesson rate
export const getDefaultPianoLessonRate = query(async () => {
  "use server";
  await requireOwner();
  return getSettingValue("defaultPianoLessonRate", null);
}, "defaultPianoLessonRate");
