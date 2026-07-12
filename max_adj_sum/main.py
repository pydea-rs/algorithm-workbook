def max_window_sum(nums, k):
    if len(nums) <= k:
        return sum(nums)
    max_s = sum(nums[:k])
    temp_s = max_s
    for i in range(k, len(nums)):
        temp_s += nums[i] - nums[i - k]
        max_s = max(max_s, temp_s)
    return max_s

print(max_window_sum([-1, 3, -2, 3, 4], 2))