---
id: B-4
code: B-4
title: C++ STL Array Toolkit
---
## The Complete C++ Array Toolkit

This is your **cheat sheet** for every STL function you'll ever need on arrays. Master these and you'll write interview solutions in half the time.

## Sorting

```cpp
#include <algorithm>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {5, 2, 8, 1, 9, 3};

    // Default sort: ascending O(n log n)
    sort(v.begin(), v.end());          // {1, 2, 3, 5, 8, 9}

    // Descending sort
    sort(v.begin(), v.end(), greater<int>()); // {9, 8, 5, 3, 2, 1}

    // Custom comparator (sort by absolute value)
    sort(v.begin(), v.end(), [](int a, int b) {
        return abs(a) < abs(b);
    });

    // Partial sort: only first k elements sorted
    partial_sort(v.begin(), v.begin() + 3, v.end()); // first 3 sorted

    // Stable sort: preserves order of equal elements
    stable_sort(v.begin(), v.end());

    // nth_element: place nth element in correct position, O(n)
    nth_element(v.begin(), v.begin() + 2, v.end()); // v[2] = median

    // Is sorted?
    bool sorted = is_sorted(v.begin(), v.end());
}
```

## Searching

```cpp
#include <algorithm>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 3, 5, 7, 9, 11, 13};

    // Linear search: O(n)
    auto it = find(v.begin(), v.end(), 7);
    if (it != v.end()) {
        int idx = distance(v.begin(), it); // index = 3
    }

    // Binary search (MUST be sorted): O(log n)
    bool found = binary_search(v.begin(), v.end(), 7); // true

    // Lower bound: first element >= value
    auto lb = lower_bound(v.begin(), v.end(), 6); // points to 7

    // Upper bound: first element > value
    auto ub = upper_bound(v.begin(), v.end(), 7); // points to 9

    // Equal range: pair of (lower_bound, upper_bound)
    auto range = equal_range(v.begin(), v.end(), 7);

    // Count occurrences
    int cnt = count(v.begin(), v.end(), 7);       // 1
    int even = count_if(v.begin(), v.end(),
        [](int x) { return x % 2 == 0; });        // 0

    // Find with condition
    auto first_big = find_if(v.begin(), v.end(),
        [](int x) { return x > 10; });             // points to 11
}
```

## Transformations & Operations

```cpp
#include <algorithm>
#include <numeric>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3, 4, 5};

    // ─── Accumulate (sum, product, etc.) ───────────
    int sum = accumulate(v.begin(), v.end(), 0);          // 15
    int product = accumulate(v.begin(), v.end(), 1, multiplies<int>()); // 120

    // ─── Partial sums (prefix sum) ─────────────────
    vector<int> prefix(v.size());
    partial_sum(v.begin(), v.end(), prefix.begin()); // {1,3,6,10,15}

    // ─── Transform (map) ──────────────────────────
    vector<int> doubled(v.size());
    transform(v.begin(), v.end(), doubled.begin(),
        [](int x) { return x * 2; });  // {2,4,6,8,10}

    // ─── Fill & Generate ──────────────────────────
    fill(v.begin(), v.end(), 0);          // all zeros
    iota(v.begin(), v.end(), 1);          // {1,2,3,4,5}

    // ─── Reverse & Rotate ─────────────────────────
    reverse(v.begin(), v.end());          // {5,4,3,2,1}
    rotate(v.begin(), v.begin() + 2, v.end()); // {3,2,1,5,4}

    // ─── Remove & Unique ──────────────────────────
    v = {1, 2, 2, 3, 3, 3, 4};
    // Remove doesn't actually erase! Returns new logical end
    auto new_end = remove(v.begin(), v.end(), 3);
    v.erase(new_end, v.end()); // {1, 2, 2, 4}

    // Unique: remove CONSECUTIVE duplicates (sort first!)
    sort(v.begin(), v.end());
    v.erase(unique(v.begin(), v.end()), v.end());

    // Remove with condition
    v.erase(remove_if(v.begin(), v.end(),
        [](int x) { return x % 2 == 0; }), v.end());
}
```

## Min, Max & Comparisons

```cpp
#include <algorithm>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {3, 1, 4, 1, 5, 9, 2, 6};

    int mn = *min_element(v.begin(), v.end());  // 1
    int mx = *max_element(v.begin(), v.end());  // 9

    // Both at once (more efficient)
    auto [lo, hi] = minmax_element(v.begin(), v.end());
    // *lo = 1, *hi = 9

    // Clamp a value
    int clamped = clamp(15, 0, 10); // 10

    // All/Any/None
    bool allPos = all_of(v.begin(), v.end(), [](int x) { return x > 0; });
    bool anyNeg = any_of(v.begin(), v.end(), [](int x) { return x < 0; });
    bool noneZero = none_of(v.begin(), v.end(), [](int x) { return x == 0; });
}
```

## Permutations

```cpp
#include <algorithm>
#include <vector>
using namespace std;

int main() {
    vector<int> v = {1, 2, 3};

    // Generate next permutation in-place
    next_permutation(v.begin(), v.end()); // {1, 3, 2}
    next_permutation(v.begin(), v.end()); // {2, 1, 3}

    // Previous permutation
    prev_permutation(v.begin(), v.end()); // {1, 3, 2}

    // Generate all permutations
    sort(v.begin(), v.end()); // MUST start sorted
    do {
        // process v
    } while (next_permutation(v.begin(), v.end()));
}
```

> 🎯 **Golden Rule**: Know `sort`, `lower_bound`, `accumulate`, `reverse`, `unique`, and `next_permutation` cold — they appear in 50%+ of interview problems.
