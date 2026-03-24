import type { VisualizationBlock } from '@/lib/visualization/types'

export type ArrayProblem = {
  id: string
  title: string
  pattern: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  description: string
  defaultInput: string
  starterCode: { javascript: string; python: string; cpp: string }
  visualization: VisualizationBlock | null
}

// ─── Pre-authored visualization blocks ────────────────────────────────

const twoPointersViz: VisualizationBlock = {
  type: 'array', initialState: {},
  steps: [
    { message: 'Two Sum II: In sorted array [1, 3, 4, 5, 7, 11], find two numbers summing to 9. Left pointer at start, right at end.', elements: [
      { type: 'array', id: 'arr', label: 'Sorted Array', items: [{ value: '1', state: 'active' }, { value: '3', state: 'default' }, { value: '4', state: 'default' }, { value: '5', state: 'default' }, { value: '7', state: 'default' }, { value: '11', state: 'active' }] },
      { type: 'variable', id: 'l', name: 'left', value: '0', state: 'active' }, { type: 'variable', id: 'r', name: 'right', value: '5', state: 'active' },
      { type: 'variable', id: 's', name: 'sum', value: '12', state: 'default' }, { type: 'variable', id: 't', name: 'target', value: '9', state: 'highlight' },
      { type: 'log', id: 'log', lines: [{ text: 'arr[0]+arr[5] = 1+11 = 12 > 9 → move right LEFT', kind: 'compare' }] },
    ]},
    { message: 'sum=12 > 9 → move right left. right: 5→4. arr[0]+arr[4]=1+7=8 < 9.', elements: [
      { type: 'array', id: 'arr', label: 'Sorted Array', items: [{ value: '1', state: 'active' }, { value: '3', state: 'default' }, { value: '4', state: 'default' }, { value: '5', state: 'default' }, { value: '7', state: 'active' }, { value: '11', state: 'visited' }] },
      { type: 'variable', id: 'l', name: 'left', value: '0', state: 'active' }, { type: 'variable', id: 'r', name: 'right', value: '4', state: 'active' },
      { type: 'variable', id: 's', name: 'sum', value: '8', state: 'default' }, { type: 'variable', id: 't', name: 'target', value: '9', state: 'highlight' },
      { type: 'log', id: 'log', lines: [{ text: 'arr[0]+arr[4] = 1+7 = 8 < 9 → move left RIGHT', kind: 'compare' }] },
    ]},
    { message: 'sum=8 < 9 → move left right. left: 0→1. arr[1]+arr[4]=3+7=10 > 9.', elements: [
      { type: 'array', id: 'arr', label: 'Sorted Array', items: [{ value: '1', state: 'visited' }, { value: '3', state: 'active' }, { value: '4', state: 'default' }, { value: '5', state: 'default' }, { value: '7', state: 'active' }, { value: '11', state: 'visited' }] },
      { type: 'variable', id: 'l', name: 'left', value: '1', state: 'active' }, { type: 'variable', id: 'r', name: 'right', value: '4', state: 'active' },
      { type: 'variable', id: 's', name: 'sum', value: '10', state: 'default' }, { type: 'variable', id: 't', name: 'target', value: '9', state: 'highlight' },
      { type: 'log', id: 'log', lines: [{ text: 'arr[1]+arr[4] = 3+7 = 10 > 9 → move right LEFT', kind: 'compare' }] },
    ]},
    { message: 'sum=10 > 9 → right: 4→3. arr[1]+arr[3]=3+5=8 < 9 → left: 1→2. arr[2]+arr[3]=4+5=9 ✅', elements: [
      { type: 'array', id: 'arr', label: 'Sorted Array', items: [{ value: '1', state: 'visited' }, { value: '3', state: 'visited' }, { value: '4', state: 'done' }, { value: '5', state: 'done' }, { value: '7', state: 'visited' }, { value: '11', state: 'visited' }] },
      { type: 'variable', id: 'l', name: 'left', value: '2', state: 'done' }, { type: 'variable', id: 'r', name: 'right', value: '3', state: 'done' },
      { type: 'variable', id: 's', name: 'sum', value: '9', state: 'done' }, { type: 'variable', id: 't', name: 'target', value: '9', state: 'done' },
      { type: 'log', id: 'log', lines: [{ text: 'FOUND: arr[2]+arr[3] = 4+5 = 9 ✅ O(n) solution', kind: 'return' }] },
    ]},
  ],
}

