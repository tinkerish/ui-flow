import { Route } from "./types";

export type PatternStats = Record<
  string,
  {
    depth: number;
    uniqueValues: Set<string>;
  }
>;

export function detectPatterns(routes: Route[]): PatternStats {
  const stats: PatternStats = {};

  for (const route of routes) {
    const segments = route.path
      .split("/")
      .filter(Boolean);

    segments.forEach((segment, index) => {
      const prefix =
        "/" + segments.slice(0, index).join("/");

      const key = prefix || "/";

      if (!stats[key]) {
        stats[key] = {
          depth: index,
          uniqueValues: new Set(),
        };
      }

      stats[key].uniqueValues.add(segment);
    });
  }

  return stats;
}
