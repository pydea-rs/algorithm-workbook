from collections import Counter

def top_k_frequent(nums, k):
    counts = Counter(nums)

    counts_to_nums = [[].copy() for _ in range(len(nums) + 1)]

    for x in counts:
        counts_to_nums[counts[x]].append(x)
    result = []
    for i in range(len(counts_to_nums) - 1, -1, -1):
        for x in counts_to_nums[i]:
            result.append(x)
            k -= 1
        if not k:
            return result
    return result