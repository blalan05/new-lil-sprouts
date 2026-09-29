import * as v from "valibot";

const DEV_SESSION_SECRET = "dev-only-session-secret-do-not-use-in-prod!";

const sessionSecret = v.pipe(
  v.optional(v.string(), ""),
  v.transform((value) => {
    const trimmed = value.trim();
    if (trimmed) return trimmed;
    if (process.env.NODE_ENV === "production") return "";
    return DEV_SESSION_SECRET;
  }),
  v.pipe(v.string(), v.minLength(32)),
);

export default {
  server: {
    SESSION_SECRET: sessionSecret,
    DATABASE_URL: v.pipe(v.string(), v.minLength(1)),
    PUBLIC_ORIGIN: v.optional(v.string()),
  },
  client: {},
};
