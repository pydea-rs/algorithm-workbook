import re

def is_palindrome(s):
    s = re.sub(r"[^w]", '', s)
    if not s:
        return True
    i = 0; length = len(s)
    end = length // 2
    while i <= end:
        if s[i].lower() != s[length-i-1].lower():
            return False
        i += 1
    return True

print(is_palindrome(" "))