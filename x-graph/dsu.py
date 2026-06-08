def make_dsu(n):
    parent = list(range(n))
    rank   = [0] * n
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]   # path compression (one-step)
            x = parent[x]
        return x
    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb: return False
        if rank[ra] < rank[rb]: ra, rb = rb, ra
        parent[rb] = ra
        if rank[ra] == rank[rb]: rank[ra] += 1
        return True
    return find, union