def is_valid(s):
    matches = {']': '[', '}': '{', ')': '(' }
    opens = []

    for ch in s:
        if ch in matches:
            if not opens:
                return False
            if opens[-1] == matches[ch]:
                opens.pop()
        else:
            opens.append(ch)

    return not opens

def validate_html_tags(html):
    parse_start = -1
    opens = []
    for i in range(len(html)):
        if html[i] == '<':
            parse_start = i + 1
        elif parse_start >= 0:
            if html[i] == '>':
                tag = html[parse_start:i]
                if tag[0] == '/':
                    if not opens:
                        return False
                    if opens.pop() != tag[1:]:
                        return False
                else:
                    opens.append(tag)
                parse_start = -1
            elif html[i] == ' ':
                tag = html[parse_start:i]
                opens.append(tag)
                parse_start = -1
    return not opens


validate_html_tags("<a></a><b></b>")
