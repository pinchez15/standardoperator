import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  const session = await auth();

  if (!isPublicRoute(req)) {
    session.protect();
  }
});

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"],
};
