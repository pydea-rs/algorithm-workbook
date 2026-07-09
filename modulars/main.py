
def fast_pow(base, exp):
    raised = 1
    
    while exp:
        if exp & 1: # if exp is odd
            raised *= base
        base *= base
        exp >>= 1
    return raised

def pow_mod2(base, exp, m):
    # (a ^ b) % m = ((a % m) ^ b) % m

    result = 1
    while exp:
        if exp & 1:
            result *= base % m
        base *= base % m
        exp >>= 1
    return result % m

def pow_mod(base, exp, m):
    # (a ^ b) % m = ((((((a * a) % m) * a) % m) * a) % m) * ... %
    result = 1

    while exp:
        if exp & 1:
            result = result * base % m
        base = base * base % m  # (base * base) % m
        exp >>= 1
    return result

print(pow_mod(2, 5, 30))
print(pow_mod2(2, 5, 30))

