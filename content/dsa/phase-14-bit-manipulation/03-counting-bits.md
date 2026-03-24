---
id: B-28
code: B-28
title: Counting Bits
---
## Count Set Bits (Hamming Weight)

```python
def countBits(n):
  count = 0
  while n:
    count += n & 1
    n >>= 1
  return count
```

## Brian Kernighan's Trick

```python
def countBits(n):
  count = 0
  while n:
    n &= n - 1  # clears the lowest set bit!
    count += 1
  return count
```

`n & (n-1)` removes the rightmost 1-bit. So this loops exactly (number of 1-bits) times.

## DP Version — Count Bits 0 to n

```
dp[i] = dp[i >> 1] + (i & 1)
```

Shift right removes last bit (already solved), add back that last bit. O(n) for all values.
