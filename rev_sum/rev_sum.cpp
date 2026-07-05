struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode* result = nullptr;
        ListNode*  result_tail = result;
        ListNode* l1_cur = l1, *l2_cur = l2;
        int carry = 0;
        while(l1_cur != nullptr || l2_cur != nullptr) {
            int sum = carry + (l1_cur != nullptr ? l1_cur->val : 0) + (l2_cur != nullptr ? l2_cur->val : 0);
            carry = 0;
            if(result_tail == nullptr) {
                result = result_tail = new ListNode(sum);
            } else {
                result->next = new ListNode(sum);
                result = result->next;
            }
            if(sum >= 10) {
                result->val -= 10;
                carry++;
            }
            if(l1_cur != nullptr)
                l1_cur = l1_cur->next;
            if(l2_cur != nullptr)
                l2_cur = l2_cur->next;
        }
        if(carry) {
            result->next = new ListNode(1);
        }
        return result_tail;
    }

};