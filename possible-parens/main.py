
def generate_parenthesis(n: int) -> list[str]:
    results = []
    def count_valids(prefix: list[str], n_open: int, n_closed):
        if not n_open and not n_closed:
            results.append(''.join(prefix))
            return
        if n_open >= 1:
            count_valids(prefix + ['('], n_open - 1, n_closed)
        if n_closed >= 1 and n_closed > n_open:
            count_valids(prefix + [')'], n_open, n_closed - 1)
    count_valids([], n, n)
    return results


print(generate_parenthesis(3))