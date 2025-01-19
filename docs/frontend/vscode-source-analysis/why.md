---
title: 为何 VSCode 源码值得学习？
date: 2024-06-30
cover: /images/vscode-2021.png
---

VSCode（Visual Studio Code）的源代码值得学习的原因有很多。

## 项目成熟，经过市场考验

到 2021 年为止，月活跃用户达到 14M（一千四百万），拥有 20K 作者创作的 28K 插件，，110K Github Stars，100K Closed Issues。实际今日，VSCode 已经成为最流行的编辑器之一。

![vscode 2021](/images/vscode-2021.png)


## 大佬带队

由设计模式大佬 Erich Gamma（四人帮《设计模式》的作者之一）带领团队，早期人数大概10人。代码质量高，设计理念先进。


## 前端技术为主

VSCode 使用了 TypeScript、NodeJS、Electron 等技术，核心代码没有使用任何 React、Vue、Angualar 等现代前端框架，却拥有一个复杂而灵活的架构，包括插件系统、扩展API、多语言支持等特性。

VSCode 没有使用网页框架，比如Vue或React，为什么？看看大佬的回答：

>I feel that going with the standard web APIs gives us the most stable API to work with and does not lock us into a particular, possibly opinionated, tech stack that we constantly have to maintain. 

>我觉得使用标准的 Web API 可以为我们提供最稳定的 API 来工作，并且不会将我们锁定在某个特定的技术栈中，这个技术栈可能是有偏向性的，而且我们需要不断地维护它。

为何选用这些前端技术栈的原因？

大佬在访谈中的大意：

- 开始时的目标是代码编辑器，用于网页开发，且跑在浏览器上，自然选用了网页技术。
- VSCode 和 TS 几乎同时间启动，两个团队间保持良好互动，所以用 TS。
- 到了2014年，开始决定发布跨平台桌面版，决定使用 Electron，它比 nwjs 更活跃。

（VSCode 项目最早可以追溯到 2011 年，到 2015 微软在 Build 2015 开发者大会上首次发布）

## 开源项目

VSCode 是一个完全开源的项目，其代码可以在 GitHub 上找到。这意味着你可以自由地查看、修改和分发它的代码，这对于学习和理解现代软件开发过程非常有价值。作为一个由微软支持并广泛使用的编辑器，VSCode 的代码质量通常很高。它遵循了良好的编程实践，使用了先进的设计模式和技术，这些都可以作为学习的范例。

## 用户体验

除了技术层面的学习之外，VSCode 还是一个很好的例子来研究用户界面和用户体验的设计。它的设计考虑到了易用性和效率，对于想要提升这方面能力的人来说是非常好的学习资源。

## 文档和支持

VSCode 拥有丰富的官方文档和庞大的用户群体提供的各种教程、指南和问题解决方案，这些都是学习过程中不可或缺的支持。

综上所述，VSCode 的源代码提供了一个极佳的学习环境，无论是对于新手还是经验丰富的开发者来说，都有很多可以从中学习和借鉴的地方。