import re


def calculate(s):
    numbers = [int(x) for x in re.findall(r"\d", s)]
    operators = re.findall(r"[+-/*]", s)
    i = 0

    while i < len(numbers) - 1:
        match operators[i]:
            case "*":
                numbers[i] = numbers[i] * numbers[i+1]
                numbers[i+1] = -1

            case "/":
                numbers[i] = numbers[i] // numbers[i+1]
                numbers[i+1] = -1
        i += 1
    i = 1
    numbers = list(filter(lambda x: x >= 0, numbers))
    operators = list(filter(lambda x: x == '+' or x == '-', operators))
    numbers[0] = numbers[0]
    while i < len(numbers):
        match operators[i]:
            case "+":
                numbers[0] += numbers[i]
            case "-":
                numbers[0] -= numbers[i]
        i += 1

    return numbers[0]

print(calculate("1+5/3*4"))