#include <bits/stdc++.h>
#include <vector>
using namespace std;

class Solution {
public:
    int minRotations(int n, string s) {
        auto dist = [](char a, char b) {
            int d = abs(a - b);
            return min(d, 10 - d);
        };

        string temp = s;

        vector<long long> prefix(n), suffix(n);
        prefix[0] = dist('0', temp[0]);
        for (int i = 1; i < n; i++)
            prefix[i] = prefix[i - 1] + dist(temp[i - 1], temp[i]);

        suffix[n - 1] = 0;
        for (int i = n - 2; i >= 0; i--)
            suffix[i] = suffix[i + 1] + dist(temp[i + 1], temp[i]);

        long long ans = prefix[n - 1];
        ans = min(ans, (long long)dist('0', temp[n - 1]) + suffix[0]);
        for (int k = 1; k < n; k++)
            ans = min(ans, prefix[k - 1] + dist(temp[k - 1], temp[n - 1]) + suffix[k]);

        return (int)ans;
    }
};
