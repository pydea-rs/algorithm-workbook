use std::collections::HashMap;

impl Solution {
    pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
        let mut seen = HashMap::new();
        
        for (i, &x) in nums.iter().enumerate() {
            let diff = target - x;
            if let Some(&idx) = seen.get(&diff) {
                return vec![idx, i as i32];
            }
            seen.insert(x, i as i32);
        }
        vec![]
    }
}