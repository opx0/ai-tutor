---
id: A-11
code: A-11
title: Topological Sort
---
## Ordering Dependencies

Given a DAG (Directed Acyclic Graph), produce a linear order where every edge u → v has u before v.

## Kahn's Algorithm (BFS)

1. Compute indegree of every node
2. Enqueue all nodes with indegree 0
3. Dequeue node, add to result, decrement neighbors' indegree
4. If neighbor's indegree becomes 0, enqueue it

## Cycle Detection

If the result has fewer than V nodes, there's a cycle — topological sort is impossible.

*[When to reach for this]* Course scheduling, build systems (Makefile), task ordering, compiler dependency resolution.
