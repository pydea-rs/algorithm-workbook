from collections import Counter
from typing import List

def most_repeated_counter(string: str) -> List[str]:
    counts = Counter(string)
    return [s for s, _ in counts.most_common(2)]


def most_repeated(string: str, wanted: int = 2) -> List[str]:
    stats = Counter(string)
    characters = list(stats.keys())
    characters.sort(key=lambda ch: stats[ch], reverse=True)
    return characters[:wanted]

print(most_repeated("abraxxxxcadabra"))