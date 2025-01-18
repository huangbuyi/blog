---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 「头哥」的技术博客
  text: 技术改变生活，分享驱动进步
  tagline: 前端、后端、AI、设计……，技术无界，分享无限

features:
  - title: 大前端
    details: JavaScript、TypeScript、Vue、React、CSS、HTML、SSR……，前端的一切都在这 👈
    link: /frontend
  - title: 大后端
    details: NodeJS、Python、数据库、运维……，后端的一切都在这 👈
    link: /backend
  - title: 人工智能
    details: 在二进制的脉搏中苏醒，AI 的思绪如电流穿梭，代码是它的摇篮，数据它的养分 —— AI 🤖
    link: /ai
  - title: 计算机科学
    details: 数据结构、算法、操作系统、计算机网络……，计算机科学的底层部分都在这 👈
    link: /cs
  - title: 产品&设计
    details: 设计规范、实用设计工具……，产品和设计的一切都在这 👈
    link: /product-and-design
  - title: 计算机技术
    details: 计算机使用、实用软件、效率提升……，这里是计算机通用技术 👈
    link: /ct
---

<script setup>
import ArticleList from './ArticleList.vue';

</script>

<div>
  <ArticleList title="最新文章" />
</div>