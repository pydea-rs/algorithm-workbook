
def total_n_queens(n: int):
    diags = set(); anti_diags = set(); columns = set()
    result = []
    def place(r: int):
        if r == n:
            result.append(1)
            return

        for c in range(n):
            if c in columns or r-c in diags or r+c in anti_diags:
                continue
            diags.add(r-c); columns.add(c); anti_diags.add(r+c)
            place(r + 1)
            diags.discard(r-c); columns.discard(c); anti_diags.discard(r+c)

        return 0
    place(0)
    return result
print(total_n_queens(4))

def permute(nums):
    results = []
    
    def backtrack(start: int, end: int):
        if start == end - 1:
            results.append(nums.copy())
            return

        for i in range(start, end):
            nums[i], nums[start] = nums[start], nums[i]
            backtrack(start, end)
            nums[i], nums[start] = nums[start], nums[i]
    backtrack(0, len(nums))
    return results