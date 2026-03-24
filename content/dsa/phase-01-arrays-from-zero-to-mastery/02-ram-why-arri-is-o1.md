---
id: B-1
code: B-1
title: 'RAM — Why arr[i] is O(1)'
---
## Why This Matters

Every variable you create lives in RAM. Understanding RAM explains *why* arrays are O(1) access — the single most important fact in all of DSA.

## The Mental Model

RAM is a giant numbered mailbox wall. Each mailbox (byte) has an **address** (0, 1, 2...). You tell the clerk an address, they go *straight* to that box. No scanning, no searching.

## The Key Formula

```cpp
// Address calculation — this is why arr[i] is O(1)
// address = base_address + (index × sizeof(element))

// Example: int array starting at address 0x100 (256)
int arr[5] = {10, 20, 30, 40, 50};

// arr[0] → 0x100 + (0 × 4) = 0x100   → value: 10
// arr[3] → 0x100 + (3 × 4) = 0x10C   → value: 40
// arr[1000] → 0x100 + (1000 × 4) = 0x1084 → same speed!

// One multiply + one add + one memory read = O(1)
// Whether i=0 or i=1,000,000 — same speed.
```

## Sizeof in C++

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "char:   " << sizeof(char) << " byte" << endl;    // 1
    cout << "int:    " << sizeof(int) << " bytes" << endl;     // 4
    cout << "float:  " << sizeof(float) << " bytes" << endl;   // 4
    cout << "double: " << sizeof(double) << " bytes" << endl;  // 8
    cout << "long:   " << sizeof(long long) << " bytes" << endl; // 8

    int arr[100];
    cout << "Array of 100 ints: " << sizeof(arr) << " bytes" << endl; // 400

    return 0;
}
```

## Cache Locality — The Hidden Superpower

When CPU reads `arr[0]`, it loads a whole **cache line** (~64 bytes = 16 ints). So `arr[1]` through `arr[15]` are *already in cache*. This makes sequential array access 10-100× faster than jumping between random memory locations (like linked lists).

```cpp
// Sequential access: FAST (cache-friendly)
for (int i = 0; i < n; i++) sum += arr[i];  // ✅ 

// Random access: SLOW (cache misses)
for (int i = 0; i < n; i++) sum += arr[rand() % n];  // ❌
```

> 🎯 Interview Insight: "Why are arrays faster than linked lists even though both have O(n) search?" → Cache locality. Sequential memory access is hardware-optimized. Arrays win because of spatial locality.
