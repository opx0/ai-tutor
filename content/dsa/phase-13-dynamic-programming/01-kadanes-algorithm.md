---
id: A-12
code: A-12
title: Kadane's Algorithm
---
## Maximum Subarray Sum

Given an array, find the contiguous subarray with the largest sum. Kadane's solves this in O(n) with O(1) space.

## The DP Insight

At each index i, we decide: **extend** the current subarray, or **start fresh**.

```
maxEndingHere = max(arr[i], maxEndingHere + arr[i])
maxSoFar = max(maxSoFar, maxEndingHere)
```

If the running sum becomes negative, starting fresh is better than carrying the burden.

## Why This is DP

dp[i] = max subarray ending at i = max(arr[i], dp[i-1] + arr[i]). We just use one variable instead of an array — **space optimization**.
