---
title: 跨域解法方案有哪些？原理是什么？
date: 2019-04-01
---

1. JSONP：利用 script 标签不会跨域的原理。需传入回调函数，通过执行回调函数，传递数据。只支持 get 方法。

2. iframe + 表单：利用 iframe 不会跨域的原理。使用 js 创建一个 iframe，在 iframe 中创建表单并提交。

3. CORS 跨域资源共享。对于跨域请求，浏览器会先发送一个 option 请求，服务器响应在头部添加：

```txt
Access-Control-Allow-Origin: *   // 可信源
Access-Control-Allow-Credentials: true   // 是否发送cookie
Access-Control-Expose-Headers: *  // 可暴露头部
```