---
title: 使用 Chrome 监控 work_thread 子线程
date: 2024-12-20
---

Chrome DevTools 是实用前端开发工具，对于 NodeJS 的开发和调试也是非常好用。

主线程代码在创建工作线程时传入一个启动参数，可以自己定义参数：

```js
const worker = new Worker('./dist/worker.js', {
  execArgv: ["--inspect-brk"]
});
```

工作线程代码通过`node:inspector`库启动监控器，每个线程都需要设置一个端口，因为每个线程都启动一个监视器；当然，也可以根据需要只监视一个线程。

```js
import inspector from "node:inspector"

if (process.execArgv.includes("--inspect-brk")) {
  inspector.open(9230 + threadId);
  inspector.waitForDebugger(); // 等待打开 debugger 工具后开始运行程序
}
```

打开 Chrome，在地址栏输入`chrome://inspect`，打开监视页面，可以看到正在运行的 NodeJS 程序，点击`inspect`按钮即可打开调试工具对子线程进行调试。

如果没有刷出可以监控的程序，稍等几秒，等待 Chrome 读取；如果仍然没有，点击`Open dedicated DevTools for Node`，再 Tabs 中选择`connection`，点击`Add connection`，输入程序运行的地址和端口，比如`localhost:9230`。