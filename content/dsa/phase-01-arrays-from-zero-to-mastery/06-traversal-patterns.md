---
id: B-31
code: B-31
title: Traversal Patterns
---
## The 6 Traversal Patterns

Every array problem boils down to HOW you walk through the elements. Master these 6 patterns and you can attack any array problem.

## Pattern 1: Forward Traversal

```cpp
// The most basic pattern — visit every element once
// Time: O(n), Space: O(1)
int findMax(vector<int>& arr) {
    int maxVal = arr[0];
    for (int i = 0; i < arr.size(); i++) {
        maxVal = max(maxVal, arr[i]);
    }
    return maxVal;
}

// Range-based for (cleaner when you don't need index)
int sumAll(vector<int>& arr) {
    int sum = 0;
    for (int x : arr) sum += x;
    return sum;
}
```

## Pattern 2: Reverse Traversal

```cpp
// Walk backwards — essential for in-place operations
// Used in: insertion sort, building suffix arrays, right-to-left DP
void printReverse(vector<int>& arr) {
    for (int i = arr.size() - 1; i >= 0; i--) {
        cout << arr[i] << " ";
    }
}

// LC 1299: Replace every element with the greatest on its right
vector<int> replaceElements(vector<int>& arr) {
    int n = arr.size();
    int rightMax = -1;
    for (int i = n - 1; i >= 0; i--) {
        int cur = arr[i];
        arr[i] = rightMax;
        rightMax = max(rightMax, cur);
    }
    return arr;
}
```

## Pattern 3: Two-Pointer (Converging)

```cpp
// Start from both ends, move inward
// Used in: palindrome, 2-sum sorted, container with most water
bool isPalindrome(vector<int>& arr) {
    int left = 0, right = arr.size() - 1;
    while (left < right) {
        if (arr[left] != arr[right]) return false;
        left++;
        right--;
    }
    return true;
}

// LC 167: Two Sum II (sorted array)
vector<int> twoSumSorted(vector<int>& nums, int target) {
    int lo = 0, hi = nums.size() - 1;
    while (lo < hi) {
        int sum = nums[lo] + nums[hi];
        if (sum == target) return {lo + 1, hi + 1};
        else if (sum < target) lo++;
        else hi--;
    }
    return {};
}
```

## Pattern 4: Fast-Slow (Same Direction)

```cpp
// Two pointers moving same direction at different speeds
// Used in: remove duplicates, move zeros, partition

// LC 26: Remove Duplicates from Sorted Array
int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int slow = 0;
    for (int fast = 1; fast < nums.size(); fast++) {
        if (nums[fast] != nums[slow]) {
            slow++;
            nums[slow] = nums[fast];
        }
    }
    return slow + 1;
}

// LC 283: Move Zeroes
void moveZeroes(vector<int>& nums) {
    int write = 0;
    for (int read = 0; read < nums.size(); read++) {
        if (nums[read] != 0) {
            swap(nums[write], nums[read]);
            write++;
        }
    }
}
```

## Pattern 5: Window Traversal

```cpp
// Process a fixed-size window as it slides
// Used in: max sum subarray of size k, running average

double maxAvgSubarray(vector<int>& nums, int k) {
    double windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];

    double maxSum = windowSum;
    for (int i = k; i < nums.size(); i++) {
        windowSum += nums[i] - nums[i - k]; // slide window
        maxSum = max(maxSum, windowSum);
    }
    return maxSum / k;
}
```

## Pattern 6: Multi-Pass

```cpp
// Multiple passes over the array, each doing one thing
// Used in: product of array except self, trapping rain water

// LC 238: Product of Array Except Self — O(n) time, O(1) extra space
vector<int> productExceptSelf(vector<int>& nums) {
    int n = nums.size();
    vector<int> result(n, 1);

    // Pass 1: left products
    int leftProd = 1;
    for (int i = 0; i < n; i++) {
        result[i] = leftProd;
        leftProd *= nums[i];
    }

    // Pass 2: right products
    int rightProd = 1;
    for (int i = n - 1; i >= 0; i--) {
        result[i] *= rightProd;
        rightProd *= nums[i];
    }

    return result;
}
```

> 🎯 **Interview Hack**: When stuck, ask: "Which traversal pattern fits?" Forward? Reverse? Two-pointer? Window? Multi-pass? This alone solves 80% of the problem.
