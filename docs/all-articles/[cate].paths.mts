import { cates } from '../data.mts';

export default {
  paths() {
    const paths = cates.map(cate => {
      return { params: { cate: cate.name, title: cate.text } }
    });

    paths.push({ params: { cate: 'index', title: '全部文章' } });

    return paths;
  }
}