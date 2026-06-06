function twoSum(nums, target) {
  const numTable = {};

  for(let i = 0; i < nums.length; i++) {
    if((target - nums[i]) in numTable) {
        return [numTable[target - nums[i]], i];
    }
    numTable[nums[i]] = i;
  }
}
