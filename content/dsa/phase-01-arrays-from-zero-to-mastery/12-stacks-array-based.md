---
id: B-4
code: B-4
title: Stacks (Array-Based)
---
## Why This Matters

A stack is just an array with restricted access — you can only touch the top element. Your function call stack is a stack. Ctrl+Z (undo) is a stack. Browser back button is a stack.

## Core Definition

**Stack** — Last In, First Out (LIFO). Built on a dynamic array. Three operations, all O(1):

- **push(x)** — append to array end
- **pop()** — remove from array end
- **peek()** — read array end without removing

## Implementation

```python
class Stack:
  def __init__(self):
    self.items = []       # the underlying array!
  def push(self, x):
    self.items.append(x)  # O(1) amortized
  def pop(self):
    return self.items.pop()  # O(1)
  def peek(self):
    return self.items[-1]
  def is_empty(self):
    return len(self.items) == 0
```

## Interview Patterns Using Stacks

- **Valid Parentheses (LC 20)** — push open, pop on close, check match
- **Min Stack (LC 155)** — track minimum alongside push/pop
- **Monotonic Stack** — maintain sorted order for "next greater element" problems
- **Evaluate Reverse Polish (LC 150)** — push numbers, pop two on operator

> 🎯 When you see "matching pairs", "nested structures", or "undo" → think Stack. The call stack is why recursion works — each call pushes a frame, each return pops it.
