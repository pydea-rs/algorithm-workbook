
#include <cstddef>
#include <array>
#include <string>
#include <vector>
#include <unordered_map>

using namespace std;

class ArrayHash {
public:
    size_t operator()(const array<int, 26>& counts) const {
        size_t hash = 0;

        for (int count : counts) {
            hash = hash * 31 + count;
        }

        return hash;
    }
};

class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<array<int, 26>, vector<string>, ArrayHash> groups;

        for (const string& word : strs) {
            array<int, 26> counts{};

            for (char ch : word) {
                counts[ch - 'a']++;
            }

            groups[counts].push_back(word);
        }

        vector<vector<string>> result;
        result.reserve(groups.size());

        for (auto& [key, group] : groups) {
            result.push_back(move(group));
        }

        return result;
    }
};