import { type RouteDefinition } from "@solidjs/router";
import { serverRedirect } from "~/lib/server-redirect";

export const route = {
  preload() {
    throw serverRedirect("/families");
  },
};

export default function ChildrenRedirect() {
  return null;
}
