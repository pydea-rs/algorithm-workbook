from typing import List

def windows_sum_k(nums: List[int], target: int) -> int:
    prefix_sums = {0: 1}
    counts = 0; run = 0

    for x in nums:
        run += x
        diff = run - target
        if diff in prefix_sums:
            counts += prefix_sums[diff]
        prefix_sums[run] = prefix_sums.get(run, 0) + 1
    return counts