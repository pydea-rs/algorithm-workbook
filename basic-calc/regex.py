from typing import List
import re
def calculate(s: str) -> int:
    result = 0
    terms = re.findall(r"-?[\s0-9\*/\/]+", s)

    for x in terms:
        y = re.findall(r"-?\d+|[\*\/]", x.replace(' ', ''))

        term = int(y[0])
        for i in range(1, len(y), 2):
            match y[i]:
                case "*":
                  term *= int(y[i+1])
                case "/":
                    term = int(term / int(y[i+1]))
        result += term
    return result

print(calculate("    14-3/2  * 5 - 4"))