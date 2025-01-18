---
title: Vue3 父组件传入属性变化，子组件属性未变
date: 2024-09-25
---

问题代码如下：

```vue
<script setup lang="ts">

const { title } = defineProps<{
  title: string;
}>();

</script>

<template>
  <div class="property-input">{{ title }}</div>
</template>
```

解决：因为析构赋值，变量`title`相当于`const title = props.title`，它只是一个普通字符串类型，并非 Vue 中的响应式类型。

又因为`setup`实际上只执行一次，所以`title`的值只会是最初创建组件时的值，不会随`props`一起变化，除非在`onBeforeUpdate`时重新赋值。

结论：不要对`props`实用析构赋值，直接引用`props`。

```vue
<script setup lang="ts">

const props= defineProps<{
  title: string;
}>();

</script>

<template>
  <div class="property-input">{{ props.title }}</div>
</template>
```