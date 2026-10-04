#include <iostream>
#include <string>

using namespace std;
int minRotations(string s) {
  short current = 0;
  int total = 0;
  for (int i = 0; s[i]; i++) {
    const short digit = s[i] - '0';
    if (current < digit) {
      const short r = digit - current, l = current + 10 - digit;
      total += r < l ? r : l;
    } else {
      const short r = 10 - current + digit, l = current - digit;
      total += r < l ? r : l;
    }
    current = digit;
  }
  return total;
}

int main() {
    cout << minRotations("0192837465");
}
