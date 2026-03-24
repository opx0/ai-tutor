---
id: B-3
code: B-3
title: Dynamic Arrays — Auto-Resize
---
## The Problem with Static Arrays

Static arrays can't grow. If you need to add more elements, you need a bigger container. Dynamic arrays solve this with **automatic resizing**.

## std::vector — The King of DSA

```cpp
#include <iostream>
#include <vector>
using namespace std;

int main() {
    // ─── Construction ──────────────────────────────
    vector<int> v1;                    // empty
    vector<int> v2(5);                 // {0,0,0,0,0}
    vector<int> v3(5, -1);            // {-1,-1,-1,-1,-1}
    vector<int> v4 = {1, 2, 3, 4, 5}; // initializer list
    vector<int> v5(v4);                // copy of v4
    vector<int> v6(v4.begin(), v4.begin() + 3); // {1,2,3}

    // ─── Size & Capacity ───────────────────────────
    cout << v4.size() << endl;         // 5 (elements in use)
    cout << v4.capacity() << endl;     // ≥ 5 (allocated slots)
    cout << v4.empty() << endl;        // false
    cout << v4.max_size() << endl;     // system limit

    // ─── Element Access ────────────────────────────
    cout << v4[0] << endl;            // 1 (no bounds check)
    cout << v4.at(0) << endl;         // 1 (throws if OOB)
    cout << v4.front() << endl;       // 1 (first)
    cout << v4.back() << endl;        // 5 (last)
    int* ptr = v4.data();             // raw pointer to internal array

    return 0;
}
```

## All Vector Modifiers — Complete Reference

```cpp
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};

    // ─── Adding Elements ───────────────────────────
    v.push_back(4);                // {1,2,3,4}        O(1) amortized
    v.emplace_back(5);             // {1,2,3,4,5}      O(1), constructs in-place
    v.insert(v.begin() + 1, 10);   // {1,10,2,3,4,5}   O(n) — shifts right
    v.insert(v.end(), {6, 7});     // append {6,7}      O(k)
    v.insert(v.begin(), 3, 0);     // prepend 3 zeros   O(n)

    // ─── Removing Elements ─────────────────────────
    v.pop_back();                  // remove last      O(1)
    v.erase(v.begin() + 1);       // remove at idx 1  O(n) — shifts left
    v.erase(v.begin(), v.begin() + 3); // remove range O(n)
    v.clear();                     // remove all       O(n)

    // ─── Resizing ──────────────────────────────────
    v.resize(10);                  // grow to 10 (fill with 0)
    v.resize(10, -1);             // grow to 10 (fill with -1)
    v.resize(3);                   // shrink to first 3
    v.reserve(1000);               // pre-allocate capacity (no size change)
    v.shrink_to_fit();             // release unused capacity

    // ─── Assignment ────────────────────────────────
    v.assign(5, 100);              // {100, 100, 100, 100, 100}
    v.assign({1, 2, 3});           // {1, 2, 3}

    // ─── Swap ──────────────────────────────────────
    vector<int> other = {9, 8, 7};
    v.swap(other);                 // O(1) — just swaps internal pointers

    return 0;
}
```

## The Doubling Strategy

When a vector is full (`size == capacity`), it allocates a **new array of 2× capacity**, copies everything, and frees the old memory.

| Push # | Size | Capacity | Copy Cost |
| --- | --- | --- | --- |
| 1 | 1 | 1 | 0 |
| 2 | 2 | 2 | 1 (copy old) |
| 3 | 3 | 4 | 2 (copy old) |
| 5 | 5 | 8 | 4 (copy old) |
| 9 | 9 | 16 | 8 (copy old) |

Total copies for n pushes ≈ n + n/2 + n/4 + ... ≈ 2n → **O(1) amortized per push_back**.

> 🎯 **Performance Tip**: If you know the final size, call `v.reserve(n)` first to avoid ALL resize copies. This is a common interview optimization!
