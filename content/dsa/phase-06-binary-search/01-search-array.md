---
id: B-14
code: B-14
title: Search Array
---
## Why This Matters

Binary search appears in ~15% of all interview problems. The template is simple but the variations are tricky.

## The Template

```python
def binary_search(arr, target):
  lo, hi = 0, len(arr) - 1
  while lo <= hi:
    mid = (lo + hi) // 2
    if arr[mid] == target:
      return mid
    elif arr[mid] < target:
      lo = mid + 1
    else:
      hi = mid - 1
  return -1
```

## Key Insight

Each comparison eliminates HALF the search space. n → n/2 → n/4 → ... → 1. That's log₂(n) steps.

For n = 1,000,000: linear search = 1M checks, binary = 20 checks.

> What happens if the array isn't sorted?

Binary search breaks. It relies on the sorted order to know which half to discard.
