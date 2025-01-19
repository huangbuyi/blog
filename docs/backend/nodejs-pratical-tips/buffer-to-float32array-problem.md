---
title: 关于 buffer 转 Float32Array 的问题
date: 2024-12-08
---

直接使用 buffer 创建 Float32Array，每个字节对应一个元素：

```js
const buffer = new Buffer.alloc(8).fill(0);
const array = new Float32Array(buffer);
console.log(buffer.byteLength, array.length); // 8 8
```

如果 buffer 保存的是单精度浮点数（32 位，4 字节），就会得到错误长度的数组和错误的数值：

```js
const buffer = new Buffer.alloc(8);
buffer.writeFloatLE(3.14, 0);
buffer.writeFloatLE(2.72, 4);
const array = new Float32Array(buffer);
console.log(array.toString()); // 195,245,72,64,123,20,46,64
```

使用`buffer.buffer`，可以得到想要的结果：

```js
const buffer = new Buffer.alloc(8);
buffer.writeFloatLE(3.14, 0);
buffer.writeFloatLE(2.72, 4);
const array = new Float32Array(buffer.buffer);
console.log(array.toString()); // 3.140000104904175,2.7200000286102295
```

读取的数与原数可能存在些许误差，因为浮点数的使用本身会有精度损失。