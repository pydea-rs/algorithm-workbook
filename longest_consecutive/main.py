from typing import List

def longest_consecutive(nums: List[int]) -> int:
    distincts = set(nums); best = 0
    l = 0
    for x in distincts:
        if x - 1 in distincts:
            continue
        first = x
        while x in distincts:
            x += 1
        best = max(x - first, best)
    return best

print(longest_consecutive([2,1,7,3,6, 4, 8, 10, 9]))