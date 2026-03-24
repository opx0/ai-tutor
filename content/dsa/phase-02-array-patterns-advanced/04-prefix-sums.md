---
id: B-12
code: B-12
title: Prefix Sums
---
## The Mental Model

Querying the sum of a subarray `nums[i..j]` takes $O(k)$ time where $k$ is the length. If you have to answer $Q$ queries, it takes $O(Q \times n)$ time.

**Prefix Sum** brings the query time down to $O(1)$ by pre-calculating a running total array.
`prefix[i]` = Sum of all elements from index 0 to $i-1$.

## The Formula

For `nums` = `[3, 1, 4, 1, 5, 9, 2, 6]`
`prefix` = `[0, 3, 4, 8, 9, 14, 23, 25, 31]`
*(Note: Prefix array is size $N+1$, starting with 0)*

**Sum from index $L$ to $R$ (inclusive):**
`Sum = prefix[R + 1] - prefix[L]`

Example: Sum of indices 2 to 5 (`4+1+5+9 = 19`).
Using formula: `prefix[6] - prefix[2]` → `23 - 4 = 19`. Magic! $O(1)$ time!

## LC 303: Range Sum Query - Immutable

```cpp
#include <vector>
using namespace std;

class NumArray {
private:
    vector<int> prefix;

public:
    NumArray(vector<int>& nums) {
        int n = nums.size();
        prefix.resize(n + 1, 0); // size N+1 initialized to 0
        
        for (int i = 0; i < n; i++) {
            // prefix[i+1] stores sum up to nums[i]
            prefix[i + 1] = prefix[i] + nums[i]; 
        }
    }
    
    int sumRange(int left, int right) {
        return prefix[right + 1] - prefix[left];
    }
};
```

## 2D Prefix Sums (Matrices)

You can extend this to 2D grids to find the sum of any rectangle in $O(1)$ time!

`prefix[r][c]` = Sum of rectangle from `(0,0)` to `(r-1, c-1)`

**Building the 2D Prefix Array:**
```cpp
// prefix[r][c] = current_cell + above + left - top_left_overlap
prefix[r+1][c+1] = matrix[r][c] + prefix[r][c+1] + prefix[r+1][c] - prefix[r][c];
```

**Querying a Rectangle $(r1, c1)$ to $(r2, c2)$:**
```cpp
int getSum(int r1, int c1, int r2, int c2) {
    return prefix[r2+1][c2+1] 
         - prefix[r1][c2+1] 
         - prefix[r2+1][c1] 
         + prefix[r1][c1]; // add back double-subtracted piece
}
```

## Frequency/Count Prefix Sums

Prefix arrays aren't just for adding numbers! You can use them to count occurrences. E.g., counting the number of 1s in a boolean array range, or counting occurrences of the letter 'A' in a string range.

```cpp
// Count how many 'E's occur between index L and R
vector<int> countPrefix(string s) {
    vector<int> prefix(s.length() + 1, 0);
    for (int i = 0; i < s.length(); i++) {
        prefix[i + 1] = prefix[i] + (s[i] == 'E' ? 1 : 0);
    }
    return prefix;
}

int countEs(const vector<int>& prefix, int L, int R) {
    return prefix[R + 1] - prefix[L];
}
```

> 🎯 **When to Use**: "Sum of range", "Number of X between index L and R", "Multiple queries", "Static array (no updates)".
