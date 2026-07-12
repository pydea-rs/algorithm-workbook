
def reverse(s: str | list[str]) -> str:
    s = list(s)

    for i in range((end:=len(s))//2):
        t = s[i]
        s[i] = s[end - i - 1]
        s[end - i - 1] = t

    return ''.join(s)

print(reverse("IaMHere"))