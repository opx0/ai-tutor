---
id: B-22
code: B-22
title: Hash Map Internals
---
## How Hash Maps Work

1. Compute `hash(key)` — turns any key into an integer
2. Compute `index = hash % table_size` — maps to a bucket
3. Store (key, value) in that bucket

## Collisions

When two keys map to the same bucket:

- **Chaining** — each bucket is a linked list. O(1) avg, O(n) worst.
- **Open Addressing** — probe the next empty slot. Better cache locality.

## Load Factor

α = n/m (items/buckets). When α > 0.75, resize (double table, rehash everything). This keeps operations O(1) amortized.
