from typing import Optional
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head) -> ListNode:
    next: Optional[ListNode] = None
    previous: Optional[ListNode] = None
    cursor: ListNode = head

    while cursor:
        next = cursor.next
        cursor.next = previous
        previous = cursor; cursor = next
    return previous