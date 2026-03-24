---
id: B-26
code: B-26
title: Bit Operations
---
## The Fundamentals

- **AND (&)**: both 1 → 1. Use: mask/clear bits
- **OR (|)**: either 1 → 1. Use: set bits
- **XOR (^)**: different → 1. Use: toggle bits, find unique
- **NOT (~)**: flip all bits
- **Left Shift (<<)**: multiply by 2. `1 << k` = 2^k
- **Right Shift (>>)**: divide by 2

## Essential Tricks

```
# Check if bit k is set
(n >> k) & 1

# Set bit k
n | (1 << k)

# Clear bit k
n & ~(1 << k)

# Check if power of 2
n & (n - 1) == 0
```
