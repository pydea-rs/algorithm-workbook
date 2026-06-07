import re
def calculate(s: str):
    s = s.replace(' ', '')
    parts = [int(x) for x in re.split(r"[*+-/]", s)]
    ops = list(re.sub(r"[^*+-/]", '', s))

    i = 0
    while i < len(ops):
        match ops[i]:
            case "*":
                parts[i] *= parts[i + 1]
                del parts[i + 1]
                del ops[i]
                
            case "/":
                parts[i] = int(parts[i] / parts[i + 1])
                del parts[i + 1]
                del ops[i]
            case _:
                i += 1
    i = 0
    print(parts, ops)
    while len(parts) > 1:
        match ops[i]:
            case "+":
                parts[i] += parts[i + 1]
                del parts[i + 1]
                del ops[i]
            case "-":
                parts[i] -= parts[i + 1]
                del parts[i + 1]
                del ops[i]
            case _:
                i += 1
    return parts[0]

print(calculate("1*2-3/4+5*6-7*8+9/10"))