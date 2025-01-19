---
title: 禁止用户打开调试工具
date: 2024-08-01
---

定时器进行循环检测，进入调试环境，触发调试函数，无限递归执行debbuger。于是，一打开调试，就无限debugger。

```bash
// 原版
setInterval(function() {
  check()
}, 4000);
var check = function() {
  function doCheck(a) {
    if (("" + a/a)["length"] !== 1 || a % 20 === 0) {
      (function() {}
      ["constructor"]("debugger")())
    } else {
      (function() {}
      ["constructor"]("debugger")())
    }
    doCheck(++a)
  } 
  try {
    doCheck(0)
  } catch (err) {}
};
check();



// 简化版 效果一样
const check = () => {
        /** 
        猜测是在一瞬间瞬间让你的函数调用超出最大限制, 然后导致控制报错, 
        此时这个函数下的就存在了某个可以让你进行 debugger 操作的函数, 有大佬可以解释下吗? 
        本意是为了方便开发者调试结果变成了拦截开发者
        我：(function() {}["constructor"]("debugger") = Function("debugger") 返回一个ƒ anonymous(){debugger}函数，然后执行
        **/
	const doCheck = (a) => {
            (function() {}["constructor"]("debugger")()); // 立即执行匿名函数 调用 constructor函数传入 字符串 "debugger"
	    doCheck(++a); // 递归调用
	};
	try {
	    doCheck(0);
	} catch (err) {
	    console.log("err", err); // 超出最大调用限制 Maximum call stack size exceeded
	}
};
check();
// 每隔4秒检测一次
setInterval(check, 4000);
```