package main

func twoSum(nums []int, target int) []int {
	seen := make(map[int]int)
	for i, x := range nums {
		if index, exists := seen[target-x]; exists {
			return []int{index, i}
		}
		seen[x] = i
	}
	return []int{}
}
