// import { NextResponse } from "next/server";

import { auth } from "./app/_lib/auth";

// export function proxy(request) {
//   return NextResponse.redirect(new URL("/about", request.url));
// }

export const proxy = auth;

export const config = {
  matcher: ["/account"],
};
