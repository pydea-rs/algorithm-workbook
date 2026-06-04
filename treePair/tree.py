import re
def TreeConstructor(strArr):
  pairs = [re.sub("[()]", "", pair).split(",") for pair in strArr]

  result = dict()
  for pair in pairs:
    if pair[0] in result:
      result[pair[0]]['p'] += 1
    else:
      result[pair[0]] = {'p': 1, 'c': 0}
    if pair[1] in result:
      result[pair[1]]['c'] += 1
    else:
      result[pair[1]] = {'c': 1, 'p': 0}

  heads = 0
  for elm in result:
    if result[elm]['p'] > 1 or result[elm]['c'] > 2:
      return False
    if ('p' not in result[elm]) or result[elm]['p'] == 0:
      heads += 1
      if heads > 1:
        return False
  return True

print(TreeConstructor(["(1,2)", "(3,2)", "(2,12)", "(5,2)"]))