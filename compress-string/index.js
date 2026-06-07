function runLengthEncode(s) {
  if(!s?.length) {
    return s;
  }
  let count = 1;
  let r = [];
  for(let i = 1; i < s.length; i++) {
    if(s[i] === s[i - 1]) {
        count++;
    } else {
        r.push(s[i - 1], count);
        count = 1;
    }
  }
  r.push(s[s.length - 1], count);
  if(r.length >= s.length) {
    return s;
  }
  return r.join("");
}
