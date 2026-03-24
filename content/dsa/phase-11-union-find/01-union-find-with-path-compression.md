---
id: B-24
code: B-24
title: Union-Find with Path Compression
---
## The Data Structure

**Union-Find** (Disjoint Set) tracks groups of connected elements. Two operations:

- **find(x)** — returns the root/representative of x's group
- **union(x, y)** — merges the groups of x and y

## Optimizations

- **Union by rank** — attach shorter tree under taller tree. Keeps trees balanced.
- **Path compression** — during find(x), make every node on the path point directly to root. Nearly O(1) amortized.

```python
class UnionFind:
  def __init__(self, n):
    self.parent = list(range(n))
    self.rank = [0] * n
  def find(self, x):
    if self.parent[x] != x:
      self.parent[x] = self.find(self.parent[x])  # path compression
    return self.parent[x]
  def union(self, x, y):
    px, py = self.find(x), self.find(y)
    if px == py: return
    if self.rank[px] < self.rank[py]: px, py = py, px
    self.parent[py] = px
    if self.rank[px] == self.rank[py]: self.rank[px] += 1
```
