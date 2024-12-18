import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;

  console.log("Middleware triggered:");
  console.log("Pathname:", nextUrl.pathname);
  console.log("Is Logged In:", !!req.auth);

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isDashboardRoute = nextUrl.pathname.startsWith("/admin/dashboard");
  const isAuthRoute = nextUrl.pathname.startsWith("/admin/login") || nextUrl.pathname.startsWith("/admin/signup");
  const isLoggedIn = !!req.auth;

  if (isAdminRoute) {
    if (isDashboardRoute) {
      if (!isLoggedIn) {
        console.log("Redirecting to login from dashboard route.");
        return Response.redirect(new URL("/admin/login", nextUrl));
      }
      return;
    }

    if (isAuthRoute) {
      if (isLoggedIn) {
        console.log("Redirecting to dashboard from auth route.");
        return Response.redirect(new URL("/admin/dashboard", nextUrl));
      }
      return;
    }

    if (!isLoggedIn) {
      console.log("Redirecting to login from admin route.");
      return Response.redirect(new URL("/admin/login", nextUrl));
    }
  }

  console.log("No redirection needed.");
  return;
});
export const config = {
    matcher: ["/admin/:path*", "/dashboard/:path*"],
  };