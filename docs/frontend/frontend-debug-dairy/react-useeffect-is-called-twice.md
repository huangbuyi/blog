---
title: 首次渲染 React useEffect 执行了两次
date: 2025-01-24
---

刚接触新版本 React，一开始以为是我的问题，哪里触发的重新渲染或不小心多渲染了一次，研究了一番才发现是框架的特性。

> StrictMode renders components twice (on dev but not production) in order to detect any problems with your code and warn you about them (which can be quite useful).

> 严格模式渲染组件两次（开发环境而非生产环境），以检测代码中的任何问题并警告你（这非常有用）。

解决方案1，移除严格模式：

```jsx
// 修改前
ReactDOM.render(
  <React.StrictMode>
    {app}
  </React.StrictMode>,
  document.getElementById('root')
);

// 修改后
ReactDOM.render(
  {app}
  document.getElementById('root')
);
```

解决方案2，添加一个变量：

```tsx
function Example() {
  let called = false;
  useEffect(() => {
    if (called) return;
    called = true;
    // do something
  })
}
```

