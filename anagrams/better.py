from typing import List

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = {}

        result = []
        for word in strs:
            sorted_word= "".join(sorted(word))
            if sorted_word in groups:
                groups[sorted_word].append(word)
            else:
                group = [word]
                result.append(group)
                group[sorted_word] = group
        return result