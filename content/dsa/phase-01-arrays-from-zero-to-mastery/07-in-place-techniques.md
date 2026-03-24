---
id: B-32
code: B-32
title: In-Place Techniques
---
## What Does "In-Place" Mean?

Modifying the array **without creating a new one**. O(1) extra space. Interviewers love asking: "Can you do it in-place?" This tests if you truly understand how arrays work.

## Technique 1: Swap

```cpp
// The fundamental operation — know this cold
void swapElements(vector<int>& arr, int i, int j) {
    // Method 1: temp variable
    int temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;

    // Method 2: std::swap (preferred in C++)
    swap(arr[i], arr[j]);

    // Method 3: XOR swap (no temp, but don't use in interviews)
    arr[i] ^= arr[j];
    arr[j] ^= arr[i];
    arr[i] ^= arr[j];
}
```

## Technique 2: Read/Write Pointer (Two-Pointer Overwrite)

```cpp
// LC 283: Move Zeroes — move all 0s to end, preserve order
void moveZeroes(vector<int>& nums) {
    int write = 0;                    // where to write next non-zero
    for (int read = 0; read < nums.size(); read++) {
        if (nums[read] != 0) {
            swap(nums[write], nums[read]);
            write++;
        }
    }
}
// [0,1,0,3,12] → [1,3,12,0,0]

// Generic pattern: remove all elements matching condition
int removeElement(vector<int>& nums, int val) {
    int write = 0;
    for (int read = 0; read < nums.size(); read++) {
        if (nums[read] != val) {
            nums[write++] = nums[read];
        }
    }
    return write; // new length
}
```

## Technique 3: Dutch National Flag (3-Way Partition)

```cpp
// LC 75: Sort Colors — sort array of 0s, 1s, 2s in ONE pass
void sortColors(vector<int>& nums) {
    int lo = 0, mid = 0, hi = nums.size() - 1;
    while (mid <= hi) {
        if (nums[mid] == 0) {
            swap(nums[lo], nums[mid]);
            lo++; mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else { // nums[mid] == 2
            swap(nums[mid], nums[hi]);
            hi--;
            // Don't advance mid! swapped element needs inspection
        }
    }
}
// Three pointers partition into three regions in one pass
// [lo...mid) = 0s, [mid...hi] = 1s, (hi...end] = 2s
```

## Technique 4: Cyclic Sort

```cpp
// Elements 1..n in array of size n → place each at its "home" index
void cyclicSort(vector<int>& nums) {
    int i = 0;
    while (i < nums.size()) {
        int correct = nums[i] - 1; // where this number should be
        if (nums[i] != nums[correct]) {
            swap(nums[i], nums[correct]);
        } else {
            i++;
        }
    }
}

// LC 268: Missing Number — find missing number in [0,n]
int missingNumber(vector<int>& nums) {
    int n = nums.size();
    // Method 1: Math
    return n * (n + 1) / 2 - accumulate(nums.begin(), nums.end(), 0);

    // Method 2: XOR
    int xorSum = 0;
    for (int i = 0; i <= n; i++) xorSum ^= i;
    for (int x : nums) xorSum ^= x;
    return xorSum;
}

// LC 442: Find All Duplicates — O(n) time, O(1) space
vector<int> findDuplicates(vector<int>& nums) {
    vector<int> result;
    for (int i = 0; i < nums.size(); i++) {
        int idx = abs(nums[i]) - 1;
        if (nums[idx] < 0) {
            result.push_back(idx + 1);
        } else {
            nums[idx] = -nums[idx]; // mark as visited by negating
        }
    }
    return result;
}
```

## Technique 5: Overwrite from End

```cpp
// LC 88: Merge Sorted Arrays — merge nums2 into nums1 (has trailing space)
void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
    int i = m - 1, j = n - 1, k = m + n - 1;
    while (i >= 0 && j >= 0) {
        if (nums1[i] > nums2[j]) {
            nums1[k--] = nums1[i--];
        } else {
            nums1[k--] = nums2[j--];
        }
    }
    while (j >= 0) {
        nums1[k--] = nums2[j--];
    }
}
```

> 🎯 Interview Insight: When they say "O(1) space", think: swaps, read/write pointers, negation marking, or overwriting the input. Never allocate a new array of size n.
