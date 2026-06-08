from collections import deque
def bfs_dist(graph, start, target):
    if start == target: return 0
    seen = {start}
    q = deque([(start, 0)])
    while q:
        node, d = q.popleft()
        for nxt in graph[node]:
            if nxt == target: return d + 1
            if nxt not in seen:
                seen.add(nxt); q.append((nxt, d + 1))
    return -1

DIRS_4 = [(0,1),(0,-1),(1,0),(-1,0)]    # right, left, down, up
DIRS_8 = DIRS_4 + [(1,1),(1,-1),(-1,1),(-1,-1)]

def bfs_grid(grid, sr, sc):
    rows, cols = len(grid), len(grid[0])
    seen = {(sr, sc)}
    q = deque([(sr, sc)])
    while q:
        r, c = q.popleft()
        for dr, dc in DIRS_4:               # ← compute neighbors with offsets
            nr, nc = r + dr, c + dc
            # Two extra checks: in-bounds, and not a wall
            if 0 <= nr < rows and 0 <= nc < cols \
            and (nr, nc) not in seen:
            #    and grid[nr][nc] != WALL \ # sometimes we also need to check for walls
                seen.add((nr, nc))
                q.append((nr, nc))