// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { ssr } from "solid-js/web";
import { config } from "dotenv";
import { resolve } from "path";
import { themeInitScript } from "./lib/theme";

// Load .env file in production (PM2 might not load it automatically)
if (process.env.NODE_ENV === "production") {
  const envPath = resolve(process.cwd(), ".env");
  config({ path: envPath });
  console.log(`[ENV] Loading .env from: ${envPath}`);
  console.log(`[ENV] DATABASE_URL loaded: ${!!process.env.DATABASE_URL}`);
}

const themeBootScript = ssr(`<script>${themeInitScript}</script>`);

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
          {themeBootScript as unknown as any}
          
          {/* PWA Meta Tags */}
          <meta name="theme-color" content="var(--color-text)" />
          <meta name="description" content="Childcare management system for families and caregivers" />
          <meta name="mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
          <meta name="apple-mobile-web-app-title" content="Lil Sprouts" />
          
          {/* Icons - Modern browsers */}
          <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-96x96.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512x512.png" />
          <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
          {/* Fallback favicon for older browsers */}
          <link rel="shortcut icon" href="/favicon.ico" />
          <link rel="icon" href="/favicon.ico" />
          
          {/* Manifest */}
          <link rel="manifest" href="/manifest.json" />
          
          {assets}
        </head>
        <body>
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
