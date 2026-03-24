---
id: B-13
code: B-13
title: Bucket Sort
---
## Breaking the O(n log n) Barrier

Comparison-based sorts can't do better than O(n log n). But if you know the range of values, you can sort in O(n).

## Algorithm

1. Create k empty buckets
2. Place each element in its bucket: bucket = value / range * k
3. Sort each bucket (small, so fast)
4. Concatenate all buckets

## Complexity

O(n + k) average, where k = number of buckets. Works best when input is uniformly distributed.

*[When to reach for this]* Known range, uniform distribution, or integer keys.
