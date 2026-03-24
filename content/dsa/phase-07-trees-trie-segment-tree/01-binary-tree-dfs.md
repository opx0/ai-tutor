---
id: B-16
code: B-16
title: Binary Tree & DFS
---
## Core Idea

A **binary tree** is a node with at most two children (left, right). A **Binary Search Tree (BST)** adds the invariant: left < node < right.

## DFS — Three Orders

- **Inorder** (left → node → right) — gives sorted output for BSTs
- **Preorder** (node → left → right) — useful for serialization
- **Postorder** (left → right → node) — useful for deletion, evaluation

```python
def inorder(node):
  if not node: return
  inorder(node.left)
  print(node.val)   # visit
  inorder(node.right)
```

## Complexity

O(n) time (visit every node), O(h) space (call stack = height). Balanced: h = log n. Skewed: h = n.
