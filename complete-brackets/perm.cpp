#include <iostream>
#include <string>
#include <vector>

using namespace std;

void swap_char(string &s, int i, int j) {
    char temp = s[i];
    s[i] = s[j];
    s[j] = temp;
}

void permetuate(vector<string> &results, string& s, int start, int length) {
    if(start == length - 1) {
        string str(s);
        results.push_back(str);
        return;
    }

    for(int i = start; s[i]; i++) {
        swap_char(s, start, i);
        permetuate(results, s, start + 1, length);
        swap_char(s, start, i);
    }
}

int main() {
    string test = "()()()";

    vector<string> results;
    permetuate(results, test, 0, test.length());

    for(string r: results) {
        cout << r << endl;
    }
}