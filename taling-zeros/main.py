def move_zeroes(nums: list):
    i = 0
    lenn = len(nums)
    zeros = 0
    while i < lenn:
        if nums[i] == 0:
            lenn -= 1
            del nums[i]
            zeros += 1
        else:
            i += 1
    if zeros:
        nums.extend([0] * zeros)
    return nums

print(move_zeroes([0,1,0,3,12]))