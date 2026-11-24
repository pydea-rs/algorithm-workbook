def is_palindrome(s):
    start = 0; end = len(s) - 1
    while start < end:
        if not s[end].isalnum():
            end -= 1
            continue
        if not s[start].isalnum():
            start += 1
            continue
        if s[start].lower() != s[end].lower():
            return False
        start += 1
        end -= 1
    return True
is_palindrome("A man, a plan, a canal: Panama")
