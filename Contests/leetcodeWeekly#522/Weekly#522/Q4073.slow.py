from functools import lru_cache


class Solution:
    @lru_cache(maxsize=None)
    def is_good(self, s: str) -> bool:
        n = len(s)
        if n % 2 == 1 and len(set(s)) == 1:
            return True
        for i in range(1, n):
            if s[i-1] != s[i] and self.is_good(s[:i]) and self.is_good(s[i:]):
                return True
        return False
    def countGoodStrings(self, n: int) -> int:
        res = set()
        @lru_cache(maxsize=None)
        def construct(s: str, m: int) -> str:
            if m == 0:
                return s
            res.add(construct(s + 'a', m - 1))
            res.add(construct(s + 'b', m - 1))

        construct("", n)
        return len(list(filter(lambda x: x and self.is_good(x), res)))
