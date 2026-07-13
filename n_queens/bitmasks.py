
def total_n_queens(n: int):
    components = [0b0, 0b0, 0b0]  # [column, diagonal, anti-diagonal]

    def place(row: int) -> int:
        if row == n:
            return 1
        counts = 0
        for c in range(n): 
            if components[0] & (1 << c) or components[2] & (1 << (row+c)) or components[1] & (1 << (row - c + n)): continue
            components[0] |= (1 << c); components[1] |= (1 << (row-c+n)); components[2] |= (1 << (row+c))
            counts += place(row + 1)
            components[0] &= ~(1 << c); components[1] &= ~(1 << row-c+n); components[2] &= ~(1 << (row + c))
        return counts
    return place(0)

print(total_n_queens(4))