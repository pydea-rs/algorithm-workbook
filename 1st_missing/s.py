from collections import defaultdict
from typing import List, Tuple

def group_anagrams(words):
    seen = defaultdict(list)

    for word in words:
        sorted_word = ''.join(sorted(word))
        seen[sorted_word].append(word)
    return list(seen.values())
print(group_anagrams(["eat","tea","tan","ate","nat","bat"]))


def get_freqs(word: str) -> Tuple[int, ...]:
    n = len(word); r = [0] * n
    for ch in word:
        r[ord(ch) - 97]
    return tuple(r)
    
def group_anagrams_freqs(words):
    groups = defaultdict(List[int])

    for w in words:
        groups[get_freqs(w)].append(w)
    return list(groups.values())