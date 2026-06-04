def permetuation(chars, start, length):
  if start == length - 1:
    yield ''.join(chars)

  for i in range(start, length):
    chars[start], chars[i] = chars[i], chars[start]
    yield from permetuation(chars, start+1, length)
    chars[start], chars[i] = chars[i], chars[start]
  return None

def check_brackets(string):
  brackets = 0
  for c in string:
    if c == '(':
      brackets += 1
    elif c ==')' and brackets > 0:
      brackets -= 1
  return brackets == 0

def BracketCombinations(num):
  string = '()' * num
  perm = permetuation(list(string), 0, len(string))

  correct = 0
  all = set()
  while perm:
    try:
      value = next(perm)
      if value not in all:
        all.add(value)
      else:
        continue
      if check_brackets(value):
        correct += 1
    except:
      break
  return correct

# keep this function call here 
print(BracketCombinations(6))