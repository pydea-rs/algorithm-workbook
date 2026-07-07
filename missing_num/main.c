#include <stdio.h>

unsigned int missing_num(unsigned int *nums, unsigned int n) {
    unsigned int sum = 0;
    unsigned int expected = n * (n + 1) / 2;

    for(int i = 0; i < n; i++) {
        sum += nums[i];
    }
    return (unsigned int)(expected - sum);
}

void main() {
    unsigned int x[] = {0,2,5,3,1};
    printf("%d", missing_num(x, 5));
}