class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        diffs = dict()

        for i, x in enumerate(nums):
            if (target - x) in diffs:
                return [diffs[target - x], i]
            diffs[x] = i