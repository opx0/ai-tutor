---
id: B-6
code: B-6
title: Doubly Linked Lists
---
## Upgrade from Singly

**Doubly Linked List** — each node has both `next` and `prev` pointers. This enables O(1) deletion of any node if you have a reference to it.

## Key Advantage

In a singly linked list, to delete node X you need the node *before* X. In a doubly linked list, X knows its own predecessor.

## Where It's Used

- **LRU Cache** — the classic interview question uses a doubly linked list + hash map
- **Browser history** — forward and back navigation
- **Text editor** — cursor movement in both directions

```python
class Node:
  def __init__(self, val):
    self.val = val
    self.next = None
    self.prev = None
```
