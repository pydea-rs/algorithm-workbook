import re
from collections import defaultdict

def extract_graph(string):
    s = re.sub(r"[()]", ' ', string)
    rels = [[int(x) for x in r.split(",")] for r in s.split()]
    graph = defaultdict(list)
    for u ,v in rels:
        graph[u].append(v)
        graph[v].append(u) # omit this line for a DIRECTED graph
    return graph

print(extract_graph(input()))