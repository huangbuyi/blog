

## 属性
使用括号包裹一个或多个属性，
```
a(href='google.com') Google
a(class='button' href='google.com') Google
input (
    id='checkInput'
    type='checkbox'
    name='agreement'
    checked
)
```
class 属性简写：
```
div.divClass
.divClass
```
多个 class
```
- var classes = ['foo', 'bar', 'baz']
a(class=classes)
a(class=classes class=['bing'])
```
ID 属性简写：
```
div#divId
#divId
```

| 空白控制

将模板编译为 JavaScript 文件
```
jade --client --no-debug
```

