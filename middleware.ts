import { clerkMiddleware } from "@clerk/nextjs/server";

// This function runs before every request
export default clerkMiddleware();

// Tell Next.js which paths should be matched by the middleware
export const config = {
  matcher: [
    // Skip static files and Next.js internals
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run middleware for API routes and tRPC
    "/(api|trpc)(.*)",
  ],
};
