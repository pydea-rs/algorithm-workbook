from typing import List, Set
def subsets(nums: List[int]):
    result = set()

    def backtrack(ss: List[int], start: int, end: int):
        result.add(frozenset(ss))
        if start == end - 1:
            return

        for i in range(start, end):
            nums[i], nums[start] = nums[start], nums[i]
            backtrack(ss + nums[start:start+1], start+1, end)
            nums[i], nums[start] = nums[start], nums[i]
    backtrack(list(), 0, len(nums))
    return [list(ss) for ss in result] + ([nums] if nums else [])

print(subsets([1,2,3]))