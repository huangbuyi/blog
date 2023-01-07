# 浏览器原生UI控制

## 表单

### 输入框——数字类型

#### 隐藏输入框的数字箭头

```css
input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0; 
}
```

## 滚动条
