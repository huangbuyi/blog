import { defineConfig, DefaultTheme } from 'vitepress';
import { CateItem, cates } from '../data.mjs';
import matter from 'gray-matter';
import { globSync } from 'tinyglobby';
import fs from 'fs';
import path from 'path';
import { groupCollapsed } from 'console';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "「头哥」的技术博客",
  description: "Neo's computer science blog.",
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
  const sidebarByCate: Record<string, DefaultTheme.SidebarItem> = {};
  const rootSidebar: DefaultTheme.SidebarItem[] = [];

  for (const cate of cates) {
    const subcates = cate.children && createSidebarItems(cate.children, sidebarByCate);
    const item = {
      text: cate.text,
      link: `/${cate.name}`,
      collapsed: true,
      items: subcates
    }
    rootSidebar.push(item);
    sidebarByCate[cate.name] = item;
    sidebar[`/${cate.name}`] = subcates;
  }
  sidebar['/'] = rootSidebar;

  const files = globSync('docs/posts/*.md');
  for (const file of files) {
    const src = fs.readFileSync(file, 'utf-8');
    const { data: frontmatter, excerpt } = matter(src);
    const categoris: string[] = frontmatter.categories;
    const lastCate = categoris[categoris.length - 1];
    if (sidebarByCate[lastCate]) {
      sidebarByCate[lastCate].items!.push({
        text: frontmatter.title,
        link: `${path.relative('docs', file)}`
      });
    }
  }

  console.log(sidebar);
  return sidebar;
}

function createSidebarItems(cates: CateItem[], sidebarByCate: Record<string, DefaultTheme.SidebarItem>) {
  return cates.map(cate => {
    const sidebarItem = {
      text: cate.text,
      link: `/${cate.name}`,
      collapsed: true,
      items: cate.children ? createSidebarItems(cate.children, sidebarByCate) : []
    }
    sidebarByCate[cate.name] = sidebarItem;

    return sidebarItem;
  })
}
