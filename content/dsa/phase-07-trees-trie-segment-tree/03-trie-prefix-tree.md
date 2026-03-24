---
id: B-18
code: B-18
title: Trie (Prefix Tree)
---
## Why This Matters

Tries enable O(m) lookup where m = word length, independent of the number of words stored. Hash maps give O(m) average, but Tries also support **prefix queries**.

## Core Operations

- **Insert(word)** — O(m): walk/create nodes for each character
- **Search(word)** — O(m): walk nodes, check end-of-word flag
- **StartsWith(prefix)** — O(m): same as search, but don't check end flag

## Implementation

```python
class TrieNode:
  def __init__(self):
    self.children = {}  # char → TrieNode
    self.is_end = False
```

*[When to reach for this]* Autocomplete, spell checker, IP routing tables, word games (Boggle).
