def missing_number(nums):
    n = len(nums)
    actual_sum = n * (n+1) / 2
    sum_nums = 0
    for x in nums:
        sum_nums += x
    return actual_sum - sum_nums
