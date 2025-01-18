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
        text: 'JavaScript 实用技巧',
        name: 'pratical-javascript-tips'
      },
      {
        text: 'VSCode 源码分析',
        name: 'vscode-source-analysis'
      },
      {
        text: '前端杀虫记',
        name: 'frontend-debug-dairy'
      },
    ]
  },
  {
    text: '大后端',
    name: 'backend',
  },
  {
    text: '人工智能',
    name: 'ai',
  },
  {
    text: '计算机科学',
    name: 'cs'
  },
  {
    text: '产品&设计',
    name: 'product-and-design'
  },
  {
    text: '计算机技术',
    name: 'ct'
  }
]