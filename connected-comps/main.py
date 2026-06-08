def count_components(n, edges):
    parents = list(range(n))
    ranks = [0] * n

    def find(x):
        while parents[x] != x:
            parents[x] = parents[parents[x]]
            x = parents[x]
        return x
    
    def union(x, y):
        px, py = find(x), find(y)
        if px == py:
            return False
        if ranks[px] > ranks[py]:
            px, py = py, px
        parents[px] = py
        if ranks[px] == ranks[py]:
            ranks[py] += 1
        return True
    
    comps = n
    for a, b in edges:
        if union(a, b):
            comps -= 1
    return comps