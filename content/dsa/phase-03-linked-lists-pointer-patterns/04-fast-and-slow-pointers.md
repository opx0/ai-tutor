---
id: A-5
code: A-5
title: Fast and Slow Pointers
---
## Why This Matters

The tortoise and hare algorithm detects cycles in O(n) time and O(1) space — no hash set needed.

## The Pattern

```
slow = head
fast = head
while fast and fast.next:
  slow = slow.next        # +1
  fast = fast.next.next   # +2
  if slow == fast:
    return True  # cycle!
return False  # no cycle
```

## Why It Works

If there's a cycle, fast enters it first and starts looping. Slow enters later. Each step, the gap between them shrinks by 1. They must eventually collide.

## Bonus Uses

- **Find middle node**: when fast reaches end, slow is at middle
- **Find cycle start**: after detection, reset one pointer to head, advance both +1. They meet at the cycle start.
