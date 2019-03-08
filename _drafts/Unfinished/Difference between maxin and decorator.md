
## 装饰模式简介233

装饰者模式把对象包装到另一个对象当中，包装对象的装饰者就像一个隐形拦截器，隐形是因为它具有与原对象一致的接口，拦截器是因为它能够在调用原对象的方法之前和返回值之后，为对象添加一些行为，例如打印信息:

```
LoggerDecorator.prototype.someMethod = function() {
	console.log('before call')
	this.decoratedObj.someMethod()
	console.log('after call')
}
```

目前，装饰者模式的提案处于 stage-2（把其归为 ES2016/ES7 并不准确），stage-2 是什么状态可以查看 [TC39 审核流程](https://tc39.github.io/proposal-decorators/#sec-intro)。


## JavaScript 装饰模式的实现

使用原型我们能实现简单的装饰模式。首先我们创建个`Hero`类，具有血量、攻击力和防御力三个属性，具有强化、攻击和防守三个方法：

```
function Hero(hp, atk, def) {
	this.hp = hp
	this.atk = atk
	this.def = def
}

Hero.prototype = {
	strengthen: function(hp, atk, def) {
	  this.hp += hp
	  this.atk += atk
	  this.def += def
		console.log('[强化] 生命值+' + hp + ' 攻击力+' + atk + ' 防御力+' + def)
	},
	attack: function() {
		console.log('[攻击] 造成' + this.atk + '点伤害')
		return this.atk
	},
	defend: function(atk) {
		var reduction = Math.max(atk - this.def, 0)
		this.hp -= reduction
		console.log('[防御] 受到' + reduction + '点伤害，当前血量：' + this.hp)
	}
}
```

### 创建装饰者父类

装饰者具有与装饰对象一致的接口，我们先创建一个功能最简单的装饰者，它拥有与 Hero 相同的接口，而不会对接口做任何修改：

```
var HeroDecorator = function(hero) {
	this.hero = hero
}

HeroDecorator.prototype = {
	strengthen: function(hp, atk, def) {
		return this.hero.strengthen(hp, atk, def)
	},
	attack: function() {
		return this.hero.attack()
	},
	defend: function(atk) {
		return this.hero.defend(atk)
	}
}
```

这个装饰者不会直接用来装饰对象，而是作为其它所有装饰者的父类使用。接下来，我们创建一些装饰者作为装备，来提升英雄的能力。

### 创建装饰者

首先我们创建装备`日炎斗篷`：

```
// 创建日炎斗篷
var SunfireCape = function(hero) {
	HeroDecorator.call(this, hero)
	console.log('装备日炎斗篷')
	this.hero.strengthen(500, 0, 50)
}
SunfireCape.prototype = new HeroDecorator()
```

包装后的新对象有与被包装对象相同的接口，但没有其属性，因此要通过被包装对象提供的接口修改其属性。上面代码中，在包装`Hero`为新对象时，调用其`strengthen`方法来提升英雄属性。接下来如何使用这个装备呢？我们需要创建一个英雄实例，再为英雄实例穿上装备：

```
// 初始化英雄盖伦 455hp 56atk 19def
var Garen = new Hero(455, 56, 19)
Garen = new SunfireCape(Garen)
// log "装备日炎斗篷"
// log "[强化] 生命值+500 攻击力+0 防御力+50"
```

穿上装备后，英雄的属性得到了提升。

### 在方法之后添加行为

接着，我们创建装备`无尽之刃`，它修改了被包装对象的`attack`方法。它先调用被包装对象的`attack`方法，并在其返回后添加了一些行为：

```
// 创建无尽之刃
var InfinityEdge = function(hero) {
	HeroDecorator.call(this, hero)
	console.log('装备无尽之刃')
	this.hero.strengthen(0, 70, 0)
}
InfinityEdge.prototype = new HeroDecorator()
InfinityEdge.prototype.attack = function() {
  let attack = this.hero.attack()
	if(Math.random() <= 0.2) {
		console.log('[暴击] 造成' + 1.5 * attack + '点额外伤害')
		return 2.5 * attack
	}
	return attack
}
```

### 在方法之前添加行为

装饰者还能够在调用被包装对象方法之前，添加一些行为，创建装备`忍者足具`，在防御时能抵挡12%的伤害：

```
var NinjaTabi = function(hero) {
  HeroDecorator.call(this, hero)
  console.log('装备忍者足具')
  this.hero.strengthen(0, 0, 30)
}
NinjaTabi.prototype = new HeroDecorator()
NinjaTabi.prototype.defend = function(atk) {
  atk = atk * 0.88 >> 0
  this.hero.defend(atk)
}
```

### 替换方法

装饰者可以替换原有方法。我们为英雄添加状态，例如：眩晕状态下的英雄无法进行攻击，于是我们替换掉它的`attack`方法：

```
var Dazzy = function(hero) {
  HeroDecorator.call(this, hero)
  console.log('[状态] 眩晕')
}
Dazzy.prototype = new HeroDecorator()
Dazzy.prototype.attack = function() {
  console.log('[攻击] 被眩晕，无法攻击')
}
```


### 添加新方法

装饰者能够添加新的方法。创建装备`兰顿之兆`，该装备具有主动技能，能够减缓敌人移动速度。

```
var RanduinsOmen = function(hero) {
  HeroDecorator.call(this, hero)
  console.log('装备兰顿之兆')
  this.hero.strengthen(350, 0, 60)
}
RanduinsOmen.prototype = new HeroDecorator()
RanduinsOmen.prototype.slowMovement = function() {
  console.log('[凝滞] 减缓周围敌人55%的移动速度')
}
```

### 装饰者的使用

对于在方法之前或之后添加行为的装饰者，应用顺序并不重要，使用起来更加灵活。替换或添加方法的装饰者，受应用顺序影响，相比前者灵活性差了许多，像添加新方法的装饰者就必须最后使用:

```
Garen = new InfinityEdge(Garen)
Garen = new NinjaTabi(Garen)
Garen = new RanduinsOmen(Garen)
Garen.attack()
Garen.attack()
Garen.attack()
Garen.attack()
Garen.attack()
Garen.defend(200)
Garen.defend(300)
Garen = new Dazzy(Garen)
Garen.attack()

/* log
装备无尽之刃
[强化] 生命值+0 攻击力+70 防御力+0
装备忍者足具
[强化] 生命值+0 攻击力+0 防御力+30
装备兰顿之兆
[强化] 生命值+350 攻击力+0 防御力+60
[攻击] 造成126点伤害
[暴击] 造成189点额外伤害
[攻击] 造成126点伤害
[攻击] 造成126点伤害
[攻击] 造成126点伤害
[攻击] 造成126点伤害
[防御] 受到17点伤害，当前血量：1288
[防御] 受到105点伤害，当前血量：1183
[凝滞] 减缓周围敌人55%的移动速度
[状态] 眩晕
[攻击] 被眩晕，无法攻击 
*/
```

以上只是装饰者一个简单的实现，ECMA 提案中的装饰者自然更加成熟，功能也更加强大。虽然装饰者还未被浏览器所支持，但得益于强大的 babel，让我们能够使用到这一特性。

## ECMA 提案中的装饰模式

根据[装饰者（Stage 2 Draft/January 4, 2017）提案](https://tc39.github.io/proposal-decorators/#prod-Decorator)，装饰者可用于类(class)或类的方法。在`class`关键字和方法定义之前，可以有一个或多个装饰者，装饰者跟在`@`之后，装饰者可以使用逗号标识符(@foo.bar())，但不能使用中括号(@foo[bar]，语法错误)。

```
@frozen class Foo {
  @configurable(false) @enumerable(true) method() {}
}
```

装饰者应用的顺序是至后向前的，前一个装饰者的返回值是后一个装饰者的输入值。

### 装饰函数

###   

在 babel 中使用装饰者，要先安装装饰者插件：



## 装饰模式的设计

## JavaScript 装饰库

## 其他

### 装饰者与 Mixin 的区别

### 装饰者与适配器的区别

