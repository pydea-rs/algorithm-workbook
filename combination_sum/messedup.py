from typing import List, Set, Tuple
def combination_sum(candidates: List[int], target: int):
    possibles = []
    for x in candidates:
        possibles.extend([x] * (target // x))
    results: Set[Tuple[int,...]] = set()
    length = len(possibles)
    candidates.clear()
    def dfs(nums: List[int], start: int, end: int):
        if sum(nums) == target:
            results.add(tuple(nums))
            return
        if start >= end - 1:
            return
        for i in range(start, end):
            possibles[i], possibles[start] = possibles[start], possibles[i]
            dfs(nums + possibles[start:start+1], start + 1, end)
            possibles[i], possibles[start] = possibles[start], possibles[i]
    dfs(candidates, 0, length)
    return [list(x) for x in results]

print(combination_sum([2,3,6,7],7))