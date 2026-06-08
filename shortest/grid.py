from collections import deque
DIRS = ((0, 1), (0, -1), (1, 0), (-1, 0), (1, 1), (1, -1), (-1, 1), (-1, -1))

def shortest_path_binary_matrix(grid):
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    if grid[0][0] == 1 or grid[rows-1][cols-1] == 1: return -1
    grid[0][0] = 1
    q = deque([(0, 0, 1)])

    while q:
        cur_r, cur_c, d = q.popleft()
        if cur_r == rows - 1 and cur_c == cols - 1: return d
        for delta_r, delta_c in DIRS:
                nxt_r, nxt_c = delta_r + cur_r, delta_c + cur_c
                
                if 0 <= nxt_r < rows and 0 <= nxt_c < cols and 0 == grid[nxt_r][nxt_c]:
                    grid[nxt_r][nxt_c] = 1; q.append((nxt_r, nxt_c, d + 1))
    return -1
