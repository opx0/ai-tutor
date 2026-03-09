import type { DemoPhase } from './types'
import type { VisualizationBlock } from '@/lib/visualization/types'

// ═══════════════════════════════════════════════════════════════════════
// PHASE 7 ⚡ — Trees (Keystone)
// ═══════════════════════════════════════════════════════════════════════

const binaryTreeDfsViz: VisualizationBlock = {
  type: 'graph', initialState: {},
  steps: [
    {
      message: 'Binary tree with root 10. DFS (Depth-First Search) explores as deep as possible before backtracking. Three orders: inorder, preorder, postorder.',
      elements: [
        { type: 'graph', id: 'tree', label: 'Binary Tree', layout: 'tree',
          nodes: [
            { id: 'r', value: '10', state: 'default' },
            { id: 'l', value: '5', state: 'default' },
            { id: 'r2', value: '15', state: 'default' },
            { id: 'll', value: '2', state: 'default' },
            { id: 'lr', value: '7', state: 'default' },
            { id: 'rl', value: '12', state: 'default' },
            { id: 'rr', value: '20', state: 'default' },
          ],
          edges: [
            { source: 'r', target: 'l', state: 'default', directed: true },
            { source: 'r', target: 'r2', state: 'default', directed: true },
            { source: 'l', target: 'll', state: 'default', directed: true },
            { source: 'l', target: 'lr', state: 'default', directed: true },
            { source: 'r2', target: 'rl', state: 'default', directed: true },
            { source: 'r2', target: 'rr', state: 'default', directed: true },
          ],
        },
        { type: 'array', id: 'result', label: 'Inorder Result', items: [] },
        { type: 'log', id: 'log', lines: [
          { text: 'Inorder DFS: left → node → right', kind: 'info' },
          { text: 'For a BST, inorder gives sorted output!', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'Start at root 10. Go LEFT first. Recurse to 5, then go left again to 2. Node 2 has no children — it\'s a leaf. Visit 2.',
      elements: [
        { type: 'graph', id: 'tree', label: 'Binary Tree', layout: 'tree',
          nodes: [
            { id: 'r', value: '10', state: 'comparing' },
            { id: 'l', value: '5', state: 'comparing' },
            { id: 'r2', value: '15', state: 'default' },
            { id: 'll', value: '2', state: 'active' },
            { id: 'lr', value: '7', state: 'default' },
            { id: 'rl', value: '12', state: 'default' },
            { id: 'rr', value: '20', state: 'default' },
          ],
          edges: [
            { source: 'r', target: 'l', state: 'comparing', directed: true },
            { source: 'r', target: 'r2', state: 'default', directed: true },
            { source: 'l', target: 'll', state: 'comparing', directed: true },
            { source: 'l', target: 'lr', state: 'default', directed: true },
            { source: 'r2', target: 'rl', state: 'default', directed: true },
            { source: 'r2', target: 'rr', state: 'default', directed: true },
          ],
        },
        { type: 'array', id: 'result', label: 'Inorder Result', items: [{ value: '2', state: 'active' }] },
        { type: 'log', id: 'log', lines: [
          { text: 'dfs(10) → go LEFT → dfs(5) → go LEFT → dfs(2)', kind: 'call' },
          { text: '2 is a leaf — visit it. Output: [2]', kind: 'return' },
        ] },
      ],
    },
    {
      message: 'Back to 5. Left done, visit 5, then go RIGHT to 7. Visit 7 (leaf). Left subtree of root done: [2, 5, 7].',
      elements: [
        { type: 'graph', id: 'tree', label: 'Binary Tree', layout: 'tree',
          nodes: [
            { id: 'r', value: '10', state: 'comparing' },
            { id: 'l', value: '5', state: 'done' },
            { id: 'r2', value: '15', state: 'default' },
            { id: 'll', value: '2', state: 'done' },
            { id: 'lr', value: '7', state: 'active' },
            { id: 'rl', value: '12', state: 'default' },
            { id: 'rr', value: '20', state: 'default' },
          ],
          edges: [
            { source: 'r', target: 'l', state: 'done', directed: true },
            { source: 'r', target: 'r2', state: 'default', directed: true },
            { source: 'l', target: 'll', state: 'done', directed: true },
            { source: 'l', target: 'lr', state: 'active', directed: true },
            { source: 'r2', target: 'rl', state: 'default', directed: true },
            { source: 'r2', target: 'rr', state: 'default', directed: true },
          ],
        },
        { type: 'array', id: 'result', label: 'Inorder Result', items: [
          { value: '2', state: 'done' }, { value: '5', state: 'done' }, { value: '7', state: 'active' },
        ] },
        { type: 'log', id: 'log', lines: [
          { text: 'Back to 5: left done → visit 5 → go RIGHT → visit 7', kind: 'return' },
          { text: 'Left subtree complete: [2, 5, 7]', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'Visit root 10. Now go RIGHT to 15. Same pattern: left(12) → visit 15 → right(20). Final: [2, 5, 7, 10, 12, 15, 20] — sorted!',
      elements: [
        { type: 'graph', id: 'tree', label: 'Binary Tree — Inorder Complete!', layout: 'tree',
          nodes: [
            { id: 'r', value: '10', state: 'done' },
            { id: 'l', value: '5', state: 'done' },
            { id: 'r2', value: '15', state: 'done' },
            { id: 'll', value: '2', state: 'done' },
            { id: 'lr', value: '7', state: 'done' },
            { id: 'rl', value: '12', state: 'done' },
            { id: 'rr', value: '20', state: 'done' },
          ],
          edges: [
            { source: 'r', target: 'l', state: 'done', directed: true },
            { source: 'r', target: 'r2', state: 'done', directed: true },
            { source: 'l', target: 'll', state: 'done', directed: true },
            { source: 'l', target: 'lr', state: 'done', directed: true },
            { source: 'r2', target: 'rl', state: 'done', directed: true },
            { source: 'r2', target: 'rr', state: 'done', directed: true },
          ],
        },
        { type: 'array', id: 'result', label: 'Inorder Result (sorted!)', items: [
          { value: '2', state: 'done' }, { value: '5', state: 'done' }, { value: '7', state: 'done' },
          { value: '10', state: 'done' }, { value: '12', state: 'done' }, { value: '15', state: 'done' }, { value: '20', state: 'done' },
        ] },
        { type: 'log', id: 'log', lines: [
          { text: 'Visit 10, then right subtree: 12 → 15 → 20', kind: 'return' },
          { text: '✅ Inorder of BST = sorted! [2,5,7,10,12,15,20]', kind: 'info' },
          { text: 'DFS time: O(n), space: O(h) where h = tree height', kind: 'info' },
        ] },
      ],
    },
  ],
}

const bfsViz: VisualizationBlock = {
  type: 'graph', initialState: {},
  steps: [
    {
      message: 'BFS (Breadth-First Search) explores the tree level by level using a QUEUE. Start by enqueuing the root.',
      elements: [
        { type: 'graph', id: 'tree', label: 'Binary Tree — BFS', layout: 'tree',
          nodes: [
            { id: 'r', value: '1', state: 'active' },
            { id: 'l', value: '2', state: 'default' },
            { id: 'r2', value: '3', state: 'default' },
            { id: 'll', value: '4', state: 'default' },
            { id: 'lr', value: '5', state: 'default' },
            { id: 'rl', value: '6', state: 'default' },
            { id: 'rr', value: '7', state: 'default' },
          ],
          edges: [
            { source: 'r', target: 'l', state: 'default', directed: true },
            { source: 'r', target: 'r2', state: 'default', directed: true },
            { source: 'l', target: 'll', state: 'default', directed: true },
            { source: 'l', target: 'lr', state: 'default', directed: true },
            { source: 'r2', target: 'rl', state: 'default', directed: true },
            { source: 'r2', target: 'rr', state: 'default', directed: true },
          ],
        },
        { type: 'array', id: 'queue', label: 'Queue', items: [{ value: '1', state: 'active' }] },
        { type: 'variable', id: 'v-level', name: 'level', value: '0', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'BFS uses a queue: dequeue front, enqueue children', kind: 'info' },
          { text: 'Enqueue root (1). Queue: [1]', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'Dequeue 1 (level 0). Enqueue its children: 2, 3. Queue now holds the entire next level.',
      elements: [
        { type: 'graph', id: 'tree', label: 'Binary Tree — BFS', layout: 'tree',
          nodes: [
            { id: 'r', value: '1', state: 'done' },
            { id: 'l', value: '2', state: 'active' },
            { id: 'r2', value: '3', state: 'active' },
            { id: 'll', value: '4', state: 'default' },
            { id: 'lr', value: '5', state: 'default' },
            { id: 'rl', value: '6', state: 'default' },
            { id: 'rr', value: '7', state: 'default' },
          ],
          edges: [
            { source: 'r', target: 'l', state: 'active', directed: true },
            { source: 'r', target: 'r2', state: 'active', directed: true },
            { source: 'l', target: 'll', state: 'default', directed: true },
            { source: 'l', target: 'lr', state: 'default', directed: true },
            { source: 'r2', target: 'rl', state: 'default', directed: true },
            { source: 'r2', target: 'rr', state: 'default', directed: true },
          ],
        },
        { type: 'array', id: 'queue', label: 'Queue', items: [{ value: '2', state: 'active' }, { value: '3', state: 'active' }] },
        { type: 'variable', id: 'v-level', name: 'level', value: '1', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'Dequeue 1 → visit. Enqueue children: 2, 3', kind: 'swap' },
          { text: 'Level 0 done: [1]. Queue: [2, 3]', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'Dequeue 2 → enqueue 4, 5. Dequeue 3 → enqueue 6, 7. Level 1 complete: [2, 3].',
      elements: [
        { type: 'graph', id: 'tree', label: 'Binary Tree — BFS', layout: 'tree',
          nodes: [
            { id: 'r', value: '1', state: 'done' },
            { id: 'l', value: '2', state: 'done' },
            { id: 'r2', value: '3', state: 'done' },
            { id: 'll', value: '4', state: 'active' },
            { id: 'lr', value: '5', state: 'active' },
            { id: 'rl', value: '6', state: 'active' },
            { id: 'rr', value: '7', state: 'active' },
          ],
          edges: [
            { source: 'r', target: 'l', state: 'done', directed: true },
            { source: 'r', target: 'r2', state: 'done', directed: true },
            { source: 'l', target: 'll', state: 'active', directed: true },
            { source: 'l', target: 'lr', state: 'active', directed: true },
            { source: 'r2', target: 'rl', state: 'active', directed: true },
            { source: 'r2', target: 'rr', state: 'active', directed: true },
          ],
        },
        { type: 'array', id: 'queue', label: 'Queue', items: [
          { value: '4', state: 'active' }, { value: '5', state: 'active' },
          { value: '6', state: 'active' }, { value: '7', state: 'active' },
        ] },
        { type: 'variable', id: 'v-level', name: 'level', value: '2', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'Dequeue 2 → enqueue 4, 5', kind: 'swap' },
          { text: 'Dequeue 3 → enqueue 6, 7', kind: 'swap' },
          { text: 'Level 1: [2, 3]. Queue: [4, 5, 6, 7]', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'Dequeue 4, 5, 6, 7. All are leaves — no children to enqueue. Queue empty. BFS complete: [1, 2, 3, 4, 5, 6, 7].',
      elements: [
        { type: 'graph', id: 'tree', label: 'BFS Complete!', layout: 'tree',
          nodes: [
            { id: 'r', value: '1', state: 'done' },
            { id: 'l', value: '2', state: 'done' },
            { id: 'r2', value: '3', state: 'done' },
            { id: 'll', value: '4', state: 'done' },
            { id: 'lr', value: '5', state: 'done' },
            { id: 'rl', value: '6', state: 'done' },
            { id: 'rr', value: '7', state: 'done' },
          ],
          edges: [
            { source: 'r', target: 'l', state: 'done', directed: true },
            { source: 'r', target: 'r2', state: 'done', directed: true },
            { source: 'l', target: 'll', state: 'done', directed: true },
            { source: 'l', target: 'lr', state: 'done', directed: true },
            { source: 'r2', target: 'rl', state: 'done', directed: true },
            { source: 'r2', target: 'rr', state: 'done', directed: true },
          ],
        },
        { type: 'array', id: 'queue', label: 'Queue (empty)', items: [] },
        { type: 'variable', id: 'v-level', name: 'level', value: '2', state: 'done' },
        { type: 'log', id: 'log', lines: [
          { text: 'Level 2: [4, 5, 6, 7]. No children.', kind: 'info' },
          { text: '✅ BFS order: [1, 2, 3, 4, 5, 6, 7]', kind: 'return' },
          { text: 'O(n) time, O(w) space where w = max width', kind: 'info' },
        ] },
      ],
    },
  ],
}

const trieViz: VisualizationBlock = {
  type: 'graph', initialState: {},
  steps: [
    {
      message: 'A Trie (prefix tree) stores strings character by character. Each edge is a character. Shared prefixes share nodes. Let\'s insert "app", "apple", "apt".',
      elements: [
        { type: 'graph', id: 'trie', label: 'Trie', layout: 'tree',
          nodes: [{ id: 'root', value: 'ROOT', state: 'active' }],
          edges: [],
        },
        { type: 'log', id: 'log', lines: [
          { text: 'Trie: each path from root = one prefix', kind: 'info' },
          { text: 'Insert "app"...', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'Insert "app": Create nodes a → p → p. Mark last p as end-of-word (*). Three characters, three edges.',
      elements: [
        { type: 'graph', id: 'trie', label: 'Trie — after "app"', layout: 'tree',
          nodes: [
            { id: 'root', value: 'ROOT', state: 'default' },
            { id: 'a', value: 'a', state: 'done' },
            { id: 'ap', value: 'p', state: 'done' },
            { id: 'app', value: 'p*', state: 'highlight' },
          ],
          edges: [
            { source: 'root', target: 'a', label: 'a', state: 'done', directed: true },
            { source: 'a', target: 'ap', label: 'p', state: 'done', directed: true },
            { source: 'ap', target: 'app', label: 'p', state: 'done', directed: true },
          ],
        },
        { type: 'log', id: 'log', lines: [
          { text: 'Insert "app": root →a→ p → p*', kind: 'swap' },
          { text: '* marks end-of-word', kind: 'info' },
          { text: 'Insert "apple"...', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'Insert "apple": Follow existing path a→p→p, then ADD l→e. "app" prefix is shared — no duplication! Mark e as end-of-word.',
      elements: [
        { type: 'graph', id: 'trie', label: 'Trie — after "apple"', layout: 'tree',
          nodes: [
            { id: 'root', value: 'ROOT', state: 'default' },
            { id: 'a', value: 'a', state: 'done' },
            { id: 'ap', value: 'p', state: 'done' },
            { id: 'app', value: 'p*', state: 'done' },
            { id: 'appl', value: 'l', state: 'active' },
            { id: 'apple', value: 'e*', state: 'highlight' },
          ],
          edges: [
            { source: 'root', target: 'a', label: 'a', state: 'done', directed: true },
            { source: 'a', target: 'ap', label: 'p', state: 'done', directed: true },
            { source: 'ap', target: 'app', label: 'p', state: 'done', directed: true },
            { source: 'app', target: 'appl', label: 'l', state: 'active', directed: true },
            { source: 'appl', target: 'apple', label: 'e', state: 'active', directed: true },
          ],
        },
        { type: 'log', id: 'log', lines: [
          { text: 'Insert "apple": reuse a→p→p, add l→e*', kind: 'swap' },
          { text: 'Shared prefix "app" — zero extra nodes for it!', kind: 'info' },
          { text: 'Insert "apt"...', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'Insert "apt": Follow a→p (shared), then branch at p with new edge "t". "ap" is the shared prefix. This branching is the Trie\'s power.',
      elements: [
        { type: 'graph', id: 'trie', label: 'Trie — all 3 words', layout: 'tree',
          nodes: [
            { id: 'root', value: 'ROOT', state: 'default' },
            { id: 'a', value: 'a', state: 'done' },
            { id: 'ap', value: 'p', state: 'done' },
            { id: 'app', value: 'p*', state: 'done' },
            { id: 'appl', value: 'l', state: 'done' },
            { id: 'apple', value: 'e*', state: 'done' },
            { id: 'apt', value: 't*', state: 'highlight' },
          ],
          edges: [
            { source: 'root', target: 'a', label: 'a', state: 'done', directed: true },
            { source: 'a', target: 'ap', label: 'p', state: 'done', directed: true },
            { source: 'ap', target: 'app', label: 'p', state: 'done', directed: true },
            { source: 'app', target: 'appl', label: 'l', state: 'done', directed: true },
            { source: 'appl', target: 'apple', label: 'e', state: 'done', directed: true },
            { source: 'ap', target: 'apt', label: 't', state: 'highlight', directed: true },
          ],
        },
        { type: 'log', id: 'log', lines: [
          { text: 'Insert "apt": reuse a→p, branch with t*', kind: 'swap' },
          { text: '✅ 3 words stored, shared prefix "ap" saves space', kind: 'info' },
          { text: 'Search "app": O(m) where m = word length, not n!', kind: 'info' },
          { text: 'Use cases: autocomplete, spell check, IP routing', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 8 — Backtracking
// ═══════════════════════════════════════════════════════════════════════

const subsetsViz: VisualizationBlock = {
  type: 'graph', initialState: {},
  steps: [
    {
      message: 'Generate all subsets of [1, 2, 3]. At each element, we CHOOSE to include it or SKIP it. This builds a binary decision tree.',
      elements: [
        { type: 'graph', id: 'dt', label: 'Decision Tree', layout: 'tree',
          nodes: [
            { id: 'root', value: '[]', state: 'active' },
          ],
          edges: [],
        },
        { type: 'array', id: 'current', label: 'Current Subset', items: [] },
        { type: 'variable', id: 'v-idx', name: 'index', value: '0', state: 'active', description: 'considering 1' },
        { type: 'log', id: 'log', lines: [
          { text: 'Backtracking: explore all choices, undo (backtrack) to try alternatives', kind: 'info' },
          { text: 'For each element: include it OR skip it', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'Include 1. Now decide on 2: include → [1,2], or skip → [1]. If include 2, decide on 3: include → [1,2,3] or skip → [1,2].',
      elements: [
        { type: 'graph', id: 'dt', label: 'Decision Tree — left branch', layout: 'tree',
          nodes: [
            { id: 'root', value: '[]', state: 'visited' },
            { id: 'inc1', value: '[1]', state: 'visited' },
            { id: 'skip1', value: '[]', state: 'default' },
            { id: 'inc12', value: '[1,2]', state: 'visited' },
            { id: 'skip2a', value: '[1]', state: 'default' },
            { id: 'inc123', value: '[1,2,3]', state: 'highlight' },
            { id: 'skip3a', value: '[1,2]', state: 'active' },
          ],
          edges: [
            { source: 'root', target: 'inc1', label: '+1', state: 'visited', directed: true },
            { source: 'root', target: 'skip1', label: 'skip', state: 'default', directed: true },
            { source: 'inc1', target: 'inc12', label: '+2', state: 'visited', directed: true },
            { source: 'inc1', target: 'skip2a', label: 'skip', state: 'default', directed: true },
            { source: 'inc12', target: 'inc123', label: '+3', state: 'highlight', directed: true },
            { source: 'inc12', target: 'skip3a', label: 'skip', state: 'active', directed: true },
          ],
        },
        { type: 'array', id: 'found', label: 'Subsets Found', items: [
          { value: '[1,2,3]', state: 'done' }, { value: '[1,2]', state: 'done' },
        ] },
        { type: 'log', id: 'log', lines: [
          { text: '+1 → +2 → +3 → leaf: [1,2,3] ✓', kind: 'return' },
          { text: 'Backtrack: remove 3 → [1,2] ✓', kind: 'return' },
          { text: 'Now backtrack from 2, try skipping it...', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'Continue exploring: [1,3], [1], [2,3], [2], [3], []. Each leaf of the decision tree is a valid subset. 2^n = 8 subsets total.',
      elements: [
        { type: 'graph', id: 'dt', label: 'Complete Decision Tree', layout: 'tree',
          nodes: [
            { id: 'root', value: '[]', state: 'done' },
            { id: 'inc1', value: '[1]', state: 'done' },
            { id: 'skip1', value: '[]', state: 'done' },
          ],
          edges: [
            { source: 'root', target: 'inc1', label: '+1', state: 'done', directed: true },
            { source: 'root', target: 'skip1', label: 'skip', state: 'done', directed: true },
          ],
        },
        { type: 'array', id: 'found', label: 'All 8 Subsets', items: [
          { value: '[1,2,3]', state: 'done' }, { value: '[1,2]', state: 'done' },
          { value: '[1,3]', state: 'done' }, { value: '[1]', state: 'done' },
          { value: '[2,3]', state: 'done' }, { value: '[2]', state: 'done' },
          { value: '[3]', state: 'done' }, { value: '[]', state: 'done' },
        ] },
        { type: 'log', id: 'log', lines: [
          { text: '✅ All 2^3 = 8 subsets found', kind: 'return' },
          { text: 'Backtracking template:', kind: 'info' },
          { text: '  choose → recurse → UN-choose (backtrack)', kind: 'info' },
          { text: 'Time: O(2^n) — can\'t avoid it, every subset is valid', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 9 — Heaps
// ═══════════════════════════════════════════════════════════════════════

const minHeapViz: VisualizationBlock = {
  type: 'graph', initialState: {},
  steps: [
    {
      message: 'Min-Heap: parent ≤ children. Stored as an array where parent(i) = floor((i-1)/2), left(i) = 2i+1, right(i) = 2i+2. Push 3, then 1.',
      elements: [
        { type: 'graph', id: 'heap', label: 'Min-Heap (tree view)', layout: 'tree',
          nodes: [
            { id: 'n0', value: '5', state: 'default' },
            { id: 'n1', value: '8', state: 'default' },
            { id: 'n2', value: '10', state: 'default' },
          ],
          edges: [
            { source: 'n0', target: 'n1', state: 'default', directed: true },
            { source: 'n0', target: 'n2', state: 'default', directed: true },
          ],
        },
        { type: 'array', id: 'arr', label: 'Heap as Array', items: [
          { value: '5', state: 'default' }, { value: '8', state: 'default' }, { value: '10', state: 'default' },
        ] },
        { type: 'log', id: 'log', lines: [
          { text: 'Heap property: parent ≤ both children', kind: 'info' },
          { text: 'Push 3: add to end, then sift UP', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'Push 3: Add to end of array [5,8,10,3]. Node 3 at index 3. Parent = index 1 (value 8). 3 < 8 → swap! Sift up.',
      elements: [
        { type: 'graph', id: 'heap', label: 'Sifting 3 up...', layout: 'tree',
          nodes: [
            { id: 'n0', value: '5', state: 'default' },
            { id: 'n1', value: '3', state: 'active' },
            { id: 'n2', value: '10', state: 'default' },
            { id: 'n3', value: '8', state: 'comparing' },
          ],
          edges: [
            { source: 'n0', target: 'n1', state: 'active', directed: true },
            { source: 'n0', target: 'n2', state: 'default', directed: true },
            { source: 'n1', target: 'n3', state: 'comparing', directed: true },
          ],
        },
        { type: 'array', id: 'arr', label: 'Heap as Array', items: [
          { value: '5', state: 'default' }, { value: '3', state: 'active' }, { value: '10', state: 'default' }, { value: '8', state: 'comparing' },
        ] },
        { type: 'log', id: 'log', lines: [
          { text: 'Added 3 at index 3. Parent(3) = index 1, value 8', kind: 'compare' },
          { text: '3 < 8 → SWAP positions. Sift up!', kind: 'swap' },
          { text: 'Now check: parent(1) = index 0, value 5', kind: 'compare' },
        ] },
      ],
    },
    {
      message: '3 < 5 → swap again! 3 becomes the root. Heap: [3, 5, 10, 8]. Push done in O(log n) — at most height swaps.',
      elements: [
        { type: 'graph', id: 'heap', label: 'After push(3)', layout: 'tree',
          nodes: [
            { id: 'n0', value: '3', state: 'highlight' },
            { id: 'n1', value: '5', state: 'done' },
            { id: 'n2', value: '10', state: 'done' },
            { id: 'n3', value: '8', state: 'done' },
          ],
          edges: [
            { source: 'n0', target: 'n1', state: 'done', directed: true },
            { source: 'n0', target: 'n2', state: 'done', directed: true },
            { source: 'n1', target: 'n3', state: 'done', directed: true },
          ],
        },
        { type: 'array', id: 'arr', label: 'Heap as Array', items: [
          { value: '3', state: 'highlight' }, { value: '5', state: 'done' }, { value: '10', state: 'done' }, { value: '8', state: 'done' },
        ] },
        { type: 'log', id: 'log', lines: [
          { text: '3 < 5 → swap! 3 is now root', kind: 'swap' },
          { text: '✅ Push complete: [3, 5, 10, 8]', kind: 'return' },
          { text: 'Push = O(log n): add to end + sift up', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'Pop min: Remove root (3). Move last element (8) to root. Sift DOWN: compare 8 with children 5 and 10. 5 < 8 → swap. Heap restored: [5, 8, 10].',
      elements: [
        { type: 'graph', id: 'heap', label: 'After pop() — sifted down', layout: 'tree',
          nodes: [
            { id: 'n0', value: '5', state: 'done' },
            { id: 'n1', value: '8', state: 'done' },
            { id: 'n2', value: '10', state: 'done' },
          ],
          edges: [
            { source: 'n0', target: 'n1', state: 'done', directed: true },
            { source: 'n0', target: 'n2', state: 'done', directed: true },
          ],
        },
        { type: 'array', id: 'arr', label: 'Heap as Array', items: [
          { value: '5', state: 'done' }, { value: '8', state: 'done' }, { value: '10', state: 'done' },
        ] },
        { type: 'variable', id: 'v-popped', name: 'popped', value: '3', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: 'Pop: remove root 3, move 8 to root', kind: 'swap' },
          { text: 'Sift down: 8 > min(5,10)=5 → swap with 5', kind: 'swap' },
          { text: '✅ Pop = O(log n): swap root + sift down', kind: 'return' },
          { text: 'Heap = O(log n) push/pop, O(1) peek min', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 10 — Hashing
// ═══════════════════════════════════════════════════════════════════════

const hashMapViz: VisualizationBlock = {
  type: 'grid', initialState: {},
  steps: [
    {
      message: 'Hash Map: array of "buckets". hash(key) % size = bucket index. Insert ("alice", 90), ("bob", 85), ("eve", 78). Table size = 4.',
      elements: [
        { type: 'grid', id: 'ht', label: 'Hash Table (4 buckets)',
          cells: [
            [{ value: 'empty', state: 'default' }],
            [{ value: 'empty', state: 'default' }],
            [{ value: 'empty', state: 'default' }],
            [{ value: 'empty', state: 'default' }],
          ],
          rowLabels: ['[0]', '[1]', '[2]', '[3]'],
        },
        { type: 'variable', id: 'v-op', name: 'operation', value: 'insert', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'hash(key) % 4 → bucket index', kind: 'info' },
          { text: 'Insert ("alice", 90)...', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'hash("alice") % 4 = 1. Place (alice, 90) in bucket 1. hash("bob") % 4 = 3. Place (bob, 85) in bucket 3. No collisions so far.',
      elements: [
        { type: 'grid', id: 'ht', label: 'Hash Table',
          cells: [
            [{ value: 'empty', state: 'default' }],
            [{ value: 'alice:90', state: 'done' }],
            [{ value: 'empty', state: 'default' }],
            [{ value: 'bob:85', state: 'done' }],
          ],
          rowLabels: ['[0]', '[1]', '[2]', '[3]'],
        },
        { type: 'log', id: 'log', lines: [
          { text: 'hash("alice") % 4 = 1 → bucket[1]', kind: 'swap' },
          { text: 'hash("bob") % 4 = 3 → bucket[3]', kind: 'swap' },
          { text: 'Insert ("eve", 78)... hash("eve") % 4 = 1 💥', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'COLLISION! hash("eve") % 4 = 1, same as alice. Solution: chaining — bucket 1 becomes a linked list: alice → eve. Lookup is still O(1) average.',
      elements: [
        { type: 'grid', id: 'ht', label: 'Hash Table (with chaining)',
          cells: [
            [{ value: 'empty', state: 'default' }],
            [{ value: 'alice:90', state: 'done' }, { value: '→ eve:78', state: 'highlight' }],
            [{ value: 'empty', state: 'default' }],
            [{ value: 'bob:85', state: 'done' }],
          ],
          rowLabels: ['[0]', '[1]', '[2]', '[3]'],
        },
        { type: 'variable', id: 'v-lf', name: 'loadFactor', value: '3/4=0.75', state: 'comparing', description: 'resize threshold' },
        { type: 'log', id: 'log', lines: [
          { text: '💥 COLLISION at bucket 1: alice and eve', kind: 'compare' },
          { text: 'Chaining: bucket[1] = alice:90 → eve:78', kind: 'swap' },
          { text: 'Lookup "eve": hash→1, scan chain → found. Still O(1) avg', kind: 'info' },
          { text: 'Worst case (all collide): O(n). Good hash → rare.', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 11 — Union-Find
// ═══════════════════════════════════════════════════════════════════════

const unionFindViz: VisualizationBlock = {
  type: 'graph', initialState: {},
  steps: [
    {
      message: 'Union-Find: track connected components. Initially 5 separate nodes, each is its own root (parent[i] = i). rank[i] = 0.',
      elements: [
        { type: 'graph', id: 'uf', label: 'Union-Find Forest',
          nodes: [
            { id: '0', value: '0', state: 'active', x: 0, y: 0 },
            { id: '1', value: '1', state: 'active', x: 100, y: 0 },
            { id: '2', value: '2', state: 'active', x: 200, y: 0 },
            { id: '3', value: '3', state: 'active', x: 300, y: 0 },
            { id: '4', value: '4', state: 'active', x: 400, y: 0 },
          ],
          edges: [],
        },
        { type: 'array', id: 'parent', label: 'parent[]', items: [
          { value: '0', state: 'active' }, { value: '1', state: 'active' }, { value: '2', state: 'active' },
          { value: '3', state: 'active' }, { value: '4', state: 'active' },
        ] },
        { type: 'variable', id: 'v-comp', name: 'components', value: '5', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'Each node is its own root. 5 components.', kind: 'info' },
          { text: 'Union(0, 1)...', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'Union(0, 1): find(0)=0, find(1)=1. Different roots → merge! Attach 1 under 0 (by rank). parent[1] = 0. Components: 4.',
      elements: [
        { type: 'graph', id: 'uf', label: 'After Union(0,1)',
          nodes: [
            { id: '0', value: '0', state: 'highlight', x: 50, y: 0 },
            { id: '1', value: '1', state: 'done', x: 50, y: 80 },
            { id: '2', value: '2', state: 'active', x: 200, y: 0 },
            { id: '3', value: '3', state: 'active', x: 300, y: 0 },
            { id: '4', value: '4', state: 'active', x: 400, y: 0 },
          ],
          edges: [
            { source: '1', target: '0', state: 'done', directed: true },
          ],
        },
        { type: 'array', id: 'parent', label: 'parent[]', items: [
          { value: '0', state: 'highlight' }, { value: '0', state: 'done' }, { value: '2', state: 'active' },
          { value: '3', state: 'active' }, { value: '4', state: 'active' },
        ] },
        { type: 'variable', id: 'v-comp', name: 'components', value: '4', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'Union(0,1): merge tree(1) under tree(0)', kind: 'swap' },
          { text: 'parent[1] = 0. Components: 4', kind: 'info' },
          { text: 'Union(2, 3), then Union(0, 2)...', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'Union(2,3): attach 3 under 2. Union(0,2): find(0)=0, find(2)=2. Attach smaller tree under larger. Now {0,1,2,3} is one component.',
      elements: [
        { type: 'graph', id: 'uf', label: 'After Union(0,2)',
          nodes: [
            { id: '0', value: '0', state: 'highlight', x: 150, y: 0 },
            { id: '1', value: '1', state: 'done', x: 75, y: 80 },
            { id: '2', value: '2', state: 'done', x: 225, y: 80 },
            { id: '3', value: '3', state: 'done', x: 225, y: 160 },
            { id: '4', value: '4', state: 'active', x: 400, y: 0 },
          ],
          edges: [
            { source: '1', target: '0', state: 'done', directed: true },
            { source: '2', target: '0', state: 'done', directed: true },
            { source: '3', target: '2', state: 'done', directed: true },
          ],
        },
        { type: 'array', id: 'parent', label: 'parent[]', items: [
          { value: '0', state: 'highlight' }, { value: '0', state: 'done' }, { value: '0', state: 'done' },
          { value: '2', state: 'done' }, { value: '4', state: 'active' },
        ] },
        { type: 'variable', id: 'v-comp', name: 'components', value: '2', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'Union(2,3): parent[3] = 2', kind: 'swap' },
          { text: 'Union(0,2): parent[2] = 0 (union by rank)', kind: 'swap' },
          { text: 'Path compression: find(3) → 3→2→0, compress to 3→0', kind: 'info' },
          { text: '✅ Nearly O(1) per op with path compression + rank', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 12 — Graphs
// ═══════════════════════════════════════════════════════════════════════

const islandsBfsViz: VisualizationBlock = {
  type: 'grid', initialState: {},
  steps: [
    {
      message: 'Number of Islands: Count connected groups of 1s. Grid: 1=land, 0=water. BFS/DFS from each unvisited land cell and mark entire island as visited.',
      elements: [
        { type: 'grid', id: 'grid', label: 'Island Grid',
          cells: [
            [{ value: '1', state: 'active' }, { value: '1', state: 'default' }, { value: '0', state: 'default' }, { value: '0', state: 'default' }],
            [{ value: '1', state: 'default' }, { value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '1', state: 'default' }],
            [{ value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '1', state: 'default' }, { value: '1', state: 'default' }],
          ],
          rowLabels: ['0', '1', '2'],
          colLabels: ['0', '1', '2', '3'],
        },
        { type: 'variable', id: 'v-islands', name: 'islands', value: '0', state: 'default' },
        { type: 'log', id: 'log', lines: [
          { text: 'Scan grid. Found land at (0,0) — start BFS!', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'BFS from (0,0): Visit (0,0), queue neighbors. (0,1)=land → visit. (1,0)=land → visit. Both have no more unvisited land neighbors. Island 1 complete!',
      elements: [
        { type: 'grid', id: 'grid', label: 'Island Grid',
          cells: [
            [{ value: '1', state: 'done' }, { value: '1', state: 'done' }, { value: '0', state: 'default' }, { value: '0', state: 'default' }],
            [{ value: '1', state: 'done' }, { value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '1', state: 'default' }],
            [{ value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '1', state: 'default' }, { value: '1', state: 'default' }],
          ],
          rowLabels: ['0', '1', '2'],
          colLabels: ['0', '1', '2', '3'],
        },
        { type: 'variable', id: 'v-islands', name: 'islands', value: '1', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'BFS from (0,0): visited (0,0),(0,1),(1,0)', kind: 'swap' },
          { text: 'Island #1 complete (3 cells)', kind: 'return' },
          { text: 'Continue scanning... (1,3) is unvisited land', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'Found (1,3)=land. BFS: only (1,3) — surrounded by water on 3 sides and (2,3) below. Visit (2,3), then (2,2). Island 2 done. Continue scan — no more land. Total: 3 islands.',
      elements: [
        { type: 'grid', id: 'grid', label: 'All Islands Found!',
          cells: [
            [{ value: '1', state: 'done' }, { value: '1', state: 'done' }, { value: '0', state: 'visited' }, { value: '0', state: 'visited' }],
            [{ value: '1', state: 'done' }, { value: '0', state: 'visited' }, { value: '0', state: 'visited' }, { value: '1', state: 'highlight' }],
            [{ value: '0', state: 'visited' }, { value: '0', state: 'visited' }, { value: '1', state: 'highlight' }, { value: '1', state: 'highlight' }],
          ],
          rowLabels: ['0', '1', '2'],
          colLabels: ['0', '1', '2', '3'],
        },
        { type: 'variable', id: 'v-islands', name: 'islands', value: '3', state: 'done' },
        { type: 'log', id: 'log', lines: [
          { text: 'Island #2: (1,3) — single cell', kind: 'return' },
          { text: 'Island #3: (2,2),(2,3) — connected', kind: 'return' },
          { text: '✅ 3 islands. O(rows × cols) — visit each cell once', kind: 'info' },
        ] },
      ],
    },
  ],
}

const dijkstraViz: VisualizationBlock = {
  type: 'graph', initialState: {},
  steps: [
    {
      message: 'Dijkstra\'s: Find shortest path from A to all nodes. Initialize dist[A]=0, all others=∞. Use a min-heap to always process the closest unvisited node.',
      elements: [
        { type: 'graph', id: 'g', label: 'Weighted Graph',
          nodes: [
            { id: 'A', value: 'A', state: 'active', x: 0, y: 80 },
            { id: 'B', value: 'B', state: 'default', x: 120, y: 0 },
            { id: 'C', value: 'C', state: 'default', x: 120, y: 160 },
            { id: 'D', value: 'D', state: 'default', x: 260, y: 0 },
            { id: 'E', value: 'E', state: 'default', x: 260, y: 160 },
          ],
          edges: [
            { source: 'A', target: 'B', label: '4', state: 'default', directed: false },
            { source: 'A', target: 'C', label: '2', state: 'default', directed: false },
            { source: 'B', target: 'D', label: '3', state: 'default', directed: false },
            { source: 'C', target: 'B', label: '1', state: 'default', directed: false },
            { source: 'C', target: 'E', label: '5', state: 'default', directed: false },
            { source: 'D', target: 'E', label: '1', state: 'default', directed: false },
          ],
        },
        { type: 'array', id: 'dist', label: 'dist[]', items: [
          { value: '0', state: 'active' }, { value: '∞', state: 'default' }, { value: '∞', state: 'default' },
          { value: '∞', state: 'default' }, { value: '∞', state: 'default' },
        ] },
        { type: 'log', id: 'log', lines: [
          { text: 'dist = [A:0, B:∞, C:∞, D:∞, E:∞]', kind: 'info' },
          { text: 'Process A (dist=0). Relax neighbors...', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'Process A: Relax A→B (0+4=4 < ∞), A→C (0+2=2 < ∞). Update dist[B]=4, dist[C]=2. Next: process C (smallest unvisited dist).',
      elements: [
        { type: 'graph', id: 'g', label: 'Weighted Graph',
          nodes: [
            { id: 'A', value: 'A:0', state: 'done', x: 0, y: 80 },
            { id: 'B', value: 'B:4', state: 'comparing', x: 120, y: 0 },
            { id: 'C', value: 'C:2', state: 'active', x: 120, y: 160 },
            { id: 'D', value: 'D:∞', state: 'default', x: 260, y: 0 },
            { id: 'E', value: 'E:∞', state: 'default', x: 260, y: 160 },
          ],
          edges: [
            { source: 'A', target: 'B', label: '4', state: 'comparing', directed: false },
            { source: 'A', target: 'C', label: '2', state: 'active', directed: false },
            { source: 'B', target: 'D', label: '3', state: 'default', directed: false },
            { source: 'C', target: 'B', label: '1', state: 'default', directed: false },
            { source: 'C', target: 'E', label: '5', state: 'default', directed: false },
            { source: 'D', target: 'E', label: '1', state: 'default', directed: false },
          ],
        },
        { type: 'array', id: 'dist', label: 'dist[]  (A B C D E)', items: [
          { value: '0', state: 'done' }, { value: '4', state: 'comparing' }, { value: '2', state: 'active' },
          { value: '∞', state: 'default' }, { value: '∞', state: 'default' },
        ] },
        { type: 'log', id: 'log', lines: [
          { text: 'Relax A→B: 0+4=4 < ∞ → dist[B]=4', kind: 'swap' },
          { text: 'Relax A→C: 0+2=2 < ∞ → dist[C]=2', kind: 'swap' },
          { text: 'Next: C (dist=2, smallest unvisited)', kind: 'compare' },
        ] },
      ],
    },
    {
      message: 'Process C: Relax C→B (2+1=3 < 4!) dist[B] updated to 3. C→E (2+5=7). Next: process B (dist=3).',
      elements: [
        { type: 'graph', id: 'g', label: 'Weighted Graph',
          nodes: [
            { id: 'A', value: 'A:0', state: 'done', x: 0, y: 80 },
            { id: 'B', value: 'B:3', state: 'active', x: 120, y: 0 },
            { id: 'C', value: 'C:2', state: 'done', x: 120, y: 160 },
            { id: 'D', value: 'D:∞', state: 'default', x: 260, y: 0 },
            { id: 'E', value: 'E:7', state: 'comparing', x: 260, y: 160 },
          ],
          edges: [
            { source: 'A', target: 'B', label: '4', state: 'done', directed: false },
            { source: 'A', target: 'C', label: '2', state: 'done', directed: false },
            { source: 'B', target: 'D', label: '3', state: 'default', directed: false },
            { source: 'C', target: 'B', label: '1', state: 'highlight', directed: false },
            { source: 'C', target: 'E', label: '5', state: 'comparing', directed: false },
            { source: 'D', target: 'E', label: '1', state: 'default', directed: false },
          ],
        },
        { type: 'array', id: 'dist', label: 'dist[]  (A B C D E)', items: [
          { value: '0', state: 'done' }, { value: '3', state: 'highlight' }, { value: '2', state: 'done' },
          { value: '∞', state: 'default' }, { value: '7', state: 'comparing' },
        ] },
        { type: 'log', id: 'log', lines: [
          { text: 'Relax C→B: 2+1=3 < 4 → UPDATE dist[B]=3!', kind: 'swap' },
          { text: 'Found shorter path: A→C→B (cost 3) beats A→B (cost 4)', kind: 'info' },
          { text: 'Relax C→E: 2+5=7 → dist[E]=7', kind: 'swap' },
        ] },
      ],
    },
    {
      message: 'Process B: B→D (3+3=6). Process D: D→E (6+1=7, not better than 7). Process E: no updates. Done! Shortest: A→C→B→D→E = 7.',
      elements: [
        { type: 'graph', id: 'g', label: 'Dijkstra Complete!',
          nodes: [
            { id: 'A', value: 'A:0', state: 'done', x: 0, y: 80 },
            { id: 'B', value: 'B:3', state: 'done', x: 120, y: 0 },
            { id: 'C', value: 'C:2', state: 'done', x: 120, y: 160 },
            { id: 'D', value: 'D:6', state: 'done', x: 260, y: 0 },
            { id: 'E', value: 'E:7', state: 'done', x: 260, y: 160 },
          ],
          edges: [
            { source: 'A', target: 'B', label: '4', state: 'default', directed: false },
            { source: 'A', target: 'C', label: '2', state: 'done', directed: false },
            { source: 'B', target: 'D', label: '3', state: 'done', directed: false },
            { source: 'C', target: 'B', label: '1', state: 'done', directed: false },
            { source: 'C', target: 'E', label: '5', state: 'default', directed: false },
            { source: 'D', target: 'E', label: '1', state: 'done', directed: false },
          ],
        },
        { type: 'array', id: 'dist', label: 'Final dist[]  (A B C D E)', items: [
          { value: '0', state: 'done' }, { value: '3', state: 'done' }, { value: '2', state: 'done' },
          { value: '6', state: 'done' }, { value: '7', state: 'done' },
        ] },
        { type: 'log', id: 'log', lines: [
          { text: 'B→D: 3+3=6 → dist[D]=6', kind: 'swap' },
          { text: 'D→E: 6+1=7 = dist[E] → no update', kind: 'compare' },
          { text: '✅ All shortest paths found from A', kind: 'return' },
          { text: 'O((V+E) log V) with min-heap', kind: 'info' },
        ] },
      ],
    },
  ],
}

const topoSortViz: VisualizationBlock = {
  type: 'graph', initialState: {},
  steps: [
    {
      message: 'Topological Sort: Order vertices of a DAG so every edge u→v has u before v. Use Kahn\'s BFS: start with nodes that have indegree 0.',
      elements: [
        { type: 'graph', id: 'dag', label: 'Course Prerequisites (DAG)',
          nodes: [
            { id: 'A', value: 'Math', state: 'active', x: 0, y: 0 },
            { id: 'B', value: 'CS101', state: 'active', x: 0, y: 100 },
            { id: 'C', value: 'CS201', state: 'default', x: 150, y: 50 },
            { id: 'D', value: 'CS301', state: 'default', x: 300, y: 0 },
            { id: 'E', value: 'CS401', state: 'default', x: 300, y: 100 },
          ],
          edges: [
            { source: 'A', target: 'C', state: 'default', directed: true },
            { source: 'B', target: 'C', state: 'default', directed: true },
            { source: 'C', target: 'D', state: 'default', directed: true },
            { source: 'C', target: 'E', state: 'default', directed: true },
            { source: 'A', target: 'D', state: 'default', directed: true },
          ],
        },
        { type: 'array', id: 'indeg', label: 'Indegree', items: [
          { value: '0', state: 'active' }, { value: '0', state: 'active' }, { value: '2', state: 'default' },
          { value: '2', state: 'default' }, { value: '1', state: 'default' },
        ] },
        { type: 'array', id: 'order', label: 'Topo Order', items: [] },
        { type: 'log', id: 'log', lines: [
          { text: 'Indegree: Math=0, CS101=0, CS201=2, CS301=2, CS401=1', kind: 'info' },
          { text: 'Queue nodes with indegree 0: [Math, CS101]', kind: 'call' },
        ] },
      ],
    },
    {
      message: 'Process Math: add to order, decrement indegree of CS201 (2→1) and CS301 (2→1). Process CS101: decrement CS201 (1→0). CS201 indegree=0 → enqueue!',
      elements: [
        { type: 'graph', id: 'dag', label: 'Course Prerequisites',
          nodes: [
            { id: 'A', value: 'Math', state: 'done', x: 0, y: 0 },
            { id: 'B', value: 'CS101', state: 'done', x: 0, y: 100 },
            { id: 'C', value: 'CS201', state: 'active', x: 150, y: 50 },
            { id: 'D', value: 'CS301', state: 'default', x: 300, y: 0 },
            { id: 'E', value: 'CS401', state: 'default', x: 300, y: 100 },
          ],
          edges: [
            { source: 'A', target: 'C', state: 'done', directed: true },
            { source: 'B', target: 'C', state: 'done', directed: true },
            { source: 'C', target: 'D', state: 'default', directed: true },
            { source: 'C', target: 'E', state: 'default', directed: true },
            { source: 'A', target: 'D', state: 'done', directed: true },
          ],
        },
        { type: 'array', id: 'indeg', label: 'Indegree', items: [
          { value: '—', state: 'done' }, { value: '—', state: 'done' }, { value: '0', state: 'active' },
          { value: '1', state: 'default' }, { value: '1', state: 'default' },
        ] },
        { type: 'array', id: 'order', label: 'Topo Order', items: [
          { value: 'Math', state: 'done' }, { value: 'CS101', state: 'done' },
        ] },
        { type: 'log', id: 'log', lines: [
          { text: 'Process Math: CS201 2→1, CS301 2→1', kind: 'swap' },
          { text: 'Process CS101: CS201 1→0 → enqueue!', kind: 'swap' },
          { text: 'Order so far: [Math, CS101]', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'Process CS201: CS301 (1→0), CS401 (1→0). Both enqueue. Process CS301, CS401. Done! Order: Math → CS101 → CS201 → CS301 → CS401.',
      elements: [
        { type: 'graph', id: 'dag', label: 'Topological Order Found!',
          nodes: [
            { id: 'A', value: 'Math', state: 'done', x: 0, y: 0 },
            { id: 'B', value: 'CS101', state: 'done', x: 0, y: 100 },
            { id: 'C', value: 'CS201', state: 'done', x: 150, y: 50 },
            { id: 'D', value: 'CS301', state: 'done', x: 300, y: 0 },
            { id: 'E', value: 'CS401', state: 'done', x: 300, y: 100 },
          ],
          edges: [
            { source: 'A', target: 'C', state: 'done', directed: true },
            { source: 'B', target: 'C', state: 'done', directed: true },
            { source: 'C', target: 'D', state: 'done', directed: true },
            { source: 'C', target: 'E', state: 'done', directed: true },
            { source: 'A', target: 'D', state: 'done', directed: true },
          ],
        },
        { type: 'array', id: 'order', label: 'Topo Order (complete!)', items: [
          { value: 'Math', state: 'done' }, { value: 'CS101', state: 'done' }, { value: 'CS201', state: 'done' },
          { value: 'CS301', state: 'done' }, { value: 'CS401', state: 'done' },
        ] },
        { type: 'log', id: 'log', lines: [
          { text: '✅ Valid topological order found', kind: 'return' },
          { text: 'All prerequisites come before dependents', kind: 'info' },
          { text: 'O(V+E) — each vertex and edge processed once', kind: 'info' },
          { text: 'If cycle exists → not all nodes processed → detect!', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 13 ⚡ — Dynamic Programming (Keystone)
// ═══════════════════════════════════════════════════════════════════════

const kadanesViz: VisualizationBlock = {
  type: 'array', initialState: {},
  steps: [
    {
      message: 'Kadane\'s Algorithm: Find max subarray sum in [-2, 1, -3, 4, -1, 2, 1, -5, 4]. Track maxEndingHere and maxSoFar.',
      elements: [
        { type: 'array', id: 'arr', label: 'Array', items: [
          { value: '-2', state: 'active' }, { value: '1', state: 'default' }, { value: '-3', state: 'default' },
          { value: '4', state: 'default' }, { value: '-1', state: 'default' }, { value: '2', state: 'default' },
          { value: '1', state: 'default' }, { value: '-5', state: 'default' }, { value: '4', state: 'default' },
        ] },
        { type: 'variable', id: 'v-meh', name: 'maxEndingHere', value: '-2', state: 'active' },
        { type: 'variable', id: 'v-msf', name: 'maxSoFar', value: '-2', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'Key insight: at each position, either EXTEND the current subarray or START FRESH', kind: 'info' },
          { text: 'maxEndingHere = max(arr[i], maxEndingHere + arr[i])', kind: 'info' },
          { text: 'i=0: maxEndingHere = -2, maxSoFar = -2', kind: 'compare' },
        ] },
      ],
    },
    {
      message: 'i=1: max(1, -2+1=-1) = 1. Starting fresh at 1 is better than extending! maxSoFar = 1. i=2: max(-3, 1-3=-2) = -2. Extend. maxSoFar stays 1.',
      elements: [
        { type: 'array', id: 'arr', label: 'Array', items: [
          { value: '-2', state: 'visited' }, { value: '1', state: 'visited' }, { value: '-3', state: 'active' },
          { value: '4', state: 'default' }, { value: '-1', state: 'default' }, { value: '2', state: 'default' },
          { value: '1', state: 'default' }, { value: '-5', state: 'default' }, { value: '4', state: 'default' },
        ] },
        { type: 'variable', id: 'v-meh', name: 'maxEndingHere', value: '-2', state: 'comparing' },
        { type: 'variable', id: 'v-msf', name: 'maxSoFar', value: '1', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: 'i=1: max(1, -2+1) = 1 → START FRESH', kind: 'compare' },
          { text: 'i=2: max(-3, 1-3) = -2 → extend (less negative)', kind: 'compare' },
        ] },
      ],
    },
    {
      message: 'i=3: max(4, -2+4=2) = 4. Start fresh! i=4: max(-1, 4-1=3) = 3. Extend. i=5: max(2, 3+2=5) = 5. Extend! maxSoFar = 5.',
      elements: [
        { type: 'array', id: 'arr', label: 'Array', items: [
          { value: '-2', state: 'visited' }, { value: '1', state: 'visited' }, { value: '-3', state: 'visited' },
          { value: '4', state: 'done' }, { value: '-1', state: 'done' }, { value: '2', state: 'active' },
          { value: '1', state: 'default' }, { value: '-5', state: 'default' }, { value: '4', state: 'default' },
        ] },
        { type: 'variable', id: 'v-meh', name: 'maxEndingHere', value: '5', state: 'active' },
        { type: 'variable', id: 'v-msf', name: 'maxSoFar', value: '5', state: 'highlight' },
        { type: 'log', id: 'log', lines: [
          { text: 'i=3: max(4, -2+4) = 4 → START FRESH at 4', kind: 'compare' },
          { text: 'i=4: max(-1, 4-1) = 3 → extend', kind: 'compare' },
          { text: 'i=5: max(2, 3+2) = 5 → extend. maxSoFar = 5', kind: 'compare' },
        ] },
      ],
    },
    {
      message: 'i=6: 5+1=6. maxSoFar=6! i=7: 6-5=1 > -5, extend. i=8: 1+4=5 > 4, extend. Done! Max subarray sum = 6 from [4,-1,2,1]. O(n) single pass.',
      elements: [
        { type: 'array', id: 'arr', label: 'Array', items: [
          { value: '-2', state: 'visited' }, { value: '1', state: 'visited' }, { value: '-3', state: 'visited' },
          { value: '4', state: 'done' }, { value: '-1', state: 'done' }, { value: '2', state: 'done' },
          { value: '1', state: 'done' }, { value: '-5', state: 'visited' }, { value: '4', state: 'visited' },
        ] },
        { type: 'variable', id: 'v-meh', name: 'maxEndingHere', value: '5', state: 'default' },
        { type: 'variable', id: 'v-msf', name: 'maxSoFar', value: '6', state: 'done', description: '[4,-1,2,1]' },
        { type: 'log', id: 'log', lines: [
          { text: 'i=6: 5+1=6 → maxSoFar = 6!', kind: 'swap' },
          { text: 'i=7: 6-5=1, i=8: 1+4=5', kind: 'compare' },
          { text: '✅ Max subarray sum = 6, subarray [4,-1,2,1]', kind: 'return' },
          { text: 'O(n) time, O(1) space — the beauty of DP thinking', kind: 'info' },
        ] },
      ],
    },
  ],
}

const climbingStairsViz: VisualizationBlock = {
  type: 'array', initialState: {},
  steps: [
    {
      message: 'Climbing Stairs: n=5 steps. You can take 1 or 2 steps at a time. How many distinct ways to reach the top? dp[i] = ways to reach step i.',
      elements: [
        { type: 'array', id: 'dp', label: 'dp[] — ways to reach each step', items: [
          { value: '1', state: 'done' }, { value: '1', state: 'done' }, { value: '?', state: 'default' },
          { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' },
        ] },
        { type: 'variable', id: 'v-i', name: 'computing', value: 'dp[2]', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'Base: dp[0]=1 (standing), dp[1]=1 (one step)', kind: 'info' },
          { text: 'Recurrence: dp[i] = dp[i-1] + dp[i-2]', kind: 'info' },
          { text: 'Why? To reach step i, either come from i-1 (+1 step) or i-2 (+2 steps)', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'dp[2] = dp[1] + dp[0] = 1 + 1 = 2. Two ways: (1+1) or (2). dp[3] = dp[2] + dp[1] = 2 + 1 = 3. Three ways: (1+1+1), (1+2), (2+1).',
      elements: [
        { type: 'array', id: 'dp', label: 'dp[]', items: [
          { value: '1', state: 'done' }, { value: '1', state: 'done' }, { value: '2', state: 'done' },
          { value: '3', state: 'active' }, { value: '?', state: 'default' }, { value: '?', state: 'default' },
        ] },
        { type: 'variable', id: 'v-i', name: 'computing', value: 'dp[3]', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: 'dp[2] = dp[1]+dp[0] = 1+1 = 2', kind: 'return' },
          { text: 'dp[3] = dp[2]+dp[1] = 2+1 = 3', kind: 'return' },
          { text: 'This is literally Fibonacci!', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'dp[4] = 3+2 = 5. dp[5] = 5+3 = 8. Answer: 8 ways to climb 5 stairs! O(n) time, O(n) space (or O(1) with just two variables).',
      elements: [
        { type: 'array', id: 'dp', label: 'dp[] (complete)', items: [
          { value: '1', state: 'done' }, { value: '1', state: 'done' }, { value: '2', state: 'done' },
          { value: '3', state: 'done' }, { value: '5', state: 'done' }, { value: '8', state: 'highlight' },
        ] },
        { type: 'variable', id: 'v-ans', name: 'answer', value: '8', state: 'done', description: '8 ways!' },
        { type: 'log', id: 'log', lines: [
          { text: 'dp[4] = 3+2 = 5', kind: 'return' },
          { text: 'dp[5] = 5+3 = 8', kind: 'return' },
          { text: '✅ 8 distinct ways to climb 5 stairs', kind: 'info' },
          { text: 'DP pattern: define state, find recurrence, fill table', kind: 'info' },
        ] },
      ],
    },
  ],
}

const uniquePathsViz: VisualizationBlock = {
  type: 'grid', initialState: {},
  steps: [
    {
      message: '2D DP: Unique Paths in a 3x4 grid. Can only move right or down. dp[r][c] = ways to reach cell (r,c). First row and first column are all 1 (only one direction).',
      elements: [
        { type: 'grid', id: 'dp', label: 'dp[][] — Unique Paths',
          cells: [
            [{ value: '1', state: 'done' }, { value: '1', state: 'done' }, { value: '1', state: 'done' }, { value: '1', state: 'done' }],
            [{ value: '1', state: 'done' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }],
            [{ value: '1', state: 'done' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'highlight' }],
          ],
          rowLabels: ['0', '1', '2'],
          colLabels: ['0', '1', '2', '3'],
        },
        { type: 'log', id: 'log', lines: [
          { text: 'Base: first row = 1, first col = 1 (only one path)', kind: 'info' },
          { text: 'dp[r][c] = dp[r-1][c] + dp[r][c-1]', kind: 'info' },
          { text: 'Fill (1,1): dp[0][1] + dp[1][0] = 1+1 = 2', kind: 'compare' },
        ] },
      ],
    },
    {
      message: 'Fill row by row. dp[1][1]=2, dp[1][2]=3, dp[1][3]=4. Each cell = sum of cell above + cell to the left.',
      elements: [
        { type: 'grid', id: 'dp', label: 'dp[][] — Unique Paths',
          cells: [
            [{ value: '1', state: 'done' }, { value: '1', state: 'done' }, { value: '1', state: 'done' }, { value: '1', state: 'done' }],
            [{ value: '1', state: 'done' }, { value: '2', state: 'active' }, { value: '3', state: 'active' }, { value: '4', state: 'active' }],
            [{ value: '1', state: 'done' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'highlight' }],
          ],
          rowLabels: ['0', '1', '2'],
          colLabels: ['0', '1', '2', '3'],
        },
        { type: 'log', id: 'log', lines: [
          { text: 'dp[1][1] = 1+1 = 2', kind: 'swap' },
          { text: 'dp[1][2] = 1+2 = 3', kind: 'swap' },
          { text: 'dp[1][3] = 1+3 = 4', kind: 'swap' },
        ] },
      ],
    },
    {
      message: 'Fill row 2: dp[2][1]=1+2=3, dp[2][2]=3+3=6, dp[2][3]=4+6=10. Answer: 10 unique paths to bottom-right!',
      elements: [
        { type: 'grid', id: 'dp', label: 'dp[][] Complete!',
          cells: [
            [{ value: '1', state: 'done' }, { value: '1', state: 'done' }, { value: '1', state: 'done' }, { value: '1', state: 'done' }],
            [{ value: '1', state: 'done' }, { value: '2', state: 'done' }, { value: '3', state: 'done' }, { value: '4', state: 'done' }],
            [{ value: '1', state: 'done' }, { value: '3', state: 'done' }, { value: '6', state: 'done' }, { value: '10', state: 'highlight' }],
          ],
          rowLabels: ['0', '1', '2'],
          colLabels: ['0', '1', '2', '3'],
        },
        { type: 'variable', id: 'v-ans', name: 'answer', value: '10', state: 'done' },
        { type: 'log', id: 'log', lines: [
          { text: 'dp[2][1]=3, dp[2][2]=6, dp[2][3]=10', kind: 'swap' },
          { text: '✅ 10 unique paths in 3×4 grid', kind: 'return' },
          { text: 'O(m×n) time and space. Classic 2D DP!', kind: 'info' },
        ] },
      ],
    },
  ],
}

const knapsackViz: VisualizationBlock = {
  type: 'grid', initialState: {},
  steps: [
    {
      message: '0/1 Knapsack: Items [(weight=1, val=6), (w=2, v=10), (w=3, v=12)], capacity=5. dp[i][w] = max value using first i items with capacity w.',
      elements: [
        { type: 'grid', id: 'dp', label: 'dp[items][capacity]',
          cells: [
            [{ value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }],
            [{ value: '0', state: 'done' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }],
            [{ value: '0', state: 'done' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }],
            [{ value: '0', state: 'done' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }],
          ],
          rowLabels: ['0 items', 'item1(1,6)', 'item2(2,10)', 'item3(3,12)'],
          colLabels: ['cap=0', 'cap=1', 'cap=2', 'cap=3', 'cap=4', 'cap=5'],
        },
        { type: 'log', id: 'log', lines: [
          { text: 'For each item, decide: INCLUDE it or EXCLUDE it', kind: 'info' },
          { text: 'dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt] + val)', kind: 'info' },
          { text: 'Row 0 (no items) = all zeros', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'Row 1 (item1: w=1, v=6): For cap≥1, we CAN take item1. dp[1][w] = max(skip=0, take=6). All caps ≥ 1 get value 6.',
      elements: [
        { type: 'grid', id: 'dp', label: 'dp[items][capacity]',
          cells: [
            [{ value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }],
            [{ value: '0', state: 'done' }, { value: '6', state: 'active' }, { value: '6', state: 'active' }, { value: '6', state: 'active' }, { value: '6', state: 'active' }, { value: '6', state: 'active' }],
            [{ value: '0', state: 'done' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }],
            [{ value: '0', state: 'done' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }],
          ],
          rowLabels: ['0 items', 'item1(1,6)', 'item2(2,10)', 'item3(3,12)'],
          colLabels: ['cap=0', 'cap=1', 'cap=2', 'cap=3', 'cap=4', 'cap=5'],
        },
        { type: 'log', id: 'log', lines: [
          { text: 'Item1 (w=1,v=6): fits in all cap ≥ 1', kind: 'compare' },
          { text: 'dp[1][1] = max(skip=0, take=0+6) = 6', kind: 'swap' },
          { text: 'dp[1][2..5] = 6 (only 1 item available)', kind: 'swap' },
        ] },
      ],
    },
    {
      message: 'Row 2 (item2: w=2, v=10): cap=1: can\'t fit, skip → 6. cap=2: max(skip=6, take=0+10) = 10. cap=3: max(6, 6+10=16) = 16! Both items fit.',
      elements: [
        { type: 'grid', id: 'dp', label: 'dp[items][capacity]',
          cells: [
            [{ value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }],
            [{ value: '0', state: 'done' }, { value: '6', state: 'done' }, { value: '6', state: 'done' }, { value: '6', state: 'done' }, { value: '6', state: 'done' }, { value: '6', state: 'done' }],
            [{ value: '0', state: 'done' }, { value: '6', state: 'active' }, { value: '10', state: 'active' }, { value: '16', state: 'highlight' }, { value: '16', state: 'active' }, { value: '16', state: 'active' }],
            [{ value: '0', state: 'done' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }, { value: '?', state: 'default' }],
          ],
          rowLabels: ['0 items', 'item1(1,6)', 'item2(2,10)', 'item3(3,12)'],
          colLabels: ['cap=0', 'cap=1', 'cap=2', 'cap=3', 'cap=4', 'cap=5'],
        },
        { type: 'log', id: 'log', lines: [
          { text: 'dp[2][1]: can\'t fit item2 (w=2) → skip = 6', kind: 'compare' },
          { text: 'dp[2][2]: max(skip=6, take=dp[1][0]+10=10) = 10', kind: 'swap' },
          { text: 'dp[2][3]: max(6, dp[1][1]+10=16) = 16 ← both items!', kind: 'swap' },
        ] },
      ],
    },
    {
      message: 'Row 3 (item3: w=3, v=12): dp[3][5] = max(skip=16, take=dp[2][2]+12=22) = 22. Take items 2+3 (w=2+3=5, v=10+12=22). Optimal!',
      elements: [
        { type: 'grid', id: 'dp', label: 'dp[][] Complete!',
          cells: [
            [{ value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }, { value: '0', state: 'done' }],
            [{ value: '0', state: 'done' }, { value: '6', state: 'done' }, { value: '6', state: 'done' }, { value: '6', state: 'done' }, { value: '6', state: 'done' }, { value: '6', state: 'done' }],
            [{ value: '0', state: 'done' }, { value: '6', state: 'done' }, { value: '10', state: 'done' }, { value: '16', state: 'done' }, { value: '16', state: 'done' }, { value: '16', state: 'done' }],
            [{ value: '0', state: 'done' }, { value: '6', state: 'done' }, { value: '10', state: 'done' }, { value: '16', state: 'done' }, { value: '18', state: 'done' }, { value: '22', state: 'highlight' }],
          ],
          rowLabels: ['0 items', 'item1(1,6)', 'item2(2,10)', 'item3(3,12)'],
          colLabels: ['cap=0', 'cap=1', 'cap=2', 'cap=3', 'cap=4', 'cap=5'],
        },
        { type: 'variable', id: 'v-ans', name: 'maxValue', value: '22', state: 'done', description: 'items 2+3' },
        { type: 'log', id: 'log', lines: [
          { text: 'dp[3][5] = max(16, dp[2][2]+12) = max(16, 22) = 22', kind: 'swap' },
          { text: '✅ Max value = 22 (items 2 & 3, weight 5)', kind: 'return' },
          { text: 'O(n×W) time/space. Pseudo-polynomial.', kind: 'info' },
        ] },
      ],
    },
  ],
}

// ═══════════════════════════════════════════════════════════════════════
// PHASE 14 — Bit Manipulation
// ═══════════════════════════════════════════════════════════════════════

const bitOpsViz: VisualizationBlock = {
  type: 'array', initialState: {},
  steps: [
    {
      message: 'Bit Manipulation: computers store everything as binary. Let\'s see AND, OR, XOR on 5 (0101) and 3 (0011).',
      elements: [
        { type: 'array', id: 'a', label: '5 in binary', items: [
          { value: '0', state: 'default' }, { value: '1', state: 'active' }, { value: '0', state: 'default' }, { value: '1', state: 'active' },
        ] },
        { type: 'array', id: 'b', label: '3 in binary', items: [
          { value: '0', state: 'default' }, { value: '0', state: 'default' }, { value: '1', state: 'active' }, { value: '1', state: 'active' },
        ] },
        { type: 'variable', id: 'v-a', name: 'a', value: '5 (0101)', state: 'active' },
        { type: 'variable', id: 'v-b', name: 'b', value: '3 (0011)', state: 'active' },
        { type: 'log', id: 'log', lines: [
          { text: '5 = 0101, 3 = 0011', kind: 'info' },
          { text: 'AND: both bits 1 → 1. OR: either bit 1 → 1. XOR: different → 1', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'AND (5 & 3): 0101 & 0011 = 0001 = 1. Only position 0 has both bits set. AND is useful for masking — extracting specific bits.',
      elements: [
        { type: 'array', id: 'a', label: '5 = 0101', items: [
          { value: '0', state: 'default' }, { value: '1', state: 'comparing' }, { value: '0', state: 'default' }, { value: '1', state: 'comparing' },
        ] },
        { type: 'array', id: 'b', label: '3 = 0011', items: [
          { value: '0', state: 'default' }, { value: '0', state: 'comparing' }, { value: '1', state: 'comparing' }, { value: '1', state: 'comparing' },
        ] },
        { type: 'array', id: 'res', label: '5 & 3 = 0001', items: [
          { value: '0', state: 'default' }, { value: '0', state: 'error' }, { value: '0', state: 'error' }, { value: '1', state: 'done' },
        ] },
        { type: 'variable', id: 'v-res', name: '5 & 3', value: '1', state: 'done' },
        { type: 'log', id: 'log', lines: [
          { text: '0&0=0, 1&0=0, 0&1=0, 1&1=1', kind: 'compare' },
          { text: 'AND = 0001 = 1', kind: 'return' },
          { text: 'Use: check if bit is set: n & (1 << k)', kind: 'info' },
        ] },
      ],
    },
    {
      message: 'XOR (5 ^ 3): 0101 ^ 0011 = 0110 = 6. XOR is 1 where bits DIFFER. Key property: a ^ a = 0, a ^ 0 = a. This finds the single unique number!',
      elements: [
        { type: 'array', id: 'a', label: '5 = 0101', items: [
          { value: '0', state: 'default' }, { value: '1', state: 'highlight' }, { value: '0', state: 'highlight' }, { value: '1', state: 'default' },
        ] },
        { type: 'array', id: 'b', label: '3 = 0011', items: [
          { value: '0', state: 'default' }, { value: '0', state: 'highlight' }, { value: '1', state: 'highlight' }, { value: '1', state: 'default' },
        ] },
        { type: 'array', id: 'res', label: '5 ^ 3 = 0110', items: [
          { value: '0', state: 'default' }, { value: '1', state: 'done' }, { value: '1', state: 'done' }, { value: '0', state: 'default' },
        ] },
        { type: 'variable', id: 'v-res', name: '5 ^ 3', value: '6', state: 'done' },
        { type: 'log', id: 'log', lines: [
          { text: '0^0=0, 1^0=1, 0^1=1, 1^1=0', kind: 'compare' },
          { text: 'XOR = 0110 = 6', kind: 'return' },
          { text: 'Magic: XOR all elements in [2,3,2] → 2^3^2 = 3. Duplicates cancel!', kind: 'info' },
          { text: 'LC 136 "Single Number" — XOR everything → O(n), O(1)', kind: 'info' },
        ] },
      ],
    },
  ],
}


// ═══════════════════════════════════════════════════════════════════════
// EXPORT: ALL ADVANCED PHASES
// ═══════════════════════════════════════════════════════════════════════

export const advancedPhases: DemoPhase[] = [
  // ─── Phase 7 ⚡ Trees (Keystone) ──────────────────────────────────
  {
    id: 'phase-7', phase: 7, title: 'Trees, Trie & Segment Tree',
    goal: 'Trees are the backbone of 30% of interview problems. Master DFS, BFS, and specialized tree structures.',
    keystone: true,
    lessons: [
      { id: 'B-16', code: 'B-16', title: 'Binary Tree & DFS', content: '<h2>Core Idea</h2><p>A <strong>binary tree</strong> is a node with at most two children (left, right). A <strong>Binary Search Tree (BST)</strong> adds the invariant: left < node < right.</p><h2>DFS — Three Orders</h2><ul><li><strong>Inorder</strong> (left → node → right) — gives sorted output for BSTs</li><li><strong>Preorder</strong> (node → left → right) — useful for serialization</li><li><strong>Postorder</strong> (left → right → node) — useful for deletion, evaluation</li></ul><pre><code>def inorder(node):\n  if not node: return\n  inorder(node.left)\n  print(node.val)   # visit\n  inorder(node.right)</code></pre><h2>Complexity</h2><p>O(n) time (visit every node), O(h) space (call stack = height). Balanced: h = log n. Skewed: h = n.</p>', visualization: binaryTreeDfsViz },
      { id: 'B-17', code: 'B-17', title: 'BFS (Level-Order)', content: '<h2>When to Use BFS vs DFS</h2><ul><li><strong>BFS</strong>: level-order, shortest path in unweighted graph, minimum depth</li><li><strong>DFS</strong>: path finding, backtracking, checking properties (balanced, symmetric)</li></ul><h2>The BFS Template</h2><pre><code>from collections import deque\ndef bfs(root):\n  queue = deque([root])\n  while queue:\n    node = queue.popleft()\n    # process node\n    if node.left: queue.append(node.left)\n    if node.right: queue.append(node.right)</code></pre><h2>Level-Order Variation</h2><p>Process entire level at once by iterating <code>for _ in range(len(queue))</code> within the loop. Useful for "zigzag", "right side view", "level averages".</p>', visualization: bfsViz },
      { id: 'B-18', code: 'B-18', title: 'Trie (Prefix Tree)', content: '<h2>Why This Matters</h2><p>Tries enable O(m) lookup where m = word length, independent of the number of words stored. Hash maps give O(m) average, but Tries also support <strong>prefix queries</strong>.</p><h2>Core Operations</h2><ul><li><strong>Insert(word)</strong> — O(m): walk/create nodes for each character</li><li><strong>Search(word)</strong> — O(m): walk nodes, check end-of-word flag</li><li><strong>StartsWith(prefix)</strong> — O(m): same as search, but don\'t check end flag</li></ul><h2>Implementation</h2><pre><code>class TrieNode:\n  def __init__(self):\n    self.children = {}  # char → TrieNode\n    self.is_end = False</code></pre><p><em>[When to reach for this]</em> Autocomplete, spell checker, IP routing tables, word games (Boggle).</p>', visualization: trieViz },
      { id: 'B-19', code: 'B-19', title: 'Segment Tree', content: '<h2>Why This Matters</h2><p>Prefix sums handle static arrays. But what if the array <strong>changes</strong>? Segment Tree answers range queries AND supports updates in O(log n).</p><h2>Core Idea</h2><p>Build a balanced binary tree where each node stores the aggregate (sum/min/max) of a range. Leaves = individual elements. Internal nodes = merge of children.</p><h2>Operations</h2><ul><li><strong>Build</strong> — O(n)</li><li><strong>Query(l, r)</strong> — O(log n): recursively combine relevant segments</li><li><strong>Update(i, val)</strong> — O(log n): update leaf, propagate up</li></ul><h2>When to Use</h2><p>Range sum + point update, range min/max queries, competitive programming. Overkill for interviews unless specifically asked.</p>', visualization: null },
    ],
    bossChallenge: 'Implement DFS inorder, preorder, and postorder iteratively (without recursion, using an explicit stack). Then implement BFS level-order.',
    leetcode: [
      { id: 226, title: 'Invert Binary Tree', url: 'https://leetcode.com/problems/invert-binary-tree/', tag: 'DFS' },
      { id: 104, title: 'Maximum Depth of Binary Tree', url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/', tag: 'DFS' },
      { id: 102, title: 'Binary Tree Level Order Traversal', url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/', tag: 'BFS' },
      { id: 208, title: 'Implement Trie', url: 'https://leetcode.com/problems/implement-trie-prefix-tree/', tag: 'Trie' },
      { id: 98, title: 'Validate BST', url: 'https://leetcode.com/problems/validate-binary-search-tree/', tag: 'BST' },
    ],
  },
  // ─── Phase 8: Backtracking ────────────────────────────────────────
  {
    id: 'phase-8', phase: 8, title: 'Backtracking',
    goal: 'Systematically explore all possibilities using choose → explore → un-choose.',
    lessons: [
      { id: 'A-6', code: 'A-6', title: 'Subsets', content: '<h2>The Template</h2><pre><code>def backtrack(start, current):\n  result.append(current.copy())  # every state is a valid subset\n  for i in range(start, len(nums)):\n    current.append(nums[i])     # CHOOSE\n    backtrack(i + 1, current)    # EXPLORE\n    current.pop()                # UN-CHOOSE</code></pre><h2>Why It Works</h2><p>At each element, we either include it or skip it. The recursion tree has 2^n leaves — one per subset. The <code>start</code> parameter prevents duplicate subsets.</p><h2>Key Insight</h2><p>Backtracking is DFS on an <strong>implicit decision tree</strong>. The tree isn\'t stored in memory — we build/destroy it as we recurse.</p>', visualization: subsetsViz },
      { id: 'A-7', code: 'A-7', title: 'Permutations', content: '<h2>Permutations vs Subsets</h2><p>Subsets: choose/skip each element. Permutations: choose the <strong>order</strong> of all elements. For [1,2,3], there are 3! = 6 permutations.</p><h2>Template</h2><pre><code>def backtrack(current):\n  if len(current) == len(nums):\n    result.append(current.copy())\n    return\n  for num in nums:\n    if num in current: continue   # skip used\n    current.append(num)           # choose\n    backtrack(current)             # explore\n    current.pop()                  # un-choose</code></pre><p><em>[Optimization]</em> Use a <code>used</code> boolean array instead of <code>in</code> for O(1) lookup.</p>', visualization: null },
      { id: 'A-8', code: 'A-8', title: 'N-Queens', content: '<h2>The Classic</h2><p>Place N queens on an N×N chessboard so no two queens attack each other (same row, column, or diagonal).</p><h2>Approach</h2><p>Place one queen per row. For each row, try each column. Before placing, check column and both diagonals.</p><h2>Pruning</h2><pre><code>cols = set()     # occupied columns\ndiag1 = set()    # row - col (main diagonal)\ndiag2 = set()    # row + col (anti-diagonal)\n\ndef backtrack(row):\n  if row == n: result.append(board.copy())\n  for col in range(n):\n    if col in cols or (row-col) in diag1 or (row+col) in diag2:\n      continue  # PRUNE — skip invalid placement\n    # place queen, recurse, remove queen</code></pre><p>Pruning is what makes backtracking efficient — we don\'t explore clearly invalid branches.</p>', visualization: null },
    ],
    bossChallenge: 'Solve N-Queens for N=4 on paper, drawing the decision tree. Then code it without looking at the template.',
    leetcode: [
      { id: 78, title: 'Subsets', url: 'https://leetcode.com/problems/subsets/', tag: 'Backtracking' },
      { id: 46, title: 'Permutations', url: 'https://leetcode.com/problems/permutations/', tag: 'Backtracking' },
      { id: 51, title: 'N-Queens', url: 'https://leetcode.com/problems/n-queens/', tag: 'Backtracking' },
      { id: 39, title: 'Combination Sum', url: 'https://leetcode.com/problems/combination-sum/', tag: 'Backtracking' },
    ],
  },
  // ─── Phase 9: Heaps ───────────────────────────────────────────────
  {
    id: 'phase-9', phase: 9, title: 'Heaps & Priority Queues',
    goal: 'Master the heap for "top K", "running median", and scheduling problems.',
    lessons: [
      { id: 'B-20', code: 'B-20', title: 'Min-Heap Push & Pop', content: '<h2>What is a Heap?</h2><p>A <strong>min-heap</strong> is a complete binary tree where parent ≤ children. The minimum is always at the root. Stored as an array for efficiency.</p><h2>Key Operations</h2><ul><li><strong>push(x)</strong> — O(log n): add to end, sift up</li><li><strong>pop()</strong> — O(log n): swap root with last, remove last, sift down</li><li><strong>peek()</strong> — O(1): return root</li></ul><h2>Array Representation</h2><pre><code>parent(i)     = (i - 1) // 2\nleft_child(i)  = 2 * i + 1\nright_child(i) = 2 * i + 2</code></pre><p>Complete binary tree → no gaps in array → excellent cache performance.</p>', visualization: minHeapViz },
      { id: 'B-21', code: 'B-21', title: 'Top K & Two Heaps', content: '<h2>Top K Pattern</h2><p>Find the K largest elements: maintain a <strong>min-heap of size K</strong>. Push each element; if heap size > K, pop the min. Final heap = K largest.</p><pre><code>import heapq\ndef topK(nums, k):\n  heap = []\n  for num in nums:\n    heapq.heappush(heap, num)\n    if len(heap) > k:\n      heapq.heappop(heap)  # remove smallest\n  return heap</code></pre><p>O(n log k) — much better than O(n log n) sorting when k << n.</p><h2>Two Heaps: Running Median</h2><p>Max-heap for lower half, min-heap for upper half. Median = top of max-heap (or average of both tops). Each insert: O(log n).</p>', visualization: null },
    ],
    bossChallenge: 'Implement a min-heap class from scratch with push, pop, and peek. Then solve "K Closest Points to Origin" (LC 973).',
    leetcode: [
      { id: 215, title: 'Kth Largest Element', url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/', tag: 'Heap' },
      { id: 295, title: 'Find Median from Data Stream', url: 'https://leetcode.com/problems/find-median-from-data-stream/', tag: 'Two Heaps' },
      { id: 973, title: 'K Closest Points to Origin', url: 'https://leetcode.com/problems/k-closest-points-to-origin/', tag: 'Heap' },
    ],
  },
  // ─── Phase 10: Hashing ────────────────────────────────────────────
  {
    id: 'phase-10', phase: 10, title: 'Hashing',
    goal: 'Understand hash maps deeply — collisions, load factors, and the patterns they unlock.',
    lessons: [
      { id: 'B-22', code: 'B-22', title: 'Hash Map Internals', content: '<h2>How Hash Maps Work</h2><ol><li>Compute <code>hash(key)</code> — turns any key into an integer</li><li>Compute <code>index = hash % table_size</code> — maps to a bucket</li><li>Store (key, value) in that bucket</li></ol><h2>Collisions</h2><p>When two keys map to the same bucket:</p><ul><li><strong>Chaining</strong> — each bucket is a linked list. O(1) avg, O(n) worst.</li><li><strong>Open Addressing</strong> — probe the next empty slot. Better cache locality.</li></ul><h2>Load Factor</h2><p>α = n/m (items/buckets). When α > 0.75, resize (double table, rehash everything). This keeps operations O(1) amortized.</p>', visualization: hashMapViz },
      { id: 'B-23', code: 'B-23', title: 'Hash Set & Patterns', content: '<h2>Hash Set</h2><p>A hash map without values — just keys. O(1) membership testing. Use it whenever you need fast "have I seen this?" checks.</p><h2>Common Patterns</h2><ul><li><strong>Two Sum</strong>: For each element, check if (target - element) is in the set. O(n).</li><li><strong>Frequency Count</strong>: Use a hash map to count occurrences. O(n).</li><li><strong>Group Anagrams</strong>: Hash by sorted characters. O(n × m log m).</li><li><strong>Subarray Sum = K</strong>: Store prefix sums in a hash map. O(n).</li></ul><pre><code># Two Sum in O(n)\nseen = {}\nfor i, num in enumerate(nums):\n  complement = target - num\n  if complement in seen:\n    return [seen[complement], i]\n  seen[num] = i</code></pre>', visualization: null },
    ],
    bossChallenge: 'Implement a hash map from scratch (array + chaining) with get, put, and remove. Then solve Group Anagrams (LC 49).',
    leetcode: [
      { id: 1, title: 'Two Sum', url: 'https://leetcode.com/problems/two-sum/', tag: 'Hash Map' },
      { id: 49, title: 'Group Anagrams', url: 'https://leetcode.com/problems/group-anagrams/', tag: 'Hashing' },
      { id: 128, title: 'Longest Consecutive Sequence', url: 'https://leetcode.com/problems/longest-consecutive-sequence/', tag: 'Hash Set' },
    ],
  },
  // ─── Phase 11: Union-Find ─────────────────────────────────────────
  {
    id: 'phase-11', phase: 11, title: 'Union-Find',
    goal: 'Track connected components with near-constant time operations.',
    lessons: [
      { id: 'B-24', code: 'B-24', title: 'Union-Find with Path Compression', content: '<h2>The Data Structure</h2><p><strong>Union-Find</strong> (Disjoint Set) tracks groups of connected elements. Two operations:</p><ul><li><strong>find(x)</strong> — returns the root/representative of x\'s group</li><li><strong>union(x, y)</strong> — merges the groups of x and y</li></ul><h2>Optimizations</h2><ul><li><strong>Union by rank</strong> — attach shorter tree under taller tree. Keeps trees balanced.</li><li><strong>Path compression</strong> — during find(x), make every node on the path point directly to root. Nearly O(1) amortized.</li></ul><pre><code>class UnionFind:\n  def __init__(self, n):\n    self.parent = list(range(n))\n    self.rank = [0] * n\n  def find(self, x):\n    if self.parent[x] != x:\n      self.parent[x] = self.find(self.parent[x])  # path compression\n    return self.parent[x]\n  def union(self, x, y):\n    px, py = self.find(x), self.find(y)\n    if px == py: return\n    if self.rank[px] < self.rank[py]: px, py = py, px\n    self.parent[py] = px\n    if self.rank[px] == self.rank[py]: self.rank[px] += 1</code></pre>', visualization: unionFindViz },
      { id: 'B-25', code: 'B-25', title: 'Connected Components', content: '<h2>The Pattern</h2><p>Union-Find shines when you need to:</p><ol><li>Dynamically add connections between elements</li><li>Query whether two elements are connected</li><li>Count the number of distinct groups</li></ol><h2>Classic Problems</h2><ul><li><strong>Number of Connected Components</strong> — union edges, count distinct roots</li><li><strong>Redundant Connection</strong> — union each edge; if find(u)==find(v) before union, that edge creates a cycle</li><li><strong>Accounts Merge</strong> — union accounts that share an email</li></ul><h2>Union-Find vs BFS/DFS</h2><p>BFS/DFS works on static graphs. Union-Find is better when edges are <strong>added incrementally</strong> (streaming/online problems).</p>', visualization: null },
    ],
    bossChallenge: 'Implement Union-Find from memory. Then solve Redundant Connection (LC 684) — find the edge that creates a cycle.',
    leetcode: [
      { id: 200, title: 'Number of Islands', url: 'https://leetcode.com/problems/number-of-islands/', tag: 'Union-Find/BFS' },
      { id: 684, title: 'Redundant Connection', url: 'https://leetcode.com/problems/redundant-connection/', tag: 'Union-Find' },
      { id: 721, title: 'Accounts Merge', url: 'https://leetcode.com/problems/accounts-merge/', tag: 'Union-Find' },
    ],
  },
  // ─── Phase 12: Graphs ─────────────────────────────────────────────
  {
    id: 'phase-12', phase: 12, title: 'Graphs, Dijkstra & Topo Sort',
    goal: 'The final data structure frontier. Graph problems combine everything you\'ve learned.',
    lessons: [
      { id: 'A-9', code: 'A-9', title: 'Graph BFS — Islands', content: '<h2>Graph Representation</h2><ul><li><strong>Adjacency List</strong> — dict/array of lists. Space: O(V+E). Best for sparse graphs.</li><li><strong>Adjacency Matrix</strong> — 2D array. Space: O(V²). Best for dense graphs.</li><li><strong>Implicit Graph</strong> — grid where each cell connects to neighbors.</li></ul><h2>Grid BFS — Number of Islands</h2><p>Treat each land cell as a node. Edges connect adjacent land cells. BFS/DFS from each unvisited land cell = one island.</p><pre><code>def numIslands(grid):\n  count = 0\n  for r in range(rows):\n    for c in range(cols):\n      if grid[r][c] == "1":\n        count += 1\n        bfs(grid, r, c)  # mark entire island visited\n  return count</code></pre>', visualization: islandsBfsViz },
      { id: 'A-10', code: 'A-10', title: 'Dijkstra\'s Algorithm', content: '<h2>Shortest Path in Weighted Graphs</h2><p>BFS finds shortest path in unweighted graphs. For weighted (non-negative) edges, use <strong>Dijkstra\'s</strong>.</p><h2>Algorithm</h2><ol><li>Set dist[source] = 0, all others = ∞</li><li>Use a min-heap. Push (0, source)</li><li>Pop minimum. For each neighbor, if dist[current] + weight < dist[neighbor], update and push</li></ol><h2>Why It\'s Greedy</h2><p>The min-heap always processes the node with smallest known distance. Once a node is popped, its distance is finalized — we\'ve found the shortest path to it.</p><h2>Complexity</h2><p>O((V + E) log V) with a binary heap. O(V² + E) with a simple array (better for dense graphs).</p>', visualization: dijkstraViz },
      { id: 'A-11', code: 'A-11', title: 'Topological Sort', content: '<h2>Ordering Dependencies</h2><p>Given a DAG (Directed Acyclic Graph), produce a linear order where every edge u → v has u before v.</p><h2>Kahn\'s Algorithm (BFS)</h2><ol><li>Compute indegree of every node</li><li>Enqueue all nodes with indegree 0</li><li>Dequeue node, add to result, decrement neighbors\' indegree</li><li>If neighbor\'s indegree becomes 0, enqueue it</li></ol><h2>Cycle Detection</h2><p>If the result has fewer than V nodes, there\'s a cycle — topological sort is impossible.</p><p><em>[When to reach for this]</em> Course scheduling, build systems (Makefile), task ordering, compiler dependency resolution.</p>', visualization: topoSortViz },
    ],
    bossChallenge: 'Implement Dijkstra\'s from memory using a min-heap. Then solve Course Schedule II (LC 210) using topological sort.',
    leetcode: [
      { id: 200, title: 'Number of Islands', url: 'https://leetcode.com/problems/number-of-islands/', tag: 'BFS/DFS' },
      { id: 743, title: 'Network Delay Time', url: 'https://leetcode.com/problems/network-delay-time/', tag: 'Dijkstra' },
      { id: 210, title: 'Course Schedule II', url: 'https://leetcode.com/problems/course-schedule-ii/', tag: 'Topo Sort' },
      { id: 133, title: 'Clone Graph', url: 'https://leetcode.com/problems/clone-graph/', tag: 'BFS/DFS' },
    ],
  },
  // ─── Phase 13 ⚡ Dynamic Programming (Keystone) ───────────────────
  {
    id: 'phase-13', phase: 13, title: 'Dynamic Programming',
    goal: 'The final boss of DSA. DP = recursion + memoization. Once it clicks, you can solve 80% of hard LeetCode problems.',
    keystone: true,
    lessons: [
      { id: 'A-12', code: 'A-12', title: 'Kadane\'s Algorithm', content: '<h2>Maximum Subarray Sum</h2><p>Given an array, find the contiguous subarray with the largest sum. Kadane\'s solves this in O(n) with O(1) space.</p><h2>The DP Insight</h2><p>At each index i, we decide: <strong>extend</strong> the current subarray, or <strong>start fresh</strong>.</p><pre><code>maxEndingHere = max(arr[i], maxEndingHere + arr[i])\nmaxSoFar = max(maxSoFar, maxEndingHere)</code></pre><p>If the running sum becomes negative, starting fresh is better than carrying the burden.</p><h2>Why This is DP</h2><p>dp[i] = max subarray ending at i = max(arr[i], dp[i-1] + arr[i]). We just use one variable instead of an array — <strong>space optimization</strong>.</p>', visualization: kadanesViz },
      { id: 'A-13', code: 'A-13', title: '1D DP — Climbing Stairs', content: '<h2>The Classic</h2><p>n stairs, take 1 or 2 steps at a time. How many ways to reach the top?</p><pre><code>dp[0] = 1\ndp[1] = 1\nfor i in range(2, n+1):\n  dp[i] = dp[i-1] + dp[i-2]</code></pre><p>This is Fibonacci! But the DP framework makes it clear <em>why</em>: to reach step i, you came from step i-1 (took 1) or step i-2 (took 2).</p><h2>The DP Framework</h2><ol><li><strong>Define state</strong>: What does dp[i] represent?</li><li><strong>Recurrence</strong>: How does dp[i] relate to previous states?</li><li><strong>Base case</strong>: What are the trivial answers?</li><li><strong>Order</strong>: In what order do we fill the table?</li><li><strong>Answer</strong>: Which cell has the final answer?</li></ol>', visualization: climbingStairsViz },
      { id: 'A-14', code: 'A-14', title: '2D DP — Unique Paths', content: '<h2>Grid DP</h2><p>Count paths from top-left to bottom-right of an m×n grid, moving only right or down.</p><pre><code>dp[r][c] = dp[r-1][c] + dp[r][c-1]</code></pre><p>Base: first row and first column are all 1 (only one way to reach them).</p><h2>Variations</h2><ul><li><strong>Obstacles</strong>: Set dp[r][c] = 0 if cell is blocked</li><li><strong>Minimum path sum</strong>: dp[r][c] = grid[r][c] + min(dp[r-1][c], dp[r][c-1])</li><li><strong>Triangle</strong>: dp top-down or bottom-up</li></ul><h2>Space Optimization</h2><p>Since each row only depends on the row above, use a 1D array: O(m×n) → O(n).</p>', visualization: uniquePathsViz },
      { id: 'A-15', code: 'A-15', title: '0/1 Knapsack', content: '<h2>The Classic DP Problem</h2><p>Given items with weights and values, and a knapsack with capacity W, maximize the total value without exceeding W.</p><h2>Recurrence</h2><pre><code>dp[i][w] = max(\n  dp[i-1][w],              # skip item i\n  dp[i-1][w-wt[i]] + val[i]  # take item i\n)</code></pre><p>For each item: either skip it (keep previous best) or take it (use remaining capacity).</p><h2>Variants</h2><ul><li><strong>0/1 Knapsack</strong> — each item used at most once</li><li><strong>Unbounded Knapsack</strong> — unlimited copies: dp[i][w-wt[i]] instead of dp[i-1][w-wt[i]]</li><li><strong>Subset Sum</strong> — special case where value = weight, target sum</li><li><strong>Coin Change</strong> — unbounded knapsack with minimum count instead of max value</li></ul>', visualization: knapsackViz },
    ],
    bossChallenge: 'Solve Longest Common Subsequence (LC 1143) from scratch. Define state, write recurrence, build the table. If you can do this cold, DP has clicked.',
    leetcode: [
      { id: 53, title: 'Maximum Subarray', url: 'https://leetcode.com/problems/maximum-subarray/', tag: 'Kadane\'s' },
      { id: 70, title: 'Climbing Stairs', url: 'https://leetcode.com/problems/climbing-stairs/', tag: '1D DP' },
      { id: 62, title: 'Unique Paths', url: 'https://leetcode.com/problems/unique-paths/', tag: '2D DP' },
      { id: 322, title: 'Coin Change', url: 'https://leetcode.com/problems/coin-change/', tag: 'Unbounded Knapsack' },
      { id: 1143, title: 'Longest Common Subsequence', url: 'https://leetcode.com/problems/longest-common-subsequence/', tag: '2D DP' },
    ],
  },
  // ─── Phase 14: Bit Manipulation ───────────────────────────────────
  {
    id: 'phase-14', phase: 14, title: 'Bit Manipulation',
    goal: 'Unlock O(1) space tricks and constant-time operations that impress interviewers.',
    lessons: [
      { id: 'B-26', code: 'B-26', title: 'Bit Operations', content: '<h2>The Fundamentals</h2><ul><li><strong>AND (&)</strong>: both 1 → 1. Use: mask/clear bits</li><li><strong>OR (|)</strong>: either 1 → 1. Use: set bits</li><li><strong>XOR (^)</strong>: different → 1. Use: toggle bits, find unique</li><li><strong>NOT (~)</strong>: flip all bits</li><li><strong>Left Shift (<<)</strong>: multiply by 2. <code>1 << k</code> = 2^k</li><li><strong>Right Shift (>>)</strong>: divide by 2</li></ul><h2>Essential Tricks</h2><pre><code># Check if bit k is set\n(n >> k) & 1\n\n# Set bit k\nn | (1 << k)\n\n# Clear bit k\nn & ~(1 << k)\n\n# Check if power of 2\nn & (n - 1) == 0</code></pre>', visualization: bitOpsViz },
      { id: 'B-27', code: 'B-27', title: 'XOR Tricks', content: '<h2>XOR Properties</h2><ul><li><code>a ^ a = 0</code> — anything XOR itself is 0</li><li><code>a ^ 0 = a</code> — anything XOR 0 is itself</li><li><strong>Commutative & Associative</strong> — order doesn\'t matter</li></ul><h2>Single Number</h2><p>Array where every element appears twice except one. XOR all elements — duplicates cancel out, leaving the unique one.</p><pre><code>def singleNumber(nums):\n  result = 0\n  for num in nums:\n    result ^= num\n  return result</code></pre><p>O(n) time, O(1) space — no hash set needed!</p><h2>Swap Without Temp Variable</h2><pre><code>a ^= b\nb ^= a\na ^= b</code></pre><p>Mind-bending but works because XOR is its own inverse.</p>', visualization: null },
      { id: 'B-28', code: 'B-28', title: 'Counting Bits', content: '<h2>Count Set Bits (Hamming Weight)</h2><pre><code>def countBits(n):\n  count = 0\n  while n:\n    count += n & 1\n    n >>= 1\n  return count</code></pre><h2>Brian Kernighan\'s Trick</h2><pre><code>def countBits(n):\n  count = 0\n  while n:\n    n &= n - 1  # clears the lowest set bit!\n    count += 1\n  return count</code></pre><p><code>n & (n-1)</code> removes the rightmost 1-bit. So this loops exactly (number of 1-bits) times.</p><h2>DP Version — Count Bits 0 to n</h2><pre><code>dp[i] = dp[i >> 1] + (i & 1)</code></pre><p>Shift right removes last bit (already solved), add back that last bit. O(n) for all values.</p>', visualization: null },
    ],
    bossChallenge: 'Solve "Single Number" (LC 136) and "Number of 1 Bits" (LC 191) in under 2 minutes each. Then explain WHY n & (n-1) clears the lowest set bit.',
    leetcode: [
      { id: 136, title: 'Single Number', url: 'https://leetcode.com/problems/single-number/', tag: 'XOR' },
      { id: 191, title: 'Number of 1 Bits', url: 'https://leetcode.com/problems/number-of-1-bits/', tag: 'Bits' },
      { id: 338, title: 'Counting Bits', url: 'https://leetcode.com/problems/counting-bits/', tag: 'DP + Bits' },
      { id: 371, title: 'Sum of Two Integers', url: 'https://leetcode.com/problems/sum-of-two-integers/', tag: 'Bits' },
    ],
  },
]
