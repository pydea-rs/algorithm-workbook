from typing import List
def common(a: List[int], b: List[int], c: List[int]) -> int:
    result = 0
    
    counts = {}
    for x in a:
        if x in counts:
            if 'a' in counts[x]:
                counts[x]['a'] += 1
            else:
                counts[x]['a'] = 1
        else:
            counts[x] = {'a': 1} 
    for x in b:
        if x in counts:
            if 'b' in counts[x]:
                counts[x]['b'] += 1
            else:
                counts[x]['b'] = 1
        else:
            counts[x] = {'b': 1} 
    for x in c:
        if x in counts:
            if 'c' in counts[x]:
                counts[x]['c'] += 1
            else:
                counts[x]['c'] = 1
        else:
            counts[x] =  {'c': 1} 

    for x in counts:
        min_count = min(counts[x]['a'] if 'a' in counts[x] else 0, counts[x]['b'] if 'b' in counts[x] else 0, counts[x]['c'] if 'c' in counts[x] else 0)
        result += min_count * x

    return result