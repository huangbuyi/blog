---
title: Material Design 几种实用 Bezier 运动曲线
date: 2025-1-10
cover: /images/material-design-easing-curves.webp
---

Material Design 的运动（Motion）规范中定义了几种常用的 `cubic-bezier` 曲线，用于创建一致且自然的动画效果。这些曲线旨在提供流畅、响应式的用户体验，并与物理世界中的运动相呼应。

![material-design-easing-curves](/images/material-design-easing-curves.webp)

以下是 Material Design 中推荐的一些 `cubic-bezier` 曲线：

### 1. 标准曲线 (Standard Easing)

这是最常用的缓动函数，适用于大多数动画场景。

- **cubic-bezier(0.4, 0.0, 0.2, 1)**

这种曲线提供了平滑的加速和减速，给人一种自然的感觉。

### 2. 加速曲线 (Accelerate)

当元素开始移动时快速增加速度，然后逐渐减慢直到停止。

- **cubic-bezier(0.4, 0.0, 1, 1)**

这个曲线适合于需要快速响应用户操作的情况，例如按钮点击后的反馈。

### 3. 减速曲线 (Decelerate)

元素以较高速度开始移动，随后慢慢减速直至停止。

- **cubic-bezier(0.0, 0.0, 0.2, 1)**

减速曲线适用于展示内容或信息的出现，给予用户时间去注意到新的变化。

### 4. 锐利曲线 (Sharp)

一种更为急剧的加速和减速模式，产生更强烈的视觉冲击。

- **cubic-bezier(0.4, 0.0, 0.6, 1)**

这种曲线适合强调重要的交互或状态改变，比如错误提示或确认对话框的显示。

### 使用指南

- **选择合适的曲线**：根据你的设计意图选择适当的缓动曲线。不同的曲线可以传达不同的情感和节奏。
- **保持一致性**：在整个应用程序中使用相同的缓动曲线来维持统一的体验。
- **考虑性能**：虽然复杂的缓动曲线可以增强视觉吸引力，但也要注意它们对性能的影响，特别是在移动设备上。

你可以通过调整 CSS 或 JavaScript 中的 `transition-timing-function` 属性来应用这些 `cubic-bezier` 曲线。例如，在 CSS 中：

```css
.myElement {
  transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

在 JavaScript 中，如果你使用的是 Web Animations API 或其他库，也可以直接指定 `cubic-bezier` 函数作为动画的缓动设置。