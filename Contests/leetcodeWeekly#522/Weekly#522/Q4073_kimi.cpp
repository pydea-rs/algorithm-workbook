#include <bits/stdc++.h>
using namespace std;

class Solution {
    static const long long MOD = 1'000'000'007;

    // returns {F(m), F(m+1)} modulo MOD
    pair<long long, long long> fib(long long m) {
        if (m == 0) return {0, 1};
        auto [a, b] = fib(m >> 1);                       // a = F(k), b = F(k+1)
        long long c = a * ((2 * b % MOD - a + MOD) % MOD) % MOD;  // F(2k)
        long long d = (a * a + b * b) % MOD;                      // F(2k+1)
        return (m & 1) ? make_pair(d, (c + d) % MOD)
                       : make_pair(c, d);
    }

public:
    int countGoodStrings(long long n) {
        return (int)(2 * fib(n).first % MOD);
    }
};
