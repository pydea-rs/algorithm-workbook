#include <unordered_map>
#include <vector>

using std::unordered_map;
using std::vector;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        vector<int> result;
        for(int i = 0; i < nums.size(); i++) {
            auto it = seen.find(target - nums[i]);
            if(it != seen.end()) {
                result.push_back(it->second);
                result.push_back(i);
                break;
            }
            seen[nums[i]] = i;
        } 
        return result;
    }
};