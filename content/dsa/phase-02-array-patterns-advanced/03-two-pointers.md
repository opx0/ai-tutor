---
id: B-11
code: B-11
title: Two Pointers (Converging)
---
## The Mental Model

Place two pointers, one at the `start` (0) and one at the `end` (n-1) of an array. Move them towards each other until they meet. This reduces pairs generation from $O(n^2)$ down to $O(n)$ time constraint.

Crucial requirement: **The array MUST be sorted** for this to work when searching for pairs/sums.

## LC 167: Two Sum II - Input Array Is Sorted

```cpp
// Find two numbers that add up to target. Array is SORTED.
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& numbers, int target) {
    int left = 0;
    int right = numbers.size() - 1;

    while (left < right) {
        int current_sum = numbers[left] + numbers[right];

        if (current_sum == target) {
            return {left + 1, right + 1}; // 1-indexed for LC
        } else if (current_sum < target) {
            // Need a larger sum, so move left pointer right
            left++;
        } else {
            // Need a smaller sum, so move right pointer left
            right--;
        }
    }
    return {};
}
```

## Why it works (The Proof)

If `arr[L] + arr[R] > target`, moving `L` to the right will only make the sum even bigger! The ONLY way to reduce the sum is to move `R` to the left. 

We eliminate entire rows/columns of the $O(n^2)$ search space with every single step.

## LC 11: Container With Most Water

```cpp
// You are given heights of lines. Find two lines that form a container storing the most water.

int maxArea(vector<int>& height) {
    int left = 0;
    int right = height.size() - 1;
    int max_water = 0;
    
    while (left < right) {
        // Area = width * min(height_left, height_right)
        int width = right - left;
        int current_water = width * min(height[left], height[right]);
        max_water = max(max_water, current_water);
        
        // Which pointer to move? 
        // We are limited by the SHORTER line. Moving the taller line cannot possibly
        // increase the min-height limit. We MUST move the shorter line to hope for a taller one!
        if (height[left] < height[right]) {
            left++;
        } else {
            right--;
        }
    }
    return max_water;
}
```

## The 3Sum Extension (LC 15)

Two pointers is the engine behind 3Sum. We loop through the array, fix one element `nums[i]`, and use Two Pointers for the remaining array to find a target of `-nums[i]`.

```cpp
vector<vector<int>> threeSum(vector<int>& nums) {
    vector<vector<int>> result;
    sort(nums.begin(), nums.end()); // MUST SORT FIRST
    int n = nums.size();
    
    for (int i = 0; i < n - 2; i++) {
        // Skip duplicate element for i
        if (i > 0 && nums[i] == nums[i - 1]) continue;
        
        int target = -nums[i];
        int left = i + 1, right = n - 1;
        
        while (left < right) {
            if (nums[left] + nums[right] == target) {
                result.push_back({nums[i], nums[left], nums[right]});
                left++; right--;
                
                // Skip duplicates for left and right
                while (left < right && nums[left] == nums[left - 1]) left++;
                while (left < right && nums[right] == nums[right + 1]) right--;
            } else if (nums[left] + nums[right] < target) {
                left++;
            } else {
                right--;
            }
        }
    }
    return result;
}
```

> 🎯 **Interview Insight**: Anytime you see "Pairs", "Triplets", or "Sorted Array", think Two Pointers.
