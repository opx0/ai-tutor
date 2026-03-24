---
id: B-0
code: B-0
title: Why Arrays Are Everything
---
## The Foundation of All Computing

Arrays are the **single most important data structure** in computer science. Every other structure — hash maps, heaps, stacks, even strings — is built on top of arrays. If you master arrays, you master 60% of all interview problems.

## What Is an Array?

An array is a **numbered collection of elements stored side-by-side in memory**. Like numbered lockers in a hallway — you say "locker 5" and go straight to it.

```cpp
#include <iostream>
#include <vector>
#include <array>
using namespace std;

int main() {
    // C-style array (fixed size, stack allocated)
    int arr[5] = {10, 20, 30, 40, 50};

    // std::array (fixed size, type-safe, STL compatible)
    array<int, 5> stdarr = {10, 20, 30, 40, 50};

    // std::vector (dynamic size, the workhorse of DSA)
    vector<int> vec = {10, 20, 30, 40, 50};

    // Access: O(1) for all three
    cout << arr[2] << endl;       // 30
    cout << stdarr[2] << endl;    // 30
    cout << vec[2] << endl;       // 30

    return 0;
}
```

## The Two Questions

For every solution you write, always ask:

1. **What is the time complexity?** — How many operations as input grows?
2. **What is the space complexity?** — How much extra memory do you use?

## Big-O Reference Table

| Notation | Name | Example | n=1M ops |
| --- | --- | --- | --- |
| O(1) | Constant | Array access | 1 |
| O(log n) | Logarithmic | Binary search | 20 |
| O(n) | Linear | Loop through array | 1M |
| O(n log n) | Linearithmic | Merge sort | 20M |
| O(n²) | Quadratic | Nested loops | 1T 💀 |

## C++ Array Types at a Glance

| Type | Size | Resize | Bounds Check | Use When |
| --- | --- | --- | --- | --- |
| `int arr[]` | Fixed | No | No | Competitive programming, raw speed |
| `std::array<T,N>` | Fixed | No | `.at()` yes | Fixed-size, type-safe |
| `std::vector<T>` | Dynamic | Yes | `.at()` yes | **Default choice for DSA** |

> 🎯 **Interview Rule**: Unless told otherwise, always use `std::vector`. It's dynamic, safe, and has O(1) amortized push_back.
