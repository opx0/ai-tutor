---
id: B-12
code: B-12
title: Quick Sort
---
## Core Idea

Pick a **pivot**. Partition: all elements < pivot go left, all > pivot go right. Pivot is now in its final sorted position. Recurse on left and right.

## Partition

```python
def partition(arr, lo, hi):
  pivot = arr[hi]
  i = lo
  for j in range(lo, hi):
    if arr[j] < pivot:
      arr[i], arr[j] = arr[j], arr[i]
      i += 1
  arr[i], arr[hi] = arr[hi], arr[i]
  return i
```

## Complexity

- **Average**: O(n log n)
- **Worst**: O(n²) — already sorted + bad pivot
- **Space**: O(log n) — call stack, in-place otherwise

*[When to reach for this]* In-place sorting, good cache locality, fast in practice.
