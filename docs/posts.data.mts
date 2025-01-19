import { ContentData, createContentLoader } from 'vitepress';
import { cates, base, CateItem } from './data.mts';
import  * as cheerio from 'cheerio';
import path from 'path';

const target = cates.map(cate => `${cate.name}/**/*.md`);
const tagByCate = createTagByCate(cates);

export default createContentLoader(target, {
  includeSrc: true, // 包含原始 markdown 源?
  render: true,     // 包含渲染的整页 HTML?
  excerpt: true,    // 包含摘录?
  transform(rawData) {
    // 根据需要对原始数据进行 map、sort 或 filter
    // 最终的结果是将发送给客户端的内容
    return rawData.filter(a => !a.url.endsWith('/')).sort((a, b) => {
      return +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date)
    }).map((item) => {
      if (item.frontmatter.cover) {
        item.frontmatter.cover = path.posix.join(base, item.frontmatter.cover);
      }

      return {
        ...item,
        url: path.posix.join(base, item.url),
        excerptText: extractText(item.html),
        tags: createTags(item.url),
      }
    });
  }
})

function createTagByCate(cates: CateItem[], tagByCate: Record<string, string> = {}) {
  for (const cate of cates) {
    tagByCate[cate.name] = cate.text;

    if (cate.children) {
      createTagByCate(cate.children, tagByCate);
    }
  }
  return tagByCate;
}

function createTags(fileUrl: string) {
  const cates = fileUrl.split('/');
  const tags: string[] = [];

  for (let i = 0; i < cates.length - 1; i++) {
    const cate = cates[i];
    if (tagByCate[cate]) {
      tags.push(tagByCate[cate]);
    }
  }

  return tags;
}


function extractText(htmlString?: string, length = 200) {
  if (!htmlString) return '';

  // 加载 HTML 字符串到 cheerio
  const $ = cheerio.load(htmlString);

  // 提取所有文本内容，并去除多余的空白字符
  let textContent = $('body').text().replace(/\s+/g, ' ').trim();

  // 取出前 100 个字符
  const firstLengthChars = textContent.slice(0, length);

  // 如果在第 100 个字符处截断了一个单词，则找到最后一个空格并在此处截断
  const lastSpaceIndex = firstLengthChars.lastIndexOf(' ');
  if (lastSpaceIndex > -1 && textContent.length > length) {
    return firstLengthChars.slice(0, lastSpaceIndex) + '...';
  }

  return firstLengthChars;
}

declare const data: (ContentData & { excerptText: string, tags: string[] })[];
export { data };