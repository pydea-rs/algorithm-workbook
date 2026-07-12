from typing import List

def max_products(nums: List[int]) -> List[int]:
    nums = list(sorted(filter(lambda x: x, nums))) # drop zeros
    length = len(nums)
    output = [1] * length

    for i in range(length - 2, -1, -1):
        output[i] = output[i + 1] * nums[i + 1]

    prefix_product = 1
    for i in range(1, length):
        output[i] *= prefix_product
        prefix_product *= nums[i]

    return output

print(max_products([10, 1, 11, 2, 6]))