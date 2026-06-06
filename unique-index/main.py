def first_uniq_char(s):
    counts = {}

    for i, c in enumerate(s):
        if c not in counts:
            counts[c] = {'v': 1, 'idx': i}
        else:
            counts[c]['v'] += 1
    for c in counts:
        if counts[c]['v'] == 1:
            return counts[c]['idx']
    return -1

print(first_uniq_char("abcccbss"))