<script setup lang="ts">
import { computed } from 'vue';
import { data } from './posts.data.mjs';
import { base } from './data.mjs';

const { cate, title, max, all } = defineProps<{
  cate?: string,
  title?: string,
  max?: number,
  all?: boolean
}>();

const posts = computed(() => {
  return data.filter(item => {
    return item.url.startsWith(`${base}${cate || ''}`);
  }).slice(0, all ? undefined : (max || 100))
})

</script>

<template>
  <div class="article-list">
    <h2 v-if="title">{{ title }}</h2>
    <ul>
      <li v-for="post of posts">
        <a :href="post.url" class="article-item">
          <div class="date">{{ new Date(post.frontmatter.date).toLocaleDateString() }}</div>
          <div class="title">{{ post.frontmatter.title }}</div>
          <div class="tags">
            <span v-for="tag of post.tags" class="tag-item">{{ tag }}</span>
          </div>
          <div v-if="post.frontmatter.cover" class="cover">
            <img :src="post.frontmatter.cover" alt="cover" class="cover-img" />
          </div>
          <div v-else class="excerpt">
            <span>{{ post.excerptText }}</span>
          </div>
        </a>
        <hr />
      </li>
    </ul>
    <a v-if="!all" :href="`${base}all-articles/${cate || ''}`">全部文章</a>
  </div>
</template>

<style scoped>
.article-list {
  padding: 20px 0;
  display: flex;
  flex-flow: column;
  align-items: center;
}

.article-list ul {
  list-style: none;
  padding: 0;
  max-width: 700px;
}

.article-item {
  display: block;
  color: #333;
  text-decoration: none;
  transition: all 225ms cubic-bezier(0.4, 0, 0.6, 1);
  border-radius: 8px;
  padding: 8px;
}

.article-item:hover {
  color: #333;
  background-color: rgba(0,0,0,.1);
}

.article-item .date {
  color: #999;
  font-size: 12px;
}

.article-item .title {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}

.article-item .tags {
  display: flex;
  gap: 4px;
  color: #999;
  font-size: 12px;
  margin-top: 4px;
}

.article-item .tag-item {
  border-radius: 4px;
  padding: 4px 8px;
  border: 1px solid rgba(0,0,0,.1);
  line-height: 1;
}

.article-item .cover {
  width: 100%;
  margin-top: 10px;
}

.article-item .cover-img {
  object-fit: contain;
  width: 100%;
  height: 100%;
  max-height: 600px;
}

.article-item .excerpt {
  margin-top: 10px;
  font-size: 15px;
  color: #666;
}
</style>