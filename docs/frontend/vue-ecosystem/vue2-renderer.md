---
title: Vue2 渲染引擎
date: 2023-02-18
cover: /images/8EVwWFriTCf298_kb2ZiZeiSZIvIwh7KR6wLKqnfNkY.png
---

本文探讨 Vue 将 HTML 模板转化页面的大概流程，我们从`$mount`执行开始：

```typescript
new Vue(App).$mount('#app')
```
流程将经历以下阶段：

1. 获取 HTML 模板代码
2. 创建模板编译器
3. 将模板转化为抽象语法树 AST
4. 生成渲染函数字符串，创建渲染函数
5. 渲染函数生成 VNode，将其渲染为真实 DOM

### 获取 HTML 模板代码
模板代码也就是 HTML 代码，Vue 会读取指定元素的 HTML，将其转化为组件的`render`函数，在 Web 运行时环境生效。在编译环境中，像单文件组件语法，编译器会自动将模板代码转化为渲染函数。

```typescript
// src/platforms/web/runtime-with-compiler.ts
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (el?: string | Element, hydrating?: boolean): Component {
  const options = this.$options
  let template = options.template
  template = getOuterHTML(el) // 获取HTML模板
  // 将模板转化为组件渲染函数
  const { render, staticRenderFns } = compileToFunctions(
    template,
    {
      outputSourceRange: __DEV__,
      shouldDecodeNewlines,
      shouldDecodeNewlinesForHref,
      delimiters: options.delimiters,
      comments: options.comments
    },
    this
  )
  options.render = render
  options.staticRenderFns = staticRenderFns
  return mount.call(this, el, hydrating)
}
```
### 创建模板编译器
```typescript
// src/compiler/index.ts
export const createCompiler = createCompilerCreator(function baseCompile(
  template: string,
  options: CompilerOptions
): CompiledResult {
  const ast = parse(template.trim(), options) // 创建抽象语法树
  if (options.optimize !== false) {
    optimize(ast, options)
  }
  const code = generate(ast, options) // 生成渲染函数
  return {
    ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  }
})
```
### 将模板转化为抽象语法树 AST
将 HTML 模板转化为树形数据结构进行描述，也就是抽象语法树。

![image](/images/8EVwWFriTCf298_kb2ZiZeiSZIvIwh7KR6wLKqnfNkY.png)

编译过程中并没有对 Vue 语法（如`v-for`、`:class`、`:key`、用户组件等）做特别处理，只是将它们视作普通的标签和属性值。

![image](/images/F6HJBSjAQOVaBVd6SX4iaoyP-J77KhQob3jiU7sC6hg.png)

### 生成渲染函数字符串，创建渲染函数
这一步用 AST 生成代码字符串，然后用`with`执行这段代码，生成渲染函数。

```typescript
// src/compiler/codegen/index.ts
export function generate(
  ast: ASTElement | void,
  options: CompilerOptions
): CodegenResult {
  const state = new CodegenState(options)
  // 生成代码字符串
  const code = ast
    ? ast.tag === 'script'
      ? 'null'
      : genElement(ast, state)
    : '_c("div")'
  return {
    render: `with(this){return ${code}}`, // with指定变量作用域，在不损失性能情况下，减少变量名长度
    staticRenderFns: state.staticRenderFns
  }
}
```
其中`code`值可能是这样的，执行时，`with`语法将变量作用域将指向`vue`实例本身，`code`中的`_c`是实例的一个方法，是`createElement`简写，用来创建`Vnode`。

