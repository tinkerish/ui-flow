import { RouteGroup } from "./types";

export function buildFlowEdges(groups: RouteGroup[]) {
  const edges = [];

  for (const group of groups) {
    for (const child of group.children || []) {

      const childGroup = groups.find(
        g => g.pattern === child
      );

      if (!childGroup) continue;

      if (childGroup.pattern.includes(":param")) {
        edges.push({
          from: group.pattern,
          to: childGroup.pattern,
          type: "flow",
        });
      }
    }
  }

  return edges;
}
