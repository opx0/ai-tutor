---
id: A-9
code: A-9
title: Graph BFS — Islands
---
## Graph Representation

- **Adjacency List** — dict/array of lists. Space: O(V+E). Best for sparse graphs.
- **Adjacency Matrix** — 2D array. Space: O(V²). Best for dense graphs.
- **Implicit Graph** — grid where each cell connects to neighbors.

## Grid BFS — Number of Islands

Treat each land cell as a node. Edges connect adjacent land cells. BFS/DFS from each unvisited land cell = one island.

```python
def numIslands(grid):
  count = 0
  for r in range(rows):
    for c in range(cols):
      if grid[r][c] == "1":
        count += 1
        bfs(grid, r, c)  # mark entire island visited
  return count
```
