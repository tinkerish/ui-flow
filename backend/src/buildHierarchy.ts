import { RouteGroup } from "./types";

export function buildHierarchy(groups: RouteGroup[]): RouteGroup[] {
  const map = new Map(
    groups.map((g) => [g.pattern, { ...g, children: [] as string[] }]),
  );

  for (const group of map.values()) {
    let parent: RouteGroup | undefined;

    for (const candidate of map.values()) {
      if (candidate.depth !== group.depth - 1) continue;

      if (
        group.pattern.startsWith(candidate.pattern + "/") ||
        (candidate.pattern === "/" && group.depth === 1)
      ) {
        parent = candidate;
        break;
      }
    }

    if (parent) {
      group.parent = parent.pattern;
      parent.children?.push(group.pattern);
    }
  }

  return Array.from(map.values());
}
