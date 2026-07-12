from typing import List

def min_window_sum(nums: List[int], k: int = 2):
    length = len(nums)
    if length <= k:
        return sum(nums)
    min_sum: int = sum(nums[:k]); temp_sum = min_sum
    for i in range(k, length):
        temp_sum += nums[i] - nums[i - k]
        min_sum = min(temp_sum, min_sum)
    return min_sum

print(min_window_sum([-1, 3, -2, 3, 4], 2))