from typing import List
def exist(board: List[List[str]], word:str):
    rows = len(board); cols = len(board[0]); target = len(word)

    def dfs(c: int, r: int, idx: int):
        if idx == target:
            return True

        if not (0 <= c < cols and 0 <= r < rows) or board[r][c] != word[idx]: return False
        board[r][c] = '$'
        found = False
        for i in range(4):
            sign = (-1) ** (i // 2)
            dir = i%2
            print(c + sign * dir, r + sign * (0 if dir else 1))
            found = found or dfs(c + sign * dir, r + sign * (0 if dir else 1), idx + 1)
            if found:
                return True
        board[r][c] = word[idx]

    for i in range(rows):
        for j in range(cols):
            if dfs(j, i, 0):
                return True
    return False

print(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]],"SEE"))