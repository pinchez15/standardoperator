import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    return auth().redirectToSignIn();
  }
  return auth().protect();
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
