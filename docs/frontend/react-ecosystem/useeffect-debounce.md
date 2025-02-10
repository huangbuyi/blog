---
title: 使用 useEffect 实现节流效果（Debounce）
date: 2025-02-10
---

## Debounce 简介

**Debounce** 是一种常用的编程技术，主要用于限制某个函数在短时间内被频繁调用的情况。它特别适用于处理那些可能会以高频率触发的事件，例如窗口调整大小、滚动、键盘输入等。通过 debounce 技术，可以确保该函数只在最后一次触发事件后的指定延迟时间后执行一次，如果在这段时间内再次触发了事件，则重新计时。

#### 工作原理

假设你设置了一个 300 毫秒的 debounce 时间：

1. 当事件第一次触发时，开始一个 300 毫秒的定时器。
2. 如果在接下来的 300 毫秒内该事件再次被触发，则重置定时器，从头开始计时。
3. 只有当 300 毫秒内没有新的事件触发时，才会执行目标函数。

这种机制有效地减少了函数调用的频率，从而提高了性能和用户体验。

### 使用场景

- **用户输入搜索框**：当用户快速输入文本时，你可能不希望每次按键都发送请求到服务器进行搜索。相反，你可以等待用户停止输入一段时间后再发送请求。
- **窗口调整大小或滚动事件**：这些事件通常会非常频繁地触发，直接在事件处理程序中执行复杂操作可能导致性能问题。
- **表单提交**：防止用户多次点击提交按钮导致重复提交表单。

## 在 React 使用 `debounce`

Lodash 提供了一个方便的方法来实现 debounce 功能——`_.debounce`，然而在 React 使用会面临一些问题。

首先不能直接赋值，因为这相当于每次组件更新都会创建新的防抖函数，调用的也是新的防抖函数，不仅增加开销，还不能起到防抖效果。

### 直接使用

```tsx
const ExampleComponent: React.FC = () => {
  const debouncedFn = _.debounce((value) => {}, 300);
};
```

第二种方法是使用 `useCallback` 来记忆化 debounced 函数，避免每次渲染时都创建一个新的 debounced 函数实例；但这种方法可能会抛出语法错误，`React Hook useCallback received a function whose dependencies are unknown. Pass an inline function instead`；在外部包裹一层箭头函数，可以解决语法报错，但会导致防抖失效。

### 使用 `useCallback`

```tsx
const ExampleComponent: React.FC = () => {
  const debouncedFn = useCallback(_.debounce((value) => {}, 300));
};
export default SearchComponent;
```

### 使用 `useEffect`

`useEffect` 可以用来轻松地实现 debounce，通过 `useEffect` 的第二个参数来控制依赖项，当依赖项变化时，会先触发`useEffect`的返回函数，清除计时器，然后重新执行，从而实现防抖：

```tsx
const ExampleComponent: React.FC = () => {
  const [state, setState] = useState('');
  useEffect(() => {
    const handler = setTimeout(() => {
      // 防抖函数
      console.log(state);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [state]);
};
```

如果只是更新状态，还可以将其包装为`useDebounce`进行复用：

```jsx
export function useDebounce(cb, delay) {
  const [debounceValue, setDebounceValue] = useState(cb);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(cb);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [cb, delay]);
  return debounceValue;
}
```