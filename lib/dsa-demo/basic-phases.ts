import type { VisualizationBlock } from "@/lib/visualization/types";
import type { DemoPhase } from "./types";

// ═══════════════════════════════════════════════════════════════════════
// PHASE 1 — Memory Mental Model
// ═══════════════════════════════════════════════════════════════════════

const ramViz: VisualizationBlock = {
  type: "array",
  initialState: {},
  steps: [
    {
      message:
        "RAM is a giant array of bytes. Each byte has an address (0, 1, 2...). Reading any address takes the same time — O(1). This is why arrays are fast.",
      elements: [
        {
          type: "array",
          id: "ram",
          label: "RAM (addresses 0-7)",
          items: [
            { value: "0", state: "default" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
          ],
        },
        { type: "variable", id: "v-addr", name: "address", value: "—", state: "default" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "RAM: Random Access Memory — every address is O(1) to read", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "Store the integer 42 at address 3. The CPU goes directly to address 3 — no scanning needed. This is the magic of random access.",
      elements: [
        {
          type: "array",
          id: "ram",
          label: "RAM (addresses 0-7)",
          items: [
            { value: "0", state: "default" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
            { value: "42", state: "active" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
          ],
        },
        { type: "variable", id: "v-addr", name: "address", value: "3", state: "active" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "RAM: Random Access Memory — every address is O(1) to read", kind: "info" },
            { text: "WRITE ram[3] = 42", kind: "swap" },
          ],
        },
      ],
    },
    {
      message:
        "Store more values. Integers typically use 4 bytes each. An array of 3 integers starting at address 0 uses addresses 0, 1, 2 (simplified to 1 slot per int here).",
      elements: [
        {
          type: "array",
          id: "ram",
          label: "RAM (addresses 0-7)",
          items: [
            { value: "10", state: "done" },
            { value: "20", state: "done" },
            { value: "30", state: "done" },
            { value: "42", state: "active" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
          ],
        },
        { type: "variable", id: "v-addr", name: "address", value: "3", state: "active" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "WRITE ram[3] = 42", kind: "swap" },
            { text: "WRITE ram[0] = 10, ram[1] = 20, ram[2] = 30", kind: "swap" },
            { text: "Array at base=0: address = base + index", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "To read arr[2]: compute address = base(0) + index(2) = 2. One multiplication + one addition = O(1). This formula is why array access is instant.",
      elements: [
        {
          type: "array",
          id: "ram",
          label: "RAM (addresses 0-7)",
          items: [
            { value: "10", state: "done" },
            { value: "20", state: "done" },
            { value: "30", state: "highlight" },
            { value: "42", state: "default" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
            { value: "0", state: "default" },
          ],
        },
        { type: "variable", id: "v-addr", name: "address", value: "0+2=2", state: "highlight" },
        { type: "variable", id: "v-val", name: "value", value: "30", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Array at base=0: address = base + index", kind: "info" },
            { text: "READ arr[2] → address = 0 + 2 = 2 → value = 30", kind: "compare" },
            { text: "O(1) access — same speed for arr[0] or arr[1000000]", kind: "info" },
          ],
        },
      ],
    },
  ],
};

const staticArrayViz: VisualizationBlock = {
  type: "array",
  initialState: {},
  steps: [
    {
      message:
        "Static array of size 5: [10, 20, 30, 40, _]. Size=4, capacity=5. Read/Write any index in O(1) via the address formula.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Static Array (capacity 5)",
          items: [
            { value: "10", state: "done" },
            { value: "20", state: "done" },
            { value: "30", state: "done" },
            { value: "40", state: "done" },
            { value: "_", state: "default" },
          ],
        },
        { type: "variable", id: "v-size", name: "size", value: "4", state: "default" },
        { type: "variable", id: "v-cap", name: "capacity", value: "5", state: "default" },
        {
          type: "log",
          id: "log",
          lines: [{ text: "arr = [10, 20, 30, 40, _]. Read/Write O(1)", kind: "info" }],
        },
      ],
    },
    {
      message:
        "INSERT 25 at index 2: Must shift elements [2..3] one position RIGHT to make room. This is O(n) — the costly part of arrays.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Before insert at index 2",
          items: [
            { value: "10", state: "done" },
            { value: "20", state: "done" },
            { value: "30", state: "comparing" },
            { value: "40", state: "comparing" },
            { value: "_", state: "default" },
          ],
        },
        { type: "variable", id: "v-idx", name: "insertAt", value: "2", state: "active" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Insert 25 at index 2", kind: "call" },
            { text: "Must shift arr[2..3] → arr[3..4]", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "Shift right (work backwards!): arr[4]=arr[3]=40, arr[3]=arr[2]=30. Then arr[2]=25. Done! Shifted 2 elements.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "After insert",
          items: [
            { value: "10", state: "done" },
            { value: "20", state: "done" },
            { value: "25", state: "highlight" },
            { value: "30", state: "active" },
            { value: "40", state: "active" },
          ],
        },
        {
          type: "variable",
          id: "v-size",
          name: "size",
          value: "5",
          state: "error",
          description: "FULL!",
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "arr[4]=40, arr[3]=30, arr[2]=25 ✓", kind: "swap" },
            { text: "Insert-in-middle: O(n) shifts", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "Array is FULL (size==capacity==5). Cannot insert more — the static array limitation. Now DELETE index 1 (value 20)...",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Static Array — FULL",
          items: [
            { value: "10", state: "done" },
            { value: "20", state: "error" },
            { value: "25", state: "comparing" },
            { value: "30", state: "comparing" },
            { value: "40", state: "comparing" },
          ],
        },
        { type: "variable", id: "v-idx", name: "deleteAt", value: "1", state: "active" },
        {
          type: "log",
          id: "log",
          lines: [{ text: "Delete arr[1]=20. Shift arr[2..4] LEFT", kind: "call" }],
        },
      ],
    },
    {
      message:
        "Shift left: arr[1]=25, arr[2]=30, arr[3]=40. Size→4. Delete=O(n) worst, O(1) if last element.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "After delete",
          items: [
            { value: "10", state: "done" },
            { value: "25", state: "active" },
            { value: "30", state: "active" },
            { value: "40", state: "active" },
            { value: "_", state: "default" },
          ],
        },
        { type: "variable", id: "v-size", name: "size", value: "4", state: "done" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Shifted 3 elements left ✓", kind: "swap" },
            { text: "Summary: Read/Write O(1), Insert/Delete O(n)", kind: "info" },
          ],
        },
      ],
    },
  ],
};

const dynamicArrayViz: VisualizationBlock = {
  type: "array",
  initialState: {},
  steps: [
    {
      message:
        "Dynamic array starts with capacity 2, size 0. The array owns a fixed block of memory, but tracks how much is actually used.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Dynamic Array",
          items: [
            { value: "_", state: "default" },
            { value: "_", state: "default" },
          ],
        },
        { type: "variable", id: "v-size", name: "size", value: "0", state: "default" },
        { type: "variable", id: "v-cap", name: "capacity", value: "2", state: "default" },
        {
          type: "log",
          id: "log",
          lines: [{ text: "Created dynamic array — capacity=2, size=0", kind: "info" }],
        },
      ],
    },
    {
      message:
        "push(5): Place 5 at index 0 (= size). Increment size to 1. Room left — no resize needed.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Dynamic Array",
          items: [
            { value: "5", state: "active" },
            { value: "_", state: "default" },
          ],
        },
        { type: "variable", id: "v-size", name: "size", value: "1", state: "active" },
        { type: "variable", id: "v-cap", name: "capacity", value: "2", state: "default" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Created dynamic array — capacity=2, size=0", kind: "info" },
            { text: "push(5) → arr[0] = 5, size = 1", kind: "swap" },
          ],
        },
      ],
    },
    {
      message:
        "push(8): Place 8 at index 1. size=2 now equals capacity=2. The array is FULL. Next push will trigger a resize.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Dynamic Array",
          items: [
            { value: "5", state: "done" },
            { value: "8", state: "active" },
          ],
        },
        { type: "variable", id: "v-size", name: "size", value: "2", state: "error" },
        {
          type: "variable",
          id: "v-cap",
          name: "capacity",
          value: "2",
          state: "error",
          description: "FULL!",
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "push(5) → arr[0] = 5, size = 1", kind: "swap" },
            { text: "push(8) → arr[1] = 8, size = 2", kind: "swap" },
            { text: "⚠ size == capacity — array is full!", kind: "compare" },
          ],
        },
      ],
    },
    {
      message:
        "push(3): size == capacity! Allocate NEW array with 2x capacity (4). Copy all elements over. This is O(n) but happens rarely.",
      elements: [
        {
          type: "array",
          id: "old",
          label: "Old Array (being copied)",
          items: [
            { value: "5", state: "comparing" },
            { value: "8", state: "comparing" },
          ],
        },
        {
          type: "array",
          id: "arr",
          label: "New Array (capacity 4)",
          items: [
            { value: "5", state: "done" },
            { value: "8", state: "done" },
            { value: "_", state: "default" },
            { value: "_", state: "default" },
          ],
        },
        { type: "variable", id: "v-size", name: "size", value: "2", state: "comparing" },
        {
          type: "variable",
          id: "v-cap",
          name: "capacity",
          value: "2→4",
          state: "highlight",
          description: "DOUBLED!",
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "⚠ size == capacity — array is full!", kind: "compare" },
            { text: "RESIZE: allocate new array of capacity 4", kind: "call" },
            { text: "COPY: old[0..1] → new[0..1]", kind: "swap" },
          ],
        },
      ],
    },
    {
      message:
        "Now place 3 at index 2 in the new array. size=3, capacity=4. The old array is freed. Amortized O(1) per push because doubling halves the resize frequency.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Dynamic Array (capacity 4)",
          items: [
            { value: "5", state: "done" },
            { value: "8", state: "done" },
            { value: "3", state: "active" },
            { value: "_", state: "default" },
          ],
        },
        { type: "variable", id: "v-size", name: "size", value: "3", state: "active" },
        { type: "variable", id: "v-cap", name: "capacity", value: "4", state: "done" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "RESIZE: allocate new array of capacity 4", kind: "call" },
            { text: "COPY: old[0..1] → new[0..1]", kind: "swap" },
            { text: "push(3) → arr[2] = 3, size = 3", kind: "swap" },
            { text: "Amortized O(1): resize cost spread over many pushes", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "push(7), push(1): size reaches 5 > capacity 4 → double again to 8. Pattern: 2→4→8→16→... Each doubling copies n items but then gets n free pushes.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Dynamic Array (capacity 8)",
          items: [
            { value: "5", state: "done" },
            { value: "8", state: "done" },
            { value: "3", state: "done" },
            { value: "7", state: "done" },
            { value: "1", state: "active" },
            { value: "_", state: "default" },
            { value: "_", state: "default" },
            { value: "_", state: "default" },
          ],
        },
        { type: "variable", id: "v-size", name: "size", value: "5", state: "active" },
        { type: "variable", id: "v-cap", name: "capacity", value: "8", state: "done" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "push(7) → arr[3] = 7, size = 4 (full again!)", kind: "swap" },
            { text: "RESIZE: capacity 4 → 8", kind: "call" },
            { text: "push(1) → arr[4] = 1, size = 5", kind: "swap" },
            { text: "Total: 5 pushes, 2 resizes (copied 2 + 4 = 6 items)", kind: "info" },
            { text: "Amortized cost per push ≈ 6/5 = O(1)", kind: "info" },
          ],
        },
      ],
    },
  ],
};

const stackViz: VisualizationBlock = {
  type: "array",
  initialState: {},
  steps: [
    {
      message:
        "A stack is LIFO: Last In, First Out. Think of a stack of plates — you can only add/remove from the top. Two operations: push (add to top) and pop (remove from top).",
      elements: [
        {
          type: "array",
          id: "stack",
          label: "Stack (bottom → top)",
          items: [],
          direction: "horizontal",
        },
        {
          type: "variable",
          id: "v-top",
          name: "top",
          value: "-1",
          state: "default",
          description: "empty",
        },
        {
          type: "log",
          id: "log",
          lines: [{ text: "Stack created — empty, top = -1", kind: "info" }],
        },
      ],
    },
    {
      message: "push(10): Place 10 on top. top moves from -1 to 0.",
      elements: [
        {
          type: "array",
          id: "stack",
          label: "Stack (bottom → top)",
          items: [{ value: "10", state: "active" }],
          direction: "horizontal",
        },
        { type: "variable", id: "v-top", name: "top", value: "0", state: "active" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Stack created — empty, top = -1", kind: "info" },
            { text: "push(10) → top = 0", kind: "call" },
          ],
        },
      ],
    },
    {
      message:
        "push(20), push(30): Each goes on top. 30 is now the top element. We can only see/remove 30.",
      elements: [
        {
          type: "array",
          id: "stack",
          label: "Stack (bottom → top)",
          items: [
            { value: "10", state: "done" },
            { value: "20", state: "done" },
            { value: "30", state: "active" },
          ],
          direction: "horizontal",
        },
        { type: "variable", id: "v-top", name: "top", value: "2", state: "active" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "push(10) → top = 0", kind: "call" },
            { text: "push(20) → top = 1", kind: "call" },
            { text: "push(30) → top = 2", kind: "call" },
          ],
        },
      ],
    },
    {
      message:
        "pop(): Remove 30 (the top). Returns 30. top decreases to 1. Now 20 is on top. Both push and pop are O(1).",
      elements: [
        {
          type: "array",
          id: "stack",
          label: "Stack (bottom → top)",
          items: [
            { value: "10", state: "done" },
            { value: "20", state: "active" },
          ],
          direction: "horizontal",
        },
        { type: "variable", id: "v-top", name: "top", value: "1", state: "active" },
        { type: "variable", id: "v-popped", name: "popped", value: "30", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "push(20) → top = 1", kind: "call" },
            { text: "push(30) → top = 2", kind: "call" },
            { text: "pop() → returns 30, top = 1", kind: "return" },
            { text: "push/pop are O(1) — just move the top pointer", kind: "info" },
          ],
        },
      ],
    },
  ],
};

// ─── Sliding Window Fixed ────────────────────────────────────────────
const slidingWindowFixedViz: VisualizationBlock = {
  type: "array",
  initialState: {},
  steps: [
    {
      message:
        "Problem: Find max sum of any k=3 consecutive elements in [2, 1, 5, 1, 3, 2]. Brute force: O(n*k) — recalculate sum for every window. Can we do O(n)?",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Array",
          items: [
            { value: "2", state: "default" },
            { value: "1", state: "default" },
            { value: "5", state: "default" },
            { value: "1", state: "default" },
            { value: "3", state: "default" },
            { value: "2", state: "default" },
          ],
        },
        { type: "variable", id: "v-k", name: "k", value: "3", state: "default" },
        { type: "variable", id: "v-sum", name: "windowSum", value: "—", state: "default" },
        { type: "variable", id: "v-max", name: "maxSum", value: "—", state: "default" },
        {
          type: "log",
          id: "log",
          lines: [
            {
              text: "Sliding Window: instead of recalculating, SLIDE the window right",
              kind: "info",
            },
          ],
        },
      ],
    },
    {
      message: "First window [0..2]: sum = 2+1+5 = 8. This is our initial maxSum.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Array",
          items: [
            { value: "2", state: "active" },
            { value: "1", state: "active" },
            { value: "5", state: "active" },
            { value: "1", state: "default" },
            { value: "3", state: "default" },
            { value: "2", state: "default" },
          ],
        },
        { type: "variable", id: "v-k", name: "k", value: "3", state: "default" },
        { type: "variable", id: "v-sum", name: "windowSum", value: "8", state: "active" },
        { type: "variable", id: "v-max", name: "maxSum", value: "8", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            {
              text: "Sliding Window: instead of recalculating, SLIDE the window right",
              kind: "info",
            },
            { text: "Window [0..2]: 2+1+5 = 8, maxSum = 8", kind: "compare" },
          ],
        },
      ],
    },
    {
      message:
        "Slide right: subtract arr[0]=2 (leaves window), add arr[3]=1 (enters window). sum = 8-2+1 = 7. No new max.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Array",
          items: [
            { value: "2", state: "error" },
            { value: "1", state: "active" },
            { value: "5", state: "active" },
            { value: "1", state: "comparing" },
            { value: "3", state: "default" },
            { value: "2", state: "default" },
          ],
        },
        { type: "variable", id: "v-k", name: "k", value: "3", state: "default" },
        { type: "variable", id: "v-sum", name: "windowSum", value: "7", state: "active" },
        { type: "variable", id: "v-max", name: "maxSum", value: "8", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Window [0..2]: 2+1+5 = 8, maxSum = 8", kind: "compare" },
            { text: "Slide: -arr[0](2) +arr[3](1) → sum = 7", kind: "swap" },
            { text: "7 < 8 → maxSum stays 8", kind: "compare" },
          ],
        },
      ],
    },
    {
      message:
        "Slide again: subtract arr[1]=1, add arr[4]=3. sum = 7-1+3 = 9. New max! maxSum = 9.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Array",
          items: [
            { value: "2", state: "default" },
            { value: "1", state: "error" },
            { value: "5", state: "active" },
            { value: "1", state: "active" },
            { value: "3", state: "comparing" },
            { value: "2", state: "default" },
          ],
        },
        { type: "variable", id: "v-k", name: "k", value: "3", state: "default" },
        { type: "variable", id: "v-sum", name: "windowSum", value: "9", state: "highlight" },
        { type: "variable", id: "v-max", name: "maxSum", value: "9", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Slide: -arr[0](2) +arr[3](1) → sum = 7", kind: "swap" },
            { text: "Slide: -arr[1](1) +arr[4](3) → sum = 9", kind: "swap" },
            { text: "9 > 8 → NEW maxSum = 9 ✓", kind: "compare" },
          ],
        },
      ],
    },
    {
      message:
        "Final slide: subtract arr[2]=5, add arr[5]=2. sum = 9-5+2 = 6. Done! maxSum = 9 from window [2,3,4] = [5,1,3]. Total: O(n) with one pass.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Array",
          items: [
            { value: "2", state: "default" },
            { value: "1", state: "default" },
            { value: "5", state: "error" },
            { value: "1", state: "active" },
            { value: "3", state: "active" },
            { value: "2", state: "comparing" },
          ],
        },
        { type: "variable", id: "v-k", name: "k", value: "3", state: "default" },
        { type: "variable", id: "v-sum", name: "windowSum", value: "6", state: "default" },
        { type: "variable", id: "v-max", name: "maxSum", value: "9", state: "done" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Slide: -arr[1](1) +arr[4](3) → sum = 9", kind: "swap" },
            { text: "Slide: -arr[2](5) +arr[5](2) → sum = 6", kind: "swap" },
            { text: "✅ Done! maxSum = 9 from subarray [5,1,3]", kind: "info" },
            { text: "O(n) — each element enters and leaves the window exactly once", kind: "info" },
          ],
        },
      ],
    },
  ],
};

