from typing import List

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = {}

        result = []
        offset = ord('a')
        for word in strs:
            freqs = [0] * 26

            for c in word:
                freqs[ord(c) - offset] += 1
            frequency = "".join(f"#{f}" for f in freqs)
            print(frequency)
            if frequency not in groups:
                group = [word]
                result.append(group)
                groups[frequency] = group
            else:
                groups[frequency].append(word)
        return result


s = Solution()

s.groupAnagrams(["bdddddddddd","bbbbbbbbbbc"])