---
id: B-10
code: B-10
title: Insertion Sort
---
## The Mental Model

Like sorting playing cards in your hand. Pick up one card at a time and insert it into the correct position among the already-sorted cards.

## Algorithm

```python
for i in range(1, n):
  key = arr[i]
  j = i - 1
  while j >= 0 and arr[j] > key:
    arr[j+1] = arr[j]  # shift right
    j -= 1
  arr[j+1] = key  # insert
```

## Complexity

- **Worst case**: O(n²) — reverse-sorted input
- **Best case**: O(n) — already sorted (inner loop never runs)
- **Space**: O(1) — in-place

*[When to reach for this]* Small arrays (n < 20) or nearly-sorted data.
