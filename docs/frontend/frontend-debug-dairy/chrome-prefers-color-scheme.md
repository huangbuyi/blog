---
title: Chrome 主题变化没改变 CSS prefers-color-scheme
date: 2024-10-10
---

在 Chrome 浏览器中，无论设置了什么主题，页面中`prefers-color-scheme`检测到的仍然是系统主题配色，不受 Chrome 浏览器主题配色的影响。而其它浏览器（比如 Firefox）中，`prefers-color-scheme`会随浏览器主题变化。

```ts
// true 或 false 不受 Chrome 浏览器主题影响
window.matchMedia('(prefers-color-scheme: light)').matches
window.matchMedia('(prefers-color-scheme: dark)').matches
```

这应该是 Chrome 浏览器 bug，相关讨论：

- [CSS media feature prefers-color-scheme should be overridden by browser theme](https://issues.chromium.org/issues/366412383)
- [XDG Desktop Portal "Prefer dark appearance" does not affect prefers-color-scheme media query](https://issues.chromium.org/issues/40642550)
