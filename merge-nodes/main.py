from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


class Solution:
    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:
        merged: Optional[ListNode] = None
        merged_head = merged
        while list1 is not None and list2 is not None:
            if merged is not None:
                merged.next = ListNode()
                merged = merged.next
            else:
                merged = ListNode()
                merged_head = merged
            if list1.val <= list2.val:
                merged.val = list1.val
                list1 = list1.next
            else:
                merged.val = list2.val
                list2 = list2.next
        if not list1 and not list2:
            return merged_head
        remaining_list = list1 if list1 is not None else list2
        
        while remaining_list is not None:
            if merged:
                merged.next = ListNode(remaining_list.val)
                merged = merged.next
            else:
                merged = ListNode(remaining_list.val)
                merged_head = merged
            remaining_list = remaining_list.next 
        return merged_head