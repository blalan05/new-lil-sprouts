import { type RouteDefinition } from "@solidjs/router";
import { getChild } from "~/lib/children";
import { serverRedirect } from "~/lib/server-redirect";

export const route = {
  preload({ params }) {
    return getChild(params.id).then((child) => {
      throw serverRedirect(`/families/${child.familyId}/children/${params.id}/edit`);
    });
  },
} satisfies RouteDefinition;

export default function ChildEditRedirect() {
  return null;
}