// ─── Two Pointers ────────────────────────────────────────────────────
const twoPointersViz: VisualizationBlock = {
  type: "array",
  initialState: {},
  steps: [
    {
      message:
        "Two Sum II: In sorted array [1, 3, 4, 5, 7, 11], find two numbers that sum to 9. Left pointer at start, right pointer at end.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Sorted Array",
          items: [
            { value: "1", state: "active" },
            { value: "3", state: "default" },
            { value: "4", state: "default" },
            { value: "5", state: "default" },
            { value: "7", state: "default" },
            { value: "11", state: "active" },
          ],
        },
        { type: "variable", id: "v-l", name: "left", value: "0", state: "active" },
        { type: "variable", id: "v-r", name: "right", value: "5", state: "active" },
        { type: "variable", id: "v-sum", name: "sum", value: "12", state: "default" },
        { type: "variable", id: "v-target", name: "target", value: "9", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "arr[0]+arr[5] = 1+11 = 12", kind: "compare" },
            { text: "12 > 9 → sum too big, move right pointer LEFT", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "sum=12 > target=9. Too big! Since array is sorted, moving right pointer left decreases the sum. right: 5→4.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Sorted Array",
          items: [
            { value: "1", state: "active" },
            { value: "3", state: "default" },
            { value: "4", state: "default" },
            { value: "5", state: "default" },
            { value: "7", state: "active" },
            { value: "11", state: "visited" },
          ],
        },
        { type: "variable", id: "v-l", name: "left", value: "0", state: "active" },
        { type: "variable", id: "v-r", name: "right", value: "4", state: "active" },
        { type: "variable", id: "v-sum", name: "sum", value: "8", state: "default" },
        { type: "variable", id: "v-target", name: "target", value: "9", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "12 > 9 → move right LEFT", kind: "info" },
            { text: "arr[0]+arr[4] = 1+7 = 8", kind: "compare" },
            { text: "8 < 9 → sum too small, move left pointer RIGHT", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "sum=8 < target=9. Too small! Move left pointer right to increase the sum. left: 0→1.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Sorted Array",
          items: [
            { value: "1", state: "visited" },
            { value: "3", state: "active" },
            { value: "4", state: "default" },
            { value: "5", state: "default" },
            { value: "7", state: "active" },
            { value: "11", state: "visited" },
          ],
        },
        { type: "variable", id: "v-l", name: "left", value: "1", state: "active" },
        { type: "variable", id: "v-r", name: "right", value: "4", state: "active" },
        { type: "variable", id: "v-sum", name: "sum", value: "10", state: "default" },
        { type: "variable", id: "v-target", name: "target", value: "9", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "8 < 9 → move left RIGHT", kind: "info" },
            { text: "arr[1]+arr[4] = 3+7 = 10", kind: "compare" },
            { text: "10 > 9 → sum too big, move right LEFT", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "sum=10 > 9. Move right left. right: 4→3. arr[1]+arr[3] = 3+5 = 8 < 9. Move left right.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Sorted Array",
          items: [
            { value: "1", state: "visited" },
            { value: "3", state: "visited" },
            { value: "4", state: "active" },
            { value: "5", state: "active" },
            { value: "7", state: "visited" },
            { value: "11", state: "visited" },
          ],
        },
        { type: "variable", id: "v-l", name: "left", value: "2", state: "active" },
        { type: "variable", id: "v-r", name: "right", value: "3", state: "active" },
        { type: "variable", id: "v-sum", name: "sum", value: "9", state: "highlight" },
        { type: "variable", id: "v-target", name: "target", value: "9", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "10 > 9 → move right LEFT", kind: "info" },
            { text: "arr[1]+arr[3] = 3+5 = 8 < 9 → move left RIGHT", kind: "compare" },
            { text: "arr[2]+arr[3] = 4+5 = 9 ✅ FOUND!", kind: "return" },
          ],
        },
      ],
    },
    {
      message:
        "Found it! arr[2]+arr[3] = 4+5 = 9. O(n) with two pointers vs O(n²) brute force. The key insight: sorted array lets us decide which pointer to move.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Sorted Array",
          items: [
            { value: "1", state: "visited" },
            { value: "3", state: "visited" },
            { value: "4", state: "done" },
            { value: "5", state: "done" },
            { value: "7", state: "visited" },
            { value: "11", state: "visited" },
          ],
        },
        { type: "variable", id: "v-l", name: "left", value: "2", state: "done" },
        { type: "variable", id: "v-r", name: "right", value: "3", state: "done" },
        { type: "variable", id: "v-sum", name: "sum", value: "9", state: "done" },
        { type: "variable", id: "v-target", name: "target", value: "9", state: "done" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "arr[2]+arr[3] = 4+5 = 9 ✅ FOUND!", kind: "return" },
            { text: "O(n) time, O(1) space — just two pointers", kind: "info" },
            { text: "Pattern: too big→move right, too small→move left", kind: "info" },
          ],
        },
      ],
    },
  ],
};

// ─── Prefix Sums ─────────────────────────────────────────────────────
const prefixSumViz: VisualizationBlock = {
  type: "array",
  initialState: {},
  steps: [
    {
      message:
        "Problem: Given arr = [3, 1, 4, 1, 5], answer many range-sum queries. Brute force: O(n) per query. With prefix sums: O(1) per query after O(n) preprocessing.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Original Array",
          items: [
            { value: "3", state: "default" },
            { value: "1", state: "default" },
            { value: "4", state: "default" },
            { value: "1", state: "default" },
            { value: "5", state: "default" },
          ],
        },
        {
          type: "array",
          id: "pfx",
          label: "Prefix Sum (building...)",
          items: [
            { value: "0", state: "active" },
            { value: "?", state: "default" },
            { value: "?", state: "default" },
            { value: "?", state: "default" },
            { value: "?", state: "default" },
            { value: "?", state: "default" },
          ],
        },
        {
          type: "log",
          id: "log",
          lines: [{ text: "prefix[i] = sum of arr[0..i-1]. prefix[0] = 0 always.", kind: "info" }],
        },
      ],
    },
    {
      message:
        "Build prefix: prefix[1]=0+3=3, prefix[2]=3+1=4, prefix[3]=4+4=8, prefix[4]=8+1=9, prefix[5]=9+5=14. Each prefix[i] = sum of all elements before index i.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Original Array",
          items: [
            { value: "3", state: "done" },
            { value: "1", state: "done" },
            { value: "4", state: "done" },
            { value: "1", state: "done" },
            { value: "5", state: "done" },
          ],
        },
        {
          type: "array",
          id: "pfx",
          label: "Prefix Sum (complete)",
          items: [
            { value: "0", state: "done" },
            { value: "3", state: "done" },
            { value: "4", state: "done" },
            { value: "8", state: "done" },
            { value: "9", state: "done" },
            { value: "14", state: "done" },
          ],
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "prefix[0] = 0", kind: "info" },
            { text: "prefix[1] = 0+3 = 3", kind: "swap" },
            { text: "prefix[2] = 3+1 = 4", kind: "swap" },
            { text: "prefix[3] = 4+4 = 8", kind: "swap" },
            { text: "prefix[4] = 8+1 = 9", kind: "swap" },
            { text: "prefix[5] = 9+5 = 14", kind: "swap" },
          ],
        },
      ],
    },
    {
      message:
        "Query: sum(1..3) = sum of arr[1]+arr[2]+arr[3] = 1+4+1 = 6. Using prefix: prefix[4] - prefix[1] = 9 - 3 = 6. O(1)!",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Original Array",
          items: [
            { value: "3", state: "default" },
            { value: "1", state: "highlight" },
            { value: "4", state: "highlight" },
            { value: "1", state: "highlight" },
            { value: "5", state: "default" },
          ],
        },
        {
          type: "array",
          id: "pfx",
          label: "Prefix Sum",
          items: [
            { value: "0", state: "default" },
            { value: "3", state: "comparing" },
            { value: "4", state: "default" },
            { value: "8", state: "default" },
            { value: "9", state: "comparing" },
            { value: "14", state: "default" },
          ],
        },
        { type: "variable", id: "v-ans", name: "answer", value: "9-3=6", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Query: sum(1..3) = prefix[4] - prefix[1]", kind: "compare" },
            { text: "= 9 - 3 = 6 ✅", kind: "return" },
            { text: "Formula: sum(l..r) = prefix[r+1] - prefix[l]", kind: "info" },
          ],
        },
      ],
    },
  ],
};

// ─── Linked List ─────────────────────────────────────────────────────
const linkedListViz: VisualizationBlock = {
  type: "graph",
  initialState: {},
  steps: [
    {
      message:
        'A singly linked list: each node stores a value + a "next" pointer to the following node. The last node points to null. Unlike arrays, nodes can be anywhere in RAM.',
      elements: [
        {
          type: "graph",
          id: "ll",
          label: "Singly Linked List",
          layout: "linear",
          nodes: [
            { id: "n1", value: "10", state: "default" },
            { id: "n2", value: "20", state: "default" },
            { id: "n3", value: "30", state: "default" },
          ],
          edges: [
            { source: "n1", target: "n2", label: "next", state: "default", directed: true },
            { source: "n2", target: "n3", label: "next", state: "default", directed: true },
          ],
        },
        { type: "variable", id: "v-head", name: "head", value: "n1", state: "active" },
        { type: "log", id: "log", lines: [{ text: "List: 10 → 20 → 30 → null", kind: "info" }] },
      ],
    },
    {
      message:
        "Insert 15 after node 10: create new node, point new.next to node 20, then point node 10.next to new node. O(1) if we have a reference to the insertion point.",
      elements: [
        {
          type: "graph",
          id: "ll",
          label: "Inserting 15 after 10",
          layout: "linear",
          nodes: [
            { id: "n1", value: "10", state: "active" },
            { id: "new", value: "15", state: "highlight" },
            { id: "n2", value: "20", state: "default" },
            { id: "n3", value: "30", state: "default" },
          ],
          edges: [
            { source: "n1", target: "new", label: "next", state: "active", directed: true },
            { source: "new", target: "n2", label: "next", state: "highlight", directed: true },
            { source: "n2", target: "n3", label: "next", state: "default", directed: true },
          ],
        },
        { type: "variable", id: "v-head", name: "head", value: "n1", state: "active" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Create node(15)", kind: "call" },
            { text: "node(15).next = node(20)", kind: "swap" },
            { text: "node(10).next = node(15)", kind: "swap" },
            { text: "Insert is O(1) — no shifting needed (unlike arrays!)", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "Delete node 20: point node 15.next to node 30, bypassing 20. Node 20 is now unreachable and gets garbage collected. O(1) delete.",
      elements: [
        {
          type: "graph",
          id: "ll",
          label: "After deleting 20",
          layout: "linear",
          nodes: [
            { id: "n1", value: "10", state: "done" },
            { id: "new", value: "15", state: "active" },
            { id: "n3", value: "30", state: "done" },
          ],
          edges: [
            { source: "n1", target: "new", label: "next", state: "done", directed: true },
            { source: "new", target: "n3", label: "next", state: "active", directed: true },
          ],
        },
        { type: "variable", id: "v-head", name: "head", value: "n1", state: "done" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "node(15).next = node(30) — skip node(20)", kind: "swap" },
            { text: "Delete is O(1) — just re-wire pointers", kind: "info" },
            { text: "Trade-off: O(1) insert/delete but O(n) access (no index)", kind: "info" },
          ],
        },
      ],
    },
  ],
};

// ─── Fast & Slow Pointers ────────────────────────────────────────────
const fastSlowViz: VisualizationBlock = {
  type: "graph",
  initialState: {},
  steps: [
    {
      message:
        "Cycle detection: Does this linked list have a cycle? Fast pointer moves 2 steps, slow moves 1. If they meet → cycle exists.",
      elements: [
        {
          type: "graph",
          id: "ll",
          label: "Linked List (with cycle)",
          nodes: [
            { id: "a", value: "1", state: "active", x: 0, y: 50 },
            { id: "b", value: "2", state: "default", x: 80, y: 50 },
            { id: "c", value: "3", state: "default", x: 160, y: 50 },
            { id: "d", value: "4", state: "default", x: 240, y: 50 },
            { id: "e", value: "5", state: "default", x: 240, y: 130 },
            { id: "f", value: "6", state: "default", x: 160, y: 130 },
          ],
          edges: [
            { source: "a", target: "b", state: "default", directed: true },
            { source: "b", target: "c", state: "default", directed: true },
            { source: "c", target: "d", state: "default", directed: true },
            { source: "d", target: "e", state: "default", directed: true },
            { source: "e", target: "f", state: "default", directed: true },
            { source: "f", target: "c", label: "cycle!", state: "error", directed: true },
          ],
        },
        {
          type: "variable",
          id: "v-slow",
          name: "slow",
          value: "node 1",
          state: "active",
          description: "+1 step",
        },
        {
          type: "variable",
          id: "v-fast",
          name: "fast",
          value: "node 1",
          state: "highlight",
          description: "+2 steps",
        },
        { type: "log", id: "log", lines: [{ text: "Start: slow=1, fast=1", kind: "info" }] },
      ],
    },
    {
      message: "Step 1: slow moves to node 2, fast moves to node 3. They haven't met yet.",
      elements: [
        {
          type: "graph",
          id: "ll",
          label: "Linked List (with cycle)",
          nodes: [
            { id: "a", value: "1", state: "visited", x: 0, y: 50 },
            { id: "b", value: "2", state: "active", x: 80, y: 50 },
            { id: "c", value: "3", state: "highlight", x: 160, y: 50 },
            { id: "d", value: "4", state: "default", x: 240, y: 50 },
            { id: "e", value: "5", state: "default", x: 240, y: 130 },
            { id: "f", value: "6", state: "default", x: 160, y: 130 },
          ],
          edges: [
            { source: "a", target: "b", state: "active", directed: true },
            { source: "b", target: "c", state: "default", directed: true },
            { source: "c", target: "d", state: "default", directed: true },
            { source: "d", target: "e", state: "default", directed: true },
            { source: "e", target: "f", state: "default", directed: true },
            { source: "f", target: "c", label: "cycle!", state: "error", directed: true },
          ],
        },
        { type: "variable", id: "v-slow", name: "slow", value: "node 2", state: "active" },
        { type: "variable", id: "v-fast", name: "fast", value: "node 3", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Start: slow=1, fast=1", kind: "info" },
            { text: "Step 1: slow→2, fast→3", kind: "compare" },
          ],
        },
      ],
    },
    {
      message:
        "Step 2: slow→3, fast→5 (jumped 3→4→5). Fast is deep in the cycle. Slow just entered.",
      elements: [
        {
          type: "graph",
          id: "ll",
          label: "Linked List (with cycle)",
          nodes: [
            { id: "a", value: "1", state: "visited", x: 0, y: 50 },
            { id: "b", value: "2", state: "visited", x: 80, y: 50 },
            { id: "c", value: "3", state: "active", x: 160, y: 50 },
            { id: "d", value: "4", state: "visited", x: 240, y: 50 },
            { id: "e", value: "5", state: "highlight", x: 240, y: 130 },
            { id: "f", value: "6", state: "default", x: 160, y: 130 },
          ],
          edges: [
            { source: "a", target: "b", state: "visited", directed: true },
            { source: "b", target: "c", state: "visited", directed: true },
            { source: "c", target: "d", state: "default", directed: true },
            { source: "d", target: "e", state: "default", directed: true },
            { source: "e", target: "f", state: "default", directed: true },
            { source: "f", target: "c", label: "cycle!", state: "error", directed: true },
          ],
        },
        { type: "variable", id: "v-slow", name: "slow", value: "node 3", state: "active" },
        { type: "variable", id: "v-fast", name: "fast", value: "node 5", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Step 1: slow→2, fast→3", kind: "compare" },
            { text: "Step 2: slow→3, fast→5", kind: "compare" },
          ],
        },
      ],
    },
    {
      message: "Step 3: slow→4, fast→5→6→3 (fast wraps around the cycle!). fast is now at node 3.",
      elements: [
        {
          type: "graph",
          id: "ll",
          label: "Linked List (with cycle)",
          nodes: [
            { id: "a", value: "1", state: "visited", x: 0, y: 50 },
            { id: "b", value: "2", state: "visited", x: 80, y: 50 },
            { id: "c", value: "3", state: "highlight", x: 160, y: 50 },
            { id: "d", value: "4", state: "active", x: 240, y: 50 },
            { id: "e", value: "5", state: "visited", x: 240, y: 130 },
            { id: "f", value: "6", state: "visited", x: 160, y: 130 },
          ],
          edges: [
            { source: "a", target: "b", state: "visited", directed: true },
            { source: "b", target: "c", state: "visited", directed: true },
            { source: "c", target: "d", state: "default", directed: true },
            { source: "d", target: "e", state: "default", directed: true },
            { source: "e", target: "f", state: "visited", directed: true },
            { source: "f", target: "c", label: "cycle!", state: "highlight", directed: true },
          ],
        },
        { type: "variable", id: "v-slow", name: "slow", value: "node 4", state: "active" },
        { type: "variable", id: "v-fast", name: "fast", value: "node 3", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Step 2: slow→3, fast→5", kind: "compare" },
            { text: "Step 3: slow→4, fast→3 (wrapped around cycle)", kind: "compare" },
          ],
        },
      ],
    },
    {
      message:
        "Step 4: slow→5, fast→3→4→5. THEY MEET at node 5! Cycle confirmed. The fast pointer always catches the slow in a cycle because the gap shrinks by 1 each step.",
      elements: [
        {
          type: "graph",
          id: "ll",
          label: "CYCLE DETECTED!",
          nodes: [
            { id: "a", value: "1", state: "visited", x: 0, y: 50 },
            { id: "b", value: "2", state: "visited", x: 80, y: 50 },
            { id: "c", value: "3", state: "visited", x: 160, y: 50 },
            { id: "d", value: "4", state: "visited", x: 240, y: 50 },
            { id: "e", value: "5", state: "done", x: 240, y: 130 },
            { id: "f", value: "6", state: "visited", x: 160, y: 130 },
          ],
          edges: [
            { source: "a", target: "b", state: "visited", directed: true },
            { source: "b", target: "c", state: "visited", directed: true },
            { source: "c", target: "d", state: "visited", directed: true },
            { source: "d", target: "e", state: "visited", directed: true },
            { source: "e", target: "f", state: "visited", directed: true },
            { source: "f", target: "c", label: "cycle!", state: "done", directed: true },
          ],
        },
        { type: "variable", id: "v-slow", name: "slow", value: "node 5", state: "done" },
        { type: "variable", id: "v-fast", name: "fast", value: "node 5", state: "done" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Step 3: slow→4, fast→3", kind: "compare" },
            { text: "Step 4: slow→5, fast→5 — THEY MEET!", kind: "return" },
            { text: "✅ Cycle detected at node 5. O(n) time, O(1) space.", kind: "info" },
          ],
        },
      ],
    },
  ],
};

