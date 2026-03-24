---
id: B-25
code: B-25
title: Connected Components
---
## The Pattern

Union-Find shines when you need to:

1. Dynamically add connections between elements
2. Query whether two elements are connected
3. Count the number of distinct groups

## Classic Problems

- **Number of Connected Components** — union edges, count distinct roots
- **Redundant Connection** — union each edge; if find(u)==find(v) before union, that edge creates a cycle
- **Accounts Merge** — union accounts that share an email

## Union-Find vs BFS/DFS

BFS/DFS works on static graphs. Union-Find is better when edges are **added incrementally** (streaming/online problems).
