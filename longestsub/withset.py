
def longest(s: str) -> str:
    best_sub: str|None = None
    best_length = 0
    seen = set()
    left = 0
    for i, char in enumerate(s):
        while char in seen:
            seen.discard(char)
            left += 1
        seen.add(char)
        if best_length < (x := i - left + 1):
            best_length = x
            best_sub = s[left:i+1]
    return best_sub or ''

print(longest("abcabcbb" ))