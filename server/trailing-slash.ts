import { eventHandler, getRequestURL, sendRedirect, type H3Event } from "h3";

/**
 * Middleware to ensure root path always has trailing slash
 * This fixes the issue where https://lilsprouts.io (no trailing slash)
 * causes a 500 error, but https://lilsprouts.io/ works correctly
 * 
 * This middleware runs early and redirects root requests to ensure
 * they always have a trailing slash, which the app expects.
 */
export default eventHandler((event: H3Event) => {
  const url = getRequestURL(event);
  
  // Only handle GET requests to root path
  if (event.method === "GET" && url.pathname === "/") {
    // Check if the URL doesn't end with "/" (excluding query/hash)
    const pathWithoutQueryHash = url.href.split("?")[0].split("#")[0];
    
    // If URL is exactly the origin (no trailing slash), redirect to add it
    const origin = `${url.protocol}//${url.host}`;
    if (pathWithoutQueryHash === origin) {
      const newUrl = `${origin}/${url.search}${url.hash}`;
      return sendRedirect(event, newUrl, 301);
    }
  }
  
  // Let the request continue normally for all other cases
});
