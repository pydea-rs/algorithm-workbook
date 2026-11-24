
def eval_rpn(tokens):
    if not tokens:
        return 0
    operands = []
    for x in tokens:
        match x:
            case "+":
                x = operands.pop() if operands else 0
                operands.append(x + (operands.pop() if operands else 0))
            case "-":
                x = operands.pop() if operands else 0
                operands.append((operands.pop() if operands else 0) - x)
            case "*":
                x = operands.pop() if operands else 0
                operands.append(x * (operands.pop() if operands else 0))
            case "/":
                x = operands.pop() if operands else 0
                operands.append(int((operands.pop() if operands else 0)/ x))
            case _:
                operands.append(int(x))
        print(operands)
    return operands.pop() if operands else 0
eval_rpn(["4","13","5","/","+"])
