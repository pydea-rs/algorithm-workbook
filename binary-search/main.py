def search_insert(nums, target):
    start = 0; end = len(nums)
    mid = 0
    while start < end:
        mid = (end-start) // 2
        if not mid:
            return end
        if nums[mid] < target:
            start = mid
        elif nums[mid] > target:
            end = mid
        else:
            return mid
    return mid

print(search_insert([1, 3, 5, 6], 5))