---
id: B-35
code: B-35
title: 2D Arrays & Matrices
---
## 2D Arrays in C++

```cpp
#include <vector>
using namespace std;

int main() {
    // ─── C-style 2D array ──────────────────────────
    int grid[3][4] = {
        {1, 2, 3, 4},
        {5, 6, 7, 8},
        {9, 10, 11, 12}
    };
    // Access: grid[row][col]

    // ─── Vector of vectors (dynamic 2D) ────────────
    int rows = 3, cols = 4;
    vector<vector<int>> matrix(rows, vector<int>(cols, 0));
    matrix[1][2] = 42;

    // ─── From input ────────────────────────────────
    // Common competitive programming pattern:
    int m, n;
    cin >> m >> n;
    vector<vector<int>> mat(m, vector<int>(n));
    for (int i = 0; i < m; i++)
        for (int j = 0; j < n; j++)
            cin >> mat[i][j];

    return 0;
}
```

## 4 Direction Traversal (BFS/DFS on Grid)

```cpp
// The 4-directional movement pattern
int dx[] = {0, 0, 1, -1};     // right, left, down, up
int dy[] = {1, -1, 0, 0};

// Check bounds
bool isValid(int r, int c, int rows, int cols) {
    return r >= 0 && r < rows && c >= 0 && c < cols;
}

// 8-directional (includes diagonals)
int dx8[] = {-1,-1,-1, 0,0, 1,1,1};
int dy8[] = {-1, 0, 1,-1,1,-1,0,1};
```

## Matrix Traversal Patterns

```cpp
// ─── Row-major (standard) ──────────────────────
for (int i = 0; i < rows; i++)
    for (int j = 0; j < cols; j++)
        process(matrix[i][j]);

// ─── Column-major ──────────────────────────────
for (int j = 0; j < cols; j++)
    for (int i = 0; i < rows; i++)
        process(matrix[i][j]);

// ─── Diagonal traversal ───────────────────────
// Main diagonal: i == j
// Anti-diagonal: i + j == constant

// LC 54: Spiral Matrix
vector<int> spiralOrder(vector<vector<int>>& matrix) {
    vector<int> result;
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;

    while (top <= bottom && left <= right) {
        for (int j = left; j <= right; j++)   result.push_back(matrix[top][j]);
        top++;
        for (int i = top; i <= bottom; i++)   result.push_back(matrix[i][right]);
        right--;
        if (top <= bottom)
            for (int j = right; j >= left; j--) result.push_back(matrix[bottom][j]);
        bottom--;
        if (left <= right)
            for (int i = bottom; i >= top; i--) result.push_back(matrix[i][left]);
        left++;
    }
    return result;
}
```

## Matrix Operations

```cpp
// LC 48: Rotate Image 90° clockwise — transpose + reverse rows
void rotate(vector<vector<int>>& matrix) {
    int n = matrix.size();
    // Transpose
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            swap(matrix[i][j], matrix[j][i]);
    // Reverse each row
    for (auto& row : matrix)
        reverse(row.begin(), row.end());
}

// LC 73: Set Matrix Zeroes — O(1) space
void setZeroes(vector<vector<int>>& matrix) {
    int m = matrix.size(), n = matrix[0].size();
    bool firstRowZero = false, firstColZero = false;

    // Check if first row/col need zeroing
    for (int j = 0; j < n; j++) if (matrix[0][j] == 0) firstRowZero = true;
    for (int i = 0; i < m; i++) if (matrix[i][0] == 0) firstColZero = true;

    // Use first row/col as markers
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            if (matrix[i][j] == 0) {
                matrix[i][0] = 0;
                matrix[0][j] = 0;
            }

    // Zero out marked rows/cols
    for (int i = 1; i < m; i++)
        for (int j = 1; j < n; j++)
            if (matrix[i][0] == 0 || matrix[0][j] == 0)
                matrix[i][j] = 0;

    if (firstRowZero) for (int j = 0; j < n; j++) matrix[0][j] = 0;
    if (firstColZero) for (int i = 0; i < m; i++) matrix[i][0] = 0;
}

// LC 240: Search 2D Matrix II — O(m + n)
bool searchMatrix(vector<vector<int>>& matrix, int target) {
    int m = matrix.size(), n = matrix[0].size();
    int r = 0, c = n - 1; // start top-right
    while (r < m && c >= 0) {
        if (matrix[r][c] == target) return true;
        else if (matrix[r][c] > target) c--;
        else r++;
    }
    return false;
}
```

> 🎯 **Matrix Trick**: Start from top-right corner for searching sorted matrices. It eliminates a row or column with each comparison → O(m+n).
