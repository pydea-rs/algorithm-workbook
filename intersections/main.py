def FindIntersection(strArr):
  a, b = [x.split(", ") for x in strArr]
  lena, lenb = len(a), len(b)
  i = 0
  j = 0
  result = ''
  a = [int(x) for x in a]
  b = [int(x) for x in b]

  while True:
    if a[i] == b[j]:
      result += "," + str(a[i]) if result else str(a[i])
    if a[i] <= b[j]:
      i += 1
      if i >= lena:
        break
    else:
      j += 1
      if j >= lenb:
        break
  return result
# keep this function call here 
print(FindIntersection(input()))