const slidingWindowViz: VisualizationBlock = {
  type: 'array', initialState: {},
  steps: [
    { message: 'Max sum of k=3 consecutive elements in [2,1,5,1,3,2]. Sliding window avoids recomputing.', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '2', state: 'default' }, { value: '1', state: 'default' }, { value: '5', state: 'default' }, { value: '1', state: 'default' }, { value: '3', state: 'default' }, { value: '2', state: 'default' }] },
      { type: 'variable', id: 'k', name: 'k', value: '3', state: 'default' }, { type: 'variable', id: 'ws', name: 'windowSum', value: '—', state: 'default' }, { type: 'variable', id: 'mx', name: 'maxSum', value: '—', state: 'default' },
      { type: 'log', id: 'log', lines: [{ text: 'Slide window of size 3 across the array', kind: 'info' }] },
    ]},
    { message: 'Window [0..2]: 2+1+5=8. maxSum=8.', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '2', state: 'active' }, { value: '1', state: 'active' }, { value: '5', state: 'active' }, { value: '1', state: 'default' }, { value: '3', state: 'default' }, { value: '2', state: 'default' }] },
      { type: 'variable', id: 'ws', name: 'windowSum', value: '8', state: 'active' }, { type: 'variable', id: 'mx', name: 'maxSum', value: '8', state: 'highlight' },
      { type: 'log', id: 'log', lines: [{ text: 'Window [0..2]: 2+1+5 = 8, maxSum = 8', kind: 'compare' }] },
    ]},
    { message: 'Slide: -arr[0]=2, +arr[3]=1 → sum=7 < 8, no new max.', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '2', state: 'error' }, { value: '1', state: 'active' }, { value: '5', state: 'active' }, { value: '1', state: 'comparing' }, { value: '3', state: 'default' }, { value: '2', state: 'default' }] },
      { type: 'variable', id: 'ws', name: 'windowSum', value: '7', state: 'active' }, { type: 'variable', id: 'mx', name: 'maxSum', value: '8', state: 'highlight' },
      { type: 'log', id: 'log', lines: [{ text: 'Slide: -2 +1 → sum=7 < 8, maxSum unchanged', kind: 'swap' }] },
    ]},
    { message: 'Slide: -arr[1]=1, +arr[4]=3 → sum=9. New max!', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '2', state: 'default' }, { value: '1', state: 'error' }, { value: '5', state: 'active' }, { value: '1', state: 'active' }, { value: '3', state: 'comparing' }, { value: '2', state: 'default' }] },
      { type: 'variable', id: 'ws', name: 'windowSum', value: '9', state: 'highlight' }, { type: 'variable', id: 'mx', name: 'maxSum', value: '9', state: 'highlight' },
      { type: 'log', id: 'log', lines: [{ text: 'Slide: -1 +3 → sum=9 > 8, NEW maxSum=9 ✓', kind: 'compare' }] },
    ]},
    { message: 'Final slide: sum=6. Done! maxSum=9 from [5,1,3]. O(n) total.', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '2', state: 'default' }, { value: '1', state: 'default' }, { value: '5', state: 'error' }, { value: '1', state: 'active' }, { value: '3', state: 'active' }, { value: '2', state: 'comparing' }] },
      { type: 'variable', id: 'ws', name: 'windowSum', value: '6', state: 'default' }, { type: 'variable', id: 'mx', name: 'maxSum', value: '9', state: 'done' },
      { type: 'log', id: 'log', lines: [{ text: '✅ maxSum=9 from subarray [5,1,3]. O(n) with 1 pass.', kind: 'info' }] },
    ]},
  ],
}

const moveZeroesViz: VisualizationBlock = {
  type: 'array', initialState: {},
  steps: [
    { message: 'Move Zeroes: Push all zeros to end, maintain relative order of non-zeros. In-place, O(n).', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '0', state: 'error' }, { value: '1', state: 'default' }, { value: '0', state: 'error' }, { value: '3', state: 'default' }, { value: '12', state: 'default' }] },
      { type: 'variable', id: 'w', name: 'write', value: '0', state: 'active' },
      { type: 'log', id: 'log', lines: [{ text: 'write pointer: tracks next position for non-zero', kind: 'info' }] },
    ]},
    { message: 'read=0: arr[0]=0, skip. read=1: arr[1]=1 ≠ 0 → swap(arr[0],arr[1]), write++.', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '1', state: 'active' }, { value: '0', state: 'error' }, { value: '0', state: 'error' }, { value: '3', state: 'default' }, { value: '12', state: 'default' }] },
      { type: 'variable', id: 'w', name: 'write', value: '1', state: 'active' },
      { type: 'log', id: 'log', lines: [{ text: 'arr[1]=1 → swap(arr[0],arr[1]), write→1', kind: 'swap' }] },
    ]},
    { message: 'read=2: arr[2]=0, skip. read=3: arr[3]=3 → swap(arr[1],arr[3]), write++.', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '1', state: 'done' }, { value: '3', state: 'active' }, { value: '0', state: 'error' }, { value: '0', state: 'error' }, { value: '12', state: 'default' }] },
      { type: 'variable', id: 'w', name: 'write', value: '2', state: 'active' },
      { type: 'log', id: 'log', lines: [{ text: 'arr[3]=3 → swap(arr[1],arr[3]), write→2', kind: 'swap' }] },
    ]},
    { message: 'read=4: arr[4]=12 → swap(arr[2],arr[4]), write++. Done! All zeros at end.', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '1', state: 'done' }, { value: '3', state: 'done' }, { value: '12', state: 'done' }, { value: '0', state: 'visited' }, { value: '0', state: 'visited' }] },
      { type: 'variable', id: 'w', name: 'write', value: '3', state: 'done' },
      { type: 'log', id: 'log', lines: [{ text: '✅ [1,3,12,0,0] — zeros at end, order preserved. O(n).', kind: 'info' }] },
    ]},
  ],
}

