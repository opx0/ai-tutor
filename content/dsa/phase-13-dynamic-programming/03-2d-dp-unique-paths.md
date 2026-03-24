---
id: A-14
code: A-14
title: 2D DP — Unique Paths
---
## Grid DP

Count paths from top-left to bottom-right of an m×n grid, moving only right or down.

```
dp[r][c] = dp[r-1][c] + dp[r][c-1]
```

Base: first row and first column are all 1 (only one way to reach them).

## Variations

- **Obstacles**: Set dp[r][c] = 0 if cell is blocked
- **Minimum path sum**: dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])
- **Triangle**: dp top-down or bottom-up

## Space Optimization

Since each row only depends on the row above, use a 1D array: O(m×n) → O(n).
