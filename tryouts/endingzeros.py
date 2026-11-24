def move_zeroes(nums):
    i = 0
    end = len(nums)
    while i < end:
        if nums[i]:
            i += 1
        else:
            del nums[i]
            nums.append(0)
            end -= 1
    return nums

def move_zeroes_little_f(nums):
    i = 0
    original_length = len(nums)
    while i < len(nums):
        if nums[i]:
            i += 1
        else:
            del nums[i]
    return nums.extend([0] * (original_length - len(nums)))
