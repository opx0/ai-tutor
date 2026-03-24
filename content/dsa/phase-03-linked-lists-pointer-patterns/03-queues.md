---
id: B-7
code: B-7
title: Queues
---
## Core Definition

**Queue** — First In, First Out (FIFO). Like a line at a store. Two operations:

- **enqueue(x)** — add to back, O(1)
- **dequeue()** — remove from front, O(1)

## Implementation

Use a linked list (enqueue at tail, dequeue at head) or a circular array. Do NOT use a regular array — dequeue would be O(n) due to shifting.

## Where Queues Show Up

- **BFS** — breadth-first search on trees/graphs (Phase 7)
- **Task scheduling** — process requests in order
- **Buffering** — producer-consumer patterns

> What happens if you implement a queue with a regular array?

Every dequeue shifts all n elements left → O(n). Circular array or linked list fixes this.
