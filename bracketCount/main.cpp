#include <iostream>
#include <string>
using namespace std;

char BracketMatcher(string str) {
  short int brackets = 0; 
  for(int i = 0; str[i]; i++) {
    if(str[i] == '(') 
      brackets++;
    else if(str[i] == ')')
      brackets--;
  }
  return brackets == 0 ? '1' : '0';
}

// keep this function call here
int main(void) { 
  cout << BracketMatcher(coderbyteInternalStdinFunction(stdin));
  return 0;
    
}