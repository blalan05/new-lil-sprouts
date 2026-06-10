import { query } from "@solidjs/router";
import { requireOwner, requireUser, requireParent } from "./auth";

/** Route preload guard: owner only. Redirects parents to /portal. */
export const ensureOwner = query(async () => {
  "use server";
  await requireOwner();
}, "ensure-owner");

/** Route preload guard: any authenticated user. */
export const ensureAuth = query(async () => {
  "use server";
  await requireUser();
}, "ensure-auth");

/** Route preload guard: parent portal users only. Redirects owners to /. */
export const ensureParent = query(async () => {
  "use server";
  await requireParent();
}, "ensure-parent");
