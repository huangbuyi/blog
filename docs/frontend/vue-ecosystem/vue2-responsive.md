---
title: Vue2 响应式源码解读
date: 2023-02-17
---

认识[Vue2](https://github.com/vuejs/vue)响应式系统原理，我们要思考两个个问题：

1. 当我们改变组件的一个状态时，系统会发生什么变化？
2. 系统是如何知道哪些部分依赖于这个状态？

实际上，组件的渲染、计算属性、组件`watch`对象和`Vue.&watch()`方法，它们之所以能响应组件`props`和`data`的变化，都是围绕着`Watcher`类来实现的。

本文只截取部分核心代码，重在讲解响应式原理，尽量减少其它代码的干扰，但会注释代码来源，结合源码观看风味更佳。另外，本文源码版本：

```typescript
"version": "2.7.14",
```
### 定义响应式属性
首先，看看组件的`props`和`data`中的属性是如何定义为响应式的：

```typescript
// src/core/instance/init.ts
Vue.prototype._init = function (options?: Record<string, any>) {
  const vm: Component = this
  initState(vm) // 初始化状态
}

// src/core/instance/state.ts
export function initState(vm: Component) {
  const opts = vm.$options
  initProps(vm, opts.props) // 初始化Props
  initData(vm) // 初始化Data
  initComputed(vm, opts.computed)
  initWatch(vm, opts.watch)
}
function initProps(vm: Component, propsOptions: Object) {
  const props = (vm._props = shallowReactive({}))
  for (const key in propsOptions) {
    defineReactive(props, key, value) // 定义响应式属性
  }
}
function initData(vm: Component) {
  let data: any = vm.$options.data
  data = vm._data = isFunction(data) ? getData(data, vm) : data || {}
  observe(data)
}

// src/core/observer/index.ts
export function observe(value: any, shallow?: boolean, ssrMockReactivity?: boolean) {
  return new Observer(value, shallow, ssrMockReactivity)
}
export class Observer {
  constructor(public value: any, public shallow = false, public mock = false) {
    const keys = Object.keys(value)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      // 定义响应式属性
      defineReactive(value, key, NO_INITIAL_VALUE, undefined, shallow, mock)
    }
  }
}
```
从上面代码可以看出，在组件初始化阶段，无论是`props`还是`data`属性，最终都通过函数`defineReactive`定义为响应式属性。所以我们要重点关注这个方法：

```typescript
// src/core/observer/index.ts
export function defineReactive(obj: object, key: string, val?: any, customSetter?: Function | null, shallow?: boolean, mock?: boolean) {
  const dep = new Dep() // 创建一个dep实例
  const property = Object.getOwnPropertyDescriptor(obj, key)
  const getter = property && property.get
  const setter = property && property.set

  Object.defineProperty(obj, key, {
    get: function reactiveGetter() {
      const value = getter ? getter.call(obj) : val
      dep.depend() // 添加依赖关系Watcher
      return isRef(value) && !shallow ? value.value : value
    },
    set: function reactiveSetter(newVal) {
      setter.call(obj, newVal)
      dep.notify() // 赋值时，发布通知
    }
  }
}
```
`Object.defineProperty`重新定义了属性的`get`和`set`。当读取属性时，会自动触发get，当设置属性值时，会自动触发`set`，记住这一机制。从上面代码可以发现，每个属性都有一个`dep`实例，它的作用就是记录依赖这个属性`watcher`列表，并在属性赋值时，通知列表中的`watcher`更新，这些更新包括：改变计算属性值、执行组件watch对象中定义的方法、重新渲染等。

### 收集依赖关系
在进一步了解`dep.depend()`是之前，先看一下`Vue.$watch`如何方法创建`watcher`，有利于后面的理解：

```typescript
Vue.prototype.$watch = function (
  expOrFn: string | (() => any), // 重点关注这个参数
  cb: any,
  options?: Record<string, any>
) {
  const vm: Component = this
  const watcher = new Watcher(vm, expOrFn, cb, options) // 创建watcher
}
```
`expOrFn`类型是一个字符串或函数，如果是字符串，会转化成函数，赋值给`watcher.getter`。接下来看`dep.depend()`是如何收集依赖的，重点关注`Dep`和`Watcher`两个类：

```typescript
// src/core/observer/dep.ts
export default class Dep {
  static target?: DepTarget | null // Watcher正是DepTarget类的实现
  subs: Array<DepTarget | null> // 依赖列表

  addSub(sub: DepTarget) {
    this.subs.push(sub)
  }

  depend(info?: DebuggerEventExtraInfo) {
    if (Dep.target) {
      Dep.target.addDep(this) // 向watcher中添加dep实例
    }
  }
}
const targetStack: Array<DepTarget | null | undefined> = []
// 入栈watcher，并将target指向这个watcher
export function pushTarget(target?: DepTarget | null) {
  targetStack.push(target)
  Dep.target = target
}
// 出栈watcher，并将target指向最后的watcher
export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}

// src/core/observer/watcher.ts
export default class Watcher implements DepTarget {
  constructor(
    vm: Component | null,
    expOrFn: string | (() => any),
    cb: Function,
    options?: WatcherOptions | null,
    isRenderWatcher?: boolean
  ) {
    this.cb = cb // 回调函数
    if (isFunction(expOrFn)) {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn) // 转化为函数
    }
    this.value = this.get() // 获取值
  }
  // 获取值，并收集依赖关系
  get() {
    pushTarget(this) // 入栈，Dep.target指向当前watcher
    let value
    const vm = this.vm
    value = this.getter.call(vm, vm) // 执行getter期间只要读取了响应式属性，会触发属性的get，然后调用dep.depend()，再调用Dep.target（当前watcher）的addDep方法，将watcher添加到dep.subs
    popTarget() // 出栈
    return value
  }

  addDep(dep: Dep) {
    dep.addSub(this) // 将watcher添加到dep.subs
  }
}
```
执行`getter`期间只要读取了响应式属性，会触发改属性重写的`get`，然后调用`dep.depend()`，再调用`Dep.target`（当前`watcher`）的`addDep`方法，将`watcher`添加到`dep.subs`。于是，属性的`dep`就知道了哪些`watcher`用到了这个属性，它们都保存在了`dep.subs`列表中。

### 赋值响应式属性
接着，看改变props或state后，会发生什么情况：

1. 改变响应式属性值
2. 触发重写的`set`，调用`dep.notify()`
3. `dep.notify()`通知`dep.subs`所有的`watcher.update()`
4. `watcher.update()`中将`watcher`自己加入更新队列
5. `nextTick`后执行更新，调用队列中所有`watcher.run()`
6. `watcher.run()`中调用`watcher.get()`获得新值，并重新收集依赖
7. 调用回调函数`watcher.cb`，传入新旧值

```typescript
// 1. 改变响应式属性值 examples/composition/todomvc.html
<input id="toggle-all" class="toggle-all" type="checkbox" v-model="state.allDone"/>

// 2. 触发重写的set，调用dep.notify() src/core/observer/index.ts
export function defineReactive() {
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    set: function reactiveSetter(newVal) {
      dep.notify()
    }
  }
}

// 3. dep.notify()通知dep.subs所有的watcher.update() src/core/observer/dep.ts
notify(info?: DebuggerEventExtraInfo) {
  const subs = this.subs.filter(s => s) as DepTarget[]
  for (let i = 0, l = subs.length; i < l; i++) {
    const sub = subs[i]
    sub.update()
  }
}

// 4. watcher.update()中将watcher自己加入队列 src/core/observer/watcher.ts
update() {
  queueWatcher(this)
}

// 5. nextTick后执行更新，调用队列中所有watcher.run() src/core/observer/seheduler.ts
const queue: Array<Watcher> = []
export function queueWatcher(watcher: Watcher) {
  queue.push(watcher)
  nextTick(flushSchedulerQueue)
}
function flushSchedulerQueue() {
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    watcher.run()
  }
}

// 6. watcher.run()中调用watcher.get()获得新值，并重新收集依赖 src/core/observer/watcher.ts
run() {
  const value = this.get()
  const oldValue = this.value
  this.value = value
  this.cb.call(this.vm, value, oldValue) // 7. 调用回调函数watcher.cb，传入新旧值
}
```
### 渲染函数响应式
渲染函数`_render`用于生成虚拟DOM，也就是`VNode`。当组件的`props`或`data`发生变化时，会触发`_render`重新渲染组件：

```typescript
// src/types/component.ts
class Component {
  _render: () => VNode
}
```
触发重绘机制也是通过`watcher`来实现的，不过这个`watcher`会比较特殊，它没有回调函数，创建于组件`mount`阶段：

```typescript
// src/platforms/web/runtime/index.ts
Vue.prototype.$mount = function (el?: string | Element, hydrating?: boolean): Component {
  el = el && inBrowser ? query(el) : undefined
  return mountComponent(this, el, hydrating)
}

// src/core/instance/lifecycle.ts
export function mountComponent(vm: Component, el: Element | null | undefined, hydrating?: boolean)  {
  updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }
  new Watcher(vm, updateComponent, noop, watcherOptions, true /* isRenderWatcher */)
}
```
`updateComponent`作为第二参数，也就成为了`watcher.getter`。和普通的`watcher`一样，`getter`执行时，也就是`updateComponent`执行期间，或者说`_update`和`_render`执行期间，读取响应式属性时，会触发它们的`get`，将渲染`watcher`添加到属性对应的`dep.subs`中。当响应式属性发生变化时，触发重新渲染，这个流程与之前略有不同：

1. 改变响应式属性值
2. 触发重写的`set`，调用`dep.notify()`
3. `dep.notify()`通知`dep.subs`所有的`watcher.update()`
4. `watcher.update()`中将`watcher`自己加入更新队列
5. `nextTick`后执行更新，调用队列中所有`watcher.run()`
6. `watcher.run()`中调用`watcher.get()`获得新值，并重新收集依赖
7. `watcher.get()`中会调用`wacher.getter.call()`
8. 等于调用`updateComponent`，重新渲染组件（渲染`watcher`回调函数等于`noop`，相当于不执行回调）

以官方例子来看以上流程：

```typescript
// 1. 改变响应式属性值 examples/composition/todomvc.html
<input id="toggle-all" class="toggle-all" type="checkbox" v-model="state.allDone"/>

// 2. 触发重写的set，调用dep.notify() src/core/observer/index.ts
export function defineReactive() {
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    set: function reactiveSetter(newVal) {
      dep.notify()
    }
  }
}

// 3. dep.notify()通知dep.subs所有的watcher.update() src/core/observer/dep.ts
notify(info?: DebuggerEventExtraInfo) {
  const subs = this.subs.filter(s => s) as DepTarget[]
  for (let i = 0, l = subs.length; i < l; i++) {
    const sub = subs[i]
    sub.update()
  }
}

// 4. watcher.update()中将watcher自己加入队列 src/core/observer/watcher.ts
update() {
  queueWatcher(this)
}

// 5. nextTick后执行更新，调用队列中所有watcher.run() src/core/observer/seheduler.ts
const queue: Array<Watcher> = []
export function queueWatcher(watcher: Watcher) {
  queue.push(watcher)
  nextTick(flushSchedulerQueue)
}
function flushSchedulerQueue() {
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    watcher.run()
  }
}

// 6. watcher.run()中调用watcher.get()获得新值，并重新收集依赖 src/core/observer/watcher.ts
run() {
  const value = this.get()
  const oldValue = this.value
  this.value = value
  this.cb.call(this.vm, value, oldValue)
}

// 7. watcher.get()中会调用wacher.getter.call() src/core/observer/watcher.ts
get() {
  pushTarget(this)
  let value
  const vm = this.vm
  value = this.getter.call(vm, vm) // 等于updateComponent()
  popTarget()
  return value
}

// 8. 等于调用updateComponent，重新渲染组件（渲染watcher回调函数等于noop，相当于不执行任何回调）src/core/instance/lifecycle.ts
export function mountComponent(vm: Component, el: Element | null | undefined, hydrating?: boolean)  {
  updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }
  new Watcher(vm, updateComponent, noop, watcherOptions, true /* isRenderWatcher */)
}
```
### 计算属性响应式
计算属性同样是通过`watcher`实现的。在实例初始化阶段`initState`时，调用`initComputed`为每个计算属性创建一个`watcher`，它同样没有回调函数：

```typescript
// src/core/instance/state.ts
export function initState(vm: Component) {
  const opts = vm.$options
  if (opts.computed) initComputed(vm, opts.computed)
}
const computedWatcherOptions = { lazy: true }
function initComputed(vm: Component, computed: Object) {
  const watchers = (vm._computedWatchers = Object.create(null))

  for (const key in computed) {
    const userDef = computed[key]
    const getter = isFunction(userDef) ? userDef : userDef.get
    watchers[key] = new Watcher(vm, getter || noop, noop, computedWatcherOptions)

    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    }
  }
}

export function defineComputed(target: any, key: string, userDef: Record<string, any> | (() => any)) {
  sharedPropertyDefinition.get = createComputedGetter(key) // 重写属性的get
  sharedPropertyDefinition.set = noop // 不允许更改属性值
  Object.defineProperty(target, key, sharedPropertyDefinition) // 重新定义计算属性的set和get
}

function createComputedGetter(key) {
  return function computedGetter() {
    const watcher = this._computedWatchers && this._computedWatchers[key]
    return watcher.value // 返回watcher.value值
  }
}
```
以上代码可以看出，`defineComputed`重新定义了计算属性的`set`和`get`，`get`永远返回对应`watcher.value`。计算属性的值是用户定义的函数，它也是`watcher.getter`，原理同上。函数中的响应式属性发生变化时：

1. 改变响应式属性值
2. 触发重写的`set`，调用`dep.notify()`
3. `dep.notify()`通知`dep.subs`所有的`watcher.update()`
4. `watcher.update()`中将`watcher`自己加入更新队列
5. `nextTick`后执行更新，调用队列中所有`watcher.run()`
6. `watcher.run()`中调用`watcher.get()`获得新值，并重新收集依赖
7. 读取计算属性时，触发重写的`get`方法，返回`watcher.value`值

### 组件的watch对象
它通过`Vue.$watch`来实现的，看代码即可，原理同上。

```typescript
// src/core/instance/state.ts
function initWatch(vm: Component, watch: Object) {
  for (const key in watch) {
    const handler = watch[key]
    createWatcher(vm, key, handler)
  }
}

function createWatcher(
  vm: Component,
  expOrFn: string | (() => any),
  handler: any,
  options?: Object
) {
  return vm.$watch(expOrFn, handler, options)
}

```
### 异步更新和 Watcher执行顺序
`nextTick`中的函数是异步执行的，也就是说随响应式属性变化的`watcher`会依次加入更新队列中，直到这部分同步代码全部执行完毕，之后才会执行异步代码，按顺序调用队列中`watch.run`，执行回调函数或重新渲染组件。

`watcher.run`执行是讲究顺序的，为了满足执行顺序，必须在`watcher.run`之前重新按`watcher.id`大小排序，因为`watcher.id`是自增的，所以后创建的`wacher.id`要大于先创建的。排序能满足以下要求：

1. 组件更新必须从父组件到子组件。（父组件永远先于子组件创建，因此父组件`watcher.id`小于子组件）
2. 用户`wachers`必须在渲染`watcher`之前执行。（用户`props`、`data`和`computed`的`wachers`创建于组件初始化阶段，`watcher.id`一定小于`mount`阶段创建的渲染`watcher`）

```typescript
function flushSchedulerQueue() {
  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(sortCompareFn)
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index]
    watcher.run()
  }
}

const sortCompareFn = (a: Watcher, b: Watcher): number => {
  if (a.post) {
    if (!b.post) return 1
  } else if (b.post) {
    return -1
  }
  return a.id - b.id
}
```
