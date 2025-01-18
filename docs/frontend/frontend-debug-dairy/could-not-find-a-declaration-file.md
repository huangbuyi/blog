---
title: Could not find a declaration file for module 'package name'
date: 2024-08-22
---

这个问题意思是缺少包的类型声明，以下是几种解决方案。

方案一，如果包是相对热门的包，或最近更新时间近，有更大可能性已经上传类型声明包，尝试安装类型声明：

```shell
npm install -D @types/module-name
```

如果安装失败，没有对应的包，请尝试其它方案。

方案二，创建声明文件`module-name.d.ts`（`module-name`根据模块名或项目需要修改），声明缺少的模块：

```ts
// module-name.d.ts
declare module 'module-name';
```

这里声明模块为`any`类型。

```ts
// module-name.d.ts
declare module 'module-name' {
  export function sayHello(): void
} 
```

这里声明模块为特定类型。

方案三，添加注释，让 TS 检测忽略该行：

```ts
// @ts-ignore
import module-name from 'module-name'
```

方案四，如果是自己的模块，在`package.json`中通过`types`字段指定类型定义文件：

```json
{
  "main": "./lib/main.js",
  "types": "./lib/main.d.ts"
}
```