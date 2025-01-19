---
title: TS 报错 Cannot use import statement outside a module
date: 2022-07-07
---

`package.json`添加：

```json
{
  "type": "module"
}
```

确认 HTML 文件中 script 标签的 type 属性为 module：

```html
<script type="module" src="whatever.js"></script>
```