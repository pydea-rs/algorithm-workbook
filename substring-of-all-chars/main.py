from collections import defaultdict

def min_window(s: str, t: str) -> str:
    counts = defaultdict(int)
    for c in t:
        counts[c] += 1
    distince_chars = len(counts.values())
    conditions_not_passed = distince_chars
    left = 0
    length = len(s)
    min_length = length + 1; result = ""

    while left < length and s[left] not in counts:
        left += 1
    i = 0
    while i < length:
        print(s[left:i+1])

        if s[i] in counts:
            counts[s[i]] -= 1
            if counts[s[i]] <= 0:
                conditions_not_passed -= 1
                if not conditions_not_passed:
                    l = i - left + 1
                    if l < min_length:
                        min_length = l
                        result = s[left:i+1]
                    counts[s[left]] += 1
                    conditions_not_passed += 1
                    left += 1
                    while left < i and s[left] not in counts:
                        left += 1
        i += 1
    return result

print(min_window("ADOBECODEBANC", "ABC"))