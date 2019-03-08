## 生成数组做 map 循环
```
let arr = new Array(10).fill(undefined).map((val,idx) => idx);
let arr = Array.apply(null, Array(10)).map((val, idx) => idx);
```
https://stackoverflow.com/questions/5501581/javascript-new-arrayn-and-array-prototype-map-weirdness


## 移位取整
```
n / 10 >> 0
```
