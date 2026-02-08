# Website Flow Analyzer — Architecture & Design Document

## 1. Overview

The Website Flow Analyzer is a system that crawls a website, analyzes its routing structure, and produces a visual representation of:

- Website structure (hierarchy)
- Content grouping
- Navigation relationships between pages

The goal is **not** to simulate real user analytics, but to infer meaningful structure from static site links in a scalable and deterministic way.

This document explains the architectural decisions, processing stages, and trade-offs made during implementation.

---

## 2. Problem Statement

Modern websites contain:

- Deep routing hierarchies
- Dynamic URLs
- Repeated navigation links
- Large content collections (blogs, docs, resources)

A naive crawl produces:

- Thousands of pages
- Excessive graph edges
- Unreadable visualizations

The challenge is to convert raw crawl data into:

1. A reduced representation of site structure
2. Logical grouping of similar routes
3. A visualization that scales across small SPAs and large documentation sites

---

## 3. High-Level Architecture

```
Crawler
(HTML Fetch)
    │
Normalization
(URL cleanup)
    │
Noise Removal
(filters)
    │
Pattern Detect
(stats build)
    │
Route Collapse
(:param logic)
    │
Synthetic
Parents
    │
Hierarchy
Construction
    │
Edge Builder
(Structure)
    │
Visualization
(ReactFlow)
```

---

## 4. Processing Stages

### 4.1 Crawling

The crawler collects:

- Page URL
- Internal links from each page

Output:

```
Route {
  path: string
  links: string[]
}
```

The crawler intentionally avoids:

- Rendering JavaScript flows
- Tracking user sessions
- Analytics inference

This keeps the system deterministic and reproducible.

---

### 4.2 Route Normalization

Purpose:

- Remove query strings
- Normalize trailing slashes
- Convert URLs to consistent path format

Example:

```
/blog/post?id=123 → /blog/post
```

Reason:

Different URLs representing the same page should not produce separate nodes.

---

### 4.3 Noise Removal

Filters remove:

- External links
- Anchor links
- Duplicate navigation links
- Non-navigational resources

This stage reduces graph density before structural analysis.

---

### 4.4 Pattern Detection

The system analyzes path segments to detect dynamic patterns.

Example:

```
/blog/react-19
/blog/react-18
/blog/react-compiler
```

Detected as:

```
/blog/:param
```

Statistics collected:

- Unique values per segment position
- Frequency of variation

This allows automatic identification of dynamic routes.

---

### 4.5 Route Collapse

If a segment contains many unique values (above threshold):

```
/blog/* → /blog/:param
```

Key Design Decision:

Collapse only **after detecting sufficient variation**, preventing over-grouping.

This ensures:

- Blogs collapse
- Static pages remain explicit

---

### 4.6 Normalized Segment Depth

Depth is computed using normalized segments:

```
["blog", ":param"]
```

instead of raw path segments.

Reason:

Prevents artificial depth inflation such as:

```
/blog/:param/12/03/post-name
```

from creating unnecessary hierarchy levels.

---

### 4.7 Synthetic Parent Insertion

Some sites do not have intermediate pages:

```
/products/ai-agent
```

without:

```
/products
```

Synthetic nodes are created to preserve hierarchy:

```
/products (synthetic)
  └── /products/ai-agent
```

This improves visualization clarity.

---

### 4.8 Hierarchy Construction

Parent-child relationships are built using path prefixes:

```
/blog → /blog/:param
/reference → /reference/react
```

This defines the structural tree of the site.

---

### 4.9 Edge Construction

Two edge types exist conceptually:

#### Structure Edges

Represent hierarchy:

```
parent → child
```

These define the sitemap.

#### Flow Edges (Experimental)

Represent inferred transitions.

Due to lack of behavioral data, flow detection is currently minimized and structure edges are prioritized.

---

## 5. Visualization Model

Visualization uses:

- ReactFlow
- Dagre layout engine

Layout decision:

```
rankdir = LR (Left → Right)
```

Reason:

Most applications have a left sidebar, making horizontal expansion more readable for wide hierarchies.

---

## 6. Key Engineering Decisions

### Decision 1 — Structure Over Behavior

User flow cannot be reliably inferred from static crawling alone.

Therefore the system focuses on:

- Structural clarity
- Pattern grouping

instead of behavioral assumptions.

---

### Decision 2 — Early Noise Reduction

Reducing edges before hierarchy construction prevents exponential graph growth.

---

### Decision 3 — Pattern-Based Grouping

Dynamic routes are grouped automatically instead of relying on framework-specific rules.

---

### Decision 4 — Synthetic Nodes

Maintains logical hierarchy even when intermediate routes do not exist physically.

---

## 7. Known Limitations

- Cannot infer real user journeys
- SPA navigation without links may be missed
- Authenticated flows depend on crawler access
- Navigation vs content flow cannot be perfectly distinguished

These are intentional trade-offs for deterministic analysis.

---

## 8. Future Improvements

Possible future extensions:

- Edge weighting based on link frequency
- Clustering by content type
- Analytics integration for real flow detection
- Interactive collapsing of subtrees
- Page importance scoring

---

## 9. Summary

The system converts a noisy crawl graph into:

```
Raw Links → Structured Route Graph → Visual Site Map
```

by applying progressive reduction, grouping, and hierarchy construction.

The focus is on producing a readable, scalable representation of website structure rather than simulating real user behavior.
