package main

import "fmt"

func missing_num(nums []uint32) uint32 {
	sum := uint32(0)
	n := uint32(len(nums))

	expected := n * (n + 1) / 2

	for _, x := range nums {
		sum += x
	}
	return uint32(expected - sum)
}

func main() {
	fmt.Println(missing_num([]uint32{0, 4, 3, 2}))
}
