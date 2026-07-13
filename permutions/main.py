class Solution:
    def permute(self, nums: list[int]) -> list[list[int]]:
        results = []
        def perm(start: int, end: int):
            if start == end - 1:
                results.append(nums.copy())
                return
            
            for i in range(start, end):
                nums[i], nums[start] = nums[start], nums[i]
                perm(start+1, end)
                nums[i], nums[start] = nums[start], nums[i]
        perm(0, len(nums))
        return results

print(Solution().permute([2,1,4]))