import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isOnDashboard = req.nextUrl.pathname.startsWith("/dashboard") ||
        req.nextUrl.pathname.startsWith("/employees") ||
        req.nextUrl.pathname.startsWith("/patients") ||
        req.nextUrl.pathname.startsWith("/whatsapp") ||
        req.nextUrl.pathname.startsWith("/activity") ||
        req.nextUrl.pathname.startsWith("/settings");

    if (isOnDashboard) {
        if (isLoggedIn) {
            // Add pathname to headers for server components
            const response = NextResponse.next();
            response.headers.set("x-pathname", req.nextUrl.pathname);
            return response;
        }
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    // Removed auto-redirect for logged-in users at user request
    // else if (isLoggedIn && req.nextUrl.pathname === "/login") {
    //    return NextResponse.redirect(new URL("/dashboard", req.nextUrl)); 
    // }

    return Promise.resolve();
});

export const config = {
    // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
