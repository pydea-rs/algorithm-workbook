class Solution:
    def lengthOfLongestSubstring(self, s: str) -> int:
        seen = dict()

        left = 0; max_length = 0; s_length = len(s)
        i = 0
        while i < s_length:
            if s[i] in seen and seen[s[i]] >= left:
                length = i - left
                if length > max_length:
                    max_length = length
                left = seen[s[i]] + 1
            seen[s[i]] = i
            i += 1
        if s_length - left > max_length and seen and seen[s[-1]] == s_length - 1:
            return s_length - left
        return max_length