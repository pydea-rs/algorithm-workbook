#include <stdio.h>
#include "uthash.h"

typedef struct {
    int key. value;
    UT_hash_handle hh;
} Map;

int* twoSum(int* nums, int numsSize, int target, int* returnSize) {
    Map *seen = NULL;

    for(int i = 0; i < numsSize; i++) {
        Map* isSeen;
        int lookFor = target - nums[i];
        HASH_FIND_INT(map, &lookFor, isSeen);
        if(isSeen) {
            returnSize[0] = isSeen->value;
            returnSize[1] = i;
            break;
        }
        Map* next = malloc(sizeof(Map));
        next->key = nums[i];
        next->value = i;
        HASH_ADD_INT(map, nums[i], item);
    }
    return returnSize;
}