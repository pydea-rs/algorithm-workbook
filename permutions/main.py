class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        results = []
        def perm(nums: list[int], start: int, end: int):
            if start == end - 1:
                results.append(nums.copy())
                return
            
            for i in range(start, end):
                nums[i], nums[start] = nums[start], nums[i]
                perm(nums, start+1, end)
                nums[i], nums[start] = nums[start], nums[i]
        perm(nums, 0, len(nums))
        return results