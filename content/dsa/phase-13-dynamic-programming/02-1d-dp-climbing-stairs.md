---
id: A-13
code: A-13
title: 1D DP — Climbing Stairs
---
## The Classic

n stairs, take 1 or 2 steps at a time. How many ways to reach the top?

```python
dp[0] = 1
dp[1] = 1
for i in range(2, n+1):
  dp[i] = dp[i-1] + dp[i-2]
```

This is Fibonacci! But the DP framework makes it clear *why*: to reach step i, you came from step i-1 (took 1) or step i-2 (took 2).

## The DP Framework

1. **Define state**: What does dp[i] represent?
2. **Recurrence**: How does dp[i] relate to previous states?
3. **Base case**: What are the trivial answers?
4. **Order**: In what order do we fill the table?
5. **Answer**: Which cell has the final answer?
