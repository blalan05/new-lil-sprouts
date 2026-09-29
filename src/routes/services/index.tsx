import { type RouteDefinition } from "@solidjs/router";
import { serverRedirect } from "~/lib/server-redirect";

export const route = {
  preload() {
    throw serverRedirect("/reports");
  },
};

export default function ServicesRedirect() {
  return null;
}
