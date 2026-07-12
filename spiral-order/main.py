def spiral_order(matrix):
    i_dir = 0; j_dir = 1
    i = 0; j = 0
    m = len(matrix); n = len(matrix[0])
    final_length = m * n
    result = [0] * final_length
    seen = set()
    for k in range(final_length):
        result[k] = matrix[i][j]
        seen.add(f"{i}{j}")
        if j_dir == 1:
            if j == n - 1:
                j_dir = 0
                i_dir = +1 if i < m - 1 else -1
        elif i_dir == 1:
            if i == m - 1:
                i_dir = 0
                j_dir = +1 if j < n - 1 else -1
        elif j_dir == -1:
            if j == 0:
                j_dir = 0
                i_dir = +1 if i < m - 1 else -1
        elif i_dir == -1:
            if i == 0:
                i_dir = 0
                j_dir = +1 if j < n - 1 else -1
        if f"{i+i_dir}{j+j_dir}" in seen:
            if i_dir:
                j_dir = -i_dir
                i_dir = 0
            elif j_dir:
                i_dir = -j_dir
                j_dir = 0

        i += i_dir
        j += j_dir
    return result

print(spiral_order([[1,2,3,4],
         [5,6,7,8],
         [9,10,11,12]] ))