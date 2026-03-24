---
id: B-23
code: B-23
title: Hash Set & Patterns
---
## Hash Set

A hash map without values — just keys. O(1) membership testing. Use it whenever you need fast "have I seen this?" checks.

## Common Patterns

- **Two Sum**: For each element, check if (target - element) is in the set. O(n).
- **Frequency Count**: Use a hash map to count occurrences. O(n).
- **Group Anagrams**: Hash by sorted characters. O(n × m log m).
- **Subarray Sum = K**: Store prefix sums in a hash map. O(n).

```python
# Two Sum in O(n)
seen = {}
for i, num in enumerate(nums):
  complement = target - num
  if complement in seen:
    return [seen[complement], i]
  seen[num] = i
```
