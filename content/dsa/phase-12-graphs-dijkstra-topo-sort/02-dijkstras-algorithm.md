---
id: A-10
code: A-10
title: Dijkstra's Algorithm
---
## Shortest Path in Weighted Graphs

BFS finds shortest path in unweighted graphs. For weighted (non-negative) edges, use **Dijkstra's**.

## Algorithm

1. Set dist[source] = 0, all others = ∞
2. Use a min-heap. Push (0, source)
3. Pop minimum. For each neighbor, if dist[current] + weight < dist[neighbor], update and push

## Why It's Greedy

The min-heap always processes the node with smallest known distance. Once a node is popped, its distance is finalized — we've found the shortest path to it.

## Complexity

O((V + E) log V) with a binary heap. O(V² + E) with a simple array (better for dense graphs).
