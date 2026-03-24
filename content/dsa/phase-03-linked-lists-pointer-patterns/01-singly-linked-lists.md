---
id: B-5
code: B-5
title: Singly Linked Lists
---
## Why This Matters

Linked lists teach **pointer thinking** — the mental skill needed for trees, graphs, and advanced data structures.

## Core Definition

**Singly Linked List** — each node stores a value and a pointer to the next node. Last node points to null.

## Operations

- **Prepend** — O(1): create node, point to old head, update head
- **Append** — O(n): traverse to end, add node (O(1) with tail pointer)
- **Insert after node** — O(1): rewire two pointers
- **Delete node** — O(1): bypass it by rewiring predecessor's next
- **Search** — O(n): must traverse from head

## Arrays vs Linked Lists

| Op | Array | Linked List |
| --- | --- | --- |
| Access [i] | O(1) | O(n) |
| Insert/Delete at known pos | O(n) | O(1) |
