package main

import "fmt"

func BracketMatcher(str string) uint8 {
	brackets := 0
	for _, char := range str {
		if char == '(' {
			brackets++
		} else if char == ')' {
			brackets--
		}
	}
	if brackets == 0 {
		return 1
	}
	return 0
}

func main() {
	fmt.Println(BracketMatcher("(coder)(byte))"))
}
