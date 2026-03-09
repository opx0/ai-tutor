import type { DemoPhase } from './types'
import type { VisualizationBlock } from '@/lib/visualization/types'

// ═══════════════════════════════════════════════════════════════════════
// PHASE 1 — Memory Mental Model
// ═══════════════════════════════════════════════════════════════════════

const ramViz: VisualizationBlock = {
  type: 'array',
  initialState: {},
  steps: [
    {
      message: 'RAM is a giant array of bytes. Each byte has an address (0, 1, 2...). Reading any address takes the same time — O(1). This is why arrays are fast.',
      elements: [
        { type: 'array', id: 'ram', label: 'RAM (addresses 0-7)', items: [
          { value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '0', state: 'default' },
          { value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '0', state: 'default' },
        ]},
        { type: 'variable', id: 'v-addr', name: 'address', value: '—', state: 'default' },
        { type: 'log', id: 'log', lines: [{ text: 'RAM: Random Access Memory — every address is O(1) to read', kind: 'info' }] },
      ],
    },
    {
      message: 'Store the integer 42 at address 3. The CPU goes directly to address 3 — no scanning needed. This is the magic of random access.',
      elements: [
        { type: 'array', id: 'ram', label: 'RAM (addresses 0-7)', items: [
          { value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '42', state: 'active' },
          { value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '0', state: 'default' },
        ]},
        { type: 'variable', id: 'v-addr', name: 'address', value: '3', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'RAM: Random Access Memory — every address is O(1) to read', kind: 'info' },
          { text: 'WRITE ram[3] = 42', kind: 'swap' },
        ] },
      ],
    },
    {
      message: 'Store more values. Integers typically use 4 bytes each. An array of 3 integers starting at address 0 uses addresses 0, 1, 2 (simplified to 1 slot per int here).',
      elements: [
        { type: 'array', id: 'ram', label: 'RAM (addresses 0-7)', items: [
          { value: '10', state: 'done' }, { value: '20', state: 'done' }, { value: '30', state: 'done' }, { value: '42', state: 'active' },
          { value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '0', state: 'default' },
        ]},
        { type: 'variable', id: 'v-addr', name: 'address', value: '3', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'WRITE ram[3] = 42', kind: 'swap' },
          { text: 'WRITE ram[0] = 10, ram[1] = 20, ram[2] = 30', kind: 'swap' },
          { text: 'Array at base=0: address = base + index', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'To read arr[2]: compute address = base(0) + index(2) = 2. One multiplication + one addition = O(1). This formula is why array access is instant.',
      elements: [
        { type: 'array', id: 'ram', label: 'RAM (addresses 0-7)', items: [
          { value: '10', state: 'done' }, { value: '20', state: 'done' }, { value: '30', state: 'highlight' }, { value: '42', state: 'default' },
          { value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '0', state: 'default' },
        ]},
        { type: 'variable', id: 'v-addr', name: 'address', value: '0+2=2', state: 'highlight' },
        { type: 'variable', id: 'v-val', name: 'value', value: '30', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: 'Array at base=0: address = base + index', kind: 'info' },
          { text: 'READ arr[2] → address = 0 + 2 = 2 → value = 30', kind: 'compare' },
          { text: 'O(1) access — same speed for arr[0] or arr[1000000]', kind: 'info' },
        ] },
      ],
    },
  ],
}

