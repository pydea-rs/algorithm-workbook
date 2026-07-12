def first_missing_positive(nums: list[int]) -> int:
    length = len(nums)
    for i in range(length):
        while 1 <= nums[i] <= length and nums[i] != nums[(x := nums[i] - 1)]:
            nums[i], nums[x] = nums[x], nums[i]

    for i in range(0, length):
        if nums[i] != i + 1:
            return i + 1
    return len(nums) + 1

print(first_missing_positive([3,4,-1,1]))