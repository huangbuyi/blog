import { CateItem, cates } from '../data.mts';

export default {
  paths() {
    console.log(flatCates(cates))
    return flatCates(cates).map(cate => {
      return { params: { cate: cate.name, title: cate.text } }
    })
  }
}

function flatCates(cates: CateItem[]): CateItem[] {
  return cates.reduce((res, cate) => {
    res.push({ text: cate.text, name: cate.name })
    if (cate.children) {
      res.push(...flatCates(cate.children))
    }
    return res
  }, [] as CateItem[])
}