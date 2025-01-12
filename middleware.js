import { NextResponse } from "next/server";

// Define protected routes for recruiters and users
const recruiterRoutes = ["/manage", "/conversations", "/create", "/applications"];

export async function middleware(request) {
  const { pathname } = request.nextUrl; // Get the requested path
  const token = request.cookies.get("my-cookie"); // Extract token from cookies

  // If no token is present, redirect to unauthorized page
  if (!token) {
    return NextResponse.redirect(new URL("/unauthorized-page", request.url));
  }

  try {
    // Validate the token via API call
    const response = await fetch(`${request.nextUrl.origin}/api/auth/validate`, {
      method: "GET",
      headers: { cookie: `my-cookie=${token.value}` },
    });

    const data = await response.json();

    // Check if the route matches recruiter-specific routes
    if (recruiterRoutes.some((route) => pathname.startsWith(route))) {
      if (!data.success || data.userType !== "recruiter") {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // Allow access for all other routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/manage",
    "/conversations",
    "/create",
    "/checkout",
    "/applications/:path*", // Match `/applications` and any subpath
  ],
};