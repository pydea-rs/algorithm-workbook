def get_area(heights: list[int]) -> int:
    best: int = 0
    area = 0
    left = 0
    right = len(heights) - 1

    while left <= right:
        area = (right - left) * min(heights[left], heights[right])
        best = max(area, best)

        if heights[right] <= heights[left]:
            right -= 1
        else:
            left += 1
    return best


def get_area2(heights: list[int]) -> int:
    area: int = 0
    left = 0
    right = len(heights) - 1

    while left <= right:
        min_height = heights[left]
        width = right - left
        if heights[right] <= heights[left]:
            min_height = heights[right]
            right -= 1
        else:
            left += 1
        area = max(min_height * width, area)
    return area


print(get_area([1, 8, 6, 2, 5, 4, 8, 3, 7]), get_area2([1, 8, 6, 2, 5, 4, 8, 3, 7]))
