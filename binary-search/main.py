def search_insert(nums, target):
    start = 0; end = len(nums) - 1
    mid = 0
    while start <= end:
        mid = (end+start) // 2

        if nums[mid] < target:
            start = mid + 1
        elif nums[mid] > target:
            end = mid - 1
        else:
            return start
    return start

print(search_insert([1, 3, 5, 6], 5))