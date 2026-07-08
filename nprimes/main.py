from typing import List

def prime_state(n: int) -> List[True]:
    is_prime = [True] * n

    is_prime[0] = is_prime[1] = False

    for x in range(2, int(n ** 0.5) + 1):
        if is_prime[x]:
            for i in range(x ** 2, n, x):
                is_prime[i] = False

    return is_prime

def primes_below(n: int) -> List[int]:
    is_prime = prime_state(n)
    return list(filter(lambda i: is_prime[i], range(n)))

print(prime_state(10))
print(primes_below(10))