from typing import Any, Optional, Self, Union

class LinkList:
    def __init__(self, data: Any = None, next: Optional[Self] = None):
        self.data = data
        self.next = next

    @property
    def has_cycle(self) -> Union[bool, int]:
        fast_pointer = self; slow_pointer = self
        count = 0
        while fast_pointer and fast_pointer.next:
            fast_pointer = fast_pointer.next.next
            slow_pointer = slow_pointer.next
            if fast_pointer == slow_pointer:
                return True, count
            count += 1
        return False, count

    @property
    def has_cycle_faster(self) -> Union[bool, int]:
        faster_pointer = self; slow_pointer = self
        count = 0
        while faster_pointer and faster_pointer.next and faster_pointer.next.next:
            faster_pointer = faster_pointer.next.next.next
            slow_pointer = slow_pointer.next
            if faster_pointer == slow_pointer:
                return True, count
            count += 1
        return False, count


head = LinkList()
cursor = head
for i in range(101):
    cursor.next = LinkList()
    cursor = cursor.next
cursor.next = head
print(head.has_cycle)
print(head.has_cycle_faster)
