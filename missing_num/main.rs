
fn missing_num(nums: Vec<u32>) -> u32 {
    let n = nums.len() + 1; // this one doesnt include 0
    let expected_sum: u32 = (n * (n+1) / 2) as u32;
    let mut sum = 0;

    for i in nums {
        sum += i;
    }
    (expected_sum - sum) as u32
}


fn main() {
    let n = vec![1,4,3];
    println!("{}", missing_num(n));

}