import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const protectedRoutes = ["/profile", "/applications"];

const roleRoutes: { prefix: string; roles: string[] }[] = [
    { prefix: "/dashboard", roles: ["admin"] },
    { prefix: "/employer", roles: ["employer"] },
    { prefix: "/admin", roles: ["admin"] },
    { prefix: "/jobs", roles: ["employer", "admin"] },
];

const authOnlyRoutes = ["/sign-in", "/sign-up"];

export default async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const sessionCookie = getSessionCookie(request);

    const isProtected = protectedRoutes.some((p) => pathname.startsWith(p));
    const isRoleRoute = roleRoutes.find((r) => pathname.startsWith(r.prefix));
    const isAuthOnly = authOnlyRoutes.some((p) => pathname.startsWith(p));
    const needsSession = isProtected || isRoleRoute;

    if (!sessionCookie && needsSession) {
        const loginUrl = new URL("/sign-in", request.url);
        loginUrl.searchParams.set("redirectTo", pathname);
        return NextResponse.redirect(loginUrl);
    }

    if (sessionCookie && isAuthOnly) {
        return NextResponse.redirect(new URL("/profile", request.url));
    }

    if (sessionCookie && needsSession) {
        try {
            const sessionRes = await fetch(
                new URL("/api/auth/get-session", request.url),
                { headers: { cookie: request.headers.get("cookie") ?? "" } }
            );

            if (!sessionRes.ok) {
                const loginUrl = new URL("/sign-in", request.url);
                loginUrl.searchParams.set("redirectTo", pathname);
                return NextResponse.redirect(loginUrl);
            }

            if (isRoleRoute) {
                const session = await sessionRes.json();
                const userRole = session?.user?.role;

                if (!isRoleRoute.roles.includes(userRole)) {
                    return NextResponse.redirect(new URL("/forbidden", request.url));
                }
            }
        } catch {
            const loginUrl = new URL("/sign-in", request.url);
            loginUrl.searchParams.set("redirectTo", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/profile/:path*",
        "/dashboard/:path*",
        "/applications/:path*",
        "/jobs/:path*",
        "/admin/:path*",
        "/sign-in",
        "/sign-up",
    ],
};