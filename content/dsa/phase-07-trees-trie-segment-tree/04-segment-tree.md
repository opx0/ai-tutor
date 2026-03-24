---
id: B-19
code: B-19
title: Segment Tree
---
## Why This Matters

Prefix sums handle static arrays. But what if the array **changes**? Segment Tree answers range queries AND supports updates in O(log n).

## Core Idea

Build a balanced binary tree where each node stores the aggregate (sum/min/max) of a range. Leaves = individual elements. Internal nodes = merge of children.

## Operations

- **Build** — O(n)
- **Query(l, r)** — O(log n): recursively combine relevant segments
- **Update(i, val)** — O(log n): update leaf, propagate up

## When to Use

Range sum + point update, range min/max queries, competitive programming. Overkill for interviews unless specifically asked.
