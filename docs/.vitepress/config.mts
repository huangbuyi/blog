import { defineConfig, DefaultTheme } from 'vitepress';
import { CateItem, cates } from '../data.mjs';
import matter from 'gray-matter';
import { globSync } from 'tinyglobby';
import fs from 'fs';
import path from 'path';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "「头哥」的技术博客",
  description: "Neo's computer science blog.",
  cleanUrls: true,
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],

    sidebar: createSidebar(cates),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
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
      link,
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
  sidebar['/'] = rootSidebar;

  console.log(JSON.stringify(sidebar, null, 2));

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