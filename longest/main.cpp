#include <iostream>
#include <string>
#include <cctype>

using namespace std;

string LongestWord(string sen) {
  string longest = "";
  int l_length = 0;
  string temp = "";
  int t_length = 0;
  for(int i = 0; sen[i]; i++) {
    char c = tolower(sen[i]);
    if((c >= 'a' && c <= 'z') || (c >= '0' && c <= '9')) {
      t_length ++;
      temp += c;
    } else {
      if(t_length > l_length) {
        l_length = t_length;
        longest = temp;
      }
      t_length = 0;
      temp = "";
    }
  }
  if(t_length > l_length) {
    l_length = t_length;
    longest = temp;
  }
  return longest;
}

// keep this function call here
int main(void) { 
   
  cout << LongestWord(coderbyteInternalStdinFunction(stdin));
  return 0;
    
}