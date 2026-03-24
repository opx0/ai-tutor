---
id: B-36
code: B-36
title: Array Problem-Solving Framework
---
## The Decision Tree for Array Problems

When you see an array problem in an interview, follow this decision tree:

## Step 1: Is the Array Sorted?

- **Yes** → Binary Search, Two Pointers
- **No, but could be** → Sort first? (O(n log n) trade-off)
- **No, order matters** → Sliding Window, Hash Map, Prefix Sum

## Step 2: What Are You Looking For?

- **"Find pair/triplet with sum X"** → Two Pointers (sorted) or Hash Map (unsorted)
- **"Longest/shortest subarray with property"** → Sliding Window
- **"Sum of range / subarray count"** → Prefix Sum
- **"Top K / Kth element"** → Heap or Quick Select
- **"Remove/move elements"** → Two-Pointer in-place
- **"Find missing/duplicate"** → Cyclic Sort or Math

## Step 3: Optimize

| Current | Technique | Improved |
| --- | --- | --- |
| O(n²) nested loops | Hash Map | O(n) |
| O(n²) pair search | Sort + Two Pointers | O(n log n) |
| O(n²) subarray sum | Prefix Sum | O(n) |
| O(n) search (sorted) | Binary Search | O(log n) |
| O(n) space | In-place swap | O(1) |

## The 7 Patterns That Solve 90% of Array Problems

1. **Sliding Window** — subarray/substring optimization
2. **Two Pointers** — sorted array pair problems
3. **Prefix Sum** — range queries, subarray sums
4. **Hash Map** — frequency, complement search
5. **In-Place Manipulation** — swaps, read/write pointers
6. **Binary Search** — sorted array, search space reduction
7. **Kadane's Algorithm** — maximum subarray

> 🎯 Master Rule: If brute force is O(n²), there's almost always an O(n) or O(n log n) solution using one of these 7 patterns. Your job is to identify WHICH pattern.
