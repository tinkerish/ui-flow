import { Route } from "./types";

const ASSET_EXTENSIONS = [
  ".css",
  ".js",
  ".png",
  ".jpg",
  ".jpeg",
  ".svg",
  ".ico",
  ".webp",
  ".gif",
  ".woff",
  ".woff2",
  ".map",
  ".xml",
  ".txt",
];

function isNoisePath(path: string): boolean {
  const lower = path.toLowerCase();
  if (ASSET_EXTENSIONS.some(ext => lower.endsWith(ext))) {
    return true;
  }

  if (
    lower.includes("/_next/") ||
    lower.includes("/static/") ||
    lower.includes("/assets/") ||
    lower.includes("/build/")
  ) {
    return true;
  }

  if (lower.startsWith("/api/")) {
    return true;
  }

  return false;
}

export function removeNoise(routes: Route[]): Route[] {
  return routes
    .filter(route => !isNoisePath(route.path))
    .map(route => ({
      ...route,
      links: route.links.filter(link => !isNoisePath(link)),
    }));
}
