function moveZeroes(nums) {
  // mutate nums in place
  const len = nums.length;
  let zeros = 0;
  for(let i = 0; i < len; ) {
    if(nums[i] === 0) {
        nums.splice(i, 1);
        zeros ++;
    } else {
        i++;
    }
  }
  nums.push(...Array(zeros).fill(0));
}