const dynamicArrayViz: VisualizationBlock = {
  type: 'array',
  initialState: {},
  steps: [
    {
      message: 'Dynamic array starts with capacity 2, size 0. The array owns a fixed block of memory, but tracks how much is actually used.',
      elements: [
        { type: 'array', id: 'arr', label: 'Dynamic Array', items: [
          { value: '_', state: 'default' }, { value: '_', state: 'default' },
        ]},
        { type: 'variable', id: 'v-size', name: 'size', value: '0', state: 'default' },
        { type: 'variable', id: 'v-cap', name: 'capacity', value: '2', state: 'default' },
        { type: 'log', id: 'log', lines: [{ text: 'Created dynamic array — capacity=2, size=0', kind: 'info' }] },
      ],
    },
    {
      message: 'push(5): Place 5 at index 0 (= size). Increment size to 1. Room left — no resize needed.',
      elements: [
        { type: 'array', id: 'arr', label: 'Dynamic Array', items: [
          { value: '5', state: 'active' }, { value: '_', state: 'default' },
        ]},
        { type: 'variable', id: 'v-size', name: 'size', value: '1', state: 'active' },
        { type: 'variable', id: 'v-cap', name: 'capacity', value: '2', state: 'default' },
        { type: 'log', id: 'log', lines: [
          { text: 'Created dynamic array — capacity=2, size=0', kind: 'info' },
          { text: 'push(5) → arr[0] = 5, size = 1', kind: 'swap' },
        ] },
      ],
    },
    {
      message: 'push(8): Place 8 at index 1. size=2 now equals capacity=2. The array is FULL. Next push will trigger a resize.',
      elements: [
        { type: 'array', id: 'arr', label: 'Dynamic Array', items: [
          { value: '5', state: 'done' }, { value: '8', state: 'active' },
        ]},
        { type: 'variable', id: 'v-size', name: 'size', value: '2', state: 'error' },
        { type: 'variable', id: 'v-cap', name: 'capacity', value: '2', state: 'error', description: 'FULL!' },
        { type: 'log', id: 'log', lines: [
          { text: 'push(5) → arr[0] = 5, size = 1', kind: 'swap' },
          { text: 'push(8) → arr[1] = 8, size = 2', kind: 'swap' },
          { text: '⚠ size == capacity — array is full!', kind: 'compare' },
        ] },
      ],
    },
    {
      message: 'push(3): size == capacity! Allocate NEW array with 2x capacity (4). Copy all elements over. This is O(n) but happens rarely.',
      elements: [
        { type: 'array', id: 'old', label: 'Old Array (being copied)', items: [
          { value: '5', state: 'comparing' }, { value: '8', state: 'comparing' },
        ]},
        { type: 'array', id: 'arr', label: 'New Array (capacity 4)', items: [
          { value: '5', state: 'done' }, { value: '8', state: 'done' }, { value: '_', state: 'default' }, { value: '_', state: 'default' },
        ]},
        { type: 'variable', id: 'v-size', name: 'size', value: '2', state: 'comparing' },
        { type: 'variable', id: 'v-cap', name: 'capacity', value: '2→4', state: 'highlight', description: 'DOUBLED!' },
        { type: 'log', id: 'log', lines: [
          { text: '⚠ size == capacity — array is full!', kind: 'compare' },
          { text: 'RESIZE: allocate new array of capacity 4', kind: 'call' },
          { text: 'COPY: old[0..1] → new[0..1]', kind: 'swap' },
        ] },
      ],
    },
    {
      message: 'Now place 3 at index 2 in the new array. size=3, capacity=4. The old array is freed. Amortized O(1) per push because doubling halves the resize frequency.',
      elements: [
        { type: 'array', id: 'arr', label: 'Dynamic Array (capacity 4)', items: [
          { value: '5', state: 'done' }, { value: '8', state: 'done' }, { value: '3', state: 'active' }, { value: '_', state: 'default' },
        ]},
        { type: 'variable', id: 'v-size', name: 'size', value: '3', state: 'active' },
        { type: 'variable', id: 'v-cap', name: 'capacity', value: '4', state: 'done' },
        { type: 'log', id: 'log', lines: [
          { text: 'RESIZE: allocate new array of capacity 4', kind: 'call' },
          { text: 'COPY: old[0..1] → new[0..1]', kind: 'swap' },
          { text: 'push(3) → arr[2] = 3, size = 3', kind: 'swap' },
          { text: 'Amortized O(1): resize cost spread over many pushes', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'push(7), push(1): size reaches 5 > capacity 4 → double again to 8. Pattern: 2→4→8→16→... Each doubling copies n items but then gets n free pushes.',
      elements: [
        { type: 'array', id: 'arr', label: 'Dynamic Array (capacity 8)', items: [
          { value: '5', state: 'done' }, { value: '8', state: 'done' }, { value: '3', state: 'done' }, { value: '7', state: 'done' },
          { value: '1', state: 'active' }, { value: '_', state: 'default' }, { value: '_', state: 'default' }, { value: '_', state: 'default' },
        ]},
        { type: 'variable', id: 'v-size', name: 'size', value: '5', state: 'active' },
        { type: 'variable', id: 'v-cap', name: 'capacity', value: '8', state: 'done' },
        { type: 'log', id: 'log', lines: [
          { text: 'push(7) → arr[3] = 7, size = 4 (full again!)', kind: 'swap' },
          { text: 'RESIZE: capacity 4 → 8', kind: 'call' },
          { text: 'push(1) → arr[4] = 1, size = 5', kind: 'swap' },
          { text: 'Total: 5 pushes, 2 resizes (copied 2 + 4 = 6 items)', kind: 'info' },
          { text: 'Amortized cost per push ≈ 6/5 = O(1)', kind: 'info' },
        ] },
      ],
    },
  ],
}

const stackViz: VisualizationBlock = {
  type: 'array',
  initialState: {},
  steps: [
    {
      message: 'A stack is LIFO: Last In, First Out. Think of a stack of plates — you can only add/remove from the top. Two operations: push (add to top) and pop (remove from top).',
      elements: [
        { type: 'array', id: 'stack', label: 'Stack (bottom → top)', items: [], direction: 'horizontal' },
        { type: 'variable', id: 'v-top', name: 'top', value: '-1', state: 'default', description: 'empty' },
        { type: 'log', id: 'log', lines: [{ text: 'Stack created — empty, top = -1', kind: 'info' }] },
      ],
    },
    {
      message: 'push(10): Place 10 on top. top moves from -1 to 0.',
      elements: [
        { type: 'array', id: 'stack', label: 'Stack (bottom → top)', items: [{ value: '10', state: 'active' }], direction: 'horizontal' },
        { type: 'variable', id: 'v-top', name: 'top', value: '0', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'Stack created — empty, top = -1', kind: 'info' },
          { text: 'push(10) → top = 0', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'push(20), push(30): Each goes on top. 30 is now the top element. We can only see/remove 30.',
      elements: [
        { type: 'array', id: 'stack', label: 'Stack (bottom → top)', items: [
          { value: '10', state: 'done' }, { value: '20', state: 'done' }, { value: '30', state: 'active' },
        ], direction: 'horizontal' },
        { type: 'variable', id: 'v-top', name: 'top', value: '2', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'push(10) → top = 0', kind: 'call' },
          { text: 'push(20) → top = 1', kind: 'call' },
          { text: 'push(30) → top = 2', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'pop(): Remove 30 (the top). Returns 30. top decreases to 1. Now 20 is on top. Both push and pop are O(1).',
      elements: [
        { type: 'array', id: 'stack', label: 'Stack (bottom → top)', items: [
          { value: '10', state: 'done' }, { value: '20', state: 'active' },
        ], direction: 'horizontal' },
        { type: 'variable', id: 'v-top', name: 'top', value: '1', state: 'active' },
        { type: 'variable', id: 'v-popped', name: 'popped', value: '30', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: 'push(20) → top = 1', kind: 'call' },
          { text: 'push(30) → top = 2', kind: 'call' },
          { text: 'pop() → returns 30, top = 1', kind: 'return' },
          { text: 'push/pop are O(1) — just move the top pointer', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ─── Sliding Window Fixed ────────────────────────────────────────────
const slidingWindowFixedViz: VisualizationBlock = {
  type: 'array',
  initialState: {},
  steps: [
    {
      message: 'Problem: Find max sum of any k=3 consecutive elements in [2, 1, 5, 1, 3, 2]. Brute force: O(n*k) — recalculate sum for every window. Can we do O(n)?',
      elements: [
        { type: 'array', id: 'arr', label: 'Array', items: [
          { value: '2', state: 'default' }, { value: '1', state: 'default' }, { value: '5', state: 'default' },
          { value: '1', state: 'default' }, { value: '3', state: 'default' }, { value: '2', state: 'default' },
        ]},
        { type: 'variable', id: 'v-k', name: 'k', value: '3', state: 'default' },
        { type: 'variable', id: 'v-sum', name: 'windowSum', value: '—', state: 'default' },
        { type: 'variable', id: 'v-max', name: 'maxSum', value: '—', state: 'default' },
        { type: 'log', id: 'log', lines: [{ text: 'Sliding Window: instead of recalculating, SLIDE the window right', kind: 'info' }] },
      ],
    },
    {
      message: 'First window [0..2]: sum = 2+1+5 = 8. This is our initial maxSum.',
      elements: [
        { type: 'array', id: 'arr', label: 'Array', items: [
          { value: '2', state: 'active' }, { value: '1', state: 'active' }, { value: '5', state: 'active' },
          { value: '1', state: 'default' }, { value: '3', state: 'default' }, { value: '2', state: 'default' },
        ]},
        { type: 'variable', id: 'v-k', name: 'k', value: '3', state: 'default' },
        { type: 'variable', id: 'v-sum', name: 'windowSum', value: '8', state: 'active' },
        { type: 'variable', id: 'v-max', name: 'maxSum', value: '8', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: 'Sliding Window: instead of recalculating, SLIDE the window right', kind: 'info' },
          { text: 'Window [0..2]: 2+1+5 = 8, maxSum = 8', kind: 'compare' },
        ] },
      ],
    },
    {
      message: 'Slide right: subtract arr[0]=2 (leaves window), add arr[3]=1 (enters window). sum = 8-2+1 = 7. No new max.',
      elements: [
        { type: 'array', id: 'arr', label: 'Array', items: [
          { value: '2', state: 'error' }, { value: '1', state: 'active' }, { value: '5', state: 'active' },
          { value: '1', state: 'comparing' }, { value: '3', state: 'default' }, { value: '2', state: 'default' },
        ]},
        { type: 'variable', id: 'v-k', name: 'k', value: '3', state: 'default' },
        { type: 'variable', id: 'v-sum', name: 'windowSum', value: '7', state: 'active' },
        { type: 'variable', id: 'v-max', name: 'maxSum', value: '8', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: 'Window [0..2]: 2+1+5 = 8, maxSum = 8', kind: 'compare' },
          { text: 'Slide: -arr[0](2) +arr[3](1) → sum = 7', kind: 'swap' },
          { text: '7 < 8 → maxSum stays 8', kind: 'compare' },
        ] },
      ],
    },
    {
      message: 'Slide again: subtract arr[1]=1, add arr[4]=3. sum = 7-1+3 = 9. New max! maxSum = 9.',
      elements: [
        { type: 'array', id: 'arr', label: 'Array', items: [
          { value: '2', state: 'default' }, { value: '1', state: 'error' }, { value: '5', state: 'active' },
          { value: '1', state: 'active' }, { value: '3', state: 'comparing' }, { value: '2', state: 'default' },
        ]},
        { type: 'variable', id: 'v-k', name: 'k', value: '3', state: 'default' },
        { type: 'variable', id: 'v-sum', name: 'windowSum', value: '9', state: 'highlight' },
        { type: 'variable', id: 'v-max', name: 'maxSum', value: '9', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: 'Slide: -arr[0](2) +arr[3](1) → sum = 7', kind: 'swap' },
          { text: 'Slide: -arr[1](1) +arr[4](3) → sum = 9', kind: 'swap' },
          { text: '9 > 8 → NEW maxSum = 9 ✓', kind: 'compare' },
        ] },
      ],
    },
    {
      message: 'Final slide: subtract arr[2]=5, add arr[5]=2. sum = 9-5+2 = 6. Done! maxSum = 9 from window [2,3,4] = [5,1,3]. Total: O(n) with one pass.',
      elements: [
        { type: 'array', id: 'arr', label: 'Array', items: [
          { value: '2', state: 'default' }, { value: '1', state: 'default' }, { value: '5', state: 'error' },
          { value: '1', state: 'active' }, { value: '3', state: 'active' }, { value: '2', state: 'comparing' },
        ]},
        { type: 'variable', id: 'v-k', name: 'k', value: '3', state: 'default' },
        { type: 'variable', id: 'v-sum', name: 'windowSum', value: '6', state: 'default' },
        { type: 'variable', id: 'v-max', name: 'maxSum', value: '9', state: 'done' },
        { type: 'log', id: 'log', lines: [
          { text: 'Slide: -arr[1](1) +arr[4](3) → sum = 9', kind: 'swap' },
          { text: 'Slide: -arr[2](5) +arr[5](2) → sum = 6', kind: 'swap' },
          { text: '✅ Done! maxSum = 9 from subarray [5,1,3]', kind: 'info' },
          { text: 'O(n) — each element enters and leaves the window exactly once', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ─── Two Pointers ────────────────────────────────────────────────────
const twoPointersViz: VisualizationBlock = {
  type: 'array',
  initialState: {},
  steps: [
    {
      message: 'Two Sum II: In sorted array [1, 3, 4, 5, 7, 11], find two numbers that sum to 9. Left pointer at start, right pointer at end.',
      elements: [
        { type: 'array', id: 'arr', label: 'Sorted Array', items: [
          { value: '1', state: 'active' }, { value: '3', state: 'default' }, { value: '4', state: 'default' },
          { value: '5', state: 'default' }, { value: '7', state: 'default' }, { value: '11', state: 'active' },
        ]},
        { type: 'variable', id: 'v-l', name: 'left', value: '0', state: 'active' },
        { type: 'variable', id: 'v-r', name: 'right', value: '5', state: 'active' },
        { type: 'variable', id: 'v-sum', name: 'sum', value: '12', state: 'default' },
        { type: 'variable', id: 'v-target', name: 'target', value: '9', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: 'arr[0]+arr[5] = 1+11 = 12', kind: 'compare' },
          { text: '12 > 9 → sum too big, move right pointer LEFT', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'sum=12 > target=9. Too big! Since array is sorted, moving right pointer left decreases the sum. right: 5→4.',
      elements: [
        { type: 'array', id: 'arr', label: 'Sorted Array', items: [
          { value: '1', state: 'active' }, { value: '3', state: 'default' }, { value: '4', state: 'default' },
          { value: '5', state: 'default' }, { value: '7', state: 'active' }, { value: '11', state: 'visited' },
        ]},
        { type: 'variable', id: 'v-l', name: 'left', value: '0', state: 'active' },
        { type: 'variable', id: 'v-r', name: 'right', value: '4', state: 'active' },
        { type: 'variable', id: 'v-sum', name: 'sum', value: '8', state: 'default' },
        { type: 'variable', id: 'v-target', name: 'target', value: '9', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: '12 > 9 → move right LEFT', kind: 'info' },
          { text: 'arr[0]+arr[4] = 1+7 = 8', kind: 'compare' },
          { text: '8 < 9 → sum too small, move left pointer RIGHT', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'sum=8 < target=9. Too small! Move left pointer right to increase the sum. left: 0→1.',
      elements: [
        { type: 'array', id: 'arr', label: 'Sorted Array', items: [
          { value: '1', state: 'visited' }, { value: '3', state: 'active' }, { value: '4', state: 'default' },
          { value: '5', state: 'default' }, { value: '7', state: 'active' }, { value: '11', state: 'visited' },
        ]},
        { type: 'variable', id: 'v-l', name: 'left', value: '1', state: 'active' },
        { type: 'variable', id: 'v-r', name: 'right', value: '4', state: 'active' },
        { type: 'variable', id: 'v-sum', name: 'sum', value: '10', state: 'default' },
        { type: 'variable', id: 'v-target', name: 'target', value: '9', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: '8 < 9 → move left RIGHT', kind: 'info' },
          { text: 'arr[1]+arr[4] = 3+7 = 10', kind: 'compare' },
          { text: '10 > 9 → sum too big, move right LEFT', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'sum=10 > 9. Move right left. right: 4→3. arr[1]+arr[3] = 3+5 = 8 < 9. Move left right.',
      elements: [
        { type: 'array', id: 'arr', label: 'Sorted Array', items: [
          { value: '1', state: 'visited' }, { value: '3', state: 'visited' }, { value: '4', state: 'active' },
          { value: '5', state: 'active' }, { value: '7', state: 'visited' }, { value: '11', state: 'visited' },
        ]},
        { type: 'variable', id: 'v-l', name: 'left', value: '2', state: 'active' },
        { type: 'variable', id: 'v-r', name: 'right', value: '3', state: 'active' },
        { type: 'variable', id: 'v-sum', name: 'sum', value: '9', state: 'highlight' },
        { type: 'variable', id: 'v-target', name: 'target', value: '9', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: '10 > 9 → move right LEFT', kind: 'info' },
          { text: 'arr[1]+arr[3] = 3+5 = 8 < 9 → move left RIGHT', kind: 'compare' },
          { text: 'arr[2]+arr[3] = 4+5 = 9 ✅ FOUND!', kind: 'return' },
        ] },
      ],
    },
    {
      message: 'Found it! arr[2]+arr[3] = 4+5 = 9. O(n) with two pointers vs O(n²) brute force. The key insight: sorted array lets us decide which pointer to move.',
      elements: [
        { type: 'array', id: 'arr', label: 'Sorted Array', items: [
          { value: '1', state: 'visited' }, { value: '3', state: 'visited' }, { value: '4', state: 'done' },
          { value: '5', state: 'done' }, { value: '7', state: 'visited' }, { value: '11', state: 'visited' },
        ]},
        { type: 'variable', id: 'v-l', name: 'left', value: '2', state: 'done' },
        { type: 'variable', id: 'v-r', name: 'right', value: '3', state: 'done' },
        { type: 'variable', id: 'v-sum', name: 'sum', value: '9', state: 'done' },
        { type: 'variable', id: 'v-target', name: 'target', value: '9', state: 'done' },
        { type: 'log', id: 'log', lines: [
          { text: 'arr[2]+arr[3] = 4+5 = 9 ✅ FOUND!', kind: 'return' },
          { text: 'O(n) time, O(1) space — just two pointers', kind: 'info' },
          { text: 'Pattern: too big→move right, too small→move left', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ─── Prefix Sums ─────────────────────────────────────────────────────
const prefixSumViz: VisualizationBlock = {
  type: 'array',
  initialState: {},
  steps: [
    {
      message: 'Problem: Given arr = [3, 1, 4, 1, 5], answer many range-sum queries. Brute force: O(n) per query. With prefix sums: O(1) per query after O(n) preprocessing.',
      elements: [
        { type: 'array', id: 'arr', label: 'Original Array', items: [
          { value: '3', state: 'default' }, { value: '1', state: 'default' }, { value: '4', state: 'default' },
          { value: '1', state: 'default' }, { value: '5', state: 'default' },
        ]},
        { type: 'array', id: 'pfx', label: 'Prefix Sum (building...)', items: [
          { value: '0', state: 'active' }, { value: '?', state: 'default' }, { value: '?', state: 'default' },
          { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' },
        ]},
        { type: 'log', id: 'log', lines: [{ text: 'prefix[i] = sum of arr[0..i-1]. prefix[0] = 0 always.', kind: 'info' }] },
      ],
    },
    {
      message: 'Build prefix: prefix[1]=0+3=3, prefix[2]=3+1=4, prefix[3]=4+4=8, prefix[4]=8+1=9, prefix[5]=9+5=14. Each prefix[i] = sum of all elements before index i.',
      elements: [
        { type: 'array', id: 'arr', label: 'Original Array', items: [
          { value: '3', state: 'done' }, { value: '1', state: 'done' }, { value: '4', state: 'done' },
          { value: '1', state: 'done' }, { value: '5', state: 'done' },
        ]},
        { type: 'array', id: 'pfx', label: 'Prefix Sum (complete)', items: [
          { value: '0', state: 'done' }, { value: '3', state: 'done' }, { value: '4', state: 'done' },
          { value: '8', state: 'done' }, { value: '9', state: 'done' }, { value: '14', state: 'done' },
        ]},
        { type: 'log', id: 'log', lines: [
          { text: 'prefix[0] = 0', kind: 'info' },
          { text: 'prefix[1] = 0+3 = 3', kind: 'swap' },
          { text: 'prefix[2] = 3+1 = 4', kind: 'swap' },
          { text: 'prefix[3] = 4+4 = 8', kind: 'swap' },
          { text: 'prefix[4] = 8+1 = 9', kind: 'swap' },
          { text: 'prefix[5] = 9+5 = 14', kind: 'swap' },
        ] },
      ],
    },
    {
      message: 'Query: sum(1..3) = sum of arr[1]+arr[2]+arr[3] = 1+4+1 = 6. Using prefix: prefix[4] - prefix[1] = 9 - 3 = 6. O(1)!',
      elements: [
        { type: 'array', id: 'arr', label: 'Original Array', items: [
          { value: '3', state: 'default' }, { value: '1', state: 'highlight' }, { value: '4', state: 'highlight' },
          { value: '1', state: 'highlight' }, { value: '5', state: 'default' },
        ]},
        { type: 'array', id: 'pfx', label: 'Prefix Sum', items: [
          { value: '0', state: 'default' }, { value: '3', state: 'comparing' }, { value: '4', state: 'default' },
          { value: '8', state: 'default' }, { value: '9', state: 'comparing' }, { value: '14', state: 'default' },
        ]},
        { type: 'variable', id: 'v-ans', name: 'answer', value: '9-3=6', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: 'Query: sum(1..3) = prefix[4] - prefix[1]', kind: 'compare' },
          { text: '= 9 - 3 = 6 ✅', kind: 'return' },
          { text: 'Formula: sum(l..r) = prefix[r+1] - prefix[l]', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ─── Linked List ─────────────────────────────────────────────────────
const linkedListViz: VisualizationBlock = {
  type: 'graph',
  initialState: {},
  steps: [
    {
      message: 'A singly linked list: each node stores a value + a "next" pointer to the following node. The last node points to null. Unlike arrays, nodes can be anywhere in RAM.',
      elements: [
        { type: 'graph', id: 'll', label: 'Singly Linked List', layout: 'linear',
          nodes: [
            { id: 'n1', value: '10', state: 'default' },
            { id: 'n2', value: '20', state: 'default' },
            { id: 'n3', value: '30', state: 'default' },
          ],
          edges: [
            { source: 'n1', target: 'n2', label: 'next', state: 'default', directed: true },
            { source: 'n2', target: 'n3', label: 'next', state: 'default', directed: true },
          ],
        },
        { type: 'variable', id: 'v-head', name: 'head', value: 'n1', state: 'active' },
        { type: 'log', id: 'log', lines: [{ text: 'List: 10 → 20 → 30 → null', kind: 'info' }] },
      ],
    },
    {
      message: 'Insert 15 after node 10: create new node, point new.next to node 20, then point node 10.next to new node. O(1) if we have a reference to the insertion point.',
      elements: [
        { type: 'graph', id: 'll', label: 'Inserting 15 after 10', layout: 'linear',
          nodes: [
            { id: 'n1', value: '10', state: 'active' },
            { id: 'new', value: '15', state: 'highlight' },
            { id: 'n2', value: '20', state: 'default' },
            { id: 'n3', value: '30', state: 'default' },
          ],
          edges: [
            { source: 'n1', target: 'new', label: 'next', state: 'active', directed: true },
            { source: 'new', target: 'n2', label: 'next', state: 'highlight', directed: true },
            { source: 'n2', target: 'n3', label: 'next', state: 'default', directed: true },
          ],
        },
        { type: 'variable', id: 'v-head', name: 'head', value: 'n1', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'Create node(15)', kind: 'call' },
          { text: 'node(15).next = node(20)', kind: 'swap' },
          { text: 'node(10).next = node(15)', kind: 'swap' },
          { text: 'Insert is O(1) — no shifting needed (unlike arrays!)', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'Delete node 20: point node 15.next to node 30, bypassing 20. Node 20 is now unreachable and gets garbage collected. O(1) delete.',
      elements: [
        { type: 'graph', id: 'll', label: 'After deleting 20', layout: 'linear',
          nodes: [
            { id: 'n1', value: '10', state: 'done' },
            { id: 'new', value: '15', state: 'active' },
            { id: 'n3', value: '30', state: 'done' },
          ],
          edges: [
            { source: 'n1', target: 'new', label: 'next', state: 'done', directed: true },
            { source: 'new', target: 'n3', label: 'next', state: 'active', directed: true },
          ],
        },
        { type: 'variable', id: 'v-head', name: 'head', value: 'n1', state: 'done' },
        { type: 'log', id: 'log', lines: [
          { text: 'node(15).next = node(30) — skip node(20)', kind: 'swap' },
          { text: 'Delete is O(1) — just re-wire pointers', kind: 'info' },
          { text: 'Trade-off: O(1) insert/delete but O(n) access (no index)', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ─── Fast & Slow Pointers ────────────────────────────────────────────
const fastSlowViz: VisualizationBlock = {
  type: 'graph',
  initialState: {},
  steps: [
    {
      message: 'Cycle detection: Does this linked list have a cycle? Fast pointer moves 2 steps, slow moves 1. If they meet → cycle exists.',
      elements: [
        { type: 'graph', id: 'll', label: 'Linked List (with cycle)',
          nodes: [
            { id: 'a', value: '1', state: 'active', x: 0, y: 50 },
            { id: 'b', value: '2', state: 'default', x: 80, y: 50 },
            { id: 'c', value: '3', state: 'default', x: 160, y: 50 },
            { id: 'd', value: '4', state: 'default', x: 240, y: 50 },
            { id: 'e', value: '5', state: 'default', x: 240, y: 130 },
            { id: 'f', value: '6', state: 'default', x: 160, y: 130 },
          ],
          edges: [
            { source: 'a', target: 'b', state: 'default', directed: true },
            { source: 'b', target: 'c', state: 'default', directed: true },
            { source: 'c', target: 'd', state: 'default', directed: true },
            { source: 'd', target: 'e', state: 'default', directed: true },
            { source: 'e', target: 'f', state: 'default', directed: true },
            { source: 'f', target: 'c', label: 'cycle!', state: 'error', directed: true },
          ],
        },
        { type: 'variable', id: 'v-slow', name: 'slow', value: 'node 1', state: 'active', description: '+1 step' },
        { type: 'variable', id: 'v-fast', name: 'fast', value: 'node 1', state: 'highlight', description: '+2 steps' },
        { type: 'log', id: 'log', lines: [{ text: 'Start: slow=1, fast=1', kind: 'info' }] },
      ],
    },
    {
      message: 'Step 1: slow moves to node 2, fast moves to node 3. They haven\'t met yet.',
      elements: [
        { type: 'graph', id: 'll', label: 'Linked List (with cycle)',
          nodes: [
            { id: 'a', value: '1', state: 'visited', x: 0, y: 50 },
            { id: 'b', value: '2', state: 'active', x: 80, y: 50 },
            { id: 'c', value: '3', state: 'highlight', x: 160, y: 50 },
            { id: 'd', value: '4', state: 'default', x: 240, y: 50 },
            { id: 'e', value: '5', state: 'default', x: 240, y: 130 },
            { id: 'f', value: '6', state: 'default', x: 160, y: 130 },
          ],
          edges: [
            { source: 'a', target: 'b', state: 'active', directed: true },
            { source: 'b', target: 'c', state: 'default', directed: true },
            { source: 'c', target: 'd', state: 'default', directed: true },
            { source: 'd', target: 'e', state: 'default', directed: true },
            { source: 'e', target: 'f', state: 'default', directed: true },
            { source: 'f', target: 'c', label: 'cycle!', state: 'error', directed: true },
          ],
        },
        { type: 'variable', id: 'v-slow', name: 'slow', value: 'node 2', state: 'active' },
        { type: 'variable', id: 'v-fast', name: 'fast', value: 'node 3', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: 'Start: slow=1, fast=1', kind: 'info' },
          { text: 'Step 1: slow→2, fast→3', kind: 'compare' },
        ] },
      ],
    },
    {
      message: 'Step 2: slow→3, fast→5 (jumped 3→4→5). Fast is deep in the cycle. Slow just entered.',
      elements: [
        { type: 'graph', id: 'll', label: 'Linked List (with cycle)',
          nodes: [
            { id: 'a', value: '1', state: 'visited', x: 0, y: 50 },
            { id: 'b', value: '2', state: 'visited', x: 80, y: 50 },
            { id: 'c', value: '3', state: 'active', x: 160, y: 50 },
            { id: 'd', value: '4', state: 'visited', x: 240, y: 50 },
            { id: 'e', value: '5', state: 'highlight', x: 240, y: 130 },
            { id: 'f', value: '6', state: 'default', x: 160, y: 130 },
          ],
          edges: [
            { source: 'a', target: 'b', state: 'visited', directed: true },
            { source: 'b', target: 'c', state: 'visited', directed: true },
            { source: 'c', target: 'd', state: 'default', directed: true },
            { source: 'd', target: 'e', state: 'default', directed: true },
            { source: 'e', target: 'f', state: 'default', directed: true },
            { source: 'f', target: 'c', label: 'cycle!', state: 'error', directed: true },
          ],
        },
        { type: 'variable', id: 'v-slow', name: 'slow', value: 'node 3', state: 'active' },
        { type: 'variable', id: 'v-fast', name: 'fast', value: 'node 5', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: 'Step 1: slow→2, fast→3', kind: 'compare' },
          { text: 'Step 2: slow→3, fast→5', kind: 'compare' },
        ] },
      ],
    },
    {
      message: 'Step 3: slow→4, fast→5→6→3 (fast wraps around the cycle!). fast is now at node 3.',
      elements: [
        { type: 'graph', id: 'll', label: 'Linked List (with cycle)',
          nodes: [
            { id: 'a', value: '1', state: 'visited', x: 0, y: 50 },
            { id: 'b', value: '2', state: 'visited', x: 80, y: 50 },
            { id: 'c', value: '3', state: 'highlight', x: 160, y: 50 },
            { id: 'd', value: '4', state: 'active', x: 240, y: 50 },
            { id: 'e', value: '5', state: 'visited', x: 240, y: 130 },
            { id: 'f', value: '6', state: 'visited', x: 160, y: 130 },
          ],
          edges: [
            { source: 'a', target: 'b', state: 'visited', directed: true },
            { source: 'b', target: 'c', state: 'visited', directed: true },
            { source: 'c', target: 'd', state: 'default', directed: true },
            { source: 'd', target: 'e', state: 'default', directed: true },
            { source: 'e', target: 'f', state: 'visited', directed: true },
            { source: 'f', target: 'c', label: 'cycle!', state: 'highlight', directed: true },
          ],
        },
        { type: 'variable', id: 'v-slow', name: 'slow', value: 'node 4', state: 'active' },
        { type: 'variable', id: 'v-fast', name: 'fast', value: 'node 3', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: 'Step 2: slow→3, fast→5', kind: 'compare' },
          { text: 'Step 3: slow→4, fast→3 (wrapped around cycle)', kind: 'compare' },
        ] },
      ],
    },
    {
      message: 'Step 4: slow→5, fast→3→4→5. THEY MEET at node 5! Cycle confirmed. The fast pointer always catches the slow in a cycle because the gap shrinks by 1 each step.',
      elements: [
        { type: 'graph', id: 'll', label: 'CYCLE DETECTED!',
          nodes: [
            { id: 'a', value: '1', state: 'visited', x: 0, y: 50 },
            { id: 'b', value: '2', state: 'visited', x: 80, y: 50 },
            { id: 'c', value: '3', state: 'visited', x: 160, y: 50 },
            { id: 'd', value: '4', state: 'visited', x: 240, y: 50 },
            { id: 'e', value: '5', state: 'done', x: 240, y: 130 },
            { id: 'f', value: '6', state: 'visited', x: 160, y: 130 },
          ],
          edges: [
            { source: 'a', target: 'b', state: 'visited', directed: true },
            { source: 'b', target: 'c', state: 'visited', directed: true },
            { source: 'c', target: 'd', state: 'visited', directed: true },
            { source: 'd', target: 'e', state: 'visited', directed: true },
            { source: 'e', target: 'f', state: 'visited', directed: true },
            { source: 'f', target: 'c', label: 'cycle!', state: 'done', directed: true },
          ],
        },
        { type: 'variable', id: 'v-slow', name: 'slow', value: 'node 5', state: 'done' },
        { type: 'variable', id: 'v-fast', name: 'fast', value: 'node 5', state: 'done' },
        { type: 'log', id: 'log', lines: [
          { text: 'Step 3: slow→4, fast→3', kind: 'compare' },
          { text: 'Step 4: slow→5, fast→5 — THEY MEET!', kind: 'return' },
          { text: '✅ Cycle detected at node 5. O(n) time, O(1) space.', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ─── Insertion Sort ──────────────────────────────────────────────────
const insertionSortViz: VisualizationBlock = {
  type: 'array',
  initialState: {},
  steps: [
    {
      message: 'Insertion Sort on [5, 3, 8, 1, 2]. Think: pick up each card from unsorted and insert it into the right place in the sorted portion.',
      elements: [
        { type: 'array', id: 'arr', label: 'Array', items: [
          { value: '5', state: 'done' }, { value: '3', state: 'default' }, { value: '8', state: 'default' },
          { value: '1', state: 'default' }, { value: '2', state: 'default' },
        ]},
        { type: 'variable', id: 'v-key', name: 'key', value: '—', state: 'default' },
        { type: 'variable', id: 'v-i', name: 'i', value: '1', state: 'default' },
        { type: 'log', id: 'log', lines: [{ text: 'Sorted portion: [5]. Pick up arr[1]=3.', kind: 'info' }] },
      ],
    },
    {
      message: 'key=3: Compare with 5. 3 < 5, so shift 5 right, insert 3 at position 0. Sorted: [3, 5].',
      elements: [
        { type: 'array', id: 'arr', label: 'Array', items: [
          { value: '3', state: 'highlight' }, { value: '5', state: 'done' }, { value: '8', state: 'default' },
          { value: '1', state: 'default' }, { value: '2', state: 'default' },
        ]},
        { type: 'variable', id: 'v-key', name: 'key', value: '3', state: 'highlight' },
        { type: 'variable', id: 'v-i', name: 'i', value: '1', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'key=3: 3 < 5 → shift 5 right', kind: 'compare' },
          { text: 'Insert 3 at position 0', kind: 'swap' },
        ] },
      ],
    },
    {
      message: 'key=8: Compare with 5. 8 > 5, already in place. Sorted: [3, 5, 8].',
      elements: [
        { type: 'array', id: 'arr', label: 'Array', items: [
          { value: '3', state: 'done' }, { value: '5', state: 'done' }, { value: '8', state: 'highlight' },
          { value: '1', state: 'default' }, { value: '2', state: 'default' },
        ]},
        { type: 'variable', id: 'v-key', name: 'key', value: '8', state: 'highlight' },
        { type: 'variable', id: 'v-i', name: 'i', value: '2', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'Insert 3 at position 0', kind: 'swap' },
          { text: 'key=8: 8 > 5 → already in place ✓', kind: 'compare' },
        ] },
      ],
    },
    {
      message: 'key=1: Compare with 8, 5, 3. Shift all right. Insert 1 at position 0. Sorted: [1, 3, 5, 8]. This is the worst case — shift everything.',
      elements: [
        { type: 'array', id: 'arr', label: 'Array', items: [
          { value: '1', state: 'highlight' }, { value: '3', state: 'done' }, { value: '5', state: 'done' },
          { value: '8', state: 'done' }, { value: '2', state: 'default' },
        ]},
        { type: 'variable', id: 'v-key', name: 'key', value: '1', state: 'highlight' },
        { type: 'variable', id: 'v-i', name: 'i', value: '3', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'key=1: 1 < 8 → shift 8', kind: 'compare' },
          { text: '1 < 5 → shift 5', kind: 'compare' },
          { text: '1 < 3 → shift 3', kind: 'compare' },
          { text: 'Insert 1 at position 0', kind: 'swap' },
        ] },
      ],
    },
    {
      message: 'key=2: Compare with 8, 5, 3. Shift those. 2 > 1, stop. Insert at position 1. Final: [1, 2, 3, 5, 8]. O(n²) worst case, but O(n) if nearly sorted.',
      elements: [
        { type: 'array', id: 'arr', label: 'Array (sorted!)', items: [
          { value: '1', state: 'done' }, { value: '2', state: 'done' }, { value: '3', state: 'done' },
          { value: '5', state: 'done' }, { value: '8', state: 'done' },
        ]},
        { type: 'variable', id: 'v-key', name: 'key', value: '2', state: 'done' },
        { type: 'variable', id: 'v-i', name: 'i', value: '4', state: 'done' },
        { type: 'log', id: 'log', lines: [
          { text: 'key=2: 2 < 8, 2 < 5, 2 < 3 → shift', kind: 'compare' },
          { text: '2 > 1 → STOP, insert 2 at pos 1', kind: 'swap' },
          { text: '✅ Sorted! [1, 2, 3, 5, 8]', kind: 'info' },
          { text: 'O(n²) worst, O(n) best (already sorted)', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ─── Merge Sort ──────────────────────────────────────────────────────
const mergeSortViz: VisualizationBlock = {
  type: 'array',
  initialState: {},
  steps: [
    {
      message: 'Merge Sort on [38, 27, 43, 3]. Step 1: DIVIDE — split the array in half repeatedly until each piece has 1 element (which is trivially sorted).',
      elements: [
        { type: 'array', id: 'a0', label: 'Original', items: [
          { value: '38', state: 'default' }, { value: '27', state: 'default' }, { value: '43', state: 'default' }, { value: '3', state: 'default' },
        ]},
        { type: 'log', id: 'log', lines: [
          { text: 'mergeSort([38, 27, 43, 3])', kind: 'call' },
          { text: 'Split → [38, 27] and [43, 3]', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'Split further: [38, 27] → [38] and [27]. [43, 3] → [43] and [3]. Each has 1 element = already sorted. Now MERGE upward.',
      elements: [
        { type: 'array', id: 'a1', label: 'Left half', items: [
          { value: '38', state: 'active' }, { value: '27', state: 'active' },
        ]},
        { type: 'array', id: 'a2', label: 'Right half', items: [
          { value: '43', state: 'comparing' }, { value: '3', state: 'comparing' },
        ]},
        { type: 'log', id: 'log', lines: [
          { text: 'mergeSort([38, 27]) → split → [38], [27]', kind: 'call' },
          { text: 'mergeSort([43, 3]) → split → [43], [3]', kind: 'call' },
          { text: 'Base case: single elements are sorted', kind: 'return' },
        ] },
      ],
    },
    {
      message: 'MERGE [38] and [27]: Compare 38 vs 27. 27 < 38 → take 27 first, then 38. Result: [27, 38].',
      elements: [
        { type: 'array', id: 'a1', label: 'Merging left pair', items: [
          { value: '27', state: 'done' }, { value: '38', state: 'done' },
        ]},
        { type: 'array', id: 'a2', label: 'Right half (waiting)', items: [
          { value: '43', state: 'default' }, { value: '3', state: 'default' },
        ]},
        { type: 'log', id: 'log', lines: [
          { text: 'merge([38], [27]): compare 38 vs 27', kind: 'compare' },
          { text: '27 < 38 → take 27 first → [27, 38]', kind: 'swap' },
        ] },
      ],
    },
    {
      message: 'MERGE [43] and [3]: 3 < 43 → take 3 first. Result: [3, 43]. Now merge the two sorted halves.',
      elements: [
        { type: 'array', id: 'a1', label: 'Left sorted', items: [
          { value: '27', state: 'done' }, { value: '38', state: 'done' },
        ]},
        { type: 'array', id: 'a2', label: 'Right sorted', items: [
          { value: '3', state: 'done' }, { value: '43', state: 'done' },
        ]},
        { type: 'log', id: 'log', lines: [
          { text: 'merge([43], [3]): 3 < 43 → [3, 43]', kind: 'swap' },
          { text: 'Now merge [27,38] with [3,43]', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'FINAL MERGE: [27,38] vs [3,43]. Compare heads: 3<27→take 3. Then 27<43→take 27. Then 38<43→take 38. Then take 43. Result: [3, 27, 38, 43].',
      elements: [
        { type: 'array', id: 'a0', label: 'Final sorted array', items: [
          { value: '3', state: 'done' }, { value: '27', state: 'done' }, { value: '38', state: 'done' }, { value: '43', state: 'done' },
        ]},
        { type: 'log', id: 'log', lines: [
          { text: 'merge([27,38], [3,43]):', kind: 'call' },
          { text: '3 < 27 → take 3', kind: 'compare' },
          { text: '27 < 43 → take 27', kind: 'compare' },
          { text: '38 < 43 → take 38', kind: 'compare' },
          { text: 'take 43 → [3, 27, 38, 43]', kind: 'swap' },
          { text: '✅ O(n log n) always — divide in half (log n), merge in O(n)', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ─── Binary Search ───────────────────────────────────────────────────
const binarySearchViz: VisualizationBlock = {
  type: 'array',
  initialState: {},
  steps: [
    {
      message: 'Binary Search: Find target=7 in sorted array [1, 3, 5, 7, 9, 11, 13]. Set lo=0, hi=6, mid=3.',
      elements: [
        { type: 'array', id: 'arr', label: 'Sorted Array', items: [
          { value: '1', state: 'default' }, { value: '3', state: 'default' }, { value: '5', state: 'default' },
          { value: '7', state: 'comparing' }, { value: '9', state: 'default' }, { value: '11', state: 'default' }, { value: '13', state: 'default' },
        ]},
        { type: 'variable', id: 'v-lo', name: 'lo', value: '0', state: 'active' },
        { type: 'variable', id: 'v-hi', name: 'hi', value: '6', state: 'active' },
        { type: 'variable', id: 'v-mid', name: 'mid', value: '3', state: 'comparing' },
        { type: 'variable', id: 'v-target', name: 'target', value: '7', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: 'lo=0, hi=6, mid = (0+6)/2 = 3', kind: 'info' },
          { text: 'arr[3] = 7, target = 7', kind: 'compare' },
        ] },
      ],
    },
    {
      message: 'arr[mid]=7 == target=7. FOUND IT on the very first check! But let\'s show what happens when we don\'t find it immediately...',
      elements: [
        { type: 'array', id: 'arr', label: 'Sorted Array', items: [
          { value: '1', state: 'default' }, { value: '3', state: 'default' }, { value: '5', state: 'default' },
          { value: '7', state: 'done' }, { value: '9', state: 'default' }, { value: '11', state: 'default' }, { value: '13', state: 'default' },
        ]},
        { type: 'variable', id: 'v-lo', name: 'lo', value: '0', state: 'done' },
        { type: 'variable', id: 'v-hi', name: 'hi', value: '6', state: 'done' },
        { type: 'variable', id: 'v-mid', name: 'mid', value: '3', state: 'done' },
        { type: 'variable', id: 'v-target', name: 'target', value: '7', state: 'done' },
        { type: 'log', id: 'log', lines: [
          { text: 'arr[3]=7 == 7 ✅ FOUND at index 3', kind: 'return' },
          { text: 'Now let\'s search for 11 instead to show the full algorithm...', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'New search: target=11. mid=3, arr[3]=7. 7 < 11, so target is in RIGHT half. Set lo=mid+1=4. Search space halved!',
      elements: [
        { type: 'array', id: 'arr', label: 'Sorted Array', items: [
          { value: '1', state: 'visited' }, { value: '3', state: 'visited' }, { value: '5', state: 'visited' },
          { value: '7', state: 'visited' }, { value: '9', state: 'active' }, { value: '11', state: 'active' }, { value: '13', state: 'active' },
        ]},
        { type: 'variable', id: 'v-lo', name: 'lo', value: '4', state: 'active' },
        { type: 'variable', id: 'v-hi', name: 'hi', value: '6', state: 'active' },
        { type: 'variable', id: 'v-mid', name: 'mid', value: '5', state: 'comparing' },
        { type: 'variable', id: 'v-target', name: 'target', value: '11', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: 'Search for 11: arr[3]=7 < 11 → go RIGHT', kind: 'compare' },
          { text: 'lo=4, hi=6, mid=(4+6)/2=5', kind: 'info' },
          { text: 'arr[5]=11, target=11', kind: 'compare' },
        ] },
      ],
    },
    {
      message: 'arr[5]=11 == target=11. FOUND at index 5! Only 2 comparisons for 7 elements. Binary search = O(log n). For n=1,000,000 that\'s only ~20 checks.',
      elements: [
        { type: 'array', id: 'arr', label: 'Sorted Array', items: [
          { value: '1', state: 'visited' }, { value: '3', state: 'visited' }, { value: '5', state: 'visited' },
          { value: '7', state: 'visited' }, { value: '9', state: 'visited' }, { value: '11', state: 'done' }, { value: '13', state: 'visited' },
        ]},
        { type: 'variable', id: 'v-lo', name: 'lo', value: '4', state: 'done' },
        { type: 'variable', id: 'v-hi', name: 'hi', value: '6', state: 'done' },
        { type: 'variable', id: 'v-mid', name: 'mid', value: '5', state: 'done' },
        { type: 'variable', id: 'v-target', name: 'target', value: '11', state: 'done' },
        { type: 'log', id: 'log', lines: [
          { text: 'arr[5]=11 == 11 ✅ FOUND at index 5', kind: 'return' },
          { text: 'Only 2 comparisons for 7 elements', kind: 'info' },
          { text: 'O(log n) — halve search space each step', kind: 'info' },
          { text: 'n=1,000,000 → only ~20 comparisons!', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════
// EXPORT: ALL BASIC PHASES
// ═══════════════════════════════════════════════════════════════════════

export const basicPhases: DemoPhase[] = [
  {
    id: 'phase-1', phase: 1, title: 'Memory Mental Model',
    goal: 'Build the foundational mental model that everything is memory.',
    lessons: [
      { id: 'B-0', code: 'B-0', title: 'Introduction', content: '<h2>Why Learn DSA?</h2><p>Data Structures and Algorithms are the <strong>building blocks of every program</strong>. Every app you use — Google Search, Instagram, Uber — is built on these foundations.</p><p><strong>Data Structure</strong> — a way to organize data so you can access it efficiently.<br/><strong>Algorithm</strong> — a step-by-step recipe that transforms input into output.</p><h2>The Two Questions</h2><p>For any solution, always ask:</p><ol><li><strong>Time complexity</strong> — how does runtime grow with input size?</li><li><strong>Space complexity</strong> — how much extra memory do we need?</li></ol><blockquote>Why can\'t we just buy faster computers instead of learning algorithms?</blockquote><p>Because a bad algorithm on a supercomputer loses to a good algorithm on a phone. An O(n²) sort on 1 million items: ~10¹² operations. An O(n log n) sort: ~20 million. That\'s 50,000× faster.</p>', visualization: null },
      { id: 'B-1', code: 'B-1', title: 'RAM — Why Arrays Work', content: '<h2>Why This Matters</h2><p>Every variable you create lives in RAM. Understanding RAM explains <em>why</em> arrays are O(1) access and linked lists are O(n).</p><h2>The Mental Model</h2><p>RAM is a giant numbered mailbox wall. Each mailbox (byte) has an <strong>address</strong> (0, 1, 2...). You hand the clerk an address, they go straight to that box. No scanning, no searching.</p><h2>The Key Formula</h2><pre><code>address = base + (index × element_size)</code></pre><p>This is why <code>arr[i]</code> is O(1). One multiply, one add, one memory read.</p><blockquote>If RAM access is O(1), why isn\'t every data structure O(1)?</blockquote>', visualization: ramViz },
      { id: 'B-2', code: 'B-2', title: 'Static Arrays', content: '<h2>Core Definition</h2><p><strong>Static Array</strong> — a fixed-size, contiguous block of memory. Size is set at creation and cannot change.</p><h2>Operations</h2><ul><li><strong>Read arr[i]</strong> — O(1), use the address formula</li><li><strong>Write arr[i] = x</strong> — O(1), same formula</li><li><strong>Insert at end</strong> — O(1) if space exists, impossible if full</li><li><strong>Insert at middle</strong> — O(n), must shift everything right</li><li><strong>Delete</strong> — O(n), must shift everything left to fill the gap</li></ul><h2>Gotchas</h2><ul><li>You must know the size upfront</li><li>Wasted memory if you allocate too much</li><li>Out of space if you allocate too little</li></ul>', visualization: null },
      { id: 'B-3', code: 'B-3', title: 'Dynamic Arrays', content: '<h2>Why This Matters</h2><p>Python lists, JavaScript arrays, Java ArrayLists — all dynamic arrays. The #1 data structure in real code.</p><h2>Core Idea</h2><p>A dynamic array is a static array that <strong>resizes itself</strong> when full. When capacity is reached, allocate a new array 2× the size and copy everything over.</p><h2>Amortized Analysis</h2><p>Doubling costs O(n) per resize, but happens only after n pushes. Total cost of n pushes = n (direct) + n/2 + n/4 + ... ≈ 2n. So <strong>amortized O(1) per push</strong>.</p><blockquote>What happens if we grow by +1 instead of ×2? Why is doubling special?</blockquote>', visualization: dynamicArrayViz },
      { id: 'B-4', code: 'B-4', title: 'Stacks', content: '<h2>Why This Matters</h2><p>Your function call stack is a stack. Ctrl+Z (undo) is a stack. Browser back button is a stack. Stacks are everywhere.</p><h2>Core Definition</h2><p><strong>Stack</strong> — Last In, First Out (LIFO). Two operations:</p><ul><li><strong>push(x)</strong> — add to top, O(1)</li><li><strong>pop()</strong> — remove from top, O(1)</li><li><strong>peek()</strong> — look at top without removing, O(1)</li></ul><h2>Implementation</h2><p>Use a dynamic array. push = append, pop = remove last. Both O(1).</p><pre><code>class Stack:\n  def __init__(self):\n    self.items = []\n  def push(self, x):\n    self.items.append(x)\n  def pop(self):\n    return self.items.pop()\n  def peek(self):\n    return self.items[-1]</code></pre>', visualization: stackViz },
    ],
    bossChallenge: 'Implement a dynamic array class with push(), pop(), and auto-doubling resize from memory. No notes.',
    leetcode: [
      { id: 1929, title: 'Concatenation of Array', url: 'https://leetcode.com/problems/concatenation-of-array/', tag: 'Arrays' },
      { id: 217, title: 'Contains Duplicate', url: 'https://leetcode.com/problems/contains-duplicate/', tag: 'Arrays' },
      { id: 682, title: 'Baseball Game', url: 'https://leetcode.com/problems/baseball-game/', tag: 'Stacks' },
    ],
  },
  {
    id: 'phase-2', phase: 2, title: 'Array Patterns (Advanced)',
    goal: 'Learn the 4 core array manipulation patterns — they appear in ~40% of all LeetCode problems.',
    lessons: [
      { id: 'A-1', code: 'A-1', title: 'Sliding Window — Fixed Size', content: '<h2>Why This Matters</h2><p>Any time you see "find max/min/sum of k consecutive elements", reach for a fixed sliding window.</p><h2>The Pattern</h2><ol><li>Compute sum of first k elements</li><li>Slide right: subtract the element leaving, add the element entering</li><li>Track the best answer seen so far</li></ol><p><em>[When to reach for this]</em> "subarray of size k" or "k consecutive" in the problem statement.</p><h2>Complexity</h2><p>O(n) time — each element enters and leaves the window exactly once. O(1) extra space.</p>', visualization: slidingWindowFixedViz },
      { id: 'A-2', code: 'A-2', title: 'Sliding Window — Variable Size', content: '<h2>Why This Matters</h2><p>Variable window handles "longest/shortest subarray with some property" — the most common medium LeetCode pattern.</p><h2>The Template</h2><pre><code>left = 0\nfor right in range(n):\n  # expand: add arr[right] to window\n  while window_is_invalid():\n    # shrink: remove arr[left], left += 1\n  update_best_answer()</code></pre><p><em>[When to reach for this]</em> "longest substring without repeating", "smallest subarray with sum ≥ k".</p><h2>Key Insight</h2><p>left only moves right — never backwards. So total pointer movements across all iterations = O(n).</p>', visualization: null },
      { id: 'A-3', code: 'A-3', title: 'Two Pointers', content: '<h2>Why This Matters</h2><p>Two pointers turns O(n²) nested loops into O(n) single passes on sorted arrays. Extremely common pattern.</p><h2>The Pattern</h2><p>Left pointer starts at beginning, right at end. On each step, move one based on comparison:</p><ul><li><strong>Sum too big</strong> → move right pointer left (decrease sum)</li><li><strong>Sum too small</strong> → move left pointer right (increase sum)</li></ul><p><em>[When to reach for this]</em> Sorted array + "find pair with target sum", "container with most water", palindrome checking.</p><blockquote>Why does this only work on sorted arrays?</blockquote><p>Because sorting gives us a <strong>monotonic guarantee</strong>: moving left always increases, moving right always decreases.</p>', visualization: twoPointersViz },
      { id: 'A-4', code: 'A-4', title: 'Prefix Sums', content: '<h2>Why This Matters</h2><p>Prefix sums let you answer any range-sum query in O(1) after O(n) preprocessing. Used in competitive programming constantly.</p><h2>The Pattern</h2><pre><code>prefix[0] = 0\nfor i in range(n):\n  prefix[i+1] = prefix[i] + arr[i]\n\n# sum(l..r) = prefix[r+1] - prefix[l]</code></pre><p><em>[When to reach for this]</em> "sum of subarray from l to r", "number of subarrays with sum k".</p><h2>Why It Works</h2><p>prefix[r+1] = sum of arr[0..r]. prefix[l] = sum of arr[0..l-1]. Subtraction cancels the prefix, leaving arr[l..r].</p>', visualization: prefixSumViz },
    ],
    bossChallenge: 'Solve Maximum Subarray using Sliding Window logic without looking up the approach.',
    leetcode: [
      { id: 643, title: 'Max Average Subarray I', url: 'https://leetcode.com/problems/maximum-average-subarray-i/', tag: 'Fixed Window' },
      { id: 3, title: 'Longest Substring Without Repeating', url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/', tag: 'Variable Window' },
      { id: 167, title: 'Two Sum II', url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/', tag: 'Two Pointers' },
      { id: 303, title: 'Range Sum Query', url: 'https://leetcode.com/problems/range-sum-query-immutable/', tag: 'Prefix Sum' },
    ],
  },
  {
    id: 'phase-3', phase: 3, title: 'Linked Lists + Pointer Patterns',
    goal: 'Master pointer-based thinking. The fast/slow pointer trick is one of the most elegant patterns in DSA.',
    lessons: [
      { id: 'B-5', code: 'B-5', title: 'Singly Linked Lists', content: '<h2>Why This Matters</h2><p>Linked lists teach <strong>pointer thinking</strong> — the mental skill needed for trees, graphs, and advanced data structures.</p><h2>Core Definition</h2><p><strong>Singly Linked List</strong> — each node stores a value and a pointer to the next node. Last node points to null.</p><h2>Operations</h2><ul><li><strong>Prepend</strong> — O(1): create node, point to old head, update head</li><li><strong>Append</strong> — O(n): traverse to end, add node (O(1) with tail pointer)</li><li><strong>Insert after node</strong> — O(1): rewire two pointers</li><li><strong>Delete node</strong> — O(1): bypass it by rewiring predecessor\'s next</li><li><strong>Search</strong> — O(n): must traverse from head</li></ul><h2>Arrays vs Linked Lists</h2><table><tr><th>Op</th><th>Array</th><th>Linked List</th></tr><tr><td>Access [i]</td><td>O(1)</td><td>O(n)</td></tr><tr><td>Insert/Delete at known pos</td><td>O(n)</td><td>O(1)</td></tr></table>', visualization: linkedListViz },
      { id: 'B-6', code: 'B-6', title: 'Doubly Linked Lists', content: '<h2>Upgrade from Singly</h2><p><strong>Doubly Linked List</strong> — each node has both <code>next</code> and <code>prev</code> pointers. This enables O(1) deletion of any node if you have a reference to it.</p><h2>Key Advantage</h2><p>In a singly linked list, to delete node X you need the node <em>before</em> X. In a doubly linked list, X knows its own predecessor.</p><h2>Where It\'s Used</h2><ul><li><strong>LRU Cache</strong> — the classic interview question uses a doubly linked list + hash map</li><li><strong>Browser history</strong> — forward and back navigation</li><li><strong>Text editor</strong> — cursor movement in both directions</li></ul><pre><code>class Node:\n  def __init__(self, val):\n    self.val = val\n    self.next = None\n    self.prev = None</code></pre>', visualization: null },
      { id: 'B-7', code: 'B-7', title: 'Queues', content: '<h2>Core Definition</h2><p><strong>Queue</strong> — First In, First Out (FIFO). Like a line at a store. Two operations:</p><ul><li><strong>enqueue(x)</strong> — add to back, O(1)</li><li><strong>dequeue()</strong> — remove from front, O(1)</li></ul><h2>Implementation</h2><p>Use a linked list (enqueue at tail, dequeue at head) or a circular array. Do NOT use a regular array — dequeue would be O(n) due to shifting.</p><h2>Where Queues Show Up</h2><ul><li><strong>BFS</strong> — breadth-first search on trees/graphs (Phase 7)</li><li><strong>Task scheduling</strong> — process requests in order</li><li><strong>Buffering</strong> — producer-consumer patterns</li></ul><blockquote>What happens if you implement a queue with a regular array?</blockquote><p>Every dequeue shifts all n elements left → O(n). Circular array or linked list fixes this.</p>', visualization: null },
      { id: 'A-5', code: 'A-5', title: 'Fast and Slow Pointers', content: '<h2>Why This Matters</h2><p>The tortoise and hare algorithm detects cycles in O(n) time and O(1) space — no hash set needed.</p><h2>The Pattern</h2><pre><code>slow = head\nfast = head\nwhile fast and fast.next:\n  slow = slow.next        # +1\n  fast = fast.next.next   # +2\n  if slow == fast:\n    return True  # cycle!\nreturn False  # no cycle</code></pre><h2>Why It Works</h2><p>If there\'s a cycle, fast enters it first and starts looping. Slow enters later. Each step, the gap between them shrinks by 1. They must eventually collide.</p><h2>Bonus Uses</h2><ul><li><strong>Find middle node</strong>: when fast reaches end, slow is at middle</li><li><strong>Find cycle start</strong>: after detection, reset one pointer to head, advance both +1. They meet at the cycle start.</li></ul>', visualization: fastSlowViz },
    ],
    bossChallenge: 'Reverse a singly linked list iteratively AND recursively from memory.',
    leetcode: [
      { id: 206, title: 'Reverse Linked List', url: 'https://leetcode.com/problems/reverse-linked-list/', tag: 'Linked List' },
      { id: 141, title: 'Linked List Cycle', url: 'https://leetcode.com/problems/linked-list-cycle/', tag: 'Fast/Slow' },
      { id: 876, title: 'Middle of Linked List', url: 'https://leetcode.com/problems/middle-of-the-linked-list/', tag: 'Fast/Slow' },
    ],
  },
  {
    id: 'phase-4', phase: 4, title: 'Recursion',
    goal: 'This unlocks Merge Sort, all Trees, Backtracking, Graphs DFS, and DP. Spend 2x the lesson time on practice here.',
    keystone: true,
    lessons: [
      { id: 'B-8', code: 'B-8', title: 'Factorial', content: '<h2>The Mental Model</h2><p>"I solve the smallest version. I trust the same function handles everything bigger. Every call moves closer to the base case."</p><h2>Factorial</h2><pre><code>def factorial(n):\n  if n <= 1:       # base case\n    return 1\n  return n * factorial(n - 1)  # recursive case</code></pre><h2>Trace It</h2><pre><code>factorial(4)\n  4 * factorial(3)\n    3 * factorial(2)\n      2 * factorial(1)\n        return 1     ← base case\n      return 2 * 1 = 2\n    return 3 * 2 = 6\n  return 4 * 6 = 24</code></pre><p>The call stack is literally a stack — LIFO. Each frame waits for the one below to return.</p><blockquote>What happens if you forget the base case?</blockquote><p>Stack overflow — infinite recursion until memory runs out.</p>', visualization: {
        type: 'array', initialState: {},
        steps: [
          { message: 'factorial(4): This calls factorial(3). Each call is a new frame on the call stack. The stack grows downward.', elements: [
            { type: 'array', id: 'stack', label: 'Call Stack', items: [{ value: 'f(4)', state: 'active' }], direction: 'horizontal' },
            { type: 'variable', id: 'v-n', name: 'n', value: '4', state: 'active' },
            { type: 'log', id: 'log', lines: [{ text: 'factorial(4) called', kind: 'call' }] },
          ]},
          { message: 'factorial(3) called from factorial(4). Stack grows. f(4) is waiting for f(3) to return.', elements: [
            { type: 'array', id: 'stack', label: 'Call Stack', items: [{ value: 'f(4)', state: 'default' }, { value: 'f(3)', state: 'active' }], direction: 'horizontal' },
            { type: 'variable', id: 'v-n', name: 'n', value: '3', state: 'active' },
            { type: 'log', id: 'log', lines: [{ text: 'factorial(4) called', kind: 'call' }, { text: 'factorial(3) called', kind: 'call' }] },
          ]},
          { message: 'factorial(2), then factorial(1). n=1 hits the BASE CASE — returns 1. No more recursion.', elements: [
            { type: 'array', id: 'stack', label: 'Call Stack', items: [
              { value: 'f(4)', state: 'default' }, { value: 'f(3)', state: 'default' }, { value: 'f(2)', state: 'default' }, { value: 'f(1)', state: 'highlight' },
            ], direction: 'horizontal' },
            { type: 'variable', id: 'v-n', name: 'n', value: '1', state: 'highlight', description: 'BASE CASE' },
            { type: 'log', id: 'log', lines: [
              { text: 'factorial(3) called', kind: 'call' }, { text: 'factorial(2) called', kind: 'call' },
              { text: 'factorial(1) called — BASE CASE, return 1', kind: 'return' },
            ] },
          ]},
          { message: 'Now UNWIND: f(2) gets 1 back, returns 2*1=2. f(3) gets 2, returns 3*2=6.', elements: [
            { type: 'array', id: 'stack', label: 'Call Stack (unwinding)', items: [
              { value: 'f(4)', state: 'default' }, { value: 'f(3)=6', state: 'active' },
            ], direction: 'horizontal' },
            { type: 'variable', id: 'v-n', name: 'result', value: '6', state: 'active' },
            { type: 'log', id: 'log', lines: [
              { text: 'f(1) returns 1', kind: 'return' },
              { text: 'f(2) returns 2 × 1 = 2', kind: 'return' },
              { text: 'f(3) returns 3 × 2 = 6', kind: 'return' },
            ] },
          ]},
          { message: 'f(4) gets 6, returns 4*6=24. Stack is empty. Done! Every recursion follows this pattern: grow stack → hit base → unwind.', elements: [
            { type: 'array', id: 'stack', label: 'Call Stack (empty)', items: [], direction: 'horizontal' },
            { type: 'variable', id: 'v-n', name: 'result', value: '24', state: 'done', description: '4! = 24' },
            { type: 'log', id: 'log', lines: [
              { text: 'f(3) returns 3 × 2 = 6', kind: 'return' },
              { text: 'f(4) returns 4 × 6 = 24 ✅', kind: 'return' },
              { text: 'Pattern: grow → base case → unwind', kind: 'info' },
            ] },
          ]},
        ],
      } },
      { id: 'B-9', code: 'B-9', title: 'Fibonacci Sequence', content: '<h2>Naive Recursion</h2><pre><code>def fib(n):\n  if n <= 1: return n\n  return fib(n-1) + fib(n-2)</code></pre><p>This is O(2ⁿ) — exponential! fib(5) calls fib(3) twice, fib(2) three times. Massive redundancy.</p><h2>Fix: Memoization</h2><pre><code>memo = {}\ndef fib(n):\n  if n in memo: return memo[n]\n  if n <= 1: return n\n  memo[n] = fib(n-1) + fib(n-2)\n  return memo[n]</code></pre><p>Now O(n) — each value computed exactly once. This is your first taste of <strong>Dynamic Programming</strong> (Phase 13).</p><blockquote>Can you do it with O(1) space? Hint: you only need the last two values.</blockquote>', visualization: {
        type: 'array', initialState: {},
        steps: [
          { message: 'Fibonacci: fib(0)=0, fib(1)=1, fib(n) = fib(n-1) + fib(n-2). Let\'s fill a memo table for fib(5).', elements: [
            { type: 'array', id: 'memo', label: 'Memo Table [fib(0) ... fib(5)]', items: [
              { value: '0', state: 'done' }, { value: '1', state: 'done' }, { value: '?', state: 'default' },
              { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' },
            ]},
            { type: 'variable', id: 'v-n', name: 'computing', value: 'fib(2)', state: 'active' },
            { type: 'log', id: 'log', lines: [
              { text: 'Base cases: fib(0)=0, fib(1)=1', kind: 'info' },
              { text: 'fib(2) = fib(1) + fib(0) = 1 + 0', kind: 'compare' },
            ] },
          ]},
          { message: 'fib(2) = 1+0 = 1. fib(3) = fib(2)+fib(1) = 1+1 = 2. Each lookup is O(1) from memo.', elements: [
            { type: 'array', id: 'memo', label: 'Memo Table', items: [
              { value: '0', state: 'done' }, { value: '1', state: 'done' }, { value: '1', state: 'done' },
              { value: '2', state: 'active' }, { value: '?', state: 'default' }, { value: '?', state: 'default' },
            ]},
            { type: 'variable', id: 'v-n', name: 'computing', value: 'fib(3)', state: 'active' },
            { type: 'log', id: 'log', lines: [
              { text: 'fib(2) = 1 + 0 = 1 ✓', kind: 'return' },
              { text: 'fib(3) = fib(2) + fib(1) = 1 + 1 = 2', kind: 'compare' },
            ] },
          ]},
          { message: 'fib(4) = fib(3)+fib(2) = 2+1 = 3. fib(5) = fib(4)+fib(3) = 3+2 = 5. Done! O(n) total with memo vs O(2^n) without.', elements: [
            { type: 'array', id: 'memo', label: 'Memo Table (complete)', items: [
              { value: '0', state: 'done' }, { value: '1', state: 'done' }, { value: '1', state: 'done' },
              { value: '2', state: 'done' }, { value: '3', state: 'done' }, { value: '5', state: 'highlight' },
            ]},
            { type: 'variable', id: 'v-n', name: 'fib(5)', value: '5', state: 'done' },
            { type: 'log', id: 'log', lines: [
              { text: 'fib(4) = 2 + 1 = 3', kind: 'return' },
              { text: 'fib(5) = 3 + 2 = 5 ✅', kind: 'return' },
              { text: 'With memo: O(n). Without: O(2^n). This IS dynamic programming.', kind: 'info' },
            ] },
          ]},
        ],
      } },
    ],
    bossChallenge: 'Write all 3 from memory: factorial(n) recursively, fibonacci(n) with memoization, and sum_linked_list(node) recursively.',
    leetcode: [
      { id: 509, title: 'Fibonacci Number', url: 'https://leetcode.com/problems/fibonacci-number/', tag: 'Recursion' },
      { id: 70, title: 'Climbing Stairs', url: 'https://leetcode.com/problems/climbing-stairs/', tag: 'Recursion/DP' },
      { id: 344, title: 'Reverse String', url: 'https://leetcode.com/problems/reverse-string/', tag: 'Recursion' },
    ],
  },
  {
    id: 'phase-5', phase: 5, title: 'Sorting',
    goal: 'Understand sorting as applied recursion. Merge Sort is your Phase 4 payoff.',
    lessons: [
      { id: 'B-10', code: 'B-10', title: 'Insertion Sort', content: '<h2>The Mental Model</h2><p>Like sorting playing cards in your hand. Pick up one card at a time and insert it into the correct position among the already-sorted cards.</p><h2>Algorithm</h2><pre><code>for i in range(1, n):\n  key = arr[i]\n  j = i - 1\n  while j >= 0 and arr[j] > key:\n    arr[j+1] = arr[j]  # shift right\n    j -= 1\n  arr[j+1] = key  # insert</code></pre><h2>Complexity</h2><ul><li><strong>Worst case</strong>: O(n²) — reverse-sorted input</li><li><strong>Best case</strong>: O(n) — already sorted (inner loop never runs)</li><li><strong>Space</strong>: O(1) — in-place</li></ul><p><em>[When to reach for this]</em> Small arrays (n < 20) or nearly-sorted data.</p>', visualization: insertionSortViz },
      { id: 'B-11', code: 'B-11', title: 'Merge Sort', content: '<h2>Why This Matters</h2><p>Merge Sort is recursion applied to sorting. If you can write it from memory, recursion has truly clicked.</p><h2>The Algorithm</h2><ol><li><strong>Divide</strong>: Split array in half</li><li><strong>Conquer</strong>: Recursively sort each half</li><li><strong>Merge</strong>: Combine two sorted halves into one sorted array</li></ol><h2>The Merge Step</h2><pre><code>def merge(left, right):\n  result = []\n  i = j = 0\n  while i < len(left) and j < len(right):\n    if left[i] <= right[j]:\n      result.append(left[i]); i += 1\n    else:\n      result.append(right[j]); j += 1\n  result += left[i:] + right[j:]\n  return result</code></pre><h2>Complexity</h2><p>O(n log n) always. log n levels of recursion × O(n) merge per level. Space: O(n) for the temporary arrays.</p>', visualization: mergeSortViz },
      { id: 'B-12', code: 'B-12', title: 'Quick Sort', content: '<h2>Core Idea</h2><p>Pick a <strong>pivot</strong>. Partition: all elements < pivot go left, all > pivot go right. Pivot is now in its final sorted position. Recurse on left and right.</p><h2>Partition</h2><pre><code>def partition(arr, lo, hi):\n  pivot = arr[hi]\n  i = lo\n  for j in range(lo, hi):\n    if arr[j] < pivot:\n      arr[i], arr[j] = arr[j], arr[i]\n      i += 1\n  arr[i], arr[hi] = arr[hi], arr[i]\n  return i</code></pre><h2>Complexity</h2><ul><li><strong>Average</strong>: O(n log n)</li><li><strong>Worst</strong>: O(n²) — already sorted + bad pivot</li><li><strong>Space</strong>: O(log n) — call stack, in-place otherwise</li></ul><p><em>[When to reach for this]</em> In-place sorting, good cache locality, fast in practice.</p>', visualization: null },
      { id: 'B-13', code: 'B-13', title: 'Bucket Sort', content: '<h2>Breaking the O(n log n) Barrier</h2><p>Comparison-based sorts can\'t do better than O(n log n). But if you know the range of values, you can sort in O(n).</p><h2>Algorithm</h2><ol><li>Create k empty buckets</li><li>Place each element in its bucket: bucket = value / range * k</li><li>Sort each bucket (small, so fast)</li><li>Concatenate all buckets</li></ol><h2>Complexity</h2><p>O(n + k) average, where k = number of buckets. Works best when input is uniformly distributed.</p><p><em>[When to reach for this]</em> Known range, uniform distribution, or integer keys.</p>', visualization: null },
    ],
    bossChallenge: 'Implement Merge Sort completely from memory. If you can write merge() and mergeSort() without help, recursion has truly clicked.',
    leetcode: [
      { id: 912, title: 'Sort an Array', url: 'https://leetcode.com/problems/sort-an-array/', tag: 'Sorting' },
      { id: 75, title: 'Sort Colors', url: 'https://leetcode.com/problems/sort-colors/', tag: 'Sorting' },
    ],
  },
  {
    id: 'phase-6', phase: 6, title: 'Binary Search',
    goal: 'The template that halves search space in O(log n). Short phase, high interview ROI.',
    lessons: [
      { id: 'B-14', code: 'B-14', title: 'Search Array', content: '<h2>Why This Matters</h2><p>Binary search appears in ~15% of all interview problems. The template is simple but the variations are tricky.</p><h2>The Template</h2><pre><code>def binary_search(arr, target):\n  lo, hi = 0, len(arr) - 1\n  while lo <= hi:\n    mid = (lo + hi) // 2\n    if arr[mid] == target:\n      return mid\n    elif arr[mid] < target:\n      lo = mid + 1\n    else:\n      hi = mid - 1\n  return -1</code></pre><h2>Key Insight</h2><p>Each comparison eliminates HALF the search space. n → n/2 → n/4 → ... → 1. That\'s log₂(n) steps.</p><p>For n = 1,000,000: linear search = 1M checks, binary = 20 checks.</p><blockquote>What happens if the array isn\'t sorted?</blockquote><p>Binary search breaks. It relies on the sorted order to know which half to discard.</p>', visualization: binarySearchViz },
      { id: 'B-15', code: 'B-15', title: 'Search Range', content: '<h2>Beyond Simple Search</h2><p>Binary search works on any <strong>monotonic</strong> property — not just sorted arrays. "Search Range" means finding the first/last occurrence.</p><h2>Find First Occurrence</h2><pre><code>def find_first(arr, target):\n  lo, hi, result = 0, len(arr)-1, -1\n  while lo <= hi:\n    mid = (lo + hi) // 2\n    if arr[mid] == target:\n      result = mid    # save it\n      hi = mid - 1    # keep searching left!\n    elif arr[mid] < target:\n      lo = mid + 1\n    else:\n      hi = mid - 1\n  return result</code></pre><p>The trick: when you find target, don\'t stop! Keep searching the left half for an earlier occurrence.</p><h2>Applications Beyond Arrays</h2><ul><li>Search in rotated sorted array</li><li>Find minimum in rotated array</li><li>Search a 2D matrix</li><li>Find peak element</li></ul>', visualization: null },
    ],
    bossChallenge: 'Solve Binary Search on a rotated array cold — LC 33.',
    leetcode: [
      { id: 704, title: 'Binary Search', url: 'https://leetcode.com/problems/binary-search/', tag: 'Binary Search' },
      { id: 74, title: 'Search a 2D Matrix', url: 'https://leetcode.com/problems/search-a-2d-matrix/', tag: 'Binary Search' },
      { id: 33, title: 'Search in Rotated Sorted Array', url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/', tag: 'Binary Search' },
    ],
  },
]
