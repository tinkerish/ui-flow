# Website Flow & Structure Visualizer

A developer tool that crawls a website and automatically infers:

- Site structure (hierarchy)
- Route patterns
- Section grouping
- Navigation flows

The result is rendered as an interactive graph that helps understand how a website is organized without access to source code or analytics data.

---

## Problem

Understanding the structure of a website is difficult when:

- source code is unavailable
- routing is dynamic (SPA / client-side routing)
- documentation sites contain deep hierarchies
- marketing sites mix navigation and content flows

Developers, designers, and engineers often need to answer:

- What are the main sections of this site?
- How deep does navigation go?
- Which pages represent collections vs content?
- What does the overall structure look like?

This project attempts to infer that automatically.

---

## Core Idea

Instead of relying on analytics or user behavior data, this system:

1. Crawls reachable pages from a starting URL
2. Normalizes and cleans routes
3. Detects repeating URL patterns
4. Collapses dynamic segments into parameters
5. Builds a structural hierarchy
6. Infers possible navigation flows
7. Visualizes everything as a graph

The system is **deterministic** and works purely from observed links.

---

## 🏗 Architecture Overview

```

Crawler (Playwright)
↓
Link & URL Normalization
↓
Noise Removal
↓
Pattern Detection
↓
Route Collapse (Dynamic Segments)
↓
Hierarchy Construction
↓
Flow Construction
↓
Graph Rendering (ReactFlow)

Detailed architecture and design decisions are documented here:

[Architecture & Design Document](./docs/architecture.md)

```

---

## Pipeline Stages

### 1. Crawl / Render

- Uses a headless browser to render SPA content.
- Extracts internal links from each page.
- Supports optional authenticated crawling.

### 2. URL Normalization

- Removes query parameters and fragments.
- Converts URLs into normalized paths.
- Ensures consistent grouping.

### 3. Noise Removal

Removes:

- duplicate links
- external links
- empty routes
- non-navigational paths

### 4. Pattern Detection

Detects repeating segments such as:

```

/blog/post-1
/blog/post-2
/blog/post-3

```

and identifies them as dynamic collections.

### 5. Route Collapse

Dynamic segments are collapsed:

```

/blog/react-19-release
→ /blog/:param

```

This prevents graph explosion for content-heavy sites.

### 6. Hierarchy Construction

Builds parent-child relationships using path prefixes:

```

/products
├── /products/a
└── /products/b

```

Synthetic parents are created when necessary.

### 7. Flow Construction

Flow edges represent navigational movement between sections,
separate from structural hierarchy.

---

## Visualization

The UI uses **ReactFlow** to render:

- Structure edges → hierarchy (gray)
- Flow edges → navigation (blue)

Automatic layouting ensures readability even for large sites.

---

## Running Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

Runs on:

```
http://localhost:5000
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

Open:

```
http://localhost:5173
```

Enter a starting URL and start crawling.

---

## Authenticated Crawling (Optional)

The UI supports optional credentials for sites that require login.

This is intended for local testing environments.

---

## Deployment Philosophy

This project is intentionally designed as a **local analysis tool**.

The crawler operates on arbitrary websites and may generate a large
number of requests. Deploying publicly would introduce additional
concerns such as:

- rate limiting and abuse prevention
- crawling policies and robots.txt handling
- infrastructure scaling
- authentication security
- cost management

Since the primary goal is architectural analysis and visualization,
the tool is meant to be run locally.

---

## Example Websites Tested

- [https://react.dev](https://react.dev)
- [https://vercel.com](https://vercel.com)
- [https://simbian.ai](https://simbian.ai)

(Screenshots included below)

---

## Screenshots

_Add screenshots here showing different website structures._

---

## Tech Stack

### Backend

- Node.js
- TypeScript
- Playwright
- Express

### Frontend

- React
- TypeScript
- ReactFlow
- Dagre (auto layout)

---

## Goals

- Understand unknown website structures quickly
- Visualize navigation complexity
- Infer routing patterns automatically
- Build deterministic architecture analysis

---

## Future Improvements

- smarter flow inference
- clustering by semantic similarity
- large-site pagination handling
- layout optimizations for very large graphs

---
