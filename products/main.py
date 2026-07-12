from typing import List

def max_products(nums: List[int]) -> List[int]:
    nums = list(sorted(filter(lambda x: x, nums))) # drop zeros
    length = len(nums)
    lefts = [1] * length
    for i in range(1, length):
        if nums[i - 1] == 0: continue
        lefts[i] = lefts[i - 1] * nums[i - 1]

    rights = [1] * length
    for i in range(length - 2, -1, -1):
        if nums[i + 1] == 0: continue
        rights[i] = rights[i + 1] * nums[i + 1]

    return [lefts[i] * rights[i] for i in range(length)]

print(max_products([10, 1, 11, 2, 6]))