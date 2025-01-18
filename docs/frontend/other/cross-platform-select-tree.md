---
title: 跨平台框架选择树形图
date: 2024-12-10
---

跨平台框架选择树形图（来自通义千问）

```
开始
  ├── 是否需要支持移动应用 (Android/iOS)?
  │   ├── 是
  │   │   ├── 是否需要高性能和接近原生的体验?
  │   │   │   ├── 是 → Flutter, React Native
  │   │   │   └── 否 → Ionic, Xamarin Forms, PhoneGap/Cordova
  │   │   ├── 是否已有 Web 技术栈 (HTML/CSS/JS)?
  │   │   │   ├── 是 → React Native, Ionic, PhoneGap/Cordova
  │   │   │   └── 否 → Flutter, Xamarin Forms
  │   └── 否
  │       ├── 是否需要支持桌面应用 (Windows/macOS/Linux)?
  │       │   ├── 是
  │       │   │   ├── 是否需要高性能和接近原生的体验?
  │       │   │   │   ├── 是 → Tauri, NW.js, Electron
  │       │   │   │   └── 否 → Qt for Python/JavaScript
  │       │   └── 否
  │       │       ├── 是否需要构建 Web 应用?
  │       │       │   ├── 是 → 使用标准 Web 技术 (HTML/CSS/JS)
  │       │       │   └── 否 → 结束
  └── 是否需要同时支持移动和桌面应用?
      ├── 是
      │   ├── 是否需要高性能和接近原生的体验?
      │   │   ├── 是 → Flutter (通过 Desktop 支持), Electron, Tauri
      │   │   └── 否 → NW.js, Ionic with Capacitor/Cordova
      └── 否 → 结束
```