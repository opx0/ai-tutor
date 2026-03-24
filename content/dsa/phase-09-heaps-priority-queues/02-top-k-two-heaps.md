---
id: B-21
code: B-21
title: Top K & Two Heaps
---
## Top K Pattern

Find the K largest elements: maintain a **min-heap of size K**. Push each element; if heap size > K, pop the min. Final heap = K largest.

```python
import heapq
def topK(nums, k):
  heap = []
  for num in nums:
    heapq.heappush(heap, num)
    if len(heap) > k:
      heapq.heappop(heap)  # remove smallest
  return heap
```

O(n log k) — much better than O(n log n) sorting when k << n.

## Two Heaps: Running Median

Max-heap for lower half, min-heap for upper half. Median = top of max-heap (or average of both tops). Each insert: O(log n).
