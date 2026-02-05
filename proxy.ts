import { NextRequest, NextResponse } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const privateRoutes = ["/profile"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
  const isPrivateRoute = privateRoutes.some((route) => pathname.startsWith(route));

  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  
  if (!accessToken) {
    if (refreshToken) {
      
      const user = await checkSession();

      if (user) {
        if (isPublicRoute) return NextResponse.redirect(new URL("/", request.url));
        if (isPrivateRoute) return NextResponse.next();
      } else {
        
        if (isPrivateRoute) return NextResponse.redirect(new URL("/sign-in", request.url));
        if (isPublicRoute) return NextResponse.next();
      }
    } else {
     
      if (isPrivateRoute) return NextResponse.redirect(new URL("/sign-in", request.url));
      if (isPublicRoute) return NextResponse.next();
    }
  }

  
  if (accessToken) {
    if (isPublicRoute) return NextResponse.redirect(new URL("/", request.url));
    if (isPrivateRoute) return NextResponse.next();
  }

  return NextResponse.next();
}


export const config = {
  matcher: ["/profile/:path*", "/sign-in", "/sign-up"],
};
