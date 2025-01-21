export interface CateItem {
  text: string,
  name: string,
  children?: CateItem[]
}

export const cates: CateItem[] = [
  {
    text: '大前端',
    name: 'frontend',
    children: [
      {
        text: 'TypeScript 实用技巧',
        name: 'pratical-typescript-tips'
      },
      {
        text: 'JavaScript 实用技巧',
        name: 'pratical-javascript-tips'
      },
      {
        text: 'Vue 生态',
        name: 'vue-ecosystem'
      },
      {
        text: 'React 生态',
        name: 'react-ecosystem'
      },
      {
        text: 'CSS 实用技巧',
        name: 'pratical-css-tips'
      },
      {
        text: 'HTML 实用技巧',
        name: 'pratical-html-tips'
      },
      {
        text: 'VSCode 源码分析',
        name: 'vscode-source-analysis'
      },
      {
        text: '效率提升',
        name: 'productivity'
      },
      {
        text: '前端杀虫记',
        name: 'frontend-debug-dairy'
      },
      {
        text: '其它',
        name: 'other'
      },
    ]
  },
  {
    text: '大后端',
    name: 'backend',
    children: [
      {
        text: 'NodeJS 实用技巧',
        name: 'nodejs-pratical-tips'
      }
    ]
  },
  {
    text: '人工智能',
    name: 'ai',
    children: [
      {
        text: '强化学习',
        name: 'reinforcement-learning'
      }
    ]
  },
  {
    text: '计算机科学',
    name: 'cs',
    children: [
      {
        text: '数据结构与算法',
        name: 'data-structures-and-algorithms'
      },
      {
        text: '软件工程',
        name: 'software-engineering'
      }
    ]
  },
  {
    text: '产品&设计',
    name: 'product-and-design',
    children: [
      {
        text: '笔记',
        name: 'notes'
      },
    ]
  },
  {
    text: '计算机技术',
    name: 'ct',
    children: [
      {
        text: 'Windows 实用技巧',
        name: 'windows-pratical-tips'
      },
    ]
  },
  {
    text: '代码之外',
    name: 'beyond-code',
    children: [
      {
        text: '从0开始的1世界生活',
        name: 'life'
      },
    ]
  }
]

export const base = '/';