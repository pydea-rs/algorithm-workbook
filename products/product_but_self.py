# Write product_except_self(nums) returning an array where out[i] is the product of all elements except nums[i]. No division. O(n) time. The output array does not count as extra space — aim for O(1) beyond it.

def product_with_div(nums: list[int]) -> list[int]:
    product = 1
    for x in nums:
        product *= x
    return [product // y for y in nums]

def product_except_self(nums):
    length = len(nums); out = [1] * length
    for right in range(length - 2, -1, -1):
        out[right] = out[right + 1] * nums[right + 1]
    px = 1
    for left in range(0, length):
        out[left] *= px
        px *= nums[left]
    return out