import { Route, RouteGroup } from "./types";
import { PatternStats } from "./detectPattern";

const COLLAPSE_THRESHOLD = 5;
function normalizeSegments(segments: string[]) {
  const result: string[] = [];

  for (const seg of segments) {
    result.push(seg);

    if (seg === ":param") {
      break;
    }
  }

  return result;
}
function isDynamicSegment(segment: string) {
  if (/^\d+$/.test(segment)) return true;

  if (segment.length > 20) return true;

  if (/^[a-f0-9-]{8,}$/i.test(segment)) return true;

  return false;
}

function collapsePath(path: string, stats: PatternStats): string {
  const segments = path.split("/").filter(Boolean);

  const collapsed = segments.map((seg, index) => {
    if (index === 0) return seg;
    const prefix = "/" + segments.slice(0, index).join("/");

    const key = prefix || "/";

    const stat = stats[key];

    if (!stat) return seg;

    if (stat.uniqueValues.size >= COLLAPSE_THRESHOLD || isDynamicSegment(seg)) {
      return ":param";
    }

    return seg;
  });

  return "/" + collapsed.join("/");
}

export function collapseRoutes(
  routes: Route[],
  stats: PatternStats,
): RouteGroup[] {
  const groups = new Map<string, RouteGroup>();

  for (const route of routes) {
    const pattern = collapsePath(route.path, stats);

    if (!groups.has(pattern)) {
      const segments = pattern.split("/").filter(Boolean);
      const normalizedSegments = normalizeSegments(segments);
      groups.set(pattern, {
        pattern,
        segments: normalizedSegments,
        depth: normalizedSegments.length,
        routes: [],
      });
    }

    groups.get(pattern)!.routes.push(route);
  }

  return Array.from(groups.values());
}
