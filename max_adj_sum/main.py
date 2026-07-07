def max_window_sum(nums, k):
    if len(nums) <= k:
        return sum(nums)
    max_s = sum(nums[:k])
    temp_s = max_s
    for i in range(k, len(nums)):
        temp_s += nums[i] - nums[i - k]
        max_s = max(max_s, temp_s)
    return max_s
