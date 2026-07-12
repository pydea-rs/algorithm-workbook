from typing import List
def spiral_order(matrix):
    result: List[int] = []

    ys = [0, len(matrix) - 1]; xs = [0, len(matrix[0]) - 1]
    dir = 1; yi = 1; xi = 1
    while ys[0] <= ys[1] and xs[0] <= xs[1]:
        xi = (xi + 1) % 2
        rng = range(xs[0], xs[1] + 1) if dir > 0 else range(xs[1], xs[0] - 1, dir)
        for x in rng:
            result.append(matrix[ys[yi]][x])
        yi = (yi + 1) % 2
        ys[yi] += dir
        rng = range(ys[0], ys[1] + 1) if dir > 0 else range(ys[1], ys[0] - 1, dir)
        dir *= -1
        for x in rng:
            result.append(matrix[x][xs[xi]])
        xs[xi] += dir
        dir *= -1
    return result
# not working
print(spiral_order([[1,2,3,4],
         [5,6,7,8],
         [9,10,11,12]] ))