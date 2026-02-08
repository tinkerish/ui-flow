import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  MarkerType,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";


type FlowNode = {
  id: string;
  label: string;
};

type FlowEdge = {
  from: string;
  to: string;
  type: "structure" | "flow";
};

type Props = {
  nodes: FlowNode[];
  edges: FlowEdge[];
};


const NODE_WIDTH = 180;
const NODE_HEIGHT = 60;

function prettify(path: string) {
  if (path === "/") return "Home";

  if (path.includes("/:param")) {
    const base = path.replace("/:param", "");
    return (
      base
        .split("/")
        .filter(Boolean)
        .pop()
        ?.replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()) + " Page"
    );
  }

  return path
    .split("/")
    .filter(Boolean)
    .map((p) => p.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
    .join(" ");
}


function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  dagreGraph.setGraph({
    rankdir: "LR",
    nodesep: 80,
    ranksep: 220,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });


  edges.forEach((edge) => {
    if ((edge.data as any)?.type === "structure") {
      dagreGraph.setEdge(edge.source, edge.target);
    }
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const pos = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        x: pos.x - NODE_WIDTH / 2,
        y: pos.y - NODE_HEIGHT / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
export function FlowView({ nodes, edges }: Props) {
  const { nodes: rfNodes, edges: rfEdges } = useMemo(() => {
    const rfNodes: Node[] = nodes.map((n) => ({
      id: n.id,
      data: {
        label: n.label || prettify(n.id),
      },
      position: { x: 0, y: 0 }, // dagre will overwrite
      style: {
        borderRadius: 8,
        padding: 6,
        border: "1px solid #e5e7eb",
        background: "#ffffff",
        fontSize: 12,
        minWidth: NODE_WIDTH,
        textAlign: "center",
      },
    }));

    const rfEdges: Edge[] = edges.map((e) => ({
      id: `${e.from}-${e.to}-${e.type}`,
      source: e.from,
      target: e.to,
      data: { type: e.type },

      markerEnd: { type: MarkerType.ArrowClosed },

      style:
        e.type === "flow"
          ? {
              stroke: "#2563eb",
              strokeWidth: 2,
            }
          : {
              stroke: "#cbd5e1",
              strokeWidth: 1,
            },
    }));

    return getLayoutedElements(rfNodes, rfEdges);
  }, [nodes, edges]);

  if (!nodes.length) return null;

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        fitView
        fitViewOptions={{ padding: 0.25 }}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
