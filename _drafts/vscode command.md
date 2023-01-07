Command 类是各种命令类的超类，runCommand 方法由子组件重写，register 方法用于在 KeybindingsRegistry 中保存快键键，并在 CommandsRegistry 中保存命令。

```Typescript
abstract class Command {
	public readonly id: string;
	public readonly precondition: ContextKeyExpression | undefined;
	private readonly _kbOpts: ICommandKeybindingsOptions | undefined;
	private readonly _menuOpts: ICommandMenuOptions | ICommandMenuOptions[] | undefined;
	private readonly _description: ICommandHandlerDescription | undefined;

	public register(): void {

		if (this._kbOpts) {
			KeybindingsRegistry.registerCommandAndKeybindingRule({
				id: this.id,
				handler: (accessor, args) => this.runCommand(accessor, args),
				weight: this._kbOpts.weight,
				when: kbWhen,
				primary: this._kbOpts.primary,
				secondary: this._kbOpts.secondary,
				win: this._kbOpts.win,
				linux: this._kbOpts.linux,
				mac: this._kbOpts.mac,
				description: this._description
			});

		} else {

			CommandsRegistry.registerCommand({
				id: this.id,
				handler: (accessor, args) => this.runCommand(accessor, args),
				description: this._description
			});
		}
	}

	public abstract runCommand(accessor: ServicesAccessor, args: any): void | Promise<void>;
}
```

CommandsRegistry 类是一个单例，用于存取命令。

```Typescript
const CommandsRegistry: ICommandRegistry = new class implements ICommandRegistry {

	registerCommand(idOrCommand: string | ICommand, handler?: ICommandHandler): IDisposable {
		this._commands.set(id, commands);
	}

	getCommand(id: string): ICommand | undefined {
		return this._commands.get(id);
	}
};
```

StandaloneCommandService 类能够执行命令，它从 CommandsRegistry 取出命令，并执行命令中的 handler。

```Typescript
class StandaloneCommandService implements ICommandService {

	public executeCommand<T>(id: string, ...args: any[]): Promise<T> {
		const command = CommandsRegistry.getCommand(id);
		this._instantiationService.invokeFunction.apply(this._instantiationService, [command.handler, ...args])
	}
}
```

AbstractKeybindingService 类负责发布事件，并让 ICommandService 执行命令。

```Typescript
export abstract class AbstractKeybindingService extends Disposable implements IKeybindingService {
	constructor(protected _commandService: ICommandService,) {}

	protected _dispatch(e: IKeyboardEvent, target: IContextKeyServiceTarget): boolean {
		return this._doDispatch(this.resolveKeyboardEvent(e), target);
	}

	private _doDispatch(keybinding: ResolvedKeybinding, target: IContextKeyServiceTarget): boolean {
		this._commandService.executeCommand(resolveResult.commandId).then(undefined, err => this._notificationService.warn(err));
	}
}
```

StandaloneKeybindingService 是 AbstractKeybindingService 的子类，负责向 dom 添加监听事件，并调用父类的 _dispatch 方法执行指令。

```Typescript
class StandaloneKeybindingService extends AbstractKeybindingService {

	constructor(commandService: ICommandService, domNode: HTMLElement) {
		super(commandService);

		dom.addDisposableListener(domNode, dom.EventType.KEY_DOWN, (e: KeyboardEvent) => {
			let keyEvent = new StandardKeyboardEvent(e);
			this._dispatch(keyEvent, keyEvent.target);
		});
	}
```

调用顺序

```Typescript
user keydown
dom keydown listener
AbstractKeybindingService _dispatch
AbstractKeybindingService _doDispatch
StandaloneCommandService excuteCommand
Command handler
```
