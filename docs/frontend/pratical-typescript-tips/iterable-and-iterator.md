---
title: Iterable 和 Iterator
date: 2024-09-13
---


## Itreable

`Iteratable`是实现了 [The iterable protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterable_protocol)（可迭代协议）的对象。`Iteratable`必需实现一个`[Symbol.iterator](): Iterator<T>`方法，实现了这个方法，就可以在需要迭代的地方，比如`for...of`、`Array.from`、`new Set()`等使用该对象。`Iteratable`定义如下：

```ts
interface Iterable<T> {
  [Symbol.iterator](): Iterator<T>;
}
```

以下为示例，`MakeRange`会返回指定范围内的整数，比如`new MakeRage(0, 10)`会返回`0,1,2,3...,9`。

```ts
class MakeRange implements Iterable<number> {
  private _first: number;
  private _last: number;

  constructor(first, last) {
    this._first = first;
    this._last = last;
  }

  [Symbol.iterator](): Iterator<number> {
    return new RangeIterator(this._first, this._last);
  }
}

class RangeIterator implements Iterator<number> {
  private _first: number;
  private _last: number;

  constructor(first, last) {
    this._first = first;
    this._last = last;
  }

  next(value?: any): IteratorResult<number> {
    return {
      value: this._first++,
      done: this._first >= this._last,
    };
  }
}
```

## Iterator

`[Symbol.iterator]`方法要求返回值是一个`Iterator`，`Iterator`是实现了 [The iterator protocol](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol)（迭代器协议）的对象。`Iterator`定义如下：

```ts
interface Iterator<T, TReturn = any, TNext = undefined> {
  // NOTE: 'next' is defined using a tuple to ensure we report the correct assignability errors in all places.
  next(...args: [] | [TNext]): IteratorResult<T, TReturn>;
  return?(value?: TReturn): IteratorResult<T, TReturn>;
  throw?(e?: any): IteratorResult<T, TReturn>;
}
```

对象中必需包含一个`next`方法，方法中须返回一个另一个对象`IteratorResult`，其中包含`value`和`done`两个属性，外部使用迭代器时，每次会调用`next`方法，返回对象中的`value`表示此次迭代的值，`done`表示迭代是否完成，返回`true`表示已经完成迭代。示例如下：

```ts
class RangeIterator implements Iterator<number> {
  private _first: number;
  private _last: number;

  constructor(first, last) {
    this._first = first;
    this._last = last;
  }

  next(value?: any): IteratorResult<number> {
    return {
      value: this._first++,
      done: this._first >= this._last,
    };
  }
}
```

实现`Iterable`协议的对象就可以通过`for...of`等方式来遍历了：

```ts
for (const n of new MakeRange(0, 10)) {
  console.log(n);
}
// 0,1,2...,9
```

## IterableIterator

另外，还存在一个`IterableIterator`类，它集`Iterable`和`Iterator`于一身，换句话说，它需要同时定义`[Symbol.iterator]()`方法和`next`方法。

```ts
interface IterableIterator<T> extends Iterator<T> {
  [Symbol.iterator](): IterableIterator<T>;
}
```

它的好处是只需要定义一个对象即可实现一个可迭代的对象，从而减少冗余代码（由于 TypeScript 类型推断的能力，代码省去了一些显示地类型说明）：

```ts
class MakeRange {
  private _first: number;
  private _last: number;

  constructor(first, last) {
    this._first = first;
    this._last = last;
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    return {
      value: this._first++,
      done: this._first >= this._last,
    };
  }
}
```

值得一提的是，很多接口，比如`Array.values`，返回值类型正是`IterableIterator`。

## 参考资料

- [Typing Iterables and Iterators with TypeScript - geekAbyte](https://www.geekabyte.io/2019/06/typing-iterables-and-iterators-with.html)
- [Iterables and iterators - Exploring ES6](https://exploringjs.com/es6/ch_iteration.html)
- [Iteration protocols - MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_iterator_protocol)