def validate_html_tags(html: str):

    i = 0; length = len(html)
    stack = []
    while i < length:
        if html[i] == '<':
            i += 1
            if html[i] != '/':
                j = i
                while i < length and (html[i].isalnum() or html[i] == '-'):
                    i += 1
                stack.append(html[j:i])
            else:
                i += 1
                if not stack:
                    return False
                j = i
                while i < length and (html[i].isalnum() or html[i] == '-'):
                    i += 1
                if stack.pop() != html[j:i]:
                    return False
        i += 1
    return not stack

print(validate_html_tags("<div><p></div></p>"))