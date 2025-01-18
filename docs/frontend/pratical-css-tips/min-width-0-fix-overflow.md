---
title: 使用 min-width 0 解决 flex-box 子元素溢出容器问题
date: 2024-10-11
---

这是一个常见问题，使用 flex 布局时，flex-box 中的某个子元素随着随容器缩放，如果子元素内元素撑开子元素，导致子元素宽度和高度过大，容器中元素被寄出容器，这一般是我们不想看到的。我们希望这个子元素仍然维持在不超出容器的最大尺寸。解决方案很简单，给这个元素设置`min-width: 0;`，也可以设置为其它数值。

```css
.parent {
  display: flex;
  border: 2px solid red;
}

.foo {
  min-width: 0;
  outline: 1px solid rebeccapurple;
}

.child1 {
  background: cyan;
  height: 40px;
  width: 40px;
  flex-shrink: 0;
}

.child2 {
  background: pink;
  height: 20px;
  width: 20px;
}

.child3 {
  background: yellow;
  height: 20px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}
<div class='parent'>
  <div class='child1'>1</div>
  <div class="foo">
    <div class='child2'>2</div>
    <div class='child3'>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed luctus sagittis odio, ac pulvinar tortor sagittis et. In hac habitasse platea dictumst. Phasellus ut velit dolor. Vestibulum pulvinar orci libero, in aliquet arcu auctor non. Morbi volutpat elit id lacus cursus, at imperdiet tellus eleifend. Morbi euismod vehicula urna, sed pretium felis ullamcorper vitae. Nunc at ligula a odio eleifend convallis eget sed orci. Praesent fermentum, sem in congue tempus, ex diam suscipit neque, in ullamcorper orci erat eu orci.
    </div>
  </div>
</div>
```