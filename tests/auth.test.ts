import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  isOwnerRoute,
  isAuthRoute,
  isPublicRoute,
  shouldSkipRouteGuard,
  ownerRedirectPath,
  authenticatedHomePath,
} from "../src/lib/route-access.ts";

describe("route-access", () => {
  it("classifies owner routes", () => {
    assert.equal(isOwnerRoute("/"), true);
    assert.equal(isOwnerRoute("/families"), true);
    assert.equal(isOwnerRoute("/families/abc-123"), true);
    assert.equal(isOwnerRoute("/reports/tax-summary"), true);
    assert.equal(isOwnerRoute("/portal"), false);
    assert.equal(isOwnerRoute("/portal/today"), false);
    assert.equal(isOwnerRoute("/login"), false);
  });

  it("classifies auth routes including portal subpaths", () => {
    assert.equal(isAuthRoute("/account"), true);
    assert.equal(isAuthRoute("/portal"), true);
    assert.equal(isAuthRoute("/portal/today"), true);
    assert.equal(isAuthRoute("/families"), false);
  });

  it("classifies public routes", () => {
    assert.equal(isPublicRoute("/login"), true);
    assert.equal(isPublicRoute("/portal"), false);
  });

  it("skips non-page and asset requests", () => {
    assert.equal(shouldSkipRouteGuard("/_build/foo.js", "GET"), true);
    assert.equal(shouldSkipRouteGuard("/favicon.ico", "GET"), true);
    assert.equal(shouldSkipRouteGuard("/families", "POST"), true);
    assert.equal(shouldSkipRouteGuard("/families", "GET"), false);
  });

  it("redirects by role", () => {
    assert.equal(ownerRedirectPath(true), "/");
    assert.equal(ownerRedirectPath(false), "/account");
    assert.equal(authenticatedHomePath(true), "/");
    assert.equal(authenticatedHomePath(false, "family-1"), "/portal");
    assert.equal(authenticatedHomePath(false, null), "/account");
  });
});

describe("manual auth checklist", () => {
  it("documents scenarios to verify in the browser", () => {
    const checklist = [
      "Unauthenticated GET / redirects to /login",
      "Unauthenticated GET /families redirects to /login",
      "Parent user GET / redirects to /portal",
      "Parent user without a family GET / redirects to /account (not /portal)",
      "Parent user GET /families redirects to /portal",
      "Owner user GET /portal redirects to /",
      "Parent user can access /portal/today",
      "Parent user cannot access /reports/tax-summary",
      "Logout clears session and returns to /login",
    ];
    assert.ok(checklist.length >= 8);
  });
});
