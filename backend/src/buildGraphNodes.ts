import { FlowNode, RouteGroup } from "./types";

function formatLabel(pattern: string) {
  if (pattern === "/") return "Home";

  return pattern
    .split("/")
    .filter(Boolean)
    .slice(-1)[0]
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function buildGraphNodes(groups: RouteGroup[]): FlowNode[] {
  return groups.map((group) => ({
    id: group.pattern,
    label: formatLabel(group.pattern),
  }));
}
