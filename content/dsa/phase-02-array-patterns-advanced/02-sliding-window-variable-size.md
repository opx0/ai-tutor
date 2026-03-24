---
id: B-10
code: B-10
title: Sliding Window — Variable Size
---
## The Mental Model

What if you don't know the window size? Instead of moving both ends together, you use a **caterpillar approach**:
1. Expand the `right` pointer to make the window larger, absorbing elements until a condition is broken.
2. Shrink the `left` pointer to make the window smaller until the condition is valid again.
3. Update your max/min answer at the right moments.

## Template for Variable Size Sliding Window

```cpp
int slidingWindowTemplate(vector<int>& nums) {
    int left = 0, right = 0;
    int max_len = 0; // or min_len = INT_MAX
    // state variables (sum, counts, hashmap, etc.)
    
    while (right < nums.size()) {
        // 1. ADD: add nums[right] to state
        
        // 2. INVALID: while the window condition is broken
        // while (state is invalid) {
        //     REMOVE nums[left] from state
        //     left++;
        // }
        
        // 3. VALID: update answer
        // max_len = max(max_len, right - left + 1);
        
        right++;
    }
    
    return max_len;
}
```

## Example: Longest Subarray with Sum $\le K$

```cpp
// Find the length of the longest subarray where sum <= K
#include <vector>
#include <algorithm>
using namespace std;

int longestSubarraySumAtMostK(vector<int>& nums, int k) {
    int left = 0, right = 0;
    int current_sum = 0;
    int max_length = 0;

    while (right < nums.size()) {
        current_sum += nums[right]; // Expand window

        // Shrink window if it violates condition
        while (current_sum > k && left <= right) {
            current_sum -= nums[left];
            left++;
        }

        // Now window is valid, update max length
        max_length = max(max_length, right - left + 1);
        right++;
    }

    return max_length;
}
```

## LC 3: Longest Substring Without Repeating Characters

```cpp
#include <string>
#include <unordered_set>
#include <algorithm>
using namespace std;

int lengthOfLongestSubstring(string s) {
    int left = 0, max_len = 0;
    unordered_set<char> window; // Keeps track of characters in current window
    
    for (int right = 0; right < s.length(); right++) {
        // If char is already in window, we must shrink from the left
        // until the duplicate is removed!
        while (window.count(s[right])) {
            window.erase(s[left]);
            left++;
        }
        
        // Now it's safe to add
        window.insert(s[right]);
        max_len = max(max_len, right - left + 1);
    }
    
    return max_len;
}
```

> 🎯 **Time Complexity Proof**: Don't be fooled by the nested `while` loop. Because `left` only ever moves forward and starts at 0, it can process at most $n$ elements. `right` also processes $n$ elements. Total operations: $2n$, giving $O(n)$ time complexity!
