依赖注入（Dependency Injection）是实现控制权反转（IoC）的一种设计模式，它的关键在于统一管理实例的生命周期，从而将类之间的强耦合关系变为弱耦合关系。假设存在两个类A和B，A依赖B，A要负责B的实例化到销毁的整个生命周期，可以说A和B是强耦合关系。但随着类数量增多，依赖关系愈加复杂，A依赖B，B依赖C、D，C依赖D等等，一些类之间的强耦合关系让实例复用和生命周期管理变得困难。DI模式将实例管理工作剥离，交由特定类负责，在需要实例化一个类的时候，先实例化其依赖，再通过构造函数、方法等方式，将依赖的实例注入到类中。类从原本自己管理依赖，变为由外界传入依赖的实例的引用，可以说变成了弱耦合关系。啰嗦一句，两个类之间强耦合，如`Car`类和`Wheel`类，一般不需要DI，两个类之间弱耦合，如`Car`类和`SatelliteNavigationService`类，不妨考虑DI。

DI模式中，通常有个DI容器的类，负责管理实例的工作，VSCode源代码中，`InstantiationService`类扮演了这个角色。不过学习它之前，瞧一眼依赖注入原则（DIP）：

> 1. High-level modules should not depend on low-level modules. Both should depend on the abstraction.（高层模块不依赖低层模块，它们都依赖于抽象） 
> 2. Abstractions should not depend on details. Details should depend on abstractions.（抽象不依赖具体，具体依赖抽象）

VSCode源代码主要由TypeScript编写，TypeScript的`interface`、`abstract`补足了JavaScript对抽象的支持，得益于此，VSCode完全符合DIP。在学习源代码之前，能有一定TypeScript基础再好不过。

## 使用依赖注入

下面代码是`FileService`的声明部分和它的构造函数，其余部分不看，`Disposable`是公共超类，无需管它。

```ts
export class FileService extends Disposable implements IFileService {
	constructor(@ILogService private logService: ILogService) {
		super();
	}
}
```

`@ILogService`是属性装饰器语法，装饰器暂不是标准语法，目前处于ECMAScript提案stage2阶段。构造函数参数列表中`private logService: ILogService`的写法，可以理解成，在类中声明属性，实例化时将这个参数赋值给它（如下）。个人喜欢简化写法，less is more。

```ts
export class FileService extends Disposable implements IFileService {
	@ILogService private logService: ILogService;

	constructor(logService: ILogService) {
		super();
		this.logService = logService;
	}
}
```


VSCode源码中，`I`开头关键词一般是接口类型，上面代码中，有两个接口：`IFileService`和`ILogService`。`FileService`实现了`IFileService`接口，它依赖于`ILogService`。实例化`FileService`时，需要将实现了`ILogService`的类的实例作为参数传入。

遵照DIP：第一条，`FileService`（High-level modules）不依赖于特定的`LogService`类（low-level modules），而是依赖于接口`ILogService`（abstraction）。第二条，`FileService`是具体，依赖的`ILogService`是抽象，`IFileService`是抽象，它不依赖于任何类。第二条上面代码没体现，可以去看接口的定义，代码太长就不放了。

依赖的类的实例，以构造函数参数的方式，注入到了`FileService`类中，类无需关心`LogService`生命周期的管理。`InstantiationService`接管了管理工作，只在必要的时候实例化类、类的依赖，以及依赖的依赖，还能限定实例的作用范围。接下来，来看看它是怎么做到的。

## ServiceId


`ILogService`关键词有两层含义，一是TypeScript中定义的接口类型；二是常量，它是由`createDecorator`创建的函数，它的类型为`ServiceIdentifier<ILogService>`。因此，`ILogService`既可以作为类型使用：`logService: ILogService`，也可以作为装饰器来使用`@LogService`。

```ts
// vs/platform/log/common/log

import { createDecorator as createServiceDecorator } from 'vs/platform/instantiation/common/instantiation';

// 声明 ILogService 为常量
export const ILogService = createServiceDecorator<ILogService>('logService');

// 声明 ILogService 为接口类型
interface ILogService extends ILogger {
	_serviceBrand: undefined;
}
```

创建`ServiceIdentifier<T>`唯一合法途径是`createDecorator<T>`，`T`是泛型变量，在使用时必须指明`T`类型。`ServiceIdentifier<T>`的类型声明描述了一个可以传入任何参数，没有返回值的函数，或许它的作用只是通过泛型变量`T`来记录服务类型。

```ts
// vs/platform/instantiation/common/instantiation

export interface ServiceIdentifier<T> {
	(...args: any[]): void;
	type: T;
}

export function createDecorator<T>(serviceId: string): ServiceIdentifier<T> {

	if (_util.serviceIds.has(serviceId)) {
		return _util.serviceIds.get(serviceId)!;
	}

	const id = <any>function (target: Function, key: string, index: number): any {
		if (arguments.length !== 3) {
			throw new Error('@IServiceName-decorator can only be used to decorate a parameter');
		}
		storeServiceDependency(id, target, index, false);
	};

	id.toString = () => serviceId;

	_util.serviceIds.set(serviceId, id);
	return id;
}
```

## 记录依赖关系

通过构造函数的参数列表的方式注入依赖，实例化类时，须知道依赖了哪些类，以及参数传入顺序，下面的`LaunchMainService`依赖了六个类。

```ts
export class LaunchMainService implements ILaunchMainService {
	constructor(
		@ILogService private readonly logService: ILogService,
		@IWindowsMainService private readonly windowsMainService: IWindowsMainService,
		@IURLService private readonly urlService: IURLService,
		@IWorkspacesMainService private readonly workspacesMainService: IWorkspacesMainService,
		@IEnvironmentService private readonly environmentService: IEnvironmentService,
		@IConfigurationService private readonly configurationService: IConfigurationService
	) { }
}
```
