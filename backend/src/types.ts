export type Route = {
  path: string;
  fullPath: string;
  links: string[];
};
export type PatternStats = {
  [prefix: string]: {
    depth: number;
    uniqueValues: Set<string>;
  };
};
export type RouteGroup = {
  pattern: string;
  segments: string[];
  depth: number;
  routes: Route[];
  parent?: string;
  children?: string[];
  synthetic?: boolean;
};
export type FlowEdge = {
  from: string;
  to: string;
};
export type FlowNode = {
  id: string;
  label: string;
};