import re
from typing import List
from collections import defaultdict

def polymer_insert(raw: str | List[str], table: str):
    table_as_list = re.findall(r"[A-Z]+", table)
    equivalents = dict()

    for i in range(0, len(table_as_list) - 1, 2):
        equivalents[table_as_list[i]] = table_as_list[i+1]

    raw = list(raw)
    i = 0
    while i < 40:
        new_str = []
        for j in range(len(raw) - 1):
            pair = f"{raw[j]}{raw[j+1]}"
            eq = equivalents[pair]
            new_str.extend([raw[j], eq])
        new_str.append(raw[-1])

        raw = new_str
        i += 1
    
    max = len(raw)
    counts_dict = defaultdict(int)
    for x in raw:
        counts_dict[x] += 1

    mx, ls = counts_dict[raw[0]], counts_dict[raw[0]]

    for char in counts_dict:
        if mx < counts_dict[char]:
            mx = counts_dict[char]
        if ls > counts_dict[char]:
            ls = counts_dict[char]
        
    return mx - ls

    counts = [None] * (max + 1)

    for char in counts_dict:
        counts[counts_dict[char]] = char
    less = 0;

    for count, ch in enumerate(counts):
        if ch is not None:
            less = count
            break
    for idx in range(max, -1, -1):
        if counts[idx] is not None:
            return idx - less
    
    return 0
    
print(polymer_insert('NNCB', '''
CH -> B
HH -> N
CB -> H
NH -> C
HB -> C
HC -> B
HN -> C
NN -> C
BH -> H
NC -> B
NB -> B
BN -> B
BB -> N
BC -> B
CC -> N
CN -> C
'''))