const prefixSumViz: VisualizationBlock = {
  type: 'array', initialState: {},
  steps: [
    { message: 'Prefix Sums on [3,1,4,1,5]. After O(n) build, answer range queries in O(1).', elements: [
      { type: 'array', id: 'arr', label: 'Original Array', items: [{ value: '3', state: 'default' }, { value: '1', state: 'default' }, { value: '4', state: 'default' }, { value: '1', state: 'default' }, { value: '5', state: 'default' }] },
      { type: 'array', id: 'pfx', label: 'Prefix Sum (building...)', items: [{ value: '0', state: 'active' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }] },
      { type: 'log', id: 'log', lines: [{ text: 'prefix[i] = sum of arr[0..i-1]. prefix[0]=0.', kind: 'info' }] },
    ]},
    { message: 'Build: prefix[1]=3, [2]=4, [3]=8, [4]=9, [5]=14.', elements: [
      { type: 'array', id: 'arr', label: 'Original Array', items: [{ value: '3', state: 'done' }, { value: '1', state: 'done' }, { value: '4', state: 'done' }, { value: '1', state: 'done' }, { value: '5', state: 'done' }] },
      { type: 'array', id: 'pfx', label: 'Prefix Sum (complete)', items: [{ value: '0', state: 'done' }, { value: '3', state: 'done' }, { value: '4', state: 'done' }, { value: '8', state: 'done' }, { value: '9', state: 'done' }, { value: '14', state: 'done' }] },
      { type: 'log', id: 'log', lines: [{ text: 'prefix = [0,3,4,8,9,14] — O(n) build done', kind: 'swap' }] },
    ]},
    { message: 'Query sum(1..3): prefix[4]-prefix[1] = 9-3 = 6. O(1)!', elements: [
      { type: 'array', id: 'arr', label: 'Original Array', items: [{ value: '3', state: 'default' }, { value: '1', state: 'highlight' }, { value: '4', state: 'highlight' }, { value: '1', state: 'highlight' }, { value: '5', state: 'default' }] },
      { type: 'array', id: 'pfx', label: 'Prefix Sum', items: [{ value: '0', state: 'default' }, { value: '3', state: 'comparing' }, { value: '4', state: 'default' }, { value: '8', state: 'default' }, { value: '9', state: 'comparing' }, { value: '14', state: 'default' }] },
      { type: 'variable', id: 'ans', name: 'answer', value: '9-3=6', state: 'highlight' },
      { type: 'log', id: 'log', lines: [{ text: '✅ sum(1..3) = prefix[4]-prefix[1] = 6. O(1) query!', kind: 'return' }] },
    ]},
  ],
}

const dynamicArrayViz: VisualizationBlock = {
  type: 'array', initialState: {},
  steps: [
    { message: 'Dynamic array starts empty (capacity=2). push() doubles capacity when full.', elements: [
      { type: 'array', id: 'arr', label: 'Dynamic Array', items: [{ value: '_', state: 'default' }, { value: '_', state: 'default' }] },
      { type: 'variable', id: 'sz', name: 'size', value: '0', state: 'default' }, { type: 'variable', id: 'cap', name: 'capacity', value: '2', state: 'default' },
      { type: 'log', id: 'log', lines: [{ text: 'Created: capacity=2, size=0', kind: 'info' }] },
    ]},
    { message: 'push(5), push(8): fill capacity. size=2=capacity → FULL.', elements: [
      { type: 'array', id: 'arr', label: 'Dynamic Array', items: [{ value: '5', state: 'done' }, { value: '8', state: 'active' }] },
      { type: 'variable', id: 'sz', name: 'size', value: '2', state: 'error' }, { type: 'variable', id: 'cap', name: 'capacity', value: '2', state: 'error' },
      { type: 'log', id: 'log', lines: [{ text: 'push(5), push(8) → FULL! size==capacity', kind: 'compare' }] },
    ]},
    { message: 'push(3): RESIZE! Allocate new array capacity→4, copy elements.', elements: [
      { type: 'array', id: 'old', label: 'Old Array (copied)', items: [{ value: '5', state: 'comparing' }, { value: '8', state: 'comparing' }] },
      { type: 'array', id: 'arr', label: 'New Array (capacity 4)', items: [{ value: '5', state: 'done' }, { value: '8', state: 'done' }, { value: '3', state: 'active' }, { value: '_', state: 'default' }] },
      { type: 'variable', id: 'sz', name: 'size', value: '3', state: 'active' }, { type: 'variable', id: 'cap', name: 'capacity', value: '2→4', state: 'highlight' },
      { type: 'log', id: 'log', lines: [{ text: 'RESIZE: capacity doubled 2→4. push(3) at index 2.', kind: 'call' }] },
    ]},
    { message: 'push(7), push(1): size→5 > cap=4 → RESIZE to 8. Amortized O(1) per push.', elements: [
      { type: 'array', id: 'arr', label: 'Dynamic Array (capacity 8)', items: [{ value: '5', state: 'done' }, { value: '8', state: 'done' }, { value: '3', state: 'done' }, { value: '7', state: 'done' }, { value: '1', state: 'active' }, { value: '_', state: 'default' }, { value: '_', state: 'default' }, { value: '_', state: 'default' }] },
      { type: 'variable', id: 'sz', name: 'size', value: '5', state: 'active' }, { type: 'variable', id: 'cap', name: 'capacity', value: '8', state: 'done' },
      { type: 'log', id: 'log', lines: [{ text: '✅ 5 pushes, 2 resizes. Amortized O(1) per push.', kind: 'info' }] },
    ]},
  ],
}

