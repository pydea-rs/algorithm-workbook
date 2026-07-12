from typing import List
import re
def calculate(s: str) -> int:
    parts = re.findall(r"\d+|[\+\-\*\/]", s)

    i = 1; length = len(parts)
    while i < length - 1:
        match parts[i]:
            case "*":
                parts[i-1] = int(parts[i-1]) * int(parts[i + 1])
                del parts[i]
                del parts[i]
                length -= 2
                continue
            case "/":
                parts[i-1] = int(int(parts[i-1]) / int(parts[i + 1]))
                del parts[i]
                del parts[i]
                length -= 2
                continue
        i += 1
    result = int(parts[0])
    for i in range(1, len(parts), 2):
        result += int(parts[i+1] if parts[i] == '+' else f'-{parts[i+1]}')

    return result
print(calculate("14-3/2 - 4"))