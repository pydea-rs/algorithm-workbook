def run_length_encode(s):
    result = []
    
    i = 1
    len_string = len(s)
    count = 1
    if not s:
        return ""
    while i < len_string:
        if s[i] == s[i - 1]:
            count += 1
        else:
            result.append([s[i - 1], count])
            count = 1
        i += 1
    result.append([s[-1], count])

    if len(result) * 2 >= len_string:
        return s
    return ''.join([x[0] + str(x[1]) for x in result])

print(run_length_encode("aaabbc"))