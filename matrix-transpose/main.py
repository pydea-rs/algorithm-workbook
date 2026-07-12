def rotate_normal(matrix):
    m, n = len(matrix), len(matrix[0])
    result = [[0 for _ in range(m)] for _ in range(n)]

    for i in range(m):
        for j in range(0, n):
            result[j][i] = matrix[i][j]
    return result


from typing import List

def rotate(matrix: List[List[int]]):

    for i in range(len(matrix)):
        for j in range(i+1, len(matrix[0])):
            t = matrix[j][i]
            matrix[j][i] = matrix[i][j]
            matrix[i][j] = t
            # seen[f"{i}{j}"] = True

    cols = len(matrix[0]) // 2
    for row in matrix:
        for i in range(cols):
            t = row[i]
            row[i] = row[-i-1]
            row[-i-1] = t
    return matrix

print(rotate([[1,2], [3,4]]))
