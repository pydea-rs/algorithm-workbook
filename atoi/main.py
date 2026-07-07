class Solution:
    def myAtoi(self, s: str) -> int:
        if not s:
            return 0
        sign = 1; i = 0; length = len(s)
        while i < length and (s[i] == ' ' or s[i] == '\t' or s[i] == '_'):
            i += 1
        if i >= length:
            return 0
        if s[i] == '-':
            sign *= -1
            i += 1
        elif s[i] == '+':
            i += 1
        abs_number = 0
        LIMIT_INT =  2**31

        while i < length and ('0' <= s[i] <= '9'):
            abs_number = abs_number * 10 + ord(s[i]) - 48
            i += 1
            if abs_number >= LIMIT_INT:
                return LIMIT_INT - 1 if sign == 1 else -LIMIT_INT
        return sign * abs_number