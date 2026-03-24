---
id: A-7
code: A-7
title: Permutations
---
## Permutations vs Subsets

Subsets: choose/skip each element. Permutations: choose the **order** of all elements. For [1,2,3], there are 3! = 6 permutations.

## Template

```python
def backtrack(current):
  if len(current) == len(nums):
    result.append(current.copy())
    return
  for num in nums:
    if num in current: continue   # skip used
    current.append(num)           # choose
    backtrack(current)             # explore
    current.pop()                  # un-choose
```

*[Optimization]* Use a `used` boolean array instead of `in` for O(1) lookup.