// ─── Insertion Sort ──────────────────────────────────────────────────
const insertionSortViz: VisualizationBlock = {
  type: "array",
  initialState: {},
  steps: [
    {
      message:
        "Insertion Sort on [5, 3, 8, 1, 2]. Think: pick up each card from unsorted and insert it into the right place in the sorted portion.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Array",
          items: [
            { value: "5", state: "done" },
            { value: "3", state: "default" },
            { value: "8", state: "default" },
            { value: "1", state: "default" },
            { value: "2", state: "default" },
          ],
        },
        { type: "variable", id: "v-key", name: "key", value: "—", state: "default" },
        { type: "variable", id: "v-i", name: "i", value: "1", state: "default" },
        {
          type: "log",
          id: "log",
          lines: [{ text: "Sorted portion: [5]. Pick up arr[1]=3.", kind: "info" }],
        },
      ],
    },
    {
      message:
        "key=3: Compare with 5. 3 < 5, so shift 5 right, insert 3 at position 0. Sorted: [3, 5].",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Array",
          items: [
            { value: "3", state: "highlight" },
            { value: "5", state: "done" },
            { value: "8", state: "default" },
            { value: "1", state: "default" },
            { value: "2", state: "default" },
          ],
        },
        { type: "variable", id: "v-key", name: "key", value: "3", state: "highlight" },
        { type: "variable", id: "v-i", name: "i", value: "1", state: "active" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "key=3: 3 < 5 → shift 5 right", kind: "compare" },
            { text: "Insert 3 at position 0", kind: "swap" },
          ],
        },
      ],
    },
    {
      message: "key=8: Compare with 5. 8 > 5, already in place. Sorted: [3, 5, 8].",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Array",
          items: [
            { value: "3", state: "done" },
            { value: "5", state: "done" },
            { value: "8", state: "highlight" },
            { value: "1", state: "default" },
            { value: "2", state: "default" },
          ],
        },
        { type: "variable", id: "v-key", name: "key", value: "8", state: "highlight" },
        { type: "variable", id: "v-i", name: "i", value: "2", state: "active" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Insert 3 at position 0", kind: "swap" },
            { text: "key=8: 8 > 5 → already in place ✓", kind: "compare" },
          ],
        },
      ],
    },
    {
      message:
        "key=1: Compare with 8, 5, 3. Shift all right. Insert 1 at position 0. Sorted: [1, 3, 5, 8]. This is the worst case — shift everything.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Array",
          items: [
            { value: "1", state: "highlight" },
            { value: "3", state: "done" },
            { value: "5", state: "done" },
            { value: "8", state: "done" },
            { value: "2", state: "default" },
          ],
        },
        { type: "variable", id: "v-key", name: "key", value: "1", state: "highlight" },
        { type: "variable", id: "v-i", name: "i", value: "3", state: "active" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "key=1: 1 < 8 → shift 8", kind: "compare" },
            { text: "1 < 5 → shift 5", kind: "compare" },
            { text: "1 < 3 → shift 3", kind: "compare" },
            { text: "Insert 1 at position 0", kind: "swap" },
          ],
        },
      ],
    },
    {
      message:
        "key=2: Compare with 8, 5, 3. Shift those. 2 > 1, stop. Insert at position 1. Final: [1, 2, 3, 5, 8]. O(n²) worst case, but O(n) if nearly sorted.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Array (sorted!)",
          items: [
            { value: "1", state: "done" },
            { value: "2", state: "done" },
            { value: "3", state: "done" },
            { value: "5", state: "done" },
            { value: "8", state: "done" },
          ],
        },
        { type: "variable", id: "v-key", name: "key", value: "2", state: "done" },
        { type: "variable", id: "v-i", name: "i", value: "4", state: "done" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "key=2: 2 < 8, 2 < 5, 2 < 3 → shift", kind: "compare" },
            { text: "2 > 1 → STOP, insert 2 at pos 1", kind: "swap" },
            { text: "✅ Sorted! [1, 2, 3, 5, 8]", kind: "info" },
            { text: "O(n²) worst, O(n) best (already sorted)", kind: "info" },
          ],
        },
      ],
    },
  ],
};

// ─── Merge Sort ──────────────────────────────────────────────────────
const mergeSortViz: VisualizationBlock = {
  type: "array",
  initialState: {},
  steps: [
    {
      message:
        "Merge Sort on [38, 27, 43, 3]. Step 1: DIVIDE — split the array in half repeatedly until each piece has 1 element (which is trivially sorted).",
      elements: [
        {
          type: "array",
          id: "a0",
          label: "Original",
          items: [
            { value: "38", state: "default" },
            { value: "27", state: "default" },
            { value: "43", state: "default" },
            { value: "3", state: "default" },
          ],
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "mergeSort([38, 27, 43, 3])", kind: "call" },
            { text: "Split → [38, 27] and [43, 3]", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "Split further: [38, 27] → [38] and [27]. [43, 3] → [43] and [3]. Each has 1 element = already sorted. Now MERGE upward.",
      elements: [
        {
          type: "array",
          id: "a1",
          label: "Left half",
          items: [
            { value: "38", state: "active" },
            { value: "27", state: "active" },
          ],
        },
        {
          type: "array",
          id: "a2",
          label: "Right half",
          items: [
            { value: "43", state: "comparing" },
            { value: "3", state: "comparing" },
          ],
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "mergeSort([38, 27]) → split → [38], [27]", kind: "call" },
            { text: "mergeSort([43, 3]) → split → [43], [3]", kind: "call" },
            { text: "Base case: single elements are sorted", kind: "return" },
          ],
        },
      ],
    },
    {
      message:
        "MERGE [38] and [27]: Compare 38 vs 27. 27 < 38 → take 27 first, then 38. Result: [27, 38].",
      elements: [
        {
          type: "array",
          id: "a1",
          label: "Merging left pair",
          items: [
            { value: "27", state: "done" },
            { value: "38", state: "done" },
          ],
        },
        {
          type: "array",
          id: "a2",
          label: "Right half (waiting)",
          items: [
            { value: "43", state: "default" },
            { value: "3", state: "default" },
          ],
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "merge([38], [27]): compare 38 vs 27", kind: "compare" },
            { text: "27 < 38 → take 27 first → [27, 38]", kind: "swap" },
          ],
        },
      ],
    },
    {
      message:
        "MERGE [43] and [3]: 3 < 43 → take 3 first. Result: [3, 43]. Now merge the two sorted halves.",
      elements: [
        {
          type: "array",
          id: "a1",
          label: "Left sorted",
          items: [
            { value: "27", state: "done" },
            { value: "38", state: "done" },
          ],
        },
        {
          type: "array",
          id: "a2",
          label: "Right sorted",
          items: [
            { value: "3", state: "done" },
            { value: "43", state: "done" },
          ],
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "merge([43], [3]): 3 < 43 → [3, 43]", kind: "swap" },
            { text: "Now merge [27,38] with [3,43]", kind: "call" },
          ],
        },
      ],
    },
    {
      message:
        "FINAL MERGE: [27,38] vs [3,43]. Compare heads: 3<27→take 3. Then 27<43→take 27. Then 38<43→take 38. Then take 43. Result: [3, 27, 38, 43].",
      elements: [
        {
          type: "array",
          id: "a0",
          label: "Final sorted array",
          items: [
            { value: "3", state: "done" },
            { value: "27", state: "done" },
            { value: "38", state: "done" },
            { value: "43", state: "done" },
          ],
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "merge([27,38], [3,43]):", kind: "call" },
            { text: "3 < 27 → take 3", kind: "compare" },
            { text: "27 < 43 → take 27", kind: "compare" },
            { text: "38 < 43 → take 38", kind: "compare" },
            { text: "take 43 → [3, 27, 38, 43]", kind: "swap" },
            { text: "✅ O(n log n) always — divide in half (log n), merge in O(n)", kind: "info" },
          ],
        },
      ],
    },
  ],
};

// ─── Binary Search ───────────────────────────────────────────────────
const binarySearchViz: VisualizationBlock = {
  type: "array",
  initialState: {},
  steps: [
    {
      message:
        "Binary Search: Find target=7 in sorted array [1, 3, 5, 7, 9, 11, 13]. Set lo=0, hi=6, mid=3.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Sorted Array",
          items: [
            { value: "1", state: "default" },
            { value: "3", state: "default" },
            { value: "5", state: "default" },
            { value: "7", state: "comparing" },
            { value: "9", state: "default" },
            { value: "11", state: "default" },
            { value: "13", state: "default" },
          ],
        },
        { type: "variable", id: "v-lo", name: "lo", value: "0", state: "active" },
        { type: "variable", id: "v-hi", name: "hi", value: "6", state: "active" },
        { type: "variable", id: "v-mid", name: "mid", value: "3", state: "comparing" },
        { type: "variable", id: "v-target", name: "target", value: "7", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "lo=0, hi=6, mid = (0+6)/2 = 3", kind: "info" },
            { text: "arr[3] = 7, target = 7", kind: "compare" },
          ],
        },
      ],
    },
    {
      message:
        "arr[mid]=7 == target=7. FOUND IT on the very first check! But let's show what happens when we don't find it immediately...",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Sorted Array",
          items: [
            { value: "1", state: "default" },
            { value: "3", state: "default" },
            { value: "5", state: "default" },
            { value: "7", state: "done" },
            { value: "9", state: "default" },
            { value: "11", state: "default" },
            { value: "13", state: "default" },
          ],
        },
        { type: "variable", id: "v-lo", name: "lo", value: "0", state: "done" },
        { type: "variable", id: "v-hi", name: "hi", value: "6", state: "done" },
        { type: "variable", id: "v-mid", name: "mid", value: "3", state: "done" },
        { type: "variable", id: "v-target", name: "target", value: "7", state: "done" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "arr[3]=7 == 7 ✅ FOUND at index 3", kind: "return" },
            { text: "Now let's search for 11 instead to show the full algorithm...", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "New search: target=11. mid=3, arr[3]=7. 7 < 11, so target is in RIGHT half. Set lo=mid+1=4. Search space halved!",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Sorted Array",
          items: [
            { value: "1", state: "visited" },
            { value: "3", state: "visited" },
            { value: "5", state: "visited" },
            { value: "7", state: "visited" },
            { value: "9", state: "active" },
            { value: "11", state: "active" },
            { value: "13", state: "active" },
          ],
        },
        { type: "variable", id: "v-lo", name: "lo", value: "4", state: "active" },
        { type: "variable", id: "v-hi", name: "hi", value: "6", state: "active" },
        { type: "variable", id: "v-mid", name: "mid", value: "5", state: "comparing" },
        { type: "variable", id: "v-target", name: "target", value: "11", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Search for 11: arr[3]=7 < 11 → go RIGHT", kind: "compare" },
            { text: "lo=4, hi=6, mid=(4+6)/2=5", kind: "info" },
            { text: "arr[5]=11, target=11", kind: "compare" },
          ],
        },
      ],
    },
    {
      message:
        "arr[5]=11 == target=11. FOUND at index 5! Only 2 comparisons for 7 elements. Binary search = O(log n). For n=1,000,000 that's only ~20 checks.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Sorted Array",
          items: [
            { value: "1", state: "visited" },
            { value: "3", state: "visited" },
            { value: "5", state: "visited" },
            { value: "7", state: "visited" },
            { value: "9", state: "visited" },
            { value: "11", state: "done" },
            { value: "13", state: "visited" },
          ],
        },
        { type: "variable", id: "v-lo", name: "lo", value: "4", state: "done" },
        { type: "variable", id: "v-hi", name: "hi", value: "6", state: "done" },
        { type: "variable", id: "v-mid", name: "mid", value: "5", state: "done" },
        { type: "variable", id: "v-target", name: "target", value: "11", state: "done" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "arr[5]=11 == 11 ✅ FOUND at index 5", kind: "return" },
            { text: "Only 2 comparisons for 7 elements", kind: "info" },
            { text: "O(log n) — halve search space each step", kind: "info" },
            { text: "n=1,000,000 → only ~20 comparisons!", kind: "info" },
          ],
        },
      ],
    },
  ],
};

