from collections import deque, defaultdict

def shortest_path(n, edges, start, end):
    if start == end: return 0
    seen = {start}
    
    graph = defaultdict(list)
    for (a,b) in edges:
        graph[a].append(b)
        graph[b].append(a)

    q = deque([(start, 0)])
    
    while q:
        node, l = q.popleft()
        for nxt in graph[node]:
            if nxt == end:
                return l + 1
            if nxt not in seen:
                q.append((nxt, l+1))
                seen.add(nxt)
    return -1

print(shortest_path(4, [[1,2],[0,3],[0,3],[0,1]], 0, 3))  # 2