
def permetuation(n_open, n_closed, prefix =''):
  if not n_closed and not n_open:
    yield prefix
  if n_open > 0:
    yield from permetuation(n_open - 1, n_closed, prefix + '(')
  if n_closed > 0:
    yield from permetuation(n_open, n_closed - 1, prefix + ")")
  
def check_brackets(string):
  brackets = 0
  for c in string:
    if c == '(':
      brackets += 1
    elif c ==')' and brackets > 0:
      brackets -= 1
  return brackets == 0

def BracketCombinations(num):
  perm = permetuation(num, num)
  correct = 0
  while perm:
    try:
      value = next(perm)
      if check_brackets(value):
        correct += 1
    except:
      break
  return correct

# keep this function call here 
print(BracketCombinations(input()))