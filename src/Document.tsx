import type { JSX, ParentProps } from "solid-js";
import { HydrationScript, ssr } from "@solidjs/web";
import { themeInitScript } from "~/lib/theme";

const themeBootScript = ssr(`<script>${themeInitScript}</script>`);

export default function Document(props: ParentProps) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />
        {themeBootScript as unknown as JSX.Element}
        <HydrationScript />

        <meta name="theme-color" content="var(--color-text)" />
        <meta name="description" content="Childcare management system for families and caregivers" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Lil Sprouts" />

        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="manifest" href="/manifest.json" />

        {/* Required with custom entry-client: the start handler rewrites this URL to the built/dev bundle. */}
        <script type="module" async src="/src/entry-client.tsx" />
      </head>
      <body>{props.children}</body>
    </html>
  );
}
