def MinWindowSubstring(strArr):
  chars = list(strArr[1])
  lens = len(strArr[0])

  start = 0
  string = strArr[0]
  curr_match = None
  match_length = 0
  while start < lens:
    if string[start] in chars:
      temp = list(chars)
      m = string[start]
      end = start + 1
      temp.remove(string[start])
      while end < lens and len(temp):
        if string[end] in temp:
          temp.remove(string[end])
        m += string[end]
        end += 1
      if not len(temp):
        if not curr_match or end - start < match_length:
          curr_match = m
          match_length = end - start
    start += 1
  return curr_match
# keep this function call here 
print(MinWindowSubstring(input()))