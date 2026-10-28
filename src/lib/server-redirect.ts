import { redirect } from "@solidjs/web";

type RedirectInit = number | ResponseInit | undefined;

export function serverRedirect(location: string, init?: RedirectInit) {
  const target = /^https?:\/\//i.test(location)
    ? location
    : location.startsWith("/")
      ? location
      : `/${location}`;

  return redirect(target, init as ResponseInit | undefined);
}
