import { createServerClient, type CookieOptions } from "@supabase/ssr";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import {
  getSupabasePublishableKey,
  getSupabaseUrl,
} from "./src/lib/supabase/env";

const PUBLIC_PATH_PREFIXES = ["/auth"];
const PUBLIC_FILE_PATTERNS = [
  /^\/_next\//,
  /^\/images\//,
  /^\/fonts\//,
  /^\/favicon\.ico$/,
  /^\/robots\.txt$/,
  /^\/sitemap\.xml$/,
  /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map|txt|xml)$/i,
];

function isPublicPath(pathname: string) {
  if (PUBLIC_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  return PUBLIC_FILE_PATTERNS.some((pattern) => pattern.test(pathname));
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (isPublicPath(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options as CookieOptions);
          }
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("redirected", "1");

    return NextResponse.redirect(signInUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};

