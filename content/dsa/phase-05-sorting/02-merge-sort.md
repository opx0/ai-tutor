---
id: B-11
code: B-11
title: Merge Sort
---
## Why This Matters

Merge Sort is recursion applied to sorting. If you can write it from memory, recursion has truly clicked.

## The Algorithm

1. **Divide**: Split array in half
2. **Conquer**: Recursively sort each half
3. **Merge**: Combine two sorted halves into one sorted array

## The Merge Step

```python
def merge(left, right):
  result = []
  i = j = 0
  while i < len(left) and j < len(right):
    if left[i] <= right[j]:
      result.append(left[i]); i += 1
    else:
      result.append(right[j]); j += 1
  result += left[i:] + right[j:]
  return result
```

## Complexity

O(n log n) always. log n levels of recursion × O(n) merge per level. Space: O(n) for the temporary arrays.
