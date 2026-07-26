import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Routes that require ANY authenticated user
const protectedRoutes = ["/profile", "/dashboard", "/applications"];

// Routes that require a specific role
const roleRoutes: { prefix: string; role: string }[] = [
    { prefix: "/employer", role: "employer" },
    { prefix: "/admin", role: "admin" },
];

// Routes only unauthenticated users should see (login/register)
const authOnlyRoutes = ["/login", "/register"];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Fast check: does a session cookie exist at all?
    const sessionCookie = getSessionCookie(request);

    const isProtected = protectedRoutes.some((p) => pathname.startsWith(p));
    const isRoleRoute = roleRoutes.find((r) => pathname.startsWith(r.prefix));
    const isAuthOnly = authOnlyRoutes.some((p) => pathname.startsWith(p));

    // No session, but trying to hit a protected or role-gated route
    if (!sessionCookie && (isProtected || isRoleRoute)) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // Has a session, but visiting login/register — bounce to profile
    if (sessionCookie && isAuthOnly) {
        return NextResponse.redirect(new URL("/profile", request.url));
    }

    // Role-gated route: cookie alone doesn't carry role, so verify against
    // Better Auth's session endpoint before allowing through.
    if (sessionCookie && isRoleRoute) {
        const sessionRes = await fetch(
            new URL("/api/auth/get-session", request.url),
            { headers: { cookie: request.headers.get("cookie") ?? "" } }
        );

        if (!sessionRes.ok) {
            return NextResponse.redirect(new URL("/login", request.url));
        }

        const session = await sessionRes.json();
        const userRole = session?.user?.role;

        if (userRole !== isRoleRoute.role) {
            // Logged in, but wrong role for this section
            return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/dashboard/:path*",
        "/applications/:path*",
        "/employer/:path*",
        "/admin/:path*",
        "/login",
        "/register",
    ],
};