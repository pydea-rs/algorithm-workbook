class Solution:
    def permutate(self, word: list[str], start, end):
        if start >= end - 1:
            yield ''.join(word)
        else:
            for i in range(start, end):
                word[i], word[start] = word[start], word[i]
                yield from self.permutate(word, start+1, end)
                word[start], word[i] = word[i], word[start]
        yield None

    def groupAnagrams(self, strs: list[str]) -> list[list[str]]:
        result = []
        seen = dict()

        for word in strs:
            if word in seen:
                group = seen[word]
                group.append(word)
            else:
                group = [word]
                for anagram in self.permutate(list(word), 0, len(word)):
                    seen[anagram] = group
                result.append(group)
        return result