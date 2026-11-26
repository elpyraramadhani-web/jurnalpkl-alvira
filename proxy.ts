import { NextResponse, type NextRequest } from "next/server";
import { COOKIE_ADMIN, COOKIE_MURID, bacaToken } from "@/lib/token";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    const id = await bacaToken(request.cookies.get(COOKIE_ADMIN)?.value, "admin");
    if (id === null) {
      const tujuan = new URL("/login", request.url);
      tujuan.searchParams.set("dari", pathname);
      return NextResponse.redirect(tujuan);
    }
  }

  if (pathname.startsWith("/jurnal")) {
    const id = await bacaToken(request.cookies.get(COOKIE_MURID)?.value, "murid");
    if (id === null) return NextResponse.redirect(new URL("/masuk", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/jurnal/:path*"] };