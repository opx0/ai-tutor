---
id: B-33
code: B-33
title: Reversal & Rotation
---
## The Three-Reversal Trick

The most elegant array technique. Rotate an array by k positions without extra space.

## Array Reversal

```cpp
// Reverse a sub-range [left, right] in-place
void reverseRange(vector<int>& arr, int left, int right) {
    while (left < right) {
        swap(arr[left], arr[right]);
        left++;
        right--;
    }
}

// Using STL
// reverse(arr.begin() + left, arr.begin() + right + 1);

// LC 344: Reverse String
void reverseString(vector<char>& s) {
    int lo = 0, hi = s.size() - 1;
    while (lo < hi) swap(s[lo++], s[hi--]);
}
```

## LC 189: Rotate Array by K Steps

```cpp
// Method 1: Three-Reversal Trick — O(n) time, O(1) space
void rotate(vector<int>& nums, int k) {
    int n = nums.size();
    k %= n;  // handle k > n
    if (k == 0) return;

    reverse(nums.begin(), nums.end());           // reverse all
    reverse(nums.begin(), nums.begin() + k);     // reverse first k
    reverse(nums.begin() + k, nums.end());       // reverse rest

    // Example: [1,2,3,4,5,6,7], k=3
    // Step 1: [7,6,5,4,3,2,1]  ← reverse all
    // Step 2: [5,6,7,4,3,2,1]  ← reverse [0,k)
    // Step 3: [5,6,7,1,2,3,4]  ← reverse [k,n)  ✓
}

// Method 2: Extra array — O(n) time, O(n) space
void rotateExtraSpace(vector<int>& nums, int k) {
    int n = nums.size();
    k %= n;
    vector<int> temp(n);
    for (int i = 0; i < n; i++) {
        temp[(i + k) % n] = nums[i];
    }
    nums = temp;
}

// Method 3: Cyclic replacement — O(n) time, O(1) space
void rotateCyclic(vector<int>& nums, int k) {
    int n = nums.size();
    k %= n;
    int count = 0;
    for (int start = 0; count < n; start++) {
        int curr = start;
        int prev = nums[start];
        do {
            int next = (curr + k) % n;
            int temp = nums[next];
            nums[next] = prev;
            prev = temp;
            curr = next;
            count++;
        } while (curr != start);
    }
}
```

## Related Problems

```cpp
// LC 151: Reverse Words in a String
// "  hello world  " → "world hello"
string reverseWords(string s) {
    // Step 1: Reverse entire string
    reverse(s.begin(), s.end());
    // Step 2: Reverse each word
    // Step 3: Clean extra spaces
    int n = s.size(), i = 0, j = 0;
    while (i < n) {
        while (i < n && s[i] == ' ') i++;
        if (i < n && j > 0) s[j++] = ' ';
        int start = j;
        while (i < n && s[i] != ' ') s[j++] = s[i++];
        reverse(s.begin() + start, s.begin() + j);
    }
    s.resize(j);
    return s;
}

// LC 48: Rotate Image (90° clockwise)
void rotateImage(vector<vector<int>>& matrix) {
    int n = matrix.size();
    // Transpose + reverse each row
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            swap(matrix[i][j], matrix[j][i]);
    for (auto& row : matrix)
        reverse(row.begin(), row.end());
}
```

> 🎯 **Memory Aid**: Rotation = reverse all → reverse first k → reverse rest. This trick appears in strings, linked lists, and 2D matrices too.
