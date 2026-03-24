---
id: B-2
code: B-2
title: Static Arrays — Fixed Size
---
## Core Definition

**Static Array** = a fixed-size, contiguous block of memory. You declare the size upfront and it never changes. Think of it as renting exactly N lockers — no more, no less.

## C++ Static Array Types

```cpp
#include <iostream>
#include <array>
using namespace std;

int main() {
    // ─── C-style array ─────────────────────────────
    int c_arr[5] = {10, 20, 30, 40, 50};
    int zeros[100] = {};          // all zeros
    int partial[5] = {1, 2};     // {1, 2, 0, 0, 0}

    // Size: must use sizeof trick (error-prone!)
    int size = sizeof(c_arr) / sizeof(c_arr[0]); // 5

    // ─── std::array (preferred) ────────────────────
    array<int, 5> arr = {10, 20, 30, 40, 50};

    cout << arr.size() << endl;    // 5
    cout << arr.front() << endl;   // 10
    cout << arr.back() << endl;    // 50
    cout << arr.at(2) << endl;     // 30 (bounds-checked!)
    // arr.at(10);                 // throws std::out_of_range

    arr.fill(0);                   // set all to 0
    cout << arr.empty() << endl;   // false (size is always 5)

    return 0;
}
```

## Operations Complexity Table

| Operation | Time | Why |
| --- | --- | --- |
| Read `arr[i]` | O(1) | Address formula |
| Write `arr[i]=x` | O(1) | Same formula |
| Insert at end | O(1) | If space exists |
| Insert at middle | **O(n)** | Shift elements right |
| Delete at index | **O(n)** | Shift elements left |
| Search (unsorted) | O(n) | Linear scan |
| Search (sorted) | O(log n) | Binary search! |

## The Shifting Problem

```cpp
// Insert 25 at index 2 of [10, 20, 30, 40, _]
// Must shift elements RIGHT to make room

void insertAt(int arr[], int& size, int idx, int val) {
    // Shift right: work BACKWARDS to avoid overwriting
    for (int i = size; i > idx; i--) {
        arr[i] = arr[i - 1];
    }
    arr[idx] = val;
    size++;
}

// Delete at index 1: shift elements LEFT
void deleteAt(int arr[], int& size, int idx) {
    for (int i = idx; i < size - 1; i++) {
        arr[i] = arr[i + 1];
    }
    size--;
}
```

## Edge Cases Every Interviewer Tests

- **Empty array (n=0)** — check length before ANY access
- **Single element** — often a special case that breaks naive algorithms
- **Off-by-one** — the #1 array bug. Is it `< n` or `<= n`? Start at 0 or 1?
- **Integer overflow** — summing elements? Use `long long`. `(lo+hi)/2`? Use `lo + (hi-lo)/2`
- **All same elements** — breaks many partition-based algorithms
- **Already sorted / reverse sorted** — worst case for many algorithms
- **Negative numbers** — breaks assumptions about max/min

> 🎯 Memorize: Before writing ANY array code, ask yourself: "What if the array is empty? What if it has one element? What if all elements are the same?"
