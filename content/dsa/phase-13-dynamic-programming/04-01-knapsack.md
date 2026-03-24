---
id: A-15
code: A-15
title: 0/1 Knapsack
---
## The Classic DP Problem

Given items with weights and values, and a knapsack with capacity W, maximize the total value without exceeding W.

## Recurrence

```
dp[i][w] = max(
  dp[i-1][w],              # skip item i
  dp[i-1][w-wt[i]] + val[i]  # take item i
)
```

For each item: either skip it (keep previous best) or take it (use remaining capacity).

## Variants

- **0/1 Knapsack** — each item used at most once
- **Unbounded Knapsack** — unlimited copies: dp[i][w-wt[i]] instead of dp[i-1][w-wt[i]]
- **Subset Sum** — special case where value = weight, target sum
- **Coin Change** — unbounded knapsack with minimum count instead of max value
