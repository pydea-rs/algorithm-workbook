import re
from collections import defaultdict

class TreeNode:
  def __init__(self, p=0, c=0):
    self.p = p
    self.c = c

def TreeConstructor(strArr):
    pairs = [[int(x) for x in re.sub('[()]', '', s).split(',')] for s in strArr]

    result = defaultdict(TreeNode)

    for (p, c) in pairs:
       result[p].c += 1
       result[c].p += 1

    found_head = False

    for node in result.values():
       if node.c > 2 or node.p > 1:
          return False
       if not node.p:
          if found_head:
             return False
          found_head = True
    return True

print(TreeConstructor(["(1,2)", "(3,2)", "(2,12)", "(5,2)"]))