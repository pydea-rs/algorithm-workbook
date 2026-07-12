from typing import List

def calculate(s: str) -> int:
    result = 0
    terms: List[str] = []
    term_start = 0
    for i in range(len(s)):
        while s[term_start] == ' ' or s[term_start] == '\t':
            term_start += 1
        if s[i] == ' ': continue
        if s[i] == '+' or s[i] == '-':
            term = s[term_start:i]
            terms.append(term)
            term_start = i + 1 if s[i] == '+' else i
    terms.append(s[term_start:])

    for term in terms:
        i = 0
        number = 0
        sign = 1
        numbers: List[int] = []; operator = None
        for ch in term:
            if ch == ' ': continue
            if ch == '-':
                sign *= -1; continue
            if ch.isdigit():
                number = number * 10 + ord(ch) - 48
            else:
                numbers.append(number * sign)
                if len(numbers) == 2:
                    numbers[0] = numbers[1] * numbers[0] if operator == '*' else int(numbers[0] / numbers[1])
                    numbers.pop()
                sign = 1
                number = 0
                operator = ch

        if not numbers:
            result += (number * sign)
        else:
            result += number * numbers[0] if operator == '*' else int(numbers[0] / number)

    return result

print(calculate("14-3/2  * 5 - 4"))