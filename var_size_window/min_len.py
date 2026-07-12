from typing import List

# if all numbers are non-negative
def min_window_sumx(nums: List[int], target: int) -> int:
    length = len(nums); left = 0; best = length + 1; window_sum = 0

    for right in range(length):
        window_sum += nums[right]
        while (window_sum > target and left <= right) or not nums[left]:
            window_sum -= nums[left]
            left += 1
        
        if window_sum == target:
            best = min(best, right - left + 1)
            if best == 1:
                return best
    return 0 if best > length else best

print(min_window_sumx([3, 4, 3, 1, 2, 4, 2, 1], 3))
