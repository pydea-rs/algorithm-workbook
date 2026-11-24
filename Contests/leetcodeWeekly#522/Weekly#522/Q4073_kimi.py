def count_good_strings(n: int) -> int:
    MOD = 10**9 + 7
    def fib(m):
        if m == 0:
            return (0, 1)
        a, b = fib(m >> 1)
        c = a * (2 * b - a) % MOD
        d = (a * a + b * b) % MOD
        return (d, (c + d) % MOD) if m & 1 else (c, d)
    return 2 * fib(n)[0] % MOD
