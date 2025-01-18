import { defineConfig, DefaultTheme } from 'vitepress';
import { CateItem, cates } from '../data.mjs';
import matter from 'gray-matter';
import { globSync } from 'tinyglobby';
import fs from 'fs';
import path from 'path';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "「头哥」的技术博客",
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }]
  ],
  description: "Neo's computer science blog.",
  cleanUrls: true,
  themeConfig: {
    logo: '/icons/logo-be.svg',
    nav: [
      { text: '主页', link: '/' },
      { text: '分类', items: cates.map(cate => ({ text: cate.text, link: `/${cate.name}` })) },
      { text: '文章', link: '/all-articles/' },
      { text: '关于', link: '/about' },
    ],
    sidebar: createSidebar(cates),
    socialLinks: [
      { icon: 'github', link: 'https://github.com/huangbuyi' },
      { link: 'http://bigend.cn', icon: { svg: '<?xml version="1.0" encoding="UTF-8"?><svg id="_图层_2" data-name="图层 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 158.47 123.45"> <defs> <style> .cls-1 { fill: #ff707a; stroke: #50115f; stroke-miterlimit: 3.9; stroke-width: 3.3px; } .cls-2 { fill: #50115f; stroke-width: 0px; } </style> </defs> <g id="_图层_1-2" data-name=" 图层 1"> <path class="cls-2" d="M85.1,88.15c0,23.2-12.5,34.9-37.4,34.9H0V2.05h46.7c12.3,0,21.5,2.5,27.5,7.5s9,13,9,23.9-4.5,19.2-13.4,24.9v1.2c10.3,4,15.4,13.6,15.4,28.6M39.9,101.45c3.9,0,6.5-.9,7.9-2.6s2-5.4,2-10.9-.7-9.4-2.1-11.7-4-3.4-7.8-3.4h-6.2v28.6h6.2ZM40.1,53.85c3,0,5.1-.9,6.2-2.7,1.2-1.8,1.8-5,1.8-9.6s-.6-7.9-1.9-9.7c-1.2-1.9-3.3-2.8-6.3-2.8h-6.2v24.9h6.4v-.1ZM156.4,96.15l-1.9,27.3h-65.4V2.45h67.4l-1.9,29.8h-32.1v18.1h27.9v25.7h-27.9v20.1h34.1-.2Z"/> <path class="cls-1" d="M88.9,86.55c0,22.9-12.3,34.3-36.8,34.3H5.1V1.65h46.1c12.1,0,21.2,2.5,27.1,7.4s8.8,12.8,8.8,23.5-4.4,18.9-13.2,24.6v1.2c10.1,4,15.2,13.4,15.2,28.2h-.2ZM44.4,99.55c3.8,0,6.4-.9,7.8-2.6,1.3-1.7,2-5.3,2-10.8s-.7-9.3-2.1-11.5-4-3.4-7.7-3.4h-6.1v28.2h6.1v.1ZM44.6,52.75c2.9,0,5-.9,6.1-2.7,1.2-1.8,1.7-5,1.7-9.5s-.6-7.7-1.8-9.6c-1.2-1.9-3.3-2.8-6.2-2.8h-6.1v24.6h6.3ZM156.7,94.35l-1.9,26.9h-64.5V2.05h66.4l-1.9,29.4h-31.7v17.8h27.4v25.3h-27.4v19.8h33.6Z"/> </g></svg>' }}
    ]
  }
})

function createSidebar(cates: CateItem[]): DefaultTheme.Sidebar {
  const sidebar: DefaultTheme.Sidebar = {};
  const rootSidebar: DefaultTheme.SidebarItem[] = [];

  for (const cate of cates) {
    const link = `/${cate.name}`;
    const subcates = cate.children && createSidebarItems(cate.children, link);
    const item = {
      text: cate.text,
      collapsed: true,
      items: subcates
    }
    rootSidebar.push(item);

    if (!subcates) {
      continue;
    }

    sidebar[link] = subcates;
    sidebar[link].unshift({
      link,
      text: cate.text + ' - 全部文章'
    });
  }
  sidebar['/all-articles'] = rootSidebar;

  return sidebar;
}

function createSidebarItems(cates: CateItem[], parentLink: string): DefaultTheme.SidebarItem[] {
  return cates.map(cate => {
    const link = parentLink + '/' + cate.name;
    const sidebarItem = {
      text: cate.text,
      collapsed: true,
      items: cate.children ? createSidebarItems(cate.children, link) : crateFileItems(link)
    }

    return sidebarItem;
  })
}

function crateFileItems(parentLink: string) {
  const files = globSync(`docs/${parentLink}/*.md`);

  return files.map(file => {
    const src = fs.readFileSync(file, 'utf-8');
    const { data: frontmatter, excerpt } = matter(src);

    return {
      text: frontmatter.title,
      link: '/' + path.posix.relative('docs/', file).replace('.md',  ''),
      date: frontmatter.date,
    };
  }).sort((a, b) => (+new Date(b.date) - +new Date(a.date)))
}