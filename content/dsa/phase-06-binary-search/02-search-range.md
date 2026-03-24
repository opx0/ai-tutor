---
id: B-15
code: B-15
title: Search Range
---
## Beyond Simple Search

Binary search works on any **monotonic** property — not just sorted arrays. "Search Range" means finding the first/last occurrence.

## Find First Occurrence

```python
def find_first(arr, target):
  lo, hi, result = 0, len(arr)-1, -1
  while lo <= hi:
    mid = (lo + hi) // 2
    if arr[mid] == target:
      result = mid    # save it
      hi = mid - 1    # keep searching left!
    elif arr[mid] < target:
      lo = mid + 1
    else:
      hi = mid - 1
  return result
```

The trick: when you find target, don't stop! Keep searching the left half for an earlier occurrence.

## Applications Beyond Arrays

- Search in rotated sorted array
- Find minimum in rotated array
- Search a 2D matrix
- Find peak element
