import express from "express";
import cors from "cors";
import { crawl } from "./crawler";
import { normalizeRoutes } from "./normalizeRoutes";
import { removeNoise } from "./removeNoise";
import { detectPatterns } from "./detectPattern";
import { collapseRoutes } from "./collapseRoutes";
import { buildHierarchy } from "./buildHierarchy";
import { insertSyntheticParents } from "./insertSyntheticParents";
import { buildFlowEdges } from "./buildFlows";
import { buildStructureEdges } from "./buildStructure";
import { buildGraphNodes } from "./buildGraphNodes";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.post("/crawl", async (_req, res) => {
  const { startUrl, maxDepth = 2, maxPages = 50, auth } = _req.body;

  if (!startUrl) {
    return res.status(400).json({ error: "startUrl required" });
  }
  const headers = auth
    ? {
        Authorization:
          "Basic " +
          Buffer.from(`${auth.username}:${auth.password}`).toString("base64"),
      }
    : undefined;

  const data = await crawl({
    startUrl,
    maxDepth,
    maxPages,
  });
  const normalized = normalizeRoutes(data);

  const cleanedRoutes = removeNoise(normalized);
  const stats = detectPatterns(cleanedRoutes);
  const collapsedRoute = collapseRoutes(cleanedRoutes, stats);
  const finalRouteGroup = insertSyntheticParents(collapsedRoute);
  const group = buildHierarchy(finalRouteGroup);
  const flowEdges = buildFlowEdges(group);
  const structureEdges = buildStructureEdges(group);
  const edges = [...structureEdges];
  const nodes = buildGraphNodes(group);

  res.json({
    nodes: nodes,
    edges,
  });
});
app.get("/", (req, res) => {
  return res.json({ isOk: "done" });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

