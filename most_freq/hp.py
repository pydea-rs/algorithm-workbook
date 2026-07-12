from collections import Counter
import heapq

def top_k_frequents(nums, k):
    counts = Counter(nums)
    heap = []

    for i, (number, frequency) in enumerate(counts.items()):
        heapq.heappush(heap, (frequency, number))
        k -= 1
        if k < 0: # len(heap) > k
            heapq.heappop(heap)
            k = 0
    return [v for (f, v) in heap]