// ─── Variable Sliding Window ─────────────────────────────────────────
const variableWindowViz: VisualizationBlock = {
  type: "array",
  initialState: {},
  steps: [
    {
      message:
        'Find longest substring without repeating characters in "abcabcbb". Two pointers: left and right. A hash set tracks chars in the window.',
      elements: [
        {
          type: "array",
          id: "arr",
          label: "String",
          items: [
            { value: "a", state: "active" },
            { value: "b", state: "default" },
            { value: "c", state: "default" },
            { value: "a", state: "default" },
            { value: "b", state: "default" },
            { value: "c", state: "default" },
            { value: "b", state: "default" },
            { value: "b", state: "default" },
          ],
        },
        { type: "variable", id: "v-l", name: "left", value: "0", state: "active" },
        { type: "variable", id: "v-r", name: "right", value: "0", state: "active" },
        { type: "variable", id: "v-best", name: "best", value: "0", state: "default" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Variable window: expand right, shrink left when invalid", kind: "info" },
            { text: "Set = {}, expand right...", kind: "call" },
          ],
        },
      ],
    },
    {
      message: 'Expand: right moves to 2. Window = "abc", all unique. Set = {a,b,c}. best = 3.',
      elements: [
        {
          type: "array",
          id: "arr",
          label: "String",
          items: [
            { value: "a", state: "active" },
            { value: "b", state: "active" },
            { value: "c", state: "active" },
            { value: "a", state: "default" },
            { value: "b", state: "default" },
            { value: "c", state: "default" },
            { value: "b", state: "default" },
            { value: "b", state: "default" },
          ],
        },
        { type: "variable", id: "v-l", name: "left", value: "0", state: "active" },
        { type: "variable", id: "v-r", name: "right", value: "2", state: "active" },
        { type: "variable", id: "v-best", name: "best", value: "3", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: 'Window "abc" — all unique, best = 3', kind: "compare" },
            { text: "Set = {a, b, c}", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        'right=3, char "a" already in set! Window invalid. SHRINK: remove s[left]="a", left=1. Now "bca" is valid again.',
      elements: [
        {
          type: "array",
          id: "arr",
          label: "String",
          items: [
            { value: "a", state: "error" },
            { value: "b", state: "active" },
            { value: "c", state: "active" },
            { value: "a", state: "comparing" },
            { value: "b", state: "default" },
            { value: "c", state: "default" },
            { value: "b", state: "default" },
            { value: "b", state: "default" },
          ],
        },
        { type: "variable", id: "v-l", name: "left", value: "1", state: "active" },
        { type: "variable", id: "v-r", name: "right", value: "3", state: "active" },
        { type: "variable", id: "v-best", name: "best", value: "3", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: 'right=3: "a" in set! → SHRINK', kind: "compare" },
            { text: 'Remove s[0]="a", left=1. Window = "bca"', kind: "swap" },
            { text: "Set = {b, c, a}. best still 3", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        'Continue expanding. right=4: "b" in set → shrink left to 2. right=5: "c" in set → shrink left to 3. Window = "abc" [3..5], best stays 3.',
      elements: [
        {
          type: "array",
          id: "arr",
          label: "String",
          items: [
            { value: "a", state: "visited" },
            { value: "b", state: "visited" },
            { value: "c", state: "visited" },
            { value: "a", state: "active" },
            { value: "b", state: "active" },
            { value: "c", state: "active" },
            { value: "b", state: "default" },
            { value: "b", state: "default" },
          ],
        },
        { type: "variable", id: "v-l", name: "left", value: "3", state: "active" },
        { type: "variable", id: "v-r", name: "right", value: "5", state: "active" },
        { type: "variable", id: "v-best", name: "best", value: "3", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: 'right=4: "b" dup → shrink. right=5: "c" dup → shrink', kind: "swap" },
            { text: 'Window [3..5] = "abc", best = 3', kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        'right=6: "b" dup. Shrink past it. right=7: "b" dup again. Done! Answer = 3 ("abc"). O(n): each char enters and leaves window at most once.',
      elements: [
        {
          type: "array",
          id: "arr",
          label: "String",
          items: [
            { value: "a", state: "visited" },
            { value: "b", state: "visited" },
            { value: "c", state: "visited" },
            { value: "a", state: "visited" },
            { value: "b", state: "visited" },
            { value: "c", state: "visited" },
            { value: "b", state: "done" },
            { value: "b", state: "done" },
          ],
        },
        { type: "variable", id: "v-l", name: "left", value: "7", state: "done" },
        { type: "variable", id: "v-r", name: "right", value: "7", state: "done" },
        { type: "variable", id: "v-best", name: "best", value: "3", state: "done" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "✅ Longest substring without repeating = 3", kind: "return" },
            { text: "O(n): left never goes backward, each char processed 2x max", kind: "info" },
          ],
        },
      ],
    },
  ],
};

// ─── Doubly Linked List ──────────────────────────────────────────────
const doublyLinkedListViz: VisualizationBlock = {
  type: "graph",
  initialState: {},
  steps: [
    {
      message:
        "Doubly linked list: each node has BOTH next and prev pointers. Unlike singly linked lists, we can traverse backwards and delete any node in O(1).",
      elements: [
        {
          type: "graph",
          id: "dll",
          label: "Doubly Linked List",
          layout: "linear",
          nodes: [
            { id: "n1", value: "10", state: "default" },
            { id: "n2", value: "20", state: "default" },
            { id: "n3", value: "30", state: "default" },
          ],
          edges: [
            { source: "n1", target: "n2", label: "next", state: "default", directed: true },
            { source: "n2", target: "n1", label: "prev", state: "default", directed: true },
            { source: "n2", target: "n3", label: "next", state: "default", directed: true },
            { source: "n3", target: "n2", label: "prev", state: "default", directed: true },
          ],
        },
        { type: "variable", id: "v-head", name: "head", value: "10", state: "active" },
        { type: "variable", id: "v-tail", name: "tail", value: "30", state: "active" },
        {
          type: "log",
          id: "log",
          lines: [{ text: "10 ⇄ 20 ⇄ 30. Each node knows both neighbors.", kind: "info" }],
        },
      ],
    },
    {
      message:
        "INSERT 15 after node 10: new.next=20, new.prev=10, 10.next=new, 20.prev=new. Four pointer updates, O(1).",
      elements: [
        {
          type: "graph",
          id: "dll",
          label: "After inserting 15",
          layout: "linear",
          nodes: [
            { id: "n1", value: "10", state: "active" },
            { id: "new", value: "15", state: "highlight" },
            { id: "n2", value: "20", state: "active" },
            { id: "n3", value: "30", state: "default" },
          ],
          edges: [
            { source: "n1", target: "new", label: "next", state: "highlight", directed: true },
            { source: "new", target: "n1", label: "prev", state: "highlight", directed: true },
            { source: "new", target: "n2", label: "next", state: "highlight", directed: true },
            { source: "n2", target: "new", label: "prev", state: "highlight", directed: true },
            { source: "n2", target: "n3", label: "next", state: "default", directed: true },
            { source: "n3", target: "n2", label: "prev", state: "default", directed: true },
          ],
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "new.next=20, new.prev=10", kind: "swap" },
            { text: "10.next=new, 20.prev=new", kind: "swap" },
            { text: "Insert O(1) — just pointer rewiring", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "DELETE node 20: node.prev.next = node.next, node.next.prev = node.prev. Only 2 pointer updates! O(1) — no need to find predecessor.",
      elements: [
        {
          type: "graph",
          id: "dll",
          label: "After deleting 20",
          layout: "linear",
          nodes: [
            { id: "n1", value: "10", state: "done" },
            { id: "new", value: "15", state: "active" },
            { id: "n3", value: "30", state: "done" },
          ],
          edges: [
            { source: "n1", target: "new", label: "next", state: "done", directed: true },
            { source: "new", target: "n1", label: "prev", state: "done", directed: true },
            { source: "new", target: "n3", label: "next", state: "active", directed: true },
            { source: "n3", target: "new", label: "prev", state: "active", directed: true },
          ],
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "15.next = 30, 30.prev = 15 — skip 20", kind: "swap" },
            { text: "✅ Delete O(1) with reference. Key for LRU Cache!", kind: "info" },
          ],
        },
      ],
    },
  ],
};

// ─── Queue ───────────────────────────────────────────────────────────
const queueViz: VisualizationBlock = {
  type: "array",
  initialState: {},
  steps: [
    {
      message:
        "Queue is FIFO: First In, First Out. Like a line at a store. enqueue adds to back, dequeue removes from front.",
      elements: [
        { type: "array", id: "q", label: "Queue (front → back)", items: [] },
        { type: "variable", id: "v-front", name: "front", value: "0", state: "default" },
        { type: "variable", id: "v-rear", name: "rear", value: "-1", state: "default" },
        { type: "log", id: "log", lines: [{ text: "Queue created — empty", kind: "info" }] },
      ],
    },
    {
      message:
        "enqueue(10), enqueue(20), enqueue(30). Elements enter at the back. Front of queue is 10.",
      elements: [
        {
          type: "array",
          id: "q",
          label: "Queue (front → back)",
          items: [
            { value: "10", state: "active" },
            { value: "20", state: "done" },
            { value: "30", state: "done" },
          ],
        },
        {
          type: "variable",
          id: "v-front",
          name: "front",
          value: "10",
          state: "active",
          description: "next out",
        },
        { type: "variable", id: "v-rear", name: "rear", value: "30", state: "done" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "enqueue(10), enqueue(20), enqueue(30)", kind: "call" },
            { text: "Queue: [10, 20, 30]. Front=10", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "dequeue() returns 10 (front). FIFO: whoever entered first leaves first. Now front=20.",
      elements: [
        {
          type: "array",
          id: "q",
          label: "Queue (front → back)",
          items: [
            { value: "20", state: "active" },
            { value: "30", state: "done" },
          ],
        },
        { type: "variable", id: "v-front", name: "front", value: "20", state: "active" },
        { type: "variable", id: "v-dequeued", name: "dequeued", value: "10", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "dequeue() → 10. Queue: [20, 30]", kind: "return" },
            { text: "enqueue/dequeue both O(1) with linked list", kind: "info" },
            { text: "⚠ With array: dequeue is O(n) due to shifting!", kind: "compare" },
          ],
        },
      ],
    },
    {
      message:
        "enqueue(40), dequeue() returns 20. Queue: [30, 40]. Queue is essential for BFS — it ensures level-by-level exploration.",
      elements: [
        {
          type: "array",
          id: "q",
          label: "Queue (front → back)",
          items: [
            { value: "30", state: "active" },
            { value: "40", state: "done" },
          ],
        },
        { type: "variable", id: "v-front", name: "front", value: "30", state: "done" },
        { type: "variable", id: "v-dequeued", name: "dequeued", value: "20", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "enqueue(40), dequeue() → 20", kind: "swap" },
            { text: "✅ Queue: [30, 40]. Used in BFS, scheduling", kind: "info" },
          ],
        },
      ],
    },
  ],
};

// ─── Quick Sort ──────────────────────────────────────────────────────
const quickSortViz: VisualizationBlock = {
  type: "array",
  initialState: {},
  steps: [
    {
      message:
        "Quick Sort on [3, 6, 2, 7, 1]. Pick last element as pivot (1). Partition: everything < 1 goes left, > 1 goes right.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Array",
          items: [
            { value: "3", state: "default" },
            { value: "6", state: "default" },
            { value: "2", state: "default" },
            { value: "7", state: "default" },
            { value: "1", state: "highlight" },
          ],
        },
        { type: "variable", id: "v-pivot", name: "pivot", value: "1", state: "highlight" },
        {
          type: "variable",
          id: "v-i",
          name: "i",
          value: "0",
          state: "active",
          description: "boundary",
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Pivot = arr[4] = 1", kind: "info" },
            { text: "Scan: if arr[j] < pivot, swap with arr[i], i++", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "Scan j=0..3: 3>1, 6>1, 2>1, 7>1 — nothing < pivot. i stays at 0. No swaps during scan.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "After scan (no swaps)",
          items: [
            { value: "3", state: "comparing" },
            { value: "6", state: "comparing" },
            { value: "2", state: "comparing" },
            { value: "7", state: "comparing" },
            { value: "1", state: "highlight" },
          ],
        },
        { type: "variable", id: "v-pivot", name: "pivot", value: "1", state: "highlight" },
        { type: "variable", id: "v-i", name: "i", value: "0", state: "active" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "3>1, 6>1, 2>1, 7>1 — all > pivot", kind: "compare" },
            { text: "i=0 (no elements < pivot). Swap pivot to i.", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "Swap pivot (1) with arr[i=0] (3). Pivot 1 is now at its FINAL sorted position (index 0). Left=[], Right=[6,2,7,3].",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "After partition",
          items: [
            { value: "1", state: "done" },
            { value: "6", state: "active" },
            { value: "2", state: "active" },
            { value: "7", state: "active" },
            { value: "3", state: "active" },
          ],
        },
        {
          type: "variable",
          id: "v-pivot",
          name: "pivot pos",
          value: "0",
          state: "done",
          description: "FINAL",
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Swap arr[0]↔arr[4]: [1, 6, 2, 7, 3]", kind: "swap" },
            { text: "Pivot 1 is in final position! Recurse on right.", kind: "return" },
          ],
        },
      ],
    },
    {
      message:
        "Recurse on [6, 2, 7, 3]. Pivot=3. Scan: 6>3, 2<3→swap(arr[1],arr[1])→i=2, 7>3. Swap pivot: [2, 3, 7, 6].",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Partitioning right half",
          items: [
            { value: "1", state: "done" },
            { value: "2", state: "active" },
            { value: "3", state: "done" },
            { value: "7", state: "active" },
            { value: "6", state: "active" },
          ],
        },
        { type: "variable", id: "v-pivot", name: "pivot", value: "3", state: "done" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Pivot=3. 2<3→keep left. 6,7>3→stay right", kind: "compare" },
            { text: "[1, 2, 3, 7, 6]. 3 in final position.", kind: "return" },
          ],
        },
      ],
    },
    {
      message:
        "Continue: [7, 6], pivot=6. 7>6. Swap: [6, 7]. Done! [1, 2, 3, 6, 7]. Average O(n log n), worst O(n²) with bad pivots.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Sorted!",
          items: [
            { value: "1", state: "done" },
            { value: "2", state: "done" },
            { value: "3", state: "done" },
            { value: "6", state: "done" },
            { value: "7", state: "done" },
          ],
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "✅ [1, 2, 3, 6, 7] — sorted!", kind: "return" },
            { text: "Avg O(n log n), worst O(n²). In-place, O(log n) stack.", kind: "info" },
            { text: "Random pivot avoids worst case in practice.", kind: "info" },
          ],
        },
      ],
    },
  ],
};

// ─── Bucket Sort ─────────────────────────────────────────────────────
const bucketSortViz: VisualizationBlock = {
  type: "array",
  initialState: {},
  steps: [
    {
      message:
        "Bucket Sort: values in [0, 10). Create 5 buckets for ranges [0-2), [2-4), [4-6), [6-8), [8-10). Input: [3, 7, 1, 9, 4, 2, 8, 5].",
      elements: [
        {
          type: "array",
          id: "input",
          label: "Input",
          items: [
            { value: "3", state: "default" },
            { value: "7", state: "default" },
            { value: "1", state: "default" },
            { value: "9", state: "default" },
            { value: "4", state: "default" },
            { value: "2", state: "default" },
            { value: "8", state: "default" },
            { value: "5", state: "default" },
          ],
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "5 buckets for [0-2), [2-4), [4-6), [6-8), [8-10)", kind: "info" },
            { text: "bucket = floor(value / range * k)", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "Distribute: 3→B1, 7→B3, 1→B0, 9→B4, 4→B2, 2→B1, 8→B4, 5→B2. Each element goes to its bucket.",
      elements: [
        {
          type: "array",
          id: "b0",
          label: "Bucket 0 [0-2)",
          items: [{ value: "1", state: "active" }],
        },
        {
          type: "array",
          id: "b1",
          label: "Bucket 1 [2-4)",
          items: [
            { value: "3", state: "active" },
            { value: "2", state: "active" },
          ],
        },
        {
          type: "array",
          id: "b2",
          label: "Bucket 2 [4-6)",
          items: [
            { value: "4", state: "active" },
            { value: "5", state: "active" },
          ],
        },
        {
          type: "array",
          id: "b3",
          label: "Bucket 3 [6-8)",
          items: [{ value: "7", state: "active" }],
        },
        {
          type: "array",
          id: "b4",
          label: "Bucket 4 [8-10)",
          items: [
            { value: "9", state: "active" },
            { value: "8", state: "active" },
          ],
        },
        {
          type: "log",
          id: "log",
          lines: [{ text: "Distributed into 5 buckets — O(n)", kind: "swap" }],
        },
      ],
    },
    {
      message:
        "Sort each bucket individually (insertion sort — small buckets). Then concatenate all buckets in order.",
      elements: [
        { type: "array", id: "b0", label: "Bucket 0 ✓", items: [{ value: "1", state: "done" }] },
        {
          type: "array",
          id: "b1",
          label: "Bucket 1 ✓",
          items: [
            { value: "2", state: "done" },
            { value: "3", state: "done" },
          ],
        },
        {
          type: "array",
          id: "b2",
          label: "Bucket 2 ✓",
          items: [
            { value: "4", state: "done" },
            { value: "5", state: "done" },
          ],
        },
        { type: "array", id: "b3", label: "Bucket 3 ✓", items: [{ value: "7", state: "done" }] },
        {
          type: "array",
          id: "b4",
          label: "Bucket 4 ✓",
          items: [
            { value: "8", state: "done" },
            { value: "9", state: "done" },
          ],
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "Sort each bucket — tiny, so fast", kind: "swap" },
            { text: "Concatenate: B0 + B1 + B2 + B3 + B4", kind: "call" },
          ],
        },
      ],
    },
    {
      message:
        "Result: [1, 2, 3, 4, 5, 7, 8, 9]. O(n+k) average. Breaks the O(n log n) barrier because we don't compare all pairs!",
      elements: [
        {
          type: "array",
          id: "result",
          label: "Sorted!",
          items: [
            { value: "1", state: "done" },
            { value: "2", state: "done" },
            { value: "3", state: "done" },
            { value: "4", state: "done" },
            { value: "5", state: "done" },
            { value: "7", state: "done" },
            { value: "8", state: "done" },
            { value: "9", state: "done" },
          ],
        },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "✅ Sorted! O(n+k) average", kind: "return" },
            { text: "Works best with uniform distribution", kind: "info" },
            { text: "Worst: all in one bucket → O(n²)", kind: "compare" },
          ],
        },
      ],
    },
  ],
};

