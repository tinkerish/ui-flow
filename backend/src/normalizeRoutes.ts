import type { Route } from "./types";

function normalizePath(path: string): string {
  if (!path) return "/";

  path = path.split("#")[0];

  const [pathname] = path.split("?");

  let clean = pathname;

  if (clean.endsWith("/index.html")) {
    clean = clean.replace("/index.html", "");
  }

  if (clean === "/index.html") {
    clean = "/";
  }

  if (clean.length > 1 && clean.endsWith("/")) {
    clean = clean.slice(0, -1);
  }

  if (!clean.startsWith("/")) {
    clean = "/" + clean;
  }

  return clean || "/";
}

export function normalizeRoutes(routes: Route[]): Route[] {
  return routes.map(route => ({
    path: normalizePath(route.path),
    fullPath: route.path,
    links: route.links.map(link => normalizePath(link)),
  }));
}
