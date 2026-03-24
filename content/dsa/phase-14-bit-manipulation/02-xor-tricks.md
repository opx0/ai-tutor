---
id: B-27
code: B-27
title: XOR Tricks
---
## XOR Properties

- `a ^ a = 0` — anything XOR itself is 0
- `a ^ 0 = a` — anything XOR 0 is itself
- **Commutative & Associative** — order doesn't matter

## Single Number

Array where every element appears twice except one. XOR all elements — duplicates cancel out, leaving the unique one.

```python
def singleNumber(nums):
  result = 0
  for num in nums:
    result ^= num
  return result
```

O(n) time, O(1) space — no hash set needed!

## Swap Without Temp Variable

```
a ^= b
b ^= a
a ^= b
```

Mind-bending but works because XOR is its own inverse.