// ─── Search Range ────────────────────────────────────────────────────
const searchRangeViz: VisualizationBlock = {
  type: "array",
  initialState: {},
  steps: [
    {
      message:
        "Find FIRST occurrence of 5 in [1, 3, 5, 5, 5, 8, 9]. Standard binary search would find index 3. But 2 is earlier!",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Sorted Array",
          items: [
            { value: "1", state: "default" },
            { value: "3", state: "default" },
            { value: "5", state: "default" },
            { value: "5", state: "comparing" },
            { value: "5", state: "default" },
            { value: "8", state: "default" },
            { value: "9", state: "default" },
          ],
        },
        { type: "variable", id: "v-lo", name: "lo", value: "0", state: "active" },
        { type: "variable", id: "v-hi", name: "hi", value: "6", state: "active" },
        { type: "variable", id: "v-mid", name: "mid", value: "3", state: "comparing" },
        { type: "variable", id: "v-result", name: "result", value: "-1", state: "default" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "mid=3, arr[3]=5 == target. Found one!", kind: "compare" },
            { text: "But DON'T STOP — save result, search LEFT for earlier", kind: "info" },
          ],
        },
      ],
    },
    {
      message:
        "Found 5 at index 3. Save result=3. But there might be an earlier 5! Set hi=mid-1=2 to keep searching LEFT.",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Sorted Array",
          items: [
            { value: "1", state: "active" },
            { value: "3", state: "active" },
            { value: "5", state: "active" },
            { value: "5", state: "done" },
            { value: "5", state: "visited" },
            { value: "8", state: "visited" },
            { value: "9", state: "visited" },
          ],
        },
        { type: "variable", id: "v-lo", name: "lo", value: "0", state: "active" },
        { type: "variable", id: "v-hi", name: "hi", value: "2", state: "active" },
        { type: "variable", id: "v-mid", name: "mid", value: "1", state: "comparing" },
        { type: "variable", id: "v-result", name: "result", value: "3", state: "highlight" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "result=3, hi=2. Search left half.", kind: "swap" },
            { text: "mid=1, arr[1]=3 < 5 → go RIGHT, lo=2", kind: "compare" },
          ],
        },
      ],
    },
    {
      message:
        "lo=2, hi=2, mid=2. arr[2]=5 == target! Save result=2. Set hi=1. Now lo>hi → stop. First occurrence = index 2!",
      elements: [
        {
          type: "array",
          id: "arr",
          label: "Sorted Array",
          items: [
            { value: "1", state: "visited" },
            { value: "3", state: "visited" },
            { value: "5", state: "done" },
            { value: "5", state: "done" },
            { value: "5", state: "visited" },
            { value: "8", state: "visited" },
            { value: "9", state: "visited" },
          ],
        },
        { type: "variable", id: "v-lo", name: "lo", value: "2", state: "done" },
        {
          type: "variable",
          id: "v-hi",
          name: "hi",
          value: "1",
          state: "done",
          description: "lo > hi = DONE",
        },
        { type: "variable", id: "v-mid", name: "mid", value: "2", state: "done" },
        { type: "variable", id: "v-result", name: "result", value: "2", state: "done" },
        {
          type: "log",
          id: "log",
          lines: [
            { text: "arr[2]=5 == target → result=2, hi=1", kind: "return" },
            { text: "lo(2) > hi(1) → STOP", kind: "info" },
            { text: "✅ First occurrence at index 2. O(log n)", kind: "return" },
            { text: "Key trick: when found, save & keep searching left", kind: "info" },
          ],
        },
      ],
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════
// EXPORT: ALL BASIC PHASES
// ═══════════════════════════════════════════════════════════════════════

export const basicPhases: DemoPhase[] = [
  {
    id: "phase-1",
    phase: 1,
    title: "Arrays — From Zero to Mastery",
    goal: "The most important data structure in all of computer science. Master arrays from language basics to interview-winning techniques.",
    lessons: [
      {
        id: "B-0",
        code: "B-0",
        title: "Why Arrays Are Everything",
        content:
          '<h2>The Foundation of All Computing</h2><p>Arrays are the <strong>single most important data structure</strong> in computer science. Every other structure — hash maps, heaps, stacks, even strings — is built on top of arrays. If you master arrays, you master 60% of all interview problems.</p><h2>What Is an Array?</h2><p>An array is a <strong>numbered collection of elements stored side-by-side in memory</strong>. Like numbered lockers in a hallway — you say "locker 5" and go straight to it.</p><pre><code># Creating arrays in different languages\n\n# Python\nnums = [10, 20, 30, 40, 50]\n\n# JavaScript\nconst nums = [10, 20, 30, 40, 50];\n\n# Java\nint[] nums = {10, 20, 30, 40, 50};\n\n# C++\nvector&lt;int&gt; nums = {10, 20, 30, 40, 50};</code></pre><h2>The Two Questions</h2><p>For every solution you write, always ask:</p><ol><li><strong>Time complexity</strong> — how does runtime grow with input size?</li><li><strong>Space complexity</strong> — how much extra memory do we need?</li></ol><h2>Big-O Reference Table</h2><table><tr><th>Notation</th><th>Name</th><th>Example</th><th>n=1M ops</th></tr><tr><td>O(1)</td><td>Constant</td><td>Array access</td><td>1</td></tr><tr><td>O(log n)</td><td>Logarithmic</td><td>Binary search</td><td>20</td></tr><tr><td>O(n)</td><td>Linear</td><td>Loop through array</td><td>1M</td></tr><tr><td>O(n log n)</td><td>Linearithmic</td><td>Merge sort</td><td>20M</td></tr><tr><td>O(n²)</td><td>Quadratic</td><td>Nested loops</td><td>1T 💀</td></tr></table><h2>Why Arrays Win</h2><p>An O(n²) sort on 1 million items: ~10¹² operations (hours). An O(n log n) sort: ~20 million operations (milliseconds). That\'s <strong>50,000× faster</strong>. Knowing the right technique is more powerful than having a faster computer.</p>',
        visualization: null,
      },
      {
        id: "B-1",
        code: "B-1",
        title: "RAM — Why arr[i] is O(1)",
        content:
          '<h2>Why This Matters</h2><p>Every variable you create lives in RAM. Understanding RAM explains <em>why</em> arrays are O(1) access — the single most important fact in all of DSA.</p><h2>The Mental Model</h2><p>RAM is a giant numbered mailbox wall. Each mailbox (byte) has an <strong>address</strong> (0, 1, 2...). You tell the clerk an address, they go <em>straight</em> to that box. No scanning, no searching.</p><h2>The Key Formula</h2><pre><code>address = base + (index × element_size)\n\n# Example: int array starting at address 100\n# arr[0] → 100 + (0 × 4) = 100\n# arr[3] → 100 + (3 × 4) = 112\n# arr[1000] → 100 + (1000 × 4) = 4100\n# Same speed! One multiply, one add, done.</code></pre><p>This is why <code>arr[i]</code> is O(1). One multiply + one add + one memory read. Whether i=0 or i=1,000,000 — same speed.</p><h2>Cache Locality — The Hidden Superpower</h2><p>When CPU reads arr[0], it loads a whole <strong>cache line</strong> (~64 bytes = 16 ints). So arr[1] through arr[15] are <em>already in cache</em>. This makes sequential array access 10-100× faster than jumping between random memory locations (like linked lists).</p><blockquote>🎯 Interview Insight: "Why are arrays faster than linked lists even though both have O(n) search?" → Cache locality. Sequential memory access is hardware-optimized. Arrays win because of spatial locality.</blockquote>',
        visualization: ramViz,
      },
      {
        id: "B-2",
        code: "B-2",
        title: "Static Arrays — Fixed Size",
        content:
          '<h2>Core Definition</h2><p><strong>Static Array</strong> = a fixed-size, contiguous block of memory. You declare the size upfront and it never changes. Think of it as renting exactly 10 lockers — no more, no less.</p><h2>Operations Complexity Table</h2><table><tr><th>Operation</th><th>Time</th><th>Why</th></tr><tr><td>Read arr[i]</td><td>O(1)</td><td>Address formula</td></tr><tr><td>Write arr[i]=x</td><td>O(1)</td><td>Same formula</td></tr><tr><td>Insert at end</td><td>O(1)</td><td>If space exists</td></tr><tr><td>Insert at middle</td><td>O(n)</td><td>Shift elements right</td></tr><tr><td>Delete at index</td><td>O(n)</td><td>Shift elements left</td></tr><tr><td>Search (unsorted)</td><td>O(n)</td><td>Linear scan</td></tr><tr><td>Search (sorted)</td><td>O(log n)</td><td>Binary search!</td></tr></table><h2>The Shifting Problem</h2><p>Insert at index 2 of [10, 20, 30, 40, _]? Must shift 30→idx3, 40→idx4, then place new value. That\'s why insert/delete is O(n) — you might have to move <em>everything</em>.</p><h2>Edge Cases Every Interviewer Tests</h2><ul><li><strong>Empty array (n=0)</strong> — check length before ANY access</li><li><strong>Single element</strong> — often a special case that breaks naive algorithms</li><li><strong>Off-by-one</strong> — the #1 array bug. Is it &lt; n or &lt;= n? Start at 0 or 1?</li><li><strong>Integer overflow</strong> — summing elements? Use long. (lo+hi)/2? Use lo+(hi-lo)/2</li><li><strong>All same elements</strong> — breaks many partition-based algorithms</li><li><strong>Already sorted / reverse sorted</strong> — worst case for many algorithms</li><li><strong>Negative numbers</strong> — breaks assumptions about max/min</li></ul><blockquote>🎯 Memorize: Before writing ANY array code, ask yourself: "What if the array is empty? What if it has one element? What if all elements are the same?"</blockquote>',
        visualization: staticArrayViz,
      },
      {
        id: "B-3",
        code: "B-3",
        title: "Dynamic Arrays — Auto-Resize",
        content:
          '<h2>Why This Matters</h2><p>Python lists, JavaScript arrays, Java ArrayLists — <strong>all dynamic arrays</strong>. This is the #1 data structure in every real codebase on Earth.</p><h2>Core Idea</h2><p>A dynamic array is a static array that <strong>resizes itself</strong> when full. When capacity is reached: allocate a new array 2× the size, copy everything over, discard the old one.</p><h2>Amortized Analysis — From First Principles</h2><p>Why 2× and not +1 or +10?</p><ul><li><strong>+1 per resize</strong>: n pushes → n resizes → total copies = 1+2+3+...+n = O(n²). Terrible!</li><li><strong>×2 per resize</strong>: n pushes → log₂(n) resizes → total copies = 1+2+4+...+n ≈ 2n = O(n). Each push = <strong>O(1) amortized</strong>.</li></ul><p>The geometric series 1+2+4+...+n converges to 2n. Doubling = geometric growth = constant amortized cost.</p><blockquote>🎯 Interview Insight: "What is the amortized time of append?" → O(1). "How?" → The doubling strategy ensures n pushes do at most 2n total copies. Each push pays O(1) on average. Interviewers LOVE this question.</blockquote><h2>Language Implementations</h2><table><tr><th>Language</th><th>Type</th><th>Growth Factor</th><th>Notes</th></tr><tr><td>Python</td><td>list</td><td>~1.125×</td><td>Over-allocates slightly</td></tr><tr><td>Java</td><td>ArrayList</td><td>1.5×</td><td>Math.max(old*1.5, needed)</td></tr><tr><td>C++</td><td>vector</td><td>2×</td><td>Classic doubling</td></tr><tr><td>JavaScript</td><td>Array</td><td>Engine-specific</td><td>V8 uses complex heuristics</td></tr></table>',
        visualization: dynamicArrayViz,
      },
      {
        id: "B-30",
        code: "B-30",
        title: "Arrays in Your Language",
        content:
          '<h2>Python — The Go-To for Interviews</h2><pre><code># Creation\nnums = [1, 2, 3, 4, 5]\nempty = []\nzeros = [0] * 10          # [0,0,0,...,0]\nmatrix = [[0]*3 for _ in range(3)]  # 3x3 grid\n\n# Access \u0026 Modify\nnums[0]      # 1 (first)\nnums[-1]     # 5 (last!) — Python superpower\nnums[1:3]    # [2, 3] — slicing\nnums[::-1]   # [5,4,3,2,1] — reverse\n\n# Add/Remove\nnums.append(6)        # O(1) amortized — add to end\nnums.insert(0, 99)    # O(n) — shift everything\nnums.pop()            # O(1) — remove last\nnums.pop(0)           # O(n) — remove first, shift\nnums.remove(3)        # O(n) — find \u0026 remove first 3\n\n# Useful operations\nlen(nums)             # length\nmin(nums), max(nums)  # O(n)\nsum(nums)             # O(n)\nsorted(nums)          # O(n log n) — returns new list\nnums.sort()           # O(n log n) — sorts in-place\n3 in nums             # O(n) membership check\nnums.index(3)         # O(n) find index\nnums.count(3)         # O(n) count occurrences</code></pre><h2>JavaScript Essentials</h2><pre><code>const nums = [1, 2, 3, 4, 5];\nnums.push(6);          // O(1) — add end\nnums.pop();            // O(1) — remove end\nnums.unshift(0);       // O(n) — add front\nnums.shift();          // O(n) — remove front\nnums.splice(2, 1);     // O(n) — remove at index\nnums.includes(3);      // O(n)\nnums.indexOf(3);       // O(n)\nnums.slice(1, 3);      // [2, 3] — copy subarray\nnums.map(x => x*2);    // [2,4,6,8,10]\nnums.filter(x => x>2); // [3,4,5]\nnums.reduce((a,b) => a+b, 0);  // 15</code></pre><h2>Key Gotchas</h2><ul><li><strong>Python</strong>: <code>[[0]*3]*3</code> creates 3 references to SAME row! Use list comprehension instead</li><li><strong>JavaScript</strong>: <code>[1] + [2]</code> gives <code>"12"</code> (string concat!), not <code>[1,2]</code></li><li><strong>Python</strong>: <code>nums2 = nums</code> is a reference, not a copy! Use <code>nums.copy()</code> or <code>nums[:]</code></li><li><strong>Both</strong>: Modifying array while iterating = bugs. Use indices or build new array.</li></ul><blockquote>🎯 Interview Tip: In interviews, always clarify: "Can I modify the input array, or do I need to preserve it?" This shows maturity.</blockquote>',
        visualization: null,
      },
      {
        id: "B-31",
        code: "B-31",
        title: "Traversal Patterns",
        content:
          '<h2>Every Array Algorithm is a Traversal Pattern</h2><p>All array problems boil down to: <strong>how do you visit the elements?</strong> Master these 6 patterns and you can solve any array problem.</p><h2>Pattern 1: Forward Pass</h2><pre><code># Find max element\nmax_val = arr[0]\nfor i in range(1, len(arr)):\n  if arr[i] > max_val:\n    max_val = arr[i]</code></pre><h2>Pattern 2: Backward Pass</h2><pre><code># Build suffix max array\nsuffix_max = [0] * n\nsuffix_max[-1] = arr[-1]\nfor i in range(n-2, -1, -1):\n  suffix_max[i] = max(arr[i], suffix_max[i+1])</code></pre><h2>Pattern 3: Two-Direction (from both ends)</h2><pre><code># Is palindrome?\nleft, right = 0, len(arr) - 1\nwhile left < right:\n  if arr[left] != arr[right]: return False\n  left += 1; right -= 1\nreturn True</code></pre><h2>Pattern 4: Two-Pass (left then right)</h2><pre><code># Product of Array Except Self (LC 238)\n# Pass 1: left products\n# Pass 2: right products — multiply in</code></pre><h2>Pattern 5: Frequency Count</h2><pre><code># Count each element\nfrom collections import Counter\nfreq = Counter(arr)  # {val: count}\nmost_common = freq.most_common(1)[0][0]</code></pre><h2>Pattern 6: Enumerate with Index</h2><pre><code># When you need both index AND value\nfor i, val in enumerate(arr):\n  print(f"Index {i}: {val}")</code></pre><blockquote>🎯 Interview Trick: "Product of Array Except Self" (LC 238) uses the Two-Pass pattern: build left products forward, then multiply right products backward. O(n) time, O(1) extra space. This is a FAANG favorite.</blockquote><h2>Common Traversal Mistakes</h2><ul><li><strong>Off-by-one</strong>: <code>range(n)</code> goes 0..n-1. <code>range(1,n)</code> goes 1..n-1.</li><li><strong>Modifying while iterating</strong>: Use index loop or build new list</li><li><strong>Not handling empty array</strong>: Always check <code>if not arr: return ...</code></li></ul>',
        visualization: null,
      },
      {
        id: "B-32",
        code: "B-32",
        title: "In-Place Techniques",
        content:
          '<h2>What Does "In-Place" Mean?</h2><p>Modifying the array <strong>without creating a new one</strong>. O(1) extra space. Interviewers love asking: "Can you do it in-place?" This tests if you truly understand how arrays work.</p><h2>Technique 1: Swap Two Elements</h2><pre><code># The fundamental operation\narr[i], arr[j] = arr[j], arr[i]\n\n# Used in: sorting, partitioning, reversal</code></pre><h2>Technique 2: Two-Pointer Partition</h2><pre><code># Move all zeros to end (LC 283)\ndef moveZeroes(nums):\n  write = 0                    # where to write next non-zero\n  for read in range(len(nums)):\n    if nums[read] != 0:\n      nums[write] = nums[read]\n      write += 1\n  for i in range(write, len(nums)):\n    nums[i] = 0                # fill rest with zeros</code></pre><p>The "read/write pointer" pattern: <code>read</code> scans forward, <code>write</code> marks where to place the next valid element. O(n) time, O(1) space.</p><h2>Technique 3: Dutch National Flag</h2><pre><code># Sort Colors (LC 75) — sort array of 0s, 1s, 2s\ndef sortColors(nums):\n  lo, mid, hi = 0, 0, len(nums) - 1\n  while mid <= hi:\n    if nums[mid] == 0:\n      nums[lo], nums[mid] = nums[mid], nums[lo]\n      lo += 1; mid += 1\n    elif nums[mid] == 1:\n      mid += 1\n    else:\n      nums[mid], nums[hi] = nums[hi], nums[mid]\n      hi -= 1</code></pre><p>Three pointers partition into three regions in one pass. O(n) time, O(1) space.</p><h2>Technique 4: Cyclic Sort</h2><pre><code># Elements 1..n in array of size n\n# Place each number at its "home" index\ndef cyclicSort(nums):\n  i = 0\n  while i < len(nums):\n    correct = nums[i] - 1    # where this number should be\n    if nums[i] != nums[correct]:\n      nums[i], nums[correct] = nums[correct], nums[i]\n    else:\n      i += 1</code></pre><p>Used for: Find Missing Number, Find Duplicate, Find All Duplicates — all O(n) time O(1) space!</p><blockquote>🎯 Interview Insight: When they say "O(1) space", think: swaps, read/write pointers, or overwriting the input. Never allocate a new array of size n.</blockquote>',
        visualization: null,
      },
      {
        id: "B-33",
        code: "B-33",
        title: "Reversal \u0026 Rotation",
        content:
          "<h2>Array Reversal — The Building Block</h2><pre><code>def reverse(arr, left, right):\n  while left < right:\n    arr[left], arr[right] = arr[right], arr[left]\n    left += 1\n    right -= 1</code></pre><p>O(n/2) = O(n) time, O(1) space. This simple function is the <strong>building block</strong> for rotation, palindrome checks, and many other algorithms.</p><h2>Rotate Array by K Positions (LC 189)</h2><p>Rotate [1,2,3,4,5,6,7] right by k=3 → [5,6,7,1,2,3,4]</p><p><strong>The three-reversal trick</strong> — one of the most elegant algorithms:</p><pre><code>def rotate(nums, k):\n  k = k % len(nums)           # handle k > n\n  reverse(nums, 0, len(nums)-1)  # [7,6,5,4,3,2,1]\n  reverse(nums, 0, k-1)          # [5,6,7,4,3,2,1]\n  reverse(nums, k, len(nums)-1)  # [5,6,7,1,2,3,4] ✓</code></pre><p><strong>Why it works:</strong> Reversing the whole array puts the right elements in roughly the right place, but backwards. Two sub-reversals fix the order. O(n) time, O(1) space.</p><blockquote>🎯 Interview Classic: There are 3 ways to rotate: (1) Extra array O(n) space (2) One-by-one k times O(nk) (3) Three-reversal O(n) O(1). Interviewers want #3.</blockquote><h2>When to Use Reversal</h2><ul><li><strong>Rotate array</strong> — three reversals</li><li><strong>Reverse words in a string</strong> — reverse all, then reverse each word</li><li><strong>Next permutation (LC 31)</strong> — involves reversal of suffix</li><li><strong>Palindrome checks</strong> — compare with reverse</li></ul>",
        visualization: null,
      },
      {
        id: "B-34",
        code: "B-34",
        title: "Subarrays vs Subsequences",
        content:
          '<h2>Three Terms You MUST Know</h2><table><tr><th>Term</th><th>Definition</th><th>Contiguous?</th><th>Count for n elements</th></tr><tr><td><strong>Subarray</strong></td><td>Consecutive slice of array</td><td>Yes</td><td>n(n+1)/2 = O(n²)</td></tr><tr><td><strong>Subsequence</strong></td><td>Elements in order, not necessarily adjacent</td><td>No</td><td>2ⁿ</td></tr><tr><td><strong>Subset</strong></td><td>Any selection, order doesn\'t matter</td><td>No</td><td>2ⁿ</td></tr></table><h2>Subarrays — The Most Common in Interviews</h2><pre><code># Array: [1, 2, 3]\n# Subarrays: [1], [1,2], [1,2,3], [2], [2,3], [3]\n# Total: n*(n+1)/2 = 6\n\n# Generating all subarrays — O(n²)\nfor start in range(n):\n  for end in range(start, n):\n    subarray = arr[start:end+1]</code></pre><p>Key problems that use subarrays: Maximum Subarray Sum (Kadane\'s), Subarray Sum Equals K, Minimum Size Subarray Sum.</p><h2>The Subarray Sum Pattern</h2><pre><code># Brute force: O(n³) — generate all, sum each\n# Better: O(n²) — running sum as you extend\n# Best: O(n) — Prefix sums + hash map\n\n# "How many subarrays sum to k?" (LC 560)\nprefix_sum = 0\ncount = 0\nseen = {0: 1}\nfor num in nums:\n  prefix_sum += num\n  if prefix_sum - k in seen:\n    count += seen[prefix_sum - k]\n  seen[prefix_sum] = seen.get(prefix_sum, 0) + 1</code></pre><blockquote>🎯 Interview Pattern: "subarray with property X" → think Sliding Window or Prefix Sum. "subsequence with property X" → think DP or Backtracking. This distinction is critical.</blockquote><h2>Kadane\'s Algorithm — Maximum Subarray (LC 53)</h2><pre><code>def maxSubArray(nums):\n  max_ending_here = nums[0]\n  max_so_far = nums[0]\n  for i in range(1, len(nums)):\n    max_ending_here = max(nums[i], max_ending_here + nums[i])\n    max_so_far = max(max_so_far, max_ending_here)\n  return max_so_far</code></pre><p>At each index: <strong>extend the current subarray</strong> or <strong>start fresh</strong>. If running sum goes negative, starting over is better. O(n) time, O(1) space. <em>The most elegant array algorithm.</em></p>',
        visualization: null,
      },
      {
        id: "B-35",
        code: "B-35",
        title: "2D Arrays \u0026 Matrices",
        content:
          '<h2>Matrix = Array of Arrays</h2><pre><code># Create a 3x4 matrix (3 rows, 4 columns)\nmatrix = [[0]*4 for _ in range(3)]\n\n# Access: matrix[row][col]\nmatrix[0][0] = 1    # top-left\nmatrix[2][3] = 9    # bottom-right\n\nrows = len(matrix)\ncols = len(matrix[0])</code></pre><h2>4 Essential Traversal Patterns</h2><pre><code># Pattern 1: Row-by-row\nfor r in range(rows):\n  for c in range(cols):\n    process(matrix[r][c])\n\n# Pattern 2: Column-by-column\nfor c in range(cols):\n  for r in range(rows):\n    process(matrix[r][c])\n\n# Pattern 3: Diagonal\nfor r in range(rows):\n  for c in range(cols):\n    if r == c: process(matrix[r][c])  # main diagonal\n\n# Pattern 4: Spiral Order (LC 54)\n# Use 4 boundaries: top, bottom, left, right\n# Shrink inward after each full loop</code></pre><h2>The 4-Direction Neighbor Pattern</h2><pre><code># For grid problems (BFS, DFS, flood fill)\ndirections = [(0,1), (0,-1), (1,0), (-1,0)]\nfor dr, dc in directions:\n  nr, nc = r + dr, c + dc\n  if 0 <= nr < rows and 0 <= nc < cols:\n    process(matrix[nr][nc])</code></pre><h2>Rotate Matrix 90° (LC 48)</h2><pre><code># Transpose + reverse each row\ndef rotate(matrix):\n  n = len(matrix)\n  # Transpose: swap matrix[i][j] with matrix[j][i]\n  for i in range(n):\n    for j in range(i+1, n):\n      matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n  # Reverse each row\n  for row in matrix:\n    row.reverse()</code></pre><blockquote>🎯 Interview Tip: Matrix rotation, spiral traversal, and "search in sorted matrix" are the three most common 2D array interview questions. Master all three.</blockquote>',
        visualization: null,
      },
      {
        id: "B-36",
        code: "B-36",
        title: "Array Problem-Solving Framework",
        content:
          '<h2>The Decision Tree for Array Problems</h2><p>When you see an array problem in an interview, follow this decision tree:</p><h2>Step 1: Is the Array Sorted?</h2><ul><li><strong>Yes</strong> → Binary Search, Two Pointers</li><li><strong>No, but could be</strong> → Sort first? (O(n log n) trade-off)</li><li><strong>No, order matters</strong> → Sliding Window, Hash Map, Prefix Sum</li></ul><h2>Step 2: What Are You Looking For?</h2><ul><li><strong>"Find pair/triplet with sum X"</strong> → Two Pointers (sorted) or Hash Map (unsorted)</li><li><strong>"Longest/shortest subarray with property"</strong> → Sliding Window</li><li><strong>"Sum of range / subarray count"</strong> → Prefix Sum</li><li><strong>"Top K / Kth element"</strong> → Heap or Quick Select</li><li><strong>"Remove/move elements"</strong> → Two-Pointer in-place</li><li><strong>"Find missing/duplicate"</strong> → Cyclic Sort or Math</li></ul><h2>Step 3: Optimize</h2><table><tr><th>Current</th><th>Technique</th><th>Improved</th></tr><tr><td>O(n²) nested loops</td><td>Hash Map</td><td>O(n)</td></tr><tr><td>O(n²) pair search</td><td>Sort + Two Pointers</td><td>O(n log n)</td></tr><tr><td>O(n²) subarray sum</td><td>Prefix Sum</td><td>O(n)</td></tr><tr><td>O(n) search (sorted)</td><td>Binary Search</td><td>O(log n)</td></tr><tr><td>O(n) space</td><td>In-place swap</td><td>O(1)</td></tr></table><h2>The 7 Patterns That Solve 90% of Array Problems</h2><ol><li><strong>Sliding Window</strong> — subarray/substring optimization</li><li><strong>Two Pointers</strong> — sorted array pair problems</li><li><strong>Prefix Sum</strong> — range queries, subarray sums</li><li><strong>Hash Map</strong> — frequency, complement search</li><li><strong>In-Place Manipulation</strong> — swaps, read/write pointers</li><li><strong>Binary Search</strong> — sorted array, search space reduction</li><li><strong>Kadane\'s Algorithm</strong> — maximum subarray</li></ol><blockquote>🎯 Master Rule: If brute force is O(n²), there\'s almost always an O(n) or O(n log n) solution using one of these 7 patterns. Your job is to identify WHICH pattern.</blockquote>',
        visualization: null,
      },
      {
        id: "B-4",
        code: "B-4",
        title: "Stacks (Array-Based)",
        content:
          '<h2>Why This Matters</h2><p>A stack is just an array with restricted access — you can only touch the top element. Your function call stack is a stack. Ctrl+Z (undo) is a stack. Browser back button is a stack.</p><h2>Core Definition</h2><p><strong>Stack</strong> — Last In, First Out (LIFO). Built on a dynamic array. Three operations, all O(1):</p><ul><li><strong>push(x)</strong> — append to array end</li><li><strong>pop()</strong> — remove from array end</li><li><strong>peek()</strong> — read array end without removing</li></ul><h2>Implementation</h2><pre><code>class Stack:\n  def __init__(self):\n    self.items = []       # the underlying array!\n  def push(self, x):\n    self.items.append(x)  # O(1) amortized\n  def pop(self):\n    return self.items.pop()  # O(1)\n  def peek(self):\n    return self.items[-1]\n  def is_empty(self):\n    return len(self.items) == 0</code></pre><h2>Interview Patterns Using Stacks</h2><ul><li><strong>Valid Parentheses (LC 20)</strong> — push open, pop on close, check match</li><li><strong>Min Stack (LC 155)</strong> — track minimum alongside push/pop</li><li><strong>Monotonic Stack</strong> — maintain sorted order for "next greater element" problems</li><li><strong>Evaluate Reverse Polish (LC 150)</strong> — push numbers, pop two on operator</li></ul><blockquote>🎯 When you see "matching pairs", "nested structures", or "undo" → think Stack. The call stack is why recursion works — each call pushes a frame, each return pops it.</blockquote>',
        visualization: stackViz,
      },
    ],
    bossChallenge:
      "Solve these 3 from memory without any notes: (1) Rotate Array by K (three-reversal trick), (2) Product of Array Except Self, (3) Move Zeroes to End in-place.",
    leetcode: [
      {
        id: 1929,
        title: "Concatenation of Array",
        url: "https://leetcode.com/problems/concatenation-of-array/",
        tag: "Arrays Basics",
      },
      {
        id: 217,
        title: "Contains Duplicate",
        url: "https://leetcode.com/problems/contains-duplicate/",
        tag: "Hash Set",
      },
      {
        id: 238,
        title: "Product of Array Except Self",
        url: "https://leetcode.com/problems/product-of-array-except-self/",
        tag: "Two-Pass",
      },
      {
        id: 283,
        title: "Move Zeroes",
        url: "https://leetcode.com/problems/move-zeroes/",
        tag: "In-Place",
      },
      {
        id: 189,
        title: "Rotate Array",
        url: "https://leetcode.com/problems/rotate-array/",
        tag: "Reversal",
      },
      {
        id: 53,
        title: "Maximum Subarray",
        url: "https://leetcode.com/problems/maximum-subarray/",
        tag: "Kadane's",
      },
      {
        id: 75,
        title: "Sort Colors",
        url: "https://leetcode.com/problems/sort-colors/",
        tag: "Dutch Flag",
      },
      {
        id: 48,
        title: "Rotate Image",
        url: "https://leetcode.com/problems/rotate-image/",
        tag: "2D Array",
      },
      {
        id: 54,
        title: "Spiral Matrix",
        url: "https://leetcode.com/problems/spiral-matrix/",
        tag: "2D Traversal",
      },
      {
        id: 560,
        title: "Subarray Sum Equals K",
        url: "https://leetcode.com/problems/subarray-sum-equals-k/",
        tag: "Prefix Sum",
      },
      {
        id: 268,
        title: "Missing Number",
        url: "https://leetcode.com/problems/missing-number/",
        tag: "Cyclic Sort",
      },
      {
        id: 442,
        title: "Find All Duplicates",
        url: "https://leetcode.com/problems/find-all-duplicates-in-an-array/",
        tag: "Cyclic Sort",
      },
      {
        id: 41,
        title: "First Missing Positive",
        url: "https://leetcode.com/problems/first-missing-positive/",
        tag: "Cyclic Sort Hard",
      },
      {
        id: 20,
        title: "Valid Parentheses",
        url: "https://leetcode.com/problems/valid-parentheses/",
        tag: "Stack",
      },
      {
        id: 155,
        title: "Min Stack",
        url: "https://leetcode.com/problems/min-stack/",
        tag: "Stack",
      },
      {
        id: 739,
        title: "Daily Temperatures",
        url: "https://leetcode.com/problems/daily-temperatures/",
        tag: "Monotonic Stack",
      },
    ],
  },
  {
    id: "phase-2",
    phase: 2,
    title: "Array Patterns (Advanced)",
    goal: "Learn the 4 core array manipulation patterns — they appear in ~40% of all LeetCode problems.",
    lessons: [
      {
        id: "A-1",
        code: "A-1",
        title: "Sliding Window — Fixed Size",
        content:
          '<h2>The Idea</h2><p>Instead of recalculating a sum/count for every window from scratch O(n×k), <strong>maintain a running total</strong> and update it as the window slides. Remove the element leaving, add the element entering.</p><h2>The Pattern</h2><pre><code># Maximum sum of k consecutive elements\\ndef maxSumSubarray(arr, k):\\n  window_sum = sum(arr[:k])      # sum of first window\\n  best = window_sum\\n  for i in range(k, len(arr)):\\n    window_sum += arr[i] - arr[i - k]  # slide!\\n    best = max(best, window_sum)\\n  return best</code></pre><h2>Why O(n)</h2><p>Each element enters the window exactly once and leaves exactly once. Two operations per element = O(2n) = O(n). Compare to naive approach: O(n×k).</p><h2>When to Use</h2><ul><li>"Max/min/average of <strong>k consecutive</strong> elements"</li><li>"Subarray of <strong>exactly size k</strong>"</li><li>Any metric computed over a <strong>sliding range</strong></li></ul><h2>Common Variations</h2><ul><li><strong>Max average subarray</strong> (LC 643) — track sum, divide at end</li><li><strong>Sliding window max</strong> (LC 239, Hard) — use monotonic deque</li><li><strong>Count distinct in window</strong> — use frequency map</li></ul><blockquote>🎯 Interview Insight: Fixed window is the "warm-up" — variable window is the real test. But if they ask fixed window, nail the O(n) solution immediately.</blockquote>',
        visualization: slidingWindowFixedViz,
      },
      {
        id: "A-2",
        code: "A-2",
        title: "Sliding Window — Variable Size",
        content:
          '<h2>The Most Important Array Pattern</h2><p>Variable window handles "longest/shortest subarray with some property" — appears in ~20% of all medium/hard array problems.</p><h2>The Universal Template</h2><pre><code>def variableWindow(arr):\\n  left = 0\\n  best = 0\\n  state = {}  # track window state (counts, sum, etc.)\\n  for right in range(len(arr)):\\n    # 1. EXPAND: add arr[right] to window state\\n    update_state(state, arr[right])\\n    # 2. SHRINK: while window is invalid\\n    while is_invalid(state):\\n      remove_state(state, arr[left])\\n      left += 1\\n    # 3. UPDATE: record best valid window\\n    best = max(best, right - left + 1)\\n  return best</code></pre><h2>Example: Longest Substring Without Repeating (LC 3)</h2><pre><code>def lengthOfLongestSubstring(s):\\n  seen = {}   # char → last index\\n  left = 0\\n  best = 0\\n  for right in range(len(s)):\\n    if s[right] in seen and seen[s[right]] >= left:\\n      left = seen[s[right]] + 1\\n    seen[s[right]] = right\\n    best = max(best, right - left + 1)\\n  return best</code></pre><h2>Why O(n) — Not O(n²)</h2><p>The <code>left</code> pointer only moves <strong>right, never backwards</strong>. Total movements of both pointers across ALL iterations ≤ 2n. This is the key insight to explain in interviews.</p><h2>Classic Problems</h2><table><tr><th>Problem</th><th>Expand</th><th>Shrink when</th></tr><tr><td>LC 3: No repeating</td><td>Add char to set</td><td>Duplicate found</td></tr><tr><td>LC 76: Min window substring</td><td>Count chars</td><td>All required chars covered</td></tr><tr><td>LC 209: Min size subarray sum</td><td>Add to sum</td><td>Sum ≥ target</td></tr><tr><td>LC 424: Longest repeating with K replacements</td><td>Track max freq</td><td>Window - maxFreq > k</td></tr></table><blockquote>🎯 Interview Insight: The sliding window template is THE most bang-for-your-buck pattern. Memorize it. It appears in ~20% of medium LeetCode array/string problems.</blockquote>',
        visualization: variableWindowViz,
      },
      {
        id: "A-3",
        code: "A-3",
        title: "Two Pointers",
        content:
          "<h2>Turn O(n²) into O(n)</h2><p>Two pointers works on sorted arrays. Instead of testing all pairs O(n²), use the sorted order to eliminate half the search space each step.</p><h2>Pattern 1: Opposing Pointers (Sorted Array)</h2><pre><code># Two Sum on sorted array (LC 167)\\ndef twoSum(nums, target):\\n  left, right = 0, len(nums) - 1\\n  while left &lt; right:\\n    total = nums[left] + nums[right]\\n    if total == target:\\n      return [left + 1, right + 1]\\n    elif total &lt; target:\\n      left += 1    # need bigger sum\\n    else:\\n      right -= 1   # need smaller sum</code></pre><h2>Pattern 2: Same-Direction (Remove Duplicates)</h2><pre><code># Remove duplicates from sorted array (LC 26)\\ndef removeDuplicates(nums):\\n  write = 1   # slow pointer\\n  for read in range(1, len(nums)):  # fast pointer\\n    if nums[read] != nums[read - 1]:\\n      nums[write] = nums[read]\\n      write += 1\\n  return write</code></pre><h2>Pattern 3: 3Sum (LC 15) — The FAANG Classic</h2><pre><code>def threeSum(nums):\\n  nums.sort()\\n  result = []\\n  for i in range(len(nums) - 2):\\n    if i &gt; 0 and nums[i] == nums[i-1]: continue  # skip duplicates\\n    left, right = i + 1, len(nums) - 1\\n    while left &lt; right:\\n      total = nums[i] + nums[left] + nums[right]\\n      if total == 0:\\n        result.append([nums[i], nums[left], nums[right]])\\n        while left &lt; right and nums[left] == nums[left+1]: left += 1\\n        while left &lt; right and nums[right] == nums[right-1]: right -= 1\\n        left += 1; right -= 1\\n      elif total &lt; 0: left += 1\\n      else: right -= 1\\n  return result</code></pre><h2>Why Does Two Pointers Work?</h2><p>Sorting gives a <strong>monotonic guarantee</strong>: moving left always increases the sum, moving right always decreases it. So we can greedily choose which pointer to move — no need to try all pairs.</p><blockquote>🎯 Interview Insight: 3Sum is one of the top 5 most-asked FAANG interview problems. The key is (1) sort first (2) fix one element, two-pointer the rest (3) handle duplicates carefully.</blockquote>",
        visualization: twoPointersViz,
      },
      {
        id: "A-4",
        code: "A-4",
        title: "Prefix Sums",
        content:
          '<h2>Precompute Once, Query Forever</h2><p>Build a prefix sum array in O(n). Then answer ANY range-sum query in O(1). This is the most elegant trade-off in all of DSA.</p><h2>The Pattern</h2><pre><code># Build prefix sum\\nprefix = [0] * (n + 1)\\nfor i in range(n):\\n  prefix[i + 1] = prefix[i] + arr[i]\\n\\n# Query: sum(l..r) in O(1)\\nrange_sum = prefix[r + 1] - prefix[l]\\n\\n# Example: arr = [1, 2, 3, 4, 5]\\n# prefix =    [0, 1, 3, 6, 10, 15]\\n# sum(1..3) = prefix[4] - prefix[1] = 10 - 1 = 9 ✓ (2+3+4)</code></pre><h2>Why It Works</h2><p><code>prefix[r+1]</code> = sum of arr[0..r]. <code>prefix[l]</code> = sum of arr[0..l-1]. Subtraction cancels the prefix, leaving arr[l..r]. Pure math elegance.</p><h2>The Hash Map Extension — Subarray Sum = K (LC 560)</h2><pre><code># Count subarrays that sum to k\\ndef subarraySum(nums, k):\\n  prefix = 0\\n  count = 0\\n  seen = {0: 1}  # prefix_sum → number of times seen\\n  for num in nums:\\n    prefix += num\\n    # If (prefix - k) exists, those subarrays sum to k\\n    if prefix - k in seen:\\n      count += seen[prefix - k]\\n    seen[prefix] = seen.get(prefix, 0) + 1\\n  return count</code></pre><p>This is the MOST important prefix sum problem. Understand it deeply: if prefix[j] - prefix[i] = k, then subarray [i..j] sums to k.</p><h2>2D Prefix Sum (Matrix Region Sums)</h2><pre><code># Build 2D prefix sum for O(1) rectangle queries\\nfor r in range(rows):\\n  for c in range(cols):\\n    prefix[r+1][c+1] = (matrix[r][c] + prefix[r][c+1]\\n                        + prefix[r+1][c] - prefix[r][c])</code></pre><blockquote>🎯 Interview Insight: "How many subarrays sum to K?" → Prefix Sum + Hash Map = O(n). This combines two fundamental patterns and is a top-10 most-asked medium problem.</blockquote>',
        visualization: prefixSumViz,
      },
    ],
    bossChallenge:
      "Solve Maximum Subarray using Sliding Window logic without looking up the approach.",
    leetcode: [
      {
        id: 643,
        title: "Max Average Subarray I",
        url: "https://leetcode.com/problems/maximum-average-subarray-i/",
        tag: "Fixed Window",
      },
      {
        id: 3,
        title: "Longest Substring Without Repeating",
        url: "https://leetcode.com/problems/longest-substring-without-repeating-characters/",
        tag: "Variable Window",
      },
      {
        id: 76,
        title: "Minimum Window Substring",
        url: "https://leetcode.com/problems/minimum-window-substring/",
        tag: "Variable Window",
      },
      {
        id: 167,
        title: "Two Sum II",
        url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
        tag: "Two Pointers",
      },
      { id: 15, title: "3Sum", url: "https://leetcode.com/problems/3sum/", tag: "Two Pointers" },
      {
        id: 11,
        title: "Container With Most Water",
        url: "https://leetcode.com/problems/container-with-most-water/",
        tag: "Two Pointers",
      },
      {
        id: 303,
        title: "Range Sum Query",
        url: "https://leetcode.com/problems/range-sum-query-immutable/",
        tag: "Prefix Sum",
      },
      {
        id: 560,
        title: "Subarray Sum Equals K",
        url: "https://leetcode.com/problems/subarray-sum-equals-k/",
        tag: "Prefix Sum + Hash",
      },
    ],
  },
  {
    id: "phase-3",
    phase: 3,
    title: "Linked Lists + Pointer Patterns",
    goal: "Master pointer-based thinking. The fast/slow pointer trick is one of the most elegant patterns in DSA.",
    lessons: [
      {
        id: "B-5",
        code: "B-5",
        title: "Singly Linked Lists",
        content:
          "<h2>Why This Matters</h2><p>Linked lists teach <strong>pointer thinking</strong> — the mental skill needed for trees, graphs, and advanced data structures.</p><h2>Core Definition</h2><p><strong>Singly Linked List</strong> — each node stores a value and a pointer to the next node. Last node points to null.</p><h2>Operations</h2><ul><li><strong>Prepend</strong> — O(1): create node, point to old head, update head</li><li><strong>Append</strong> — O(n): traverse to end, add node (O(1) with tail pointer)</li><li><strong>Insert after node</strong> — O(1): rewire two pointers</li><li><strong>Delete node</strong> — O(1): bypass it by rewiring predecessor's next</li><li><strong>Search</strong> — O(n): must traverse from head</li></ul><h2>Arrays vs Linked Lists</h2><table><tr><th>Op</th><th>Array</th><th>Linked List</th></tr><tr><td>Access [i]</td><td>O(1)</td><td>O(n)</td></tr><tr><td>Insert/Delete at known pos</td><td>O(n)</td><td>O(1)</td></tr></table>",
        visualization: linkedListViz,
      },
      {
        id: "B-6",
        code: "B-6",
        title: "Doubly Linked Lists",
        content:
          "<h2>Upgrade from Singly</h2><p><strong>Doubly Linked List</strong> — each node has both <code>next</code> and <code>prev</code> pointers. This enables O(1) deletion of any node if you have a reference to it.</p><h2>Key Advantage</h2><p>In a singly linked list, to delete node X you need the node <em>before</em> X. In a doubly linked list, X knows its own predecessor.</p><h2>Where It's Used</h2><ul><li><strong>LRU Cache</strong> — the classic interview question uses a doubly linked list + hash map</li><li><strong>Browser history</strong> — forward and back navigation</li><li><strong>Text editor</strong> — cursor movement in both directions</li></ul><pre><code>class Node:\n  def __init__(self, val):\n    self.val = val\n    self.next = None\n    self.prev = None</code></pre>",
        visualization: doublyLinkedListViz,
      },
      {
        id: "B-7",
        code: "B-7",
        title: "Queues",
        content:
          "<h2>Core Definition</h2><p><strong>Queue</strong> — First In, First Out (FIFO). Like a line at a store. Two operations:</p><ul><li><strong>enqueue(x)</strong> — add to back, O(1)</li><li><strong>dequeue()</strong> — remove from front, O(1)</li></ul><h2>Implementation</h2><p>Use a linked list (enqueue at tail, dequeue at head) or a circular array. Do NOT use a regular array — dequeue would be O(n) due to shifting.</p><h2>Where Queues Show Up</h2><ul><li><strong>BFS</strong> — breadth-first search on trees/graphs (Phase 7)</li><li><strong>Task scheduling</strong> — process requests in order</li><li><strong>Buffering</strong> — producer-consumer patterns</li></ul><blockquote>What happens if you implement a queue with a regular array?</blockquote><p>Every dequeue shifts all n elements left → O(n). Circular array or linked list fixes this.</p>",
        visualization: queueViz,
      },
      {
        id: "A-5",
        code: "A-5",
        title: "Fast and Slow Pointers",
        content:
          "<h2>Why This Matters</h2><p>The tortoise and hare algorithm detects cycles in O(n) time and O(1) space — no hash set needed.</p><h2>The Pattern</h2><pre><code>slow = head\nfast = head\nwhile fast and fast.next:\n  slow = slow.next        # +1\n  fast = fast.next.next   # +2\n  if slow == fast:\n    return True  # cycle!\nreturn False  # no cycle</code></pre><h2>Why It Works</h2><p>If there's a cycle, fast enters it first and starts looping. Slow enters later. Each step, the gap between them shrinks by 1. They must eventually collide.</p><h2>Bonus Uses</h2><ul><li><strong>Find middle node</strong>: when fast reaches end, slow is at middle</li><li><strong>Find cycle start</strong>: after detection, reset one pointer to head, advance both +1. They meet at the cycle start.</li></ul>",
        visualization: fastSlowViz,
      },
    ],
    bossChallenge: "Reverse a singly linked list iteratively AND recursively from memory.",
    leetcode: [
      {
        id: 206,
        title: "Reverse Linked List",
        url: "https://leetcode.com/problems/reverse-linked-list/",
        tag: "Linked List",
      },
      {
        id: 21,
        title: "Merge Two Sorted Lists",
        url: "https://leetcode.com/problems/merge-two-sorted-lists/",
        tag: "Linked List",
      },
      {
        id: 143,
        title: "Reorder List",
        url: "https://leetcode.com/problems/reorder-list/",
        tag: "Linked List",
      },
      {
        id: 141,
        title: "Linked List Cycle",
        url: "https://leetcode.com/problems/linked-list-cycle/",
        tag: "Fast/Slow",
      },
      {
        id: 19,
        title: "Remove Nth Node From End",
        url: "https://leetcode.com/problems/remove-nth-node-from-end-of-list/",
        tag: "Two Pointers",
      },
      {
        id: 876,
        title: "Middle of Linked List",
        url: "https://leetcode.com/problems/middle-of-the-linked-list/",
        tag: "Fast/Slow",
      },
      {
        id: 146,
        title: "LRU Cache",
        url: "https://leetcode.com/problems/lru-cache/",
        tag: "DLL + Hash Map",
      },
    ],
  },
  {
    id: "phase-4",
    phase: 4,
    title: "Recursion",
    goal: "This unlocks Merge Sort, all Trees, Backtracking, Graphs DFS, and DP. Spend 2x the lesson time on practice here.",
    keystone: true,
    lessons: [
      {
        id: "B-8",
        code: "B-8",
        title: "Factorial",
        content:
          '<h2>The Mental Model</h2><p>"I solve the smallest version. I trust the same function handles everything bigger. Every call moves closer to the base case."</p><h2>Factorial</h2><pre><code>def factorial(n):\n  if n <= 1:       # base case\n    return 1\n  return n * factorial(n - 1)  # recursive case</code></pre><h2>Trace It</h2><pre><code>factorial(4)\n  4 * factorial(3)\n    3 * factorial(2)\n      2 * factorial(1)\n        return 1     ← base case\n      return 2 * 1 = 2\n    return 3 * 2 = 6\n  return 4 * 6 = 24</code></pre><p>The call stack is literally a stack — LIFO. Each frame waits for the one below to return.</p><blockquote>What happens if you forget the base case?</blockquote><p>Stack overflow — infinite recursion until memory runs out.</p>',
        visualization: {
          type: "array",
          initialState: {},
          steps: [
            {
              message:
                "factorial(4): This calls factorial(3). Each call is a new frame on the call stack. The stack grows downward.",
              elements: [
                {
                  type: "array",
                  id: "stack",
                  label: "Call Stack",
                  items: [{ value: "f(4)", state: "active" }],
                  direction: "horizontal",
                },
                { type: "variable", id: "v-n", name: "n", value: "4", state: "active" },
                { type: "log", id: "log", lines: [{ text: "factorial(4) called", kind: "call" }] },
              ],
            },
            {
              message:
                "factorial(3) called from factorial(4). Stack grows. f(4) is waiting for f(3) to return.",
              elements: [
                {
                  type: "array",
                  id: "stack",
                  label: "Call Stack",
                  items: [
                    { value: "f(4)", state: "default" },
                    { value: "f(3)", state: "active" },
                  ],
                  direction: "horizontal",
                },
                { type: "variable", id: "v-n", name: "n", value: "3", state: "active" },
                {
                  type: "log",
                  id: "log",
                  lines: [
                    { text: "factorial(4) called", kind: "call" },
                    { text: "factorial(3) called", kind: "call" },
                  ],
                },
              ],
            },
            {
              message:
                "factorial(2), then factorial(1). n=1 hits the BASE CASE — returns 1. No more recursion.",
              elements: [
                {
                  type: "array",
                  id: "stack",
                  label: "Call Stack",
                  items: [
                    { value: "f(4)", state: "default" },
                    { value: "f(3)", state: "default" },
                    { value: "f(2)", state: "default" },
                    { value: "f(1)", state: "highlight" },
                  ],
                  direction: "horizontal",
                },
                {
                  type: "variable",
                  id: "v-n",
                  name: "n",
                  value: "1",
                  state: "highlight",
                  description: "BASE CASE",
                },
                {
                  type: "log",
                  id: "log",
                  lines: [
                    { text: "factorial(3) called", kind: "call" },
                    { text: "factorial(2) called", kind: "call" },
                    { text: "factorial(1) called — BASE CASE, return 1", kind: "return" },
                  ],
                },
              ],
            },
            {
              message: "Now UNWIND: f(2) gets 1 back, returns 2*1=2. f(3) gets 2, returns 3*2=6.",
              elements: [
                {
                  type: "array",
                  id: "stack",
                  label: "Call Stack (unwinding)",
                  items: [
                    { value: "f(4)", state: "default" },
                    { value: "f(3)=6", state: "active" },
                  ],
                  direction: "horizontal",
                },
                { type: "variable", id: "v-n", name: "result", value: "6", state: "active" },
                {
                  type: "log",
                  id: "log",
                  lines: [
                    { text: "f(1) returns 1", kind: "return" },
                    { text: "f(2) returns 2 × 1 = 2", kind: "return" },
                    { text: "f(3) returns 3 × 2 = 6", kind: "return" },
                  ],
                },
              ],
            },
            {
              message:
                "f(4) gets 6, returns 4*6=24. Stack is empty. Done! Every recursion follows this pattern: grow stack → hit base → unwind.",
              elements: [
                {
                  type: "array",
                  id: "stack",
                  label: "Call Stack (empty)",
                  items: [],
                  direction: "horizontal",
                },
                {
                  type: "variable",
                  id: "v-n",
                  name: "result",
                  value: "24",
                  state: "done",
                  description: "4! = 24",
                },
                {
                  type: "log",
                  id: "log",
                  lines: [
                    { text: "f(3) returns 3 × 2 = 6", kind: "return" },
                    { text: "f(4) returns 4 × 6 = 24 ✅", kind: "return" },
                    { text: "Pattern: grow → base case → unwind", kind: "info" },
                  ],
                },
              ],
            },
          ],
        },
      },
      {
        id: "B-9",
        code: "B-9",
        title: "Fibonacci Sequence",
        content:
          "<h2>Naive Recursion</h2><pre><code>def fib(n):\n  if n <= 1: return n\n  return fib(n-1) + fib(n-2)</code></pre><p>This is O(2ⁿ) — exponential! fib(5) calls fib(3) twice, fib(2) three times. Massive redundancy.</p><h2>Fix: Memoization</h2><pre><code>memo = {}\ndef fib(n):\n  if n in memo: return memo[n]\n  if n <= 1: return n\n  memo[n] = fib(n-1) + fib(n-2)\n  return memo[n]</code></pre><p>Now O(n) — each value computed exactly once. This is your first taste of <strong>Dynamic Programming</strong> (Phase 13).</p><blockquote>Can you do it with O(1) space? Hint: you only need the last two values.</blockquote>",
        visualization: {
          type: "array",
          initialState: {},
          steps: [
            {
              message:
                "Fibonacci: fib(0)=0, fib(1)=1, fib(n) = fib(n-1) + fib(n-2). Let's fill a memo table for fib(5).",
              elements: [
                {
                  type: "array",
                  id: "memo",
                  label: "Memo Table [fib(0) ... fib(5)]",
                  items: [
                    { value: "0", state: "done" },
                    { value: "1", state: "done" },
                    { value: "?", state: "default" },
                    { value: "?", state: "default" },
                    { value: "?", state: "default" },
                    { value: "?", state: "default" },
                  ],
                },
                {
                  type: "variable",
                  id: "v-n",
                  name: "computing",
                  value: "fib(2)",
                  state: "active",
                },
                {
                  type: "log",
                  id: "log",
                  lines: [
                    { text: "Base cases: fib(0)=0, fib(1)=1", kind: "info" },
                    { text: "fib(2) = fib(1) + fib(0) = 1 + 0", kind: "compare" },
                  ],
                },
              ],
            },
            {
              message:
                "fib(2) = 1+0 = 1. fib(3) = fib(2)+fib(1) = 1+1 = 2. Each lookup is O(1) from memo.",
              elements: [
                {
                  type: "array",
                  id: "memo",
                  label: "Memo Table",
                  items: [
                    { value: "0", state: "done" },
                    { value: "1", state: "done" },
                    { value: "1", state: "done" },
                    { value: "2", state: "active" },
                    { value: "?", state: "default" },
                    { value: "?", state: "default" },
                  ],
                },
                {
                  type: "variable",
                  id: "v-n",
                  name: "computing",
                  value: "fib(3)",
                  state: "active",
                },
                {
                  type: "log",
                  id: "log",
                  lines: [
                    { text: "fib(2) = 1 + 0 = 1 ✓", kind: "return" },
                    { text: "fib(3) = fib(2) + fib(1) = 1 + 1 = 2", kind: "compare" },
                  ],
                },
              ],
            },
            {
              message:
                "fib(4) = fib(3)+fib(2) = 2+1 = 3. fib(5) = fib(4)+fib(3) = 3+2 = 5. Done! O(n) total with memo vs O(2^n) without.",
              elements: [
                {
                  type: "array",
                  id: "memo",
                  label: "Memo Table (complete)",
                  items: [
                    { value: "0", state: "done" },
                    { value: "1", state: "done" },
                    { value: "1", state: "done" },
                    { value: "2", state: "done" },
                    { value: "3", state: "done" },
                    { value: "5", state: "highlight" },
                  ],
                },
                { type: "variable", id: "v-n", name: "fib(5)", value: "5", state: "done" },
                {
                  type: "log",
                  id: "log",
                  lines: [
                    { text: "fib(4) = 2 + 1 = 3", kind: "return" },
                    { text: "fib(5) = 3 + 2 = 5 ✅", kind: "return" },
                    {
                      text: "With memo: O(n). Without: O(2^n). This IS dynamic programming.",
                      kind: "info",
                    },
                  ],
                },
              ],
            },
          ],
        },
      },
    ],
    bossChallenge:
      "Write all 3 from memory: factorial(n) recursively, fibonacci(n) with memoization, and sum_linked_list(node) recursively.",
    leetcode: [
      {
        id: 509,
        title: "Fibonacci Number",
        url: "https://leetcode.com/problems/fibonacci-number/",
        tag: "Recursion",
      },
      {
        id: 70,
        title: "Climbing Stairs",
        url: "https://leetcode.com/problems/climbing-stairs/",
        tag: "Recursion/DP",
      },
      {
        id: 344,
        title: "Reverse String",
        url: "https://leetcode.com/problems/reverse-string/",
        tag: "Recursion",
      },
      {
        id: 779,
        title: "K-th Symbol in Grammar",
        url: "https://leetcode.com/problems/k-th-symbol-in-grammar/",
        tag: "Recursion",
      },
      {
        id: 50,
        title: "Pow(x, n)",
        url: "https://leetcode.com/problems/powx-n/",
        tag: "Recursion",
      },
    ],
  },
  {
    id: "phase-5",
    phase: 5,
    title: "Sorting",
    goal: "Understand sorting as applied recursion. Merge Sort is your Phase 4 payoff.",
    lessons: [
      {
        id: "B-10",
        code: "B-10",
        title: "Insertion Sort",
        content:
          "<h2>The Mental Model</h2><p>Like sorting playing cards in your hand. Pick up one card at a time and insert it into the correct position among the already-sorted cards.</p><h2>Algorithm</h2><pre><code>for i in range(1, n):\n  key = arr[i]\n  j = i - 1\n  while j >= 0 and arr[j] > key:\n    arr[j+1] = arr[j]  # shift right\n    j -= 1\n  arr[j+1] = key  # insert</code></pre><h2>Complexity</h2><ul><li><strong>Worst case</strong>: O(n²) — reverse-sorted input</li><li><strong>Best case</strong>: O(n) — already sorted (inner loop never runs)</li><li><strong>Space</strong>: O(1) — in-place</li></ul><p><em>[When to reach for this]</em> Small arrays (n < 20) or nearly-sorted data.</p>",
        visualization: insertionSortViz,
      },
      {
        id: "B-11",
        code: "B-11",
        title: "Merge Sort",
        content:
          "<h2>Why This Matters</h2><p>Merge Sort is recursion applied to sorting. If you can write it from memory, recursion has truly clicked.</p><h2>The Algorithm</h2><ol><li><strong>Divide</strong>: Split array in half</li><li><strong>Conquer</strong>: Recursively sort each half</li><li><strong>Merge</strong>: Combine two sorted halves into one sorted array</li></ol><h2>The Merge Step</h2><pre><code>def merge(left, right):\n  result = []\n  i = j = 0\n  while i < len(left) and j < len(right):\n    if left[i] <= right[j]:\n      result.append(left[i]); i += 1\n    else:\n      result.append(right[j]); j += 1\n  result += left[i:] + right[j:]\n  return result</code></pre><h2>Complexity</h2><p>O(n log n) always. log n levels of recursion × O(n) merge per level. Space: O(n) for the temporary arrays.</p>",
        visualization: mergeSortViz,
      },
      {
        id: "B-12",
        code: "B-12",
        title: "Quick Sort",
        content:
          "<h2>Core Idea</h2><p>Pick a <strong>pivot</strong>. Partition: all elements < pivot go left, all > pivot go right. Pivot is now in its final sorted position. Recurse on left and right.</p><h2>Partition</h2><pre><code>def partition(arr, lo, hi):\n  pivot = arr[hi]\n  i = lo\n  for j in range(lo, hi):\n    if arr[j] < pivot:\n      arr[i], arr[j] = arr[j], arr[i]\n      i += 1\n  arr[i], arr[hi] = arr[hi], arr[i]\n  return i</code></pre><h2>Complexity</h2><ul><li><strong>Average</strong>: O(n log n)</li><li><strong>Worst</strong>: O(n²) — already sorted + bad pivot</li><li><strong>Space</strong>: O(log n) — call stack, in-place otherwise</li></ul><p><em>[When to reach for this]</em> In-place sorting, good cache locality, fast in practice.</p>",
        visualization: quickSortViz,
      },
      {
        id: "B-13",
        code: "B-13",
        title: "Bucket Sort",
        content:
          "<h2>Breaking the O(n log n) Barrier</h2><p>Comparison-based sorts can't do better than O(n log n). But if you know the range of values, you can sort in O(n).</p><h2>Algorithm</h2><ol><li>Create k empty buckets</li><li>Place each element in its bucket: bucket = value / range * k</li><li>Sort each bucket (small, so fast)</li><li>Concatenate all buckets</li></ol><h2>Complexity</h2><p>O(n + k) average, where k = number of buckets. Works best when input is uniformly distributed.</p><p><em>[When to reach for this]</em> Known range, uniform distribution, or integer keys.</p>",
        visualization: bucketSortViz,
      },
    ],
    bossChallenge:
      "Implement Merge Sort completely from memory. If you can write merge() and mergeSort() without help, recursion has truly clicked.",
    leetcode: [
      {
        id: 912,
        title: "Sort an Array",
        url: "https://leetcode.com/problems/sort-an-array/",
        tag: "Sorting",
      },
      {
        id: 75,
        title: "Sort Colors",
        url: "https://leetcode.com/problems/sort-colors/",
        tag: "Sorting",
      },
      {
        id: 148,
        title: "Sort List",
        url: "https://leetcode.com/problems/sort-list/",
        tag: "Merge Sort",
      },
      {
        id: 215,
        title: "Kth Largest Element",
        url: "https://leetcode.com/problems/kth-largest-element-in-an-array/",
        tag: "Quick Select",
      },
      {
        id: 347,
        title: "Top K Frequent Elements",
        url: "https://leetcode.com/problems/top-k-frequent-elements/",
        tag: "Bucket Sort",
      },
    ],
  },
  {
    id: "phase-6",
    phase: 6,
    title: "Binary Search",
    goal: "The template that halves search space in O(log n). Short phase, high interview ROI.",
    lessons: [
      {
        id: "B-14",
        code: "B-14",
        title: "Search Array",
        content:
          "<h2>Why This Matters</h2><p>Binary search appears in ~15% of all interview problems. The template is simple but the variations are tricky.</p><h2>The Template</h2><pre><code>def binary_search(arr, target):\n  lo, hi = 0, len(arr) - 1\n  while lo <= hi:\n    mid = (lo + hi) // 2\n    if arr[mid] == target:\n      return mid\n    elif arr[mid] < target:\n      lo = mid + 1\n    else:\n      hi = mid - 1\n  return -1</code></pre><h2>Key Insight</h2><p>Each comparison eliminates HALF the search space. n → n/2 → n/4 → ... → 1. That's log₂(n) steps.</p><p>For n = 1,000,000: linear search = 1M checks, binary = 20 checks.</p><blockquote>What happens if the array isn't sorted?</blockquote><p>Binary search breaks. It relies on the sorted order to know which half to discard.</p>",
        visualization: binarySearchViz,
      },
      {
        id: "B-15",
        code: "B-15",
        title: "Search Range",
        content:
          '<h2>Beyond Simple Search</h2><p>Binary search works on any <strong>monotonic</strong> property — not just sorted arrays. "Search Range" means finding the first/last occurrence.</p><h2>Find First Occurrence</h2><pre><code>def find_first(arr, target):\n  lo, hi, result = 0, len(arr)-1, -1\n  while lo <= hi:\n    mid = (lo + hi) // 2\n    if arr[mid] == target:\n      result = mid    # save it\n      hi = mid - 1    # keep searching left!\n    elif arr[mid] < target:\n      lo = mid + 1\n    else:\n      hi = mid - 1\n  return result</code></pre><p>The trick: when you find target, don\'t stop! Keep searching the left half for an earlier occurrence.</p><h2>Applications Beyond Arrays</h2><ul><li>Search in rotated sorted array</li><li>Find minimum in rotated array</li><li>Search a 2D matrix</li><li>Find peak element</li></ul>',
        visualization: searchRangeViz,
      },
    ],
    bossChallenge: "Solve Binary Search on a rotated array cold — LC 33.",
    leetcode: [
      {
        id: 704,
        title: "Binary Search",
        url: "https://leetcode.com/problems/binary-search/",
        tag: "Binary Search",
      },
      {
        id: 74,
        title: "Search a 2D Matrix",
        url: "https://leetcode.com/problems/search-a-2d-matrix/",
        tag: "Binary Search",
      },
      {
        id: 33,
        title: "Search in Rotated Sorted Array",
        url: "https://leetcode.com/problems/search-in-rotated-sorted-array/",
        tag: "Binary Search",
      },
      {
        id: 34,
        title: "Find First and Last Position",
        url: "https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/",
        tag: "Search Range",
      },
      {
        id: 153,
        title: "Find Minimum in Rotated Array",
        url: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/",
        tag: "Binary Search",
      },
      {
        id: 875,
        title: "Koko Eating Bananas",
        url: "https://leetcode.com/problems/koko-eating-bananas/",
        tag: "Binary Search on Answer",
      },
    ],
  },
];
