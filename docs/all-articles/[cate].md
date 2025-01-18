<script setup>
import { useData } from 'vitepress'
import { data } from './posts.data.mts'

const { params } = useData()

const posts = data.filter(post => post.frontmatter.categories?.includes(params.value.cate))

</script>

<div>
  <h1>{{params.title}}</h1>
  <ul>
    <li v-for="post of posts">
      <a :href="post.url">{{ post.frontmatter.title }}</a>
      <span>by {{ post.frontmatter.author }}</span>
    </li>
  </ul>
</div>