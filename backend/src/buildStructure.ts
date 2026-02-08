import { RouteGroup } from "./types";
export function buildStructureEdges(groups: RouteGroup[]) {
  const edges = [];

  for (const group of groups) {
    for (const child of group.children || []) {
      edges.push({
        from: group.pattern,
        to: child,
        type: "structure",
      });
    }
  }

  return edges;
}
