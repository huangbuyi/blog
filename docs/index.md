---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: 「头哥」的技术博客
  text: 技术改变生活，分享驱动进步
  tagline: 前端、后端、AI、设计……，技术无界，分享无限

features:
  - title: 大前端
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
    link: /frontend
  - title: 大后端
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
    link: /backend
  - title: 人工智能
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
    link: /ai
  - title: 计算机科学
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
    link: /cs
  - title: 产品&设计
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
    link: /product-and-design
  - title: 计算机技术
    details: Lorem ipsum dolor sit amet, consectetur adipiscing elit
    link: /ct
---

<script setup>
import { data as posts } from './posts.data.mts'
for (let post of posts) {
  console.log(post.frontmatter.categor);
}
</script>

<div>
  <h1>All Blog Posts</h1>
  <ul>
    <li v-for="post of posts">
      <a :href="post.url">{{ post.frontmatter.title }}</a>
      <span>by {{ post.frontmatter.author }}</span>
    </li>
  </ul>
</div>