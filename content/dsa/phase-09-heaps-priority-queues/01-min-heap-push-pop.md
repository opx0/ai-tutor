---
id: B-20
code: B-20
title: Min-Heap Push & Pop
---
## What is a Heap?

A **min-heap** is a complete binary tree where parent ≤ children. The minimum is always at the root. Stored as an array for efficiency.

## Key Operations

- **push(x)** — O(log n): add to end, sift up
- **pop()** — O(log n): swap root with last, remove last, sift down
- **peek()** — O(1): return root

## Array Representation

```
parent(i)     = (i - 1) // 2
left_child(i)  = 2 * i + 1
right_child(i) = 2 * i + 2
```

Complete binary tree → no gaps in array → excellent cache performance.
