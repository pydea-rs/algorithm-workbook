from typing import List


def combination_sum(candidates: List[int], target: int) -> List[List[int]]:
    results: List[List[int]] = []
    path = []; length = len(candidates)
    candidates = sorted(candidates)
    def backtrack(start: int, remaining: int) -> None:
        if not remaining:
            results.append(path.copy())
            return
        for i in range(start, length):
            if candidates[i] > remaining:
                return
            path.append(candidates[i])
            backtrack(i, remaining - candidates[i])
            path.pop()
    backtrack(0, target)
    return results