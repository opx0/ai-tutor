---
id: B-9
code: B-9
title: Sliding Window — Fixed Size
---
## The Mental Model

Imagine a picture frame of width $k$. You place it at the start of an array, calculate a sum or count, and then slide the frame right by one element. 

Instead of recalculating the entire frame from scratch — which takes $O(n \times k)$ — you just **subtract the element leaving the frame and add the element entering the frame**. This drops the time to $O(n)$.

## Example: Maximum Sum Subarray of Size K

```cpp
// Given an array of integers and a number k, find maximum sum of a
// contiguous subarray of size k.

#include <vector>
#include <algorithm>
#include <iostream>
using namespace std;

int maxSumSubarray(vector<int>& arr, int k) {
    int n = arr.size();
    if (n < k) return -1; // Invalid input

    // 1. Calculate the first window
    int window_sum = 0;
    for (int i = 0; i < k; i++) {
        window_sum += arr[i];
    }
    
    int max_sum = window_sum;

    // 2. Slide the window
    for (int i = k; i < n; i++) {
        window_sum += arr[i] - arr[i - k]; // Add new element, remove old
        max_sum = max(max_sum, window_sum);
    }

    return max_sum;
}
```

## Why $O(n)$?

Every element enters the window exactly once and leaves exactly once. It requires 2 operations per element ($2n = O(n)$), compared to recalculating everything every time ($k \times n$).

## When to Use

Look for these keywords in the prompt:
1. "Continuous", "Subarray", or "Substring"
2. "Max", "Min", "Longest", "Shortest"
3. A **fixed size** $k$ is given.

## LC 1456: Maximum Number of Vowels in a Substring of Given Length

```cpp
bool isVowel(char c) {
    return c == 'a' || c == 'e' || c == 'i' || c == 'o' || c == 'u';
}

int maxVowels(string s, int k) {
    int window_vowels = 0;
    
    // First window
    for (int i = 0; i < k; i++) {
        if (isVowel(s[i])) window_vowels++;
    }
    
    int max_vowels = window_vowels;
    
    // Slide!
    for (int i = k; i < s.length(); i++) {
        if (isVowel(s[i])) window_vowels++;       // entering
        if (isVowel(s[i - k])) window_vowels--;   // leaving
        max_vowels = max(max_vowels, window_vowels);
    }
    
    return max_vowels;
}
```

> 🎯 **Interview Trap**: Always check if the array size $n$ is smaller than window size $k$, and handle it (usually by returning 0, -1, or an error).
