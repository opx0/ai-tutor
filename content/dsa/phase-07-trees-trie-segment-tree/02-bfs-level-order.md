---
id: B-17
code: B-17
title: BFS (Level-Order)
---
## When to Use BFS vs DFS

- **BFS**: level-order, shortest path in unweighted graph, minimum depth
- **DFS**: path finding, backtracking, checking properties (balanced, symmetric)

## The BFS Template

```python
from collections import deque
def bfs(root):
  queue = deque([root])
  while queue:
    node = queue.popleft()
    # process node
    if node.left: queue.append(node.left)
    if node.right: queue.append(node.right)
```

## Level-Order Variation

Process entire level at once by iterating `for _ in range(len(queue))` within the loop. Useful for "zigzag", "right side view", "level averages".
