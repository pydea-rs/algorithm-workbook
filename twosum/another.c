#include <stdio.h>

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    int fsize = target != 0 ? (target > 0 ? target : -target)*2 + 1 : 10;
    int *seen = malloc(sizeof(int) * (fsize));
    int *r = malloc(sizeof(int) * 2);
    *returnSize = 0;
    for(int i = 0; i < fsize; i++) {
        seen[i] = -1;
    }

    for(int i = 0; i < numsSize; i++) {
        if(fsize/2 +target - nums[i] <= fsize) {
            int diff = target - nums[i];
            if(seen[fsize/2 + diff] != -1) {
                r[0] = seen[fsize/2 + diff];
                r[1] = i;
                *returnSize = 2;
                break;
            } 
            seen[fsize/2 + nums[i]] = i;
        }
    }
    return r;
}