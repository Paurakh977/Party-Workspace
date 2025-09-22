import { NextRequest, NextResponse } from "next/server";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  userId: number;
  username: string;
  role: string;
  credits: number;
}
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  const adminRoutes = [
    "/home",
    "/tables/membersTable",
    "/tables/committeesTable",
    "/tables/socialLinks",
    "/forms/membersForm",
    "/forms/eventsForm",
    "/forms/video-links",
    "/forms/pdfs",
    "/events/input",
    "/events/list",
    "/messages/input",
    "/messages/list",
    "/profile",
    "/pdf",
    "/search-result",
  ];

  const superAdminRoutes = [
    ...adminRoutes,
    "/forms/committeeForm",
    "/forms/subCommitteeForm",
    "/forms/levelsForm",
    "/forms/structuresForm",
    "/forms/representativesForm",
    "/forms/usersForm",
    "/tables/usersTable",
  ];

  const publicRoutes = ["/", "/auth/signin"];

  const token = request.cookies.get("token")?.value;
  const isLoggedIn = !!token;
  if (isLoggedIn && pathname === "/") {
    return NextResponse.redirect(new URL("/home", request.url));
  }

  // Skip middleware for all public/static assets including manifest, icons, service worker
  const PUBLIC_FILE = /\.(?:.*)$|^\/manifest\.json$|^\/sw\.js$|^\/workbox-.*\.js$|^\/favicon\.ico$|^\/icons\//;
  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/public/") ||
    pathname.startsWith("/node_modules/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/uploads") ||
    PUBLIC_FILE.test(pathname) ||
    pathname.startsWith("/map-province-districts.json") ||
    pathname.startsWith("/map-districts-municipalities.json") ||
    pathname.startsWith("/map-municipalities-wards.json") ||
    pathname.startsWith("/all-provinces.json") ||
    pathname.startsWith("/all-countries.json")
  ) {
    return NextResponse.next();
  }

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  try {
    const userData: DecodedToken = await verifyToken(token);

    // Role-based access control
    if (userData.role === "admin") {
      if (!adminRoutes.includes(pathname) && !isDynamicAdminRoute(pathname)) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else if (userData.role === "superadmin") {
      if (
        !superAdminRoutes.includes(pathname) &&
        !isDynamicSuperAdminRoute(pathname)
      ) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } else {
      return NextResponse.redirect(new URL("/", request.url));
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

function isDynamicAdminRoute(pathname: string): boolean {
  const dynamicRoutes = [
    /^\/forms\/updateMembersForm\/\d+$/,
    /^\/forms\/updateEventsForm\/\d+$/, // Example for /forms/updateMembersForm/[memberId]
    /^\/events\/detail\/\d+$/, // Example for /events/[eventId]
    // Add other dynamic admin routes here
    /^\/tables\/selectedMembersTable\/\d+$/,
    /^\/tables\/selectedMembersTable\/\d+(?:\/\d+)?$/,
    /^\/search-result\?mobileNumber=[^&]*$/,
    /^\/forms\/updateVideolinkForm\/\d+$/,
  ];
  return dynamicRoutes.some((route) => route.test(pathname));
}

// --- added: Check if the route is a dynamic super admin route
function isDynamicSuperAdminRoute(pathname: string): boolean {
  const dynamicRoutes = [
    /^\/forms\/updateMembersForm\/\d+$/,
    /^\/forms\/updateEventsForm\/\d+$/, // Example for /forms/updateMembersForm/[memberId]
    /^\/events\/detail\/\d+$/, // Example for /events/[eventId]
    // Add other dynamic super admin routes here
    /^\/tables\/selectedMembersTable\/\d+$/,
    /^\/tables\/selectedMembersTable\/\d+(?:\/\d+)?$/,
    /^\/forms\/updateUsersForm\/\d+$/,
    /^\/search-result\?mobileNumber=[^&]*$/,
    /^\/forms\/updateVideolinkForm\/\d+$/,
  ];
  return dynamicRoutes.some((route) => route.test(pathname));
}

async function verifyToken(token: string): Promise<DecodedToken> {
  const decoded = jwtDecode(token);
  return decoded as DecodedToken;
}
