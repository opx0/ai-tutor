---
id: B-34
code: B-34
title: Subarrays vs Subsequences
---
## Definitions — Get These Right

| Term | Definition | Count | Example from [1,2,3] |
| --- | --- | --- | --- |
| **Subarray** | Contiguous slice | O(n²) | [1], [1,2], [2,3], [1,2,3] |
| **Subsequence** | Any subset preserving order | O(2ⁿ) | [1,3], [2], [1,2,3] |
| **Subset** | Any combination, order doesn't matter | O(2ⁿ) | {1,3}, {2,3}, {} |

## Generating All Subarrays

```cpp
// O(n²) subarrays from an array of size n
void allSubarrays(vector<int>& arr) {
    int n = arr.size();
    for (int start = 0; start < n; start++) {
        for (int end = start; end < n; end++) {
            // Process subarray arr[start..end]
            for (int k = start; k <= end; k++) {
                cout << arr[k] << " ";
            }
            cout << endl;
        }
    }
}
// Total subarrays = n*(n+1)/2
```

## Kadane's Algorithm — Maximum Subarray Sum

```cpp
// LC 53: Maximum Subarray — the most famous array algorithm
// O(n) time, O(1) space
int maxSubArray(vector<int>& nums) {
    int maxSum = nums[0];
    int currentSum = nums[0];

    for (int i = 1; i < nums.size(); i++) {
        // Either extend current subarray or start fresh
        currentSum = max(nums[i], currentSum + nums[i]);
        maxSum = max(maxSum, currentSum);
    }
    return maxSum;
}

// Variant: Also track the start and end indices
pair<int, pair<int,int>> kadaneWithIndices(vector<int>& nums) {
    int maxSum = nums[0], curSum = nums[0];
    int start = 0, end = 0, tempStart = 0;

    for (int i = 1; i < nums.size(); i++) {
        if (nums[i] > curSum + nums[i]) {
            curSum = nums[i];
            tempStart = i;
        } else {
            curSum += nums[i];
        }
        if (curSum > maxSum) {
            maxSum = curSum;
            start = tempStart;
            end = i;
        }
    }
    return {maxSum, {start, end}};
}

// Variant: Maximum CIRCULAR subarray sum (LC 918)
int maxSubarraySumCircular(vector<int>& nums) {
    int totalSum = 0, maxSum = nums[0], curMax = 0;
    int minSum = nums[0], curMin = 0;

    for (int x : nums) {
        curMax = max(x, curMax + x);
        maxSum = max(maxSum, curMax);
        curMin = min(x, curMin + x);
        minSum = min(minSum, curMin);
        totalSum += x;
    }

    // If all elements are negative, maxSum is the answer
    return maxSum < 0 ? maxSum : max(maxSum, totalSum - minSum);
}
```

## Subarray Sum Problems

```cpp
// LC 560: Subarray Sum Equals K — prefix sum + hash map
// O(n) time, O(n) space
int subarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> prefixCount;
    prefixCount[0] = 1; // empty prefix
    int sum = 0, count = 0;

    for (int x : nums) {
        sum += x;
        if (prefixCount.count(sum - k)) {
            count += prefixCount[sum - k];
        }
        prefixCount[sum]++;
    }
    return count;
}

// LC 523: Continuous Subarray Sum (divisible by k)
bool checkSubarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> remainderIdx;
    remainderIdx[0] = -1;
    int sum = 0;

    for (int i = 0; i < nums.size(); i++) {
        sum += nums[i];
        int rem = sum % k;
        if (remainderIdx.count(rem)) {
            if (i - remainderIdx[rem] >= 2) return true;
        } else {
            remainderIdx[rem] = i;
        }
    }
    return false;
}
```

> 🎯 **Pattern Recognition**: See "contiguous subarray" + "sum"? Think Kadane's or Prefix Sum + HashMap. These two techniques cover 90% of subarray sum problems.
