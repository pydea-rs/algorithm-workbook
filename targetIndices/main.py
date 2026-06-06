def two_sum(nums: list[int], target: int):
    table = dict()

    for i, v in enumerate(nums):
        if (target - v) in table:
            return [table[target - v], i]
        table[v] = i
    return None