const kadaneViz: VisualizationBlock = {
  type: 'array', initialState: {},
  steps: [
    { message: "Kadane's Algorithm: Maximum Subarray on [-2,1,-3,4,-1,2,1,-5,4]. Track currentSum and maxSum.", elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '-2', state: 'default' }, { value: '1', state: 'default' }, { value: '-3', state: 'default' }, { value: '4', state: 'default' }, { value: '-1', state: 'default' }, { value: '2', state: 'default' }, { value: '1', state: 'default' }, { value: '-5', state: 'default' }, { value: '4', state: 'default' }] },
      { type: 'variable', id: 'cur', name: 'currentSum', value: '-2', state: 'default' }, { type: 'variable', id: 'mx', name: 'maxSum', value: '-2', state: 'default' },
      { type: 'log', id: 'log', lines: [{ text: 'Start: currentSum=arr[0]=-2, maxSum=-2', kind: 'info' }] },
    ]},
    { message: 'i=1: currentSum=max(1, -2+1)=max(1,-1)=1. maxSum=max(-2,1)=1. Fresh start!', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '-2', state: 'visited' }, { value: '1', state: 'active' }, { value: '-3', state: 'default' }, { value: '4', state: 'default' }, { value: '-1', state: 'default' }, { value: '2', state: 'default' }, { value: '1', state: 'default' }, { value: '-5', state: 'default' }, { value: '4', state: 'default' }] },
      { type: 'variable', id: 'cur', name: 'currentSum', value: '1', state: 'active' }, { type: 'variable', id: 'mx', name: 'maxSum', value: '1', state: 'highlight' },
      { type: 'log', id: 'log', lines: [{ text: 'i=1: max(1, -2+1) = 1. Fresh start from here.', kind: 'compare' }] },
    ]},
    { message: 'i=2: currentSum=max(-3, 1-3)=max(-3,-2)=-2. maxSum stays 1.', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '-2', state: 'visited' }, { value: '1', state: 'visited' }, { value: '-3', state: 'comparing' }, { value: '4', state: 'default' }, { value: '-1', state: 'default' }, { value: '2', state: 'default' }, { value: '1', state: 'default' }, { value: '-5', state: 'default' }, { value: '4', state: 'default' }] },
      { type: 'variable', id: 'cur', name: 'currentSum', value: '-2', state: 'default' }, { type: 'variable', id: 'mx', name: 'maxSum', value: '1', state: 'highlight' },
      { type: 'log', id: 'log', lines: [{ text: 'i=2: max(-3, -2)=-2. maxSum=1 unchanged.', kind: 'compare' }] },
    ]},
    { message: 'i=3..6: 4,-1,2,1 → currentSum grows to 6. maxSum=6! Subarray [4,-1,2,1].', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '-2', state: 'visited' }, { value: '1', state: 'visited' }, { value: '-3', state: 'visited' }, { value: '4', state: 'done' }, { value: '-1', state: 'done' }, { value: '2', state: 'done' }, { value: '1', state: 'done' }, { value: '-5', state: 'default' }, { value: '4', state: 'default' }] },
      { type: 'variable', id: 'cur', name: 'currentSum', value: '6', state: 'highlight' }, { type: 'variable', id: 'mx', name: 'maxSum', value: '6', state: 'highlight' },
      { type: 'log', id: 'log', lines: [{ text: 'i=3→6: currentSum grows 4→3→5→6. NEW maxSum=6!', kind: 'return' }] },
    ]},
    { message: 'i=7,8: -5 drops to 1, +4 gives 5. maxSum remains 6. Answer: 6 (subarray [4,-1,2,1]).', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '-2', state: 'visited' }, { value: '1', state: 'visited' }, { value: '-3', state: 'visited' }, { value: '4', state: 'done' }, { value: '-1', state: 'done' }, { value: '2', state: 'done' }, { value: '1', state: 'done' }, { value: '-5', state: 'visited' }, { value: '4', state: 'visited' }] },
      { type: 'variable', id: 'cur', name: 'currentSum', value: '5', state: 'default' }, { type: 'variable', id: 'mx', name: 'maxSum', value: '6', state: 'done' },
      { type: 'log', id: 'log', lines: [{ text: '✅ maxSum=6 from [4,-1,2,1]. O(n) Kadane\'s.', kind: 'info' }] },
    ]},
  ],
}

