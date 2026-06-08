import re
def QuestionsMarks(strParam):
  parts = re.findall(r"\d+[\.\d]*|[^\d]+", strParam)
  # or parts = re.findall(r"\d+\.*\d*|[^\d]+", strParam)
  print(parts)
  length = len(parts)
  i = 0
  once = False
  while i < length:
    try:
      a = float(parts[i])

      if i + 2 < length:
        b = float(parts[i + 2])
        if a + b == 10:
          if parts[i + 1].count('?') != 3:
            return False
          once = True
    except:
      pass
    i += 1
  return once
# keep this function call here 
print(QuestionsMarks(input()))