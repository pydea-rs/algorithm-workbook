def rle(s):
    result = []
    
    i = 0; length = len(s)
    prev_char = ''; prev_count = 0
    while i < length:
        if 'a' <= s[i].lower() <= 'z':
            if s[i] == prev_char:
                prev_count += 1
            elif prev_char:
                result.extend([prev_char, str(prev_count)])
                prev_count = 1
                prev_char = s[i]
            else:
                prev_count = 1
                prev_char = s[i]
        i += 1
    return ''.join(result)

print(rle("AAAABBBCCDAA"))