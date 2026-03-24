---
id: B-8
code: B-8
title: Factorial
---
## The Mental Model

"I solve the smallest version. I trust the same function handles everything bigger. Every call moves closer to the base case."

## Factorial

```python
def factorial(n):
  if n <= 1:       # base case
    return 1
  return n * factorial(n - 1)  # recursive case
```

## Trace It

```
factorial(4)
  4 * factorial(3)
    3 * factorial(2)
      2 * factorial(1)
        return 1     ← base case
      return 2 * 1 = 2
    return 3 * 2 = 6
  return 4 * 6 = 24
```

The call stack is literally a stack — LIFO. Each frame waits for the one below to return.

> What happens if you forget the base case?

Stack overflow — infinite recursion until memory runs out.
