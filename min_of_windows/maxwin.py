from typing import List
from collections import deque

def max_sliding_window_Onk(nums: List[int], k: int) -> List[int]:
    result: List[int] = []

    for i in range(len(nums) - k):
        mx = nums[i]
        for j in range(i+1, i + k):
            if nums[j] > mx:
                mx = nums[j]
        result.append(mx)
    return result

def max_sliding_window(nums: List[int], k: int) -> List[int]:
    result: List[int] = []
    ordered = deque()

    for i, x in enumerate(nums):
        while ordered and x > nums[ordered[-1]]:
            ordered.pop()
        ordered.append(i)
        if ordered[0] == i - k:
            ordered.popleft()
        if i + 1 >= k:
            result.append(nums[ordered[0]])
    return result