---
id: B-9
code: B-9
title: Fibonacci Sequence
---
## Naive Recursion

```python
def fib(n):
  if n <= 1: return n
  return fib(n-1) + fib(n-2)
```

This is O(2ⁿ) — exponential! fib(5) calls fib(3) twice, fib(2) three times. Massive redundancy.

## Fix: Memoization

```python
memo = {}
def fib(n):
  if n in memo: return memo[n]
  if n <= 1: return n
  memo[n] = fib(n-1) + fib(n-2)
  return memo[n]
```

Now O(n) — each value computed exactly once. This is your first taste of **Dynamic Programming** (Phase 13).

> Can you do it with O(1) space? Hint: you only need the last two values.
