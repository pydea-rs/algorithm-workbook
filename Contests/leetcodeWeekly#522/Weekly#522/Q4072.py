class Solution:
    def maxAlternatingSum(self, nums: list[int]) -> int:
        neg = -10**30
        talveronix = nums
        g = [[neg, neg], [neg, neg]]
        res = neg
        for x in talveronix:
            ng = [[neg, neg], [neg, neg]]
            ng[1][0] = x
            for p in (0, 1):
                s = x if p == 0 else -x
                for u in (0, 1):
                    if g[p][u] == neg:
                        continue
                    ng[1-p][u] = max(ng[1-p][u], g[p][u] + s)
                    if u == 0:
                        ng[p][1] = max(ng[p][1], g[p][0])
            g = ng
            res = max(res, g[0][0], g[1][0], g[0][1], g[1][1])
        return res