```typescript
`_c('div',{attrs:{"id":"app"}},[_c('section',{staticClass:"todoapp"},[_c('header',{staticClass:"header"},[_c('h1',[_v("todos")]),_v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(state.newTodo),expression:"state.newTodo"}],staticClass:"new-todo",attrs:{"autofocus":"","autocomplete":"off","placeholder":"What needs to be done?"},domProps:{"value":(state.newTodo)},on:{"keyup":function($event){if(!$event.type.indexOf('key')&&_k($event.keyCode,"enter",13,$event.key,"Enter"))return null;return addTodo.apply(null, arguments)},"input":function($event){if($event.target.composing)return;$set(state, "newTodo", $event.target.value)}}})]),_v(" "),_c('section',{directives:[{name:"show",rawName:"v-show",value:(state.todos.length),expression:"state.todos.length"}],staticClass:"main"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(state.allDone),expression:"state.allDone"}],staticClass:"toggle-all",attrs:{"id":"toggle-all","type":"checkbox"},domProps:{"checked":Array.isArray(state.allDone)?_i(state.allDone,null)>-1:(state.allDone)},on:{"change":function($event){var $$a=state.allDone,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_i($$a,$$v);if($$el.checked){$$i<0&&($set(state, "allDone", $$a.concat([$$v])))}else{$$i>-1&&($set(state, "allDone", $$a.slice(0,$$i).concat($$a.slice($$i+1))))}}else{$set(state, "allDone", $$c)}}}}),_v(" "),_c('label',{attrs:{"for":"toggle-all"}},[_v("Mark all as complete")]),_v(" "),_c('ul',{staticClass:"todo-list"},_l((state.filteredTodos),function(todo){return _c('li',{key:todo.id,staticClass:"todo",class:{ completed: todo.completed, editing: todo === state.editedTodo }},[_c('div',{staticClass:"view"},[_c('input',{directives:[{name:"model",rawName:"v-model",value:(todo.completed),expression:"todo.completed"}],staticClass:"toggle",attrs:{"type":"checkbox"},domProps:{"checked":Array.isArray(todo.completed)?_i(todo.completed,null)>-1:(todo.completed)},on:{"change":function($event){var $$a=todo.completed,$$el=$event.target,$$c=$$el.checked?(true):(false);if(Array.isArray($$a)){var $$v=null,$$i=_i($$a,$$v);if($$el.checked){$$i<0&&($set(todo, "completed", $$a.concat([$$v])))}else{$$i>-1&&($set(todo, "completed", $$a.slice(0,$$i).concat($$a.slice($$i+1))))}}else{$set(todo, "completed", $$c)}}}}),_v(" "),_c('label',{on:{"dblclick":function($event){return editTodo(todo)}}},[_v(_s(todo.title))]),_v(" "),_c('button',{staticClass:"destroy",on:{"click":function($event){return removeTodo(todo)}}})]),_v(" "),_c('input',{directives:[{name:"model",rawName:"v-model",value:(todo.title),expression:"todo.title"},{name:"todo-focus",rawName:"v-todo-focus",value:(todo === state.editedTodo),expression:"todo === state.editedTodo"}],staticClass:"edit",attrs:{"type":"text"},domProps:{"value":(todo.title)},on:{"blur":function($event){return doneEdit(todo)},"keyup":[function($event){if(!$event.type.indexOf('key')&&_k($event.keyCode,"enter",13,$event.key,"Enter"))return null;return doneEdit(todo)},function($event){if(!$event.type.indexOf('key')&&_k($event.keyCode,"escape",undefined,$event.key,undefined))return null;return cancelEdit(todo)}],"input":function($event){if($event.target.composing)return;$set(todo, "title", $event.target.value)}}})])}),0)]),_v(" "),_c('footer',{directives:[{name:"show",rawName:"v-show",value:(state.todos.length),expression:"state.todos.length"}],staticClass:"footer"},[_c('span',{staticClass:"todo-count"},[_c('strong',[_v(_s(state.remaining))]),_v(" "),_c('span',[_v(_s(state.remainingText))])]),_v(" "),_c('ul',{staticClass:"filters"},[_c('li',[_c('a',{class:{ selected: state.visibility === 'all' },attrs:{"href":"#/all"}},[_v("All")])]),_v(" "),_c('li',[_c('a',{class:{ selected: state.visibility === 'active' },attrs:{"href":"#/active"}},[_v("Active")])]),_v(" "),_c('li',[_c('a',{class:{ selected: state.visibility === 'completed' },attrs:{"href":"#/completed"}},[_v("Completed")])])]),_v(" "),_c('button',{directives:[{name:"show",rawName:"v-show",value:(state.todos.length > state.remaining),expression:"state.todos.length > state.remaining"}],staticClass:"clear-completed",on:{"click":removeCompleted}},[_v("\\n        Clear completed\\n      ")])])])])`
```
在创建编译器时，渲染函数的代码字符串会转化为一个真正函数：

```typescript
// src/compiler/to-function.ts
function createFunction(code, errors) {
  try {
    return new Function(code)
  } catch (err: any) {
    errors.push({ err, code })
    return noop
  }
}
```
### 渲染函数生成 VNode，将其渲染为真实 DOM
在组件更新时，`vm._render()`生成虚拟 DOM `Vnode`，再将它传入`vm._update()`更新真实 DOM：

```typescript
// src/core/instance
updateComponent = () => {
  vm._update(vm._render(), hydrating)
}
```
使用 `__patch__`渲染真实 DOM：

```typescript
// src/core/instance/lifecycle.ts
export function lifecycleMixin(Vue: typeof Component) {
  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    let wrapper: Component | undefined = vm
    while (
      wrapper &&
      wrapper.$vnode &&
      wrapper.$parent &&
      wrapper.$vnode === wrapper.$parent._vnode
    ) {
      wrapper.$parent.$el = wrapper.$el
      wrapper = wrapper.$parent
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }
}
```
