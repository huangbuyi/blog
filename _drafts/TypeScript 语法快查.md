## 基本类型

原始类型包括：`boolean`、`bigint`、`null`、`number`、`string`、`symbol`、`object`、`undefined`。

拓展类型包括：
 - `any`：任何类型
 - `unknow`：未知类型，需在稍后的使用中指定类型
 - `never`：表示执行了不应执行的代码，如函数报错无返回值、条件语句中的无效分支
 - `void`：函数返回 undefined 或没有返回值时的类型

## 组合类型：

联合类型：一种类型，表示为多种类型之一。

```ts
type MyBool = true | false;
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
```

泛型：将类型作为变量

```ts
type StringAray = Array<string>;
interface MyStack<T> {
  push: (val: T) => void
  pop: () => T
}
```

## 结构类型

TS 核心原则之一：类型检测关注的是值的结构。具有相同结构的两个值，视为相同类型。

## 基本

```ts
let point3D = [number, number, number]
```

## Interface

```ts
// Interface Types
interface Person {
  name: string  // 必需属性
  age?: number  // 可选属性
  readonly height: number // 只读属性
  [propName: string]: any // 支持添加额外属性
}

// Function Types
interface CompareFunc {
  (arg1: string, arg2: string): boolean
}
let compare: CompareFunc
compare = function (a, b) { return a === b }

// Class Types
interface ClockInterface {
  currentTime: Data
  new (hour: number, minute: number)
  setTime(d: Date): void
}
class Clock implements ClockInterface {
  currentTime: Data = new Data()
  constructor (h, m) {}
  setTime (d: Date) { this.currentTime = d }
}

// Extending Interfaces 接口继承
interface Shape {
  color: string
}
interface PenStroke {
  penWidth: number
}
interface Square extends Shape, PenStroke {
  sideLength: number
}
```

## Classes

```ts
class Person {
  name: string
  public nickname: string
  protected realname: string
  private idNumber: string
  readonly age: number  // 属性只能在声明时或 constroctor 中初始化值
}

// Accessors
class Student {
  private _score: number
  get score(): string { return this._score }
  set score(newScore) {
    this._score = Math.max(newScore, 0)
  }
}

// Static Properties
class Tank {
  static count = 0
  constructor () { Tank.count++ }
}

// Abstrct Classes 抽象类：用于继承，而不直接用来实例化，其中定义的抽象方法子类必须实现
abstract class Animal {
  abstract run (): void
  walk(): void {}
}
```

## Functions

```ts
function add (x: number, y: number): number {
  return x + y
}

let myAdd: (x: number, y: number) => number = function (x, y) { return x + y }

// Optional Parameters 可选参数
function buildName (firstNam: string, lastName?: string) {}

// Rest Parameters
function addAll (x: number, ...rest: number[]) {}

// Overloads
function superAdd (x: string, y: string): string
function superAdd (x: number, y: number): number
function superAdd (x, y) { return x + y }
```

## Generic 泛型

```ts
// 传入 T 类型参数，返回 T 类型值
function indentity<T>(arg: T): T {
  return arg
}
let manul = identity<string>('hello')  // 手动指定类型
let auto = indentity('hello')  // 自动指定类型

class GenericNumber<T> {
  zeroValue: T
  add: (x: T, y: T) => T
}
let myGenericNumber = new GenericNumber<number>()
myGenericNumber.zeroValue = 0
myGenericNumber.add = function (x, y) { return x + y }
```

## Enums 枚举
```ts
enum Direction {
  Up = 1, 
  Down = 2,
  Left = 3,
  Right = 4
}
let d: Direction = Direction.Up
```

##

```ts
let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
```