const reverseArrayViz: VisualizationBlock = {
  type: 'array', initialState: {},
  steps: [
    { message: 'Reverse Array [1,2,3,4,5] in-place. Two pointers: left=0, right=4, swap and converge.', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '1', state: 'active' }, { value: '2', state: 'default' }, { value: '3', state: 'default' }, { value: '4', state: 'default' }, { value: '5', state: 'active' }] },
      { type: 'variable', id: 'l', name: 'left', value: '0', state: 'active' }, { type: 'variable', id: 'r', name: 'right', value: '4', state: 'active' },
      { type: 'log', id: 'log', lines: [{ text: 'swap(arr[0], arr[4]): 1↔5', kind: 'swap' }] },
    ]},
    { message: 'After swap(0,4): [5,2,3,4,1]. Move: left→1, right→3.', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '5', state: 'done' }, { value: '2', state: 'active' }, { value: '3', state: 'default' }, { value: '4', state: 'active' }, { value: '1', state: 'done' }] },
      { type: 'variable', id: 'l', name: 'left', value: '1', state: 'active' }, { type: 'variable', id: 'r', name: 'right', value: '3', state: 'active' },
      { type: 'log', id: 'log', lines: [{ text: 'swap(arr[1], arr[3]): 2↔4', kind: 'swap' }] },
    ]},
    { message: 'After swap(1,3): [5,4,3,2,1]. left→2=right→2. Middle: no swap. Done!', elements: [
      { type: 'array', id: 'arr', label: 'Array', items: [{ value: '5', state: 'done' }, { value: '4', state: 'done' }, { value: '3', state: 'highlight' }, { value: '2', state: 'done' }, { value: '1', state: 'done' }] },
      { type: 'variable', id: 'l', name: 'left', value: '2', state: 'done' }, { type: 'variable', id: 'r', name: 'right', value: '2', state: 'done' },
      { type: 'log', id: 'log', lines: [{ text: '✅ Reversed: [5,4,3,2,1]. O(n) time, O(1) space.', kind: 'info' }] },
    ]},
  ],
}

// ─── Problem Registry ──────────────────────────────────────────────────

export const ARRAY_PROBLEMS: ArrayProblem[] = [
  {
    id: 'two-sum-sorted',
    title: 'Two Sum II (Sorted)',
    pattern: 'Two Pointer',
    difficulty: 'Easy',
    description: 'Given a sorted array, find two numbers that add up to a target. Return their indices.',
    defaultInput: 'nums = [1, 3, 4, 5, 7, 11], target = 9',
    visualization: twoPointersViz,
    starterCode: {
      javascript: `// Two Sum II — Two Pointer O(n) solution
// nums is sorted! Use left+right pointers.
function twoSumSorted(nums, target) {
  let left = 0;
  let right = nums.length - 1;

  while (left < right) {
    const sum = nums[left] + nums[right];
    console.log(\`[DEBUG] {"message": "Checking pointers", "vars": {"array": \${JSON.stringify(nums)}, "left": \${left}, "right": \${right}, "sum": \${sum}, "target": \${target}}}\`);

    if (sum === target) return [left + 1, right + 1];
    if (sum < target) left++;
    else right--;
  }
  return [];
}

console.log(twoSumSorted([1, 3, 4, 5, 7, 11], 9));`,
      python: `# Two Sum II — Two Pointer O(n) solution
import json

def two_sum_sorted(nums, target):
    left, right = 0, len(nums) - 1
    while left < right:
        s = nums[left] + nums[right]
        print(f'[DEBUG] {json.dumps({"message": "Checking pointers", "vars": {"array": nums, "left": left, "right": right, "sum": s, "target": target}})}')
        if s == target:
            return [left + 1, right + 1]
        elif s < target:
            left += 1
        else:
            right -= 1
    return []

print(two_sum_sorted([1, 3, 4, 5, 7, 11], 9))`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSumSorted(vector<int>& nums, int target) {
    int left = 0, right = nums.size() - 1;
    while (left < right) {
        int sum = nums[left] + nums[right];
        cout << "[DEBUG] {\\"message\\": \\"Checking pointers\\", \\"vars\\": {\\"left\\": " << left << ", \\"right\\": " << right << ", \\"sum\\": " << sum << "}}\\n";
        if (sum == target) return {left+1, right+1};
        if (sum < target) left++;
        else right--;
    }
    return {};
}

int main() {
    vector<int> nums = {1,3,4,5,7,11};
    auto res = twoSumSorted(nums, 9);
    cout << "[" << res[0] << ", " << res[1] << "]\\n";
}`,
    },
  },
  {
    id: 'sliding-window-max',
    title: 'Max Sum Subarray of Size K',
    pattern: 'Sliding Window',
    difficulty: 'Easy',
    description: 'Find the maximum sum of any k consecutive elements in the array using a sliding window.',
    defaultInput: 'nums = [2,1,5,1,3,2], k = 3',
    visualization: slidingWindowViz,
    starterCode: {
      javascript: `// Sliding Window — Max Sum of k consecutive elements
function maxSumSubarray(nums, k) {
  let windowSum = 0;
  // Build first window
  for (let i = 0; i < k; i++) windowSum += nums[i];
  let maxSum = windowSum;

  console.log(\`[DEBUG] {"message": "Initial window [0..\${k-1}]", "vars": {"array": \${JSON.stringify(nums)}, "windowSum": \${windowSum}, "maxSum": \${maxSum}}}\`);

  for (let i = k; i < nums.length; i++) {
    windowSum += nums[i] - nums[i - k]; // slide
    if (windowSum > maxSum) maxSum = windowSum;
    console.log(\`[DEBUG] {"message": "Slid window to [\${i-k+1}..\${i}]", "vars": {"array": \${JSON.stringify(nums)}, "windowSum": \${windowSum}, "maxSum": \${maxSum}}}\`);
  }
  return maxSum;
}

console.log(maxSumSubarray([2, 1, 5, 1, 3, 2], 3));`,
      python: `import json

def max_sum_subarray(nums, k):
    window_sum = sum(nums[:k])
    max_sum = window_sum
    print(f'[DEBUG] {json.dumps({"message": f"Initial window [0..{k-1}]", "vars": {"array": nums, "windowSum": window_sum, "maxSum": max_sum}})}')
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        if window_sum > max_sum:
            max_sum = window_sum
        print(f'[DEBUG] {json.dumps({"message": f"Slid window to [{i-k+1}..{i}]", "vars": {"array": nums, "windowSum": window_sum, "maxSum": max_sum}})}')
    return max_sum

print(max_sum_subarray([2,1,5,1,3,2], 3))`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int maxSumSubarray(vector<int>& nums, int k) {
    int windowSum = 0;
    for (int i = 0; i < k; i++) windowSum += nums[i];
    int maxSum = windowSum;
    cout << "[DEBUG] {\\"message\\": \\"Initial window\\", \\"vars\\": {\\"windowSum\\": " << windowSum << ", \\"maxSum\\": " << maxSum << "}}\\n";
    for (int i = k; i < (int)nums.size(); i++) {
        windowSum += nums[i] - nums[i-k];
        if (windowSum > maxSum) maxSum = windowSum;
        cout << "[DEBUG] {\\"message\\": \\"Slid window\\", \\"vars\\": {\\"windowSum\\": " << windowSum << ", \\"maxSum\\": " << maxSum << "}}\\n";
    }
    return maxSum;
}

int main() {
    vector<int> nums = {2,1,5,1,3,2};
    cout << maxSumSubarray(nums, 3) << "\\n";
}`,
    },
  },
  {
    id: 'move-zeroes',
    title: 'Move Zeroes',
    pattern: 'Fast-Slow Pointer',
    difficulty: 'Easy',
    description: 'Move all zeros to the end while maintaining relative order of non-zero elements. In-place.',
    defaultInput: 'nums = [0,1,0,3,12]',
    visualization: moveZeroesViz,
    starterCode: {
      javascript: `// Move Zeroes — Fast/Slow pointer in-place
function moveZeroes(nums) {
  let write = 0;
  for (let read = 0; read < nums.length; read++) {
    if (nums[read] !== 0) {
      [nums[write], nums[read]] = [nums[read], nums[write]];
      console.log(\`[DEBUG] {"message": "Swapped non-zero to write pos", "vars": {"array": \${JSON.stringify(nums)}, "write": \${write}, "read": \${read}}}\`);
      write++;
    }
  }
  return nums;
}

console.log(moveZeroes([0, 1, 0, 3, 12]));`,
      python: `import json

def move_zeroes(nums):
    write = 0
    for read in range(len(nums)):
        if nums[read] != 0:
            nums[write], nums[read] = nums[read], nums[write]
            print(f'[DEBUG] {json.dumps({"message": "Swapped non-zero", "vars": {"array": nums[:], "write": write, "read": read}})}')
            write += 1
    return nums

print(move_zeroes([0, 1, 0, 3, 12]))`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void moveZeroes(vector<int>& nums) {
    int write = 0;
    for (int read = 0; read < (int)nums.size(); read++) {
        if (nums[read] != 0) {
            swap(nums[write], nums[read]);
            cout << "[DEBUG] {\\"message\\": \\"Swapped\\", \\"vars\\": {\\"write\\": " << write << ", \\"read\\": " << read << "}}\\n";
            write++;
        }
    }
}

int main() {
    vector<int> nums = {0,1,0,3,12};
    moveZeroes(nums);
    for (int x : nums) cout << x << " ";
}`,
    },
  },
  {
    id: 'prefix-sum',
    title: 'Prefix Sum Queries',
    pattern: 'Prefix Sum',
    difficulty: 'Easy',
    description: 'Build a prefix sum array to answer range sum queries in O(1) after O(n) preprocessing.',
    defaultInput: 'nums = [3,1,4,1,5], query: sum(1..3)',
    visualization: prefixSumViz,
    starterCode: {
      javascript: `// Prefix Sum — O(n) build, O(1) per query
function buildPrefix(nums) {
  const prefix = new Array(nums.length + 1).fill(0);
  for (let i = 0; i < nums.length; i++) {
    prefix[i + 1] = prefix[i] + nums[i];
    console.log(\`[DEBUG] {"message": "Building prefix[\${i+1}]", "vars": {"array": \${JSON.stringify(nums)}, "prefix": \${JSON.stringify(prefix.slice(0,i+2))}}}\`);
  }
  return prefix;
}

function rangeSum(prefix, l, r) {
  const ans = prefix[r + 1] - prefix[l];
  console.log(\`[DEBUG] {"message": "Query sum(\${l}..\${r})=\${ans}", "vars": {"prefix": \${JSON.stringify(prefix)}, "answer": \${ans}}}\`);
  return ans;
}

const nums = [3, 1, 4, 1, 5];
const prefix = buildPrefix(nums);
console.log("sum(1..3) =", rangeSum(prefix, 1, 3));`,
      python: `import json

def build_prefix(nums):
    prefix = [0] * (len(nums) + 1)
    for i, v in enumerate(nums):
        prefix[i+1] = prefix[i] + v
        print(f'[DEBUG] {json.dumps({"message": f"Building prefix[{i+1}]", "vars": {"array": nums, "prefix": prefix[:i+2]}})}')
    return prefix

def range_sum(prefix, l, r):
    ans = prefix[r+1] - prefix[l]
    print(f'[DEBUG] {json.dumps({"message": f"Query sum({l}..{r})={ans}", "vars": {"prefix": prefix, "answer": ans}})}')
    return ans

nums = [3,1,4,1,5]
prefix = build_prefix(nums)
print("sum(1..3) =", range_sum(prefix, 1, 3))`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

int main() {
    vector<int> nums = {3,1,4,1,5};
    int n = nums.size();
    vector<int> prefix(n+1, 0);
    for (int i = 0; i < n; i++) {
        prefix[i+1] = prefix[i] + nums[i];
        cout << "[DEBUG] {\\"message\\": \\"Building prefix[" << i+1 << "]\\", \\"vars\\": {\\"val\\": " << prefix[i+1] << "}}\\n";
    }
    int l=1, r=3;
    int ans = prefix[r+1] - prefix[l];
    cout << "[DEBUG] {\\"message\\": \\"Query sum(1..3)=" << ans << "\\", \\"vars\\": {\\"answer\\": " << ans << "}}\\n";
    cout << "sum(1..3) = " << ans << "\\n";
}`,
    },
  },
  {
    id: 'max-subarray',
    title: 'Maximum Subarray (Kadane\'s)',
    pattern: 'Dynamic Programming',
    difficulty: 'Medium',
    description: 'Find the contiguous subarray with the largest sum using Kadane\'s algorithm in O(n).',
    defaultInput: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
    visualization: kadaneViz,
    starterCode: {
      javascript: `// Kadane's Algorithm — Maximum Subarray O(n)
function maxSubArray(nums) {
  let currentSum = nums[0];
  let maxSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
    console.log(\`[DEBUG] {"message": "i=\${i}", "vars": {"array": \${JSON.stringify(nums)}, "currentSum": \${currentSum}, "maxSum": \${maxSum}}}\`);
  }
  return maxSum;
}

console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4]));`,
      python: `import json

def max_sub_array(nums):
    current_sum = nums[0]
    max_sum = nums[0]
    for i in range(1, len(nums)):
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
        print(f'[DEBUG] {json.dumps({"message": f"i={i}", "vars": {"array": nums, "currentSum": current_sum, "maxSum": max_sum}})}')
    return max_sum

print(max_sub_array([-2,1,-3,4,-1,2,1,-5,4]))`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int maxSubArray(vector<int>& nums) {
    int cur = nums[0], mx = nums[0];
    for (int i = 1; i < (int)nums.size(); i++) {
        cur = max(nums[i], cur + nums[i]);
        mx = max(mx, cur);
        cout << "[DEBUG] {\\"message\\": \\"i=" << i << "\\", \\"vars\\": {\\"currentSum\\": " << cur << ", \\"maxSum\\": " << mx << "}}\\n";
    }
    return mx;
}

int main() {
    vector<int> nums = {-2,1,-3,4,-1,2,1,-5,4};
    cout << maxSubArray(nums) << "\\n";
}`,
    },
  },
  {
    id: 'dynamic-array',
    title: 'Dynamic Array Internals',
    pattern: 'Array Fundamentals',
    difficulty: 'Easy',
    description: 'Understand how dynamic arrays grow by doubling capacity. See push() with amortized O(1).',
    defaultInput: 'push: 5, 8, 3, 7, 1',
    visualization: dynamicArrayViz,
    starterCode: {
      javascript: `// Dynamic Array simulation — watch the capacity doubling!
class DynamicArray {
  constructor() {
    this.data = [];
    this.size = 0;
    this.capacity = 2;
    this._internal = new Array(2).fill(null);
  }

  push(val) {
    if (this.size === this.capacity) {
      this.capacity *= 2; // DOUBLE capacity
      console.log(\`[DEBUG] {"message": "RESIZE! New capacity: \${this.capacity}", "vars": {"array": \${JSON.stringify(this._internal.slice(0,this.size))}, "size": \${this.size}, "capacity": \${this.capacity}}}\`);
    }
    this._internal[this.size] = val;
    this.size++;
    console.log(\`[DEBUG] {"message": "push(\${val})", "vars": {"array": \${JSON.stringify(this._internal.slice(0,this.size))}, "size": \${this.size}, "capacity": \${this.capacity}}}\`);
  }
}

const arr = new DynamicArray();
[5, 8, 3, 7, 1].forEach(v => arr.push(v));`,
      python: `import json

class DynamicArray:
    def __init__(self):
        self.data = [None, None]
        self.size = 0
        self.capacity = 2

    def push(self, val):
        if self.size == self.capacity:
            self.capacity *= 2
            print(f'[DEBUG] {json.dumps({"message": f"RESIZE! capacity→{self.capacity}", "vars": {"array": self.data[:self.size], "size": self.size, "capacity": self.capacity}})}')
        self.data[self.size] = val
        self.size += 1
        print(f'[DEBUG] {json.dumps({"message": f"push({val})", "vars": {"array": self.data[:self.size], "size": self.size, "capacity": self.capacity}})}')

arr = DynamicArray()
for v in [5, 8, 3, 7, 1]:
    arr.push(v)`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

class DynamicArray {
    vector<int> data;
    int sz = 0, cap = 2;
public:
    DynamicArray() { data.resize(2); }
    void push(int val) {
        if (sz == cap) {
            cap *= 2;
            data.resize(cap);
            cout << "[DEBUG] {\\"message\\": \\"RESIZE!\\", \\"vars\\": {\\"size\\": " << sz << ", \\"capacity\\": " << cap << "}}\\n";
        }
        data[sz++] = val;
        cout << "[DEBUG] {\\"message\\": \\"push(" << val << ")\\", \\"vars\\": {\\"size\\": " << sz << ", \\"capacity\\": " << cap << "}}\\n";
    }
};

int main() {
    DynamicArray arr;
    for (int v : {5, 8, 3, 7, 1}) arr.push(v);
}`,
    },
  },
  {
    id: 'reverse-array',
    title: 'Reverse Array In-Place',
    pattern: 'Two Pointer',
    difficulty: 'Easy',
    description: 'Reverse an array in-place using two pointers. O(n) time, O(1) space — a fundamental technique.',
    defaultInput: 'nums = [1,2,3,4,5]',
    visualization: reverseArrayViz,
    starterCode: {
      javascript: `// Reverse Array in-place — Two Pointer O(n)
function reverseArray(nums) {
  let left = 0, right = nums.length - 1;
  while (left < right) {
    [nums[left], nums[right]] = [nums[right], nums[left]];
    console.log(\`[DEBUG] {"message": "Swapped indices \${left} and \${right}", "vars": {"array": \${JSON.stringify(nums)}, "left": \${left}, "right": \${right}}}\`);
    left++;
    right--;
  }
  return nums;
}

console.log(reverseArray([1, 2, 3, 4, 5]));`,
      python: `import json

def reverse_array(nums):
    left, right = 0, len(nums) - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        print(f'[DEBUG] {json.dumps({"message": f"Swapped {left} and {right}", "vars": {"array": nums[:], "left": left, "right": right}})}')
        left += 1
        right -= 1
    return nums

print(reverse_array([1,2,3,4,5]))`,
      cpp: `#include <iostream>
#include <vector>
using namespace std;

void reverseArray(vector<int>& nums) {
    int left = 0, right = nums.size() - 1;
    while (left < right) {
        swap(nums[left], nums[right]);
        cout << "[DEBUG] {\\"message\\": \\"Swapped " << left << " and " << right << "\\", \\"vars\\": {\\"left\\": " << left << ", \\"right\\": " << right << "}}\\n";
        left++; right--;
    }
}

int main() {
    vector<int> nums = {1,2,3,4,5};
    reverseArray(nums);
    for (int x : nums) cout << x << " ";
}`,
    },
  },
]

export const PROBLEM_GROUPS = [
  { label: 'Two Pointer', ids: ['two-sum-sorted', 'reverse-array'] },
  { label: 'Sliding Window', ids: ['sliding-window-max'] },
  { label: 'Fast-Slow Pointer', ids: ['move-zeroes'] },
  { label: 'Prefix Sum', ids: ['prefix-sum'] },
  { label: 'Dynamic Programming', ids: ['max-subarray'] },
  { label: 'Array Fundamentals', ids: ['dynamic-array'] },
]
