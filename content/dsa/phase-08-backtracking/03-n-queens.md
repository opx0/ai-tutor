---
id: A-8
code: A-8
title: N-Queens
---
## The Classic

Place N queens on an N×N chessboard so no two queens attack each other (same row, column, or diagonal).

## Approach

Place one queen per row. For each row, try each column. Before placing, check column and both diagonals.

## Pruning

```python
cols = set()     # occupied columns
diag1 = set()    # row - col (main diagonal)
diag2 = set()    # row + col (anti-diagonal)

def backtrack(row):
  if row == n: result.append(board.copy())
  for col in range(n):
    if col in cols or (row-col) in diag1 or (row+col) in diag2:
      continue  # PRUNE — skip invalid placement
    # place queen, recurse, remove queen
```

Pruning is what makes backtracking efficient — we don't explore clearly invalid branches.
