import { RouteGroup } from "./types";

export function insertSyntheticParents(groups: RouteGroup[]): RouteGroup[] {
  const map = new Map(groups.map((g) => [g.pattern, g]));
  const prefixCount = new Map<string, number>();

  for (const group of groups) {
    const parts = group.pattern.split("/").filter(Boolean);

    for (let i = 1; i < parts.length; i++) {
      const prefix = "/" + parts.slice(0, i).join("/");
      prefixCount.set(prefix, (prefixCount.get(prefix) || 0) + 1);
    }
  }

  for (const [prefix, count] of prefixCount.entries()) {
    const depth = prefix.split("/").filter(Boolean).length;

    if (depth > 1 && count < 2) continue;

    if (map.has(prefix)) continue;

    const segments = prefix.split("/").filter(Boolean);

    map.set(prefix, {
      pattern: prefix,
      segments,
      depth: segments.length,
      routes: [],
      synthetic: true,
      children: [],
    });
  }

  return Array.from(map.values());
}
