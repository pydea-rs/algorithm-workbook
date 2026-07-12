from typing import List
from collections import deque

def get_subarray_mins(numbers: List[int], winsize: int) -> List[int]:
    result, minimum_indices = [], deque()

    for i, x in enumerate(numbers):
        # find the minimum of the current window
        while minimum_indices and numbers[minimum_indices[-1]] >= x:
            minimum_indices.pop()
        minimum_indices.append(i)

        if minimum_indices[0] == i - winsize:
            minimum_indices.popleft()
        
        if i + 1 >= winsize:
            result.append(numbers[minimum_indices[0]])
    return result

print(get_subarray_mins([1,4,5,2,4,3,1], 3))