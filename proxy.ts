import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import createMiddleware from "next-intl/middleware";
import { routing } from "@/src/i18n/routing";

const intlMiddleware = createMiddleware(routing);

const candidateRoutes = ["/profile", "/my-jobs"];

const companyAndAdminRoutes = [
    "/dashboard",
    "/jobs",
    "/account",
    "/candidates",
    "/companies",
    "/recruiters",
    "/interviews",
    "/messages",
    "/notifications",
    "/reports",
    "/calendar",
    "/saved-candidates",
    "/talent-pool",
    "/applications",
];

const adminOnlyRoutes = ["/admin"];

const genericProtectedRoutes = ["/change-password"];

const authOnlyRoutes = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
];

function getRoleHome(role?: string): string {
    if (role === "admin" || role === "company" || role === "employer") {
        return "/dashboard";
    }
    return "/profile";
}

function stripLocale(pathname: string): string {
    const segments = pathname.split("/");
    const maybeLocale = segments[1];
    if ((routing.locales as readonly string[]).includes(maybeLocale)) {
        const rest = "/" + segments.slice(2).join("/");
        return rest === "/" ? "/" : rest.replace(/\/+$/, "") || "/";
    }
    return pathname;
}

export default async function proxy(request: NextRequest) {
    const { pathname: rawPathname, search } = request.nextUrl;
    const pathname = stripLocale(rawPathname);
    const sessionCookie = getSessionCookie(request);

    const isCandidateRoute = candidateRoutes.some((p) => pathname.startsWith(p));
    const isCompanyOrAdminRoute = companyAndAdminRoutes.some((p) => pathname.startsWith(p));
    const isAdminOnlyRoute = adminOnlyRoutes.some((p) => pathname.startsWith(p));
    const isGenericProtected = genericProtectedRoutes.some((p) => pathname.startsWith(p));
    const isAuthOnly = authOnlyRoutes.some((p) => pathname.startsWith(p));

    const isProtected =
        isCandidateRoute ||
        isCompanyOrAdminRoute ||
        isAdminOnlyRoute ||
        isGenericProtected;

    if (!sessionCookie && isProtected) {
        const loginUrl = new URL("/sign-in", request.url);
        loginUrl.searchParams.set("redirectTo", `${rawPathname}${search}`);
        return NextResponse.redirect(loginUrl);
    }

    if (sessionCookie) {
        try {
            const sessionRes = await fetch(
                new URL("/api/auth/get-session", request.url),
                {
                    headers: {
                        cookie: request.headers.get("cookie") ?? "",
                    },
                }
            );

            if (!sessionRes.ok) {
                if (isProtected) {
                    const loginUrl = new URL("/sign-in", request.url);
                    loginUrl.searchParams.set("redirectTo", `${rawPathname}${search}`);
                    return NextResponse.redirect(loginUrl);
                }
                return intlMiddleware(request);
            }

            const data = await sessionRes.json();
            const session = data?.session;
            const userRole = data?.user?.role;

            if (!session) {
                if (isProtected) {
                    const loginUrl = new URL("/sign-in", request.url);
                    loginUrl.searchParams.set("redirectTo", `${rawPathname}${search}`);
                    return NextResponse.redirect(loginUrl);
                }
                return intlMiddleware(request);
            }

            if (isAuthOnly) {
                return NextResponse.redirect(new URL(getRoleHome(userRole), request.url));
            }

            if (isAdminOnlyRoute && userRole !== "admin") {
                return NextResponse.redirect(new URL("/forbidden", request.url));
            }

            if (isCompanyOrAdminRoute) {
                const allowedRoles = ["company", "employer", "admin"];
                if (userRole === "candidate") {
                    return NextResponse.redirect(new URL("/profile", request.url));
                }
                if (!allowedRoles.includes(userRole)) {
                    return NextResponse.redirect(new URL("/forbidden", request.url));
                }
            }

            if (isCandidateRoute) {
                if (userRole === "company" || userRole === "employer") {
                    return NextResponse.redirect(new URL("/dashboard", request.url));
                }
            }
        } catch {
            if (isProtected) {
                const loginUrl = new URL("/sign-in", request.url);
                loginUrl.searchParams.set("redirectTo", `${rawPathname}${search}`);
                return NextResponse.redirect(loginUrl);
            }
        }
    }
    return intlMiddleware(request);
}

export const config = {
    matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};