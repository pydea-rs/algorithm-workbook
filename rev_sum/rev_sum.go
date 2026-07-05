package main

type ListNode struct {
	Val  int
	Next *ListNode
}

func addTwoNumbers(l1 *ListNode, l2 *ListNode) *ListNode {
	var head *ListNode = nil
	var result *ListNode = head
	carry := 0
	for l1 != nil || l2 != nil {
		sum := carry
		if l1 != nil {
			sum += l1.Val
			l1 = l1.Next
		}
		if l2 != nil {
			sum += l2.Val
			l2 = l2.Next
		}
		carry = 0

		if head == nil {
			head = new(ListNode)
			result = head
		} else {
			result.Next = new(ListNode)
			result = result.Next
		}
		result.Val = sum
		if sum >= 10 {
			result.Val -= 10
			carry++
		}
	}

	if carry > 0 {
		result.Next = new(ListNode)
		result.Next.Val = 1
	}
	return head
}
