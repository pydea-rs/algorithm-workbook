
def count_set_bits(n):
    count = 0

    while n: count += 1; n &= n-1  # n & (n-1) will reset the lowest set bit
    return count

print(count_set_bits(7))