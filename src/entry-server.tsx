// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { config } from "dotenv";
import { resolve } from "path";

// Load .env file in production (PM2 might not load it automatically)
if (process.env.NODE_ENV === "production") {
  const envPath = resolve(process.cwd(), ".env");
  config({ path: envPath });
  console.log(`[ENV] Loading .env from: ${envPath}`);
  console.log(`[ENV] DATABASE_URL loaded: ${!!process.env.DATABASE_URL}`);
}

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
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
