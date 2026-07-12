from typing import List
def spiral_order(matrix):
    result: List[int] = []

    top = 0; bottom = len(matrix) - 1; left = 0; right = len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        for x in range(left, right + 1):
            result.append(matrix[top][x])
        top += 1
        for x in range(top, bottom + 1):
            result.append(matrix[x][right])
        right -= 1

        if top <= bottom:
            for x in range(right, left-1, -1):
                result.append(matrix[bottom][x])
            bottom -= 1
        if left <= right:
            for x in range(bottom, top - 1, -1):
                result.append(matrix[x][left])
            left += 1
    return result

print(spiral_order([[1,2,3,4],
         [5,6,7,8],
         [9,10,11,12]] ))