依赖注入（DI，Dependency Injection），一种设计模式，是控制权反转（IoC，Invert of Control）的一种实现方式。DI 模式中，创建依赖对象的过程从类中移出，再通过某种方式将依赖注入回类。依赖注入好处是将类之间的强耦合关系转变为松耦合关系。控制权反转相关内容，可以参考[文章](https://www.tutorialsteacher.com/ioc/inversion-of-control)。

我们先来看看 VSCode 是如何使用 DI 模式的：

```js
class WindowsMainService extends Disposable implements IWindowsMainService {

	constructor(
		private readonly machineId: string,
		private readonly initialUserEnv: IProcessEnvironment,
		@ILogService private readonly logService: ILogService,
		@IStateService private readonly stateService: IStateService,
		@IEnvironmentService private readonly environmentService: INativeEnvironmentService,
		@ILifecycleMainService private readonly lifecycleMainService: ILifecycleMainService,
		@IBackupMainService private readonly backupMainService: IBackupMainService,
		@IConfigurationService private readonly configurationService: IConfigurationService,
		@IWorkspacesHistoryMainService private readonly workspacesHistoryMainService: IWorkspacesHistoryMainService,
		@IWorkspacesMainService private readonly workspacesMainService: IWorkspacesMainService,
		@IInstantiationService private readonly instantiationService: IInstantiationService,
		@IDialogMainService private readonly dialogMainService: IDialogMainService
	) {
		super();
	}
}
```

`WindowsMainService`。如果对这段代码的语法有疑问，可以理解成下面代码的简写：

```js
class WindowsMainService extends Disposable implements IWindowsMainService {
	private readonly machineId: string;
	private readonly initialUserEnv: IProcessEnvironment;
	@ILogService private readonly logService: ILogService;

	constructor(
		machineId: string,
		initialUserEnv: IProcessEnvironment,
		logService: ILogService,
		// ...
	) {
		super();
		this.machineId = machineId;
		this.initialUserEnv = initialUserEnv;
		this.logService = logService;
	}
}
```

解读这段代码之前，先了解下[DIP（Dependency Injection Principle）]((https://www.tutorialsteacher.com/ioc/dependency-inversion-principle))定义：

> 1. High-level modules should not depend on low-level modules. Both should depend on the abstraction.（高层模块不依赖低层模块，它们都依赖于抽象） 
> 2. Abstractions should not depend on details. Details should depend on abstractions.（抽象不依赖具体，具体依赖抽象）

接着，结合代码来看这两点。`WindowsMainService`不依赖于具体类，例如`LogService`，而是依赖于接口`ILogService`。同时，`WindowsMainService`是`IWindowsMainService`的实现，其它需要使用`WindowsMainService`的类，依赖的也是它的接口`IWindowsMainService`。相对具体类，接口也是一种抽象方式。

