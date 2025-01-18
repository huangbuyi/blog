<script setup>
import { useData } from 'vitepress';
import ArticleList from '../ArticleList.vue';

const { params, title } = useData();

</script>

<div>
  <ArticleList :cate="params.cate === 'index' ? '' : params.cate" :title="params.title"  :max="999" />
</div>