from collections import deque

def eval_rpn(tokens):
    if not tokens:
        return 0
    if len(tokens) == 1:
        return int(tokens[0])
    tokens = deque(tokens)

    nums = []
    lastround = False
    while not lastround:
        x = tokens.popleft()
        if not tokens:
            lastround = True
        match x:
            case '+':
                x, y = nums.pop(), nums.pop()
                tokens.appendleft(y + x)
            case '/':
                x, y = nums.pop(), nums.pop()
                tokens.appendleft(int(y / x))
            case '*':
                x, y = nums.pop(), nums.pop()
                tokens.appendleft(y * x)
            case '-':
                x, y = nums.pop(), nums.pop()
                tokens.appendleft(y - x)
            case _:
                nums.append(int(x))
    return tokens.pop()

print(eval_rpn(["1"]))