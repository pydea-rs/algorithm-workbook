function climbStairs(n) {
  let f1 = 0;
  let f2 = 1;
  for(let i = 0; i < n; i++) {
    const t = f2;
    f2 += f1;
    f1 = t;
  }
  return f2;
}
