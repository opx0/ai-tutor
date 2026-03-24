---
id: A-6
code: A-6
title: Subsets
---
## The Template

```python
def backtrack(start, current):
  result.append(current.copy())  # every state is a valid subset
  for i in range(start, len(nums)):
    current.append(nums[i])     # CHOOSE
    backtrack(i + 1, current)    # EXPLORE
    current.pop()                # UN-CHOOSE
```

## Why It Works

At each element, we either include it or skip it. The recursion tree has 2^n leaves — one per subset. The `start` parameter prevents duplicate subsets.

## Key Insight

Backtracking is DFS on an **implicit decision tree**. The tree isn't stored in memory — we build/destroy it as we recurse.
