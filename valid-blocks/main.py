def is_valid(s):
    matches = {'(': ')', '[': ']', '{': '}'};
    stack = []
    for c in s:
        if c in '([{':
            stack.append(c)
        else:
            if not stack or matches[stack[-1]] != c:
                return False
            stack.pop()
    return not stack

print(is_valid("("))