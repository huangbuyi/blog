---
title: 私有化构造器阻止第三方示例化
date: 2024-08-02
---

为阻止第三方实例化类，可以将构造器声明为私有类型（private）或保护类型（protect）。可用于创建纯静态方法和属性的类，也可以用于实现单例模式。

```ts
class BikeFactory {
  private static _instance: BikeFactory | null = null;
  
  public static create() {
    if (!BikeFactory._instance) {
      BikeFactory._instance = new BikeFactory();
    }
    return this._instance;
  }

  private constructor() {}
}

const b = new BikeFactory(); // ts error