---
title: VSCode 源码分析 —— 撤销重做
date: 2024-09-28
cover: /images/push-element-flow-chart.png
---

## 前言

撤销重做功能有三个重要过程：编辑操作入栈；撤销（Undo）；重做（Redo）。通过阅读源代码，希望了解到 VSCode 如何实现这三个过程，如何解耦和抽象，如何存储每一次操作。这些是本文研究对象。VSCode 撤销重做除了文本变化，还涉及到资源的变化，多模型文本变化，原生组件（比如输入框）的撤销重做，本文重点关注最常用的单模型文本撤销重做的实现。

撤销重做设计问题远不止这些，比如如何实现按键触发、如何持久化存储、如何校验数据有效性、如何实现组操作，等等，篇幅有限，读者自行探索。代码所在文件也请读者自行搜索。

[VSCode 源代码](https://github.com/microsoft/vscode)版本：`"version": "1.91.0"`。

提示：**为减少篇幅，示例代码并不完整，详情请查看源代码！**

## 入栈

### 流程

当用户在 VSCode 编辑文本时，编辑产生的文本变化、光变变化等会被保存，放入栈中，之后撤销或重做读取栈中元素使用。入栈执行流程如下，具体细节看源代码解读。

1. 用户编辑
2. `TextModel`执行`pushEditOperations()`
3. `EditStack`执行`pushEditOperation()`，创建`UndoRedoElement`
4. `UndoRedoService`执行`pushElement()`，创建`StackElement`
5. `ResourceEditStack`执行入栈操作`pushElement()`

![push element flow chart](/images/push-element-flow-chart.png)

### 源码解读

#### TextModel 入栈

用户执行编辑文本操作，最终交由`TextModel`执行`pushEditOperations()`，其中过程本文不做深入。`TextModel`是代码编辑器的文本数据模型，各种文本操作最终汇集于此，有兴趣读者可以深入研究，本文不做解读。可以看到最后调用了`_commandManager: EditStack`的`pushEditOperation()`。

```ts
export class TextModel extends Disposable implements model.ITextModel, IDecorationsTreesHost {
	private readonly _commandManager: EditStack;
	private _isUndoing: boolean;
	private _isRedoing: boolean;

	public pushEditOperations(beforeCursorState: Selection[] | null, editOperations: model.IIdentifiedSingleEditOperation[], cursorStateComputer: model.ICursorStateComputer | null, group?: UndoRedoGroup): Selection[] | null {
		try {
			this._onDidChangeDecorations.beginDeferredEmit();
			this._eventEmitter.beginDeferredEmit();
			// 入栈
			return this._pushEditOperations(beforeCursorState, this._validateEditOperations(editOperations), cursorStateComputer, group);
		} finally {
			this._eventEmitter.endDeferredEmit();
			this._onDidChangeDecorations.endDeferredEmit();
		}
	}

	private _pushEditOperations(beforeCursorState: Selection[] | null, editOperations: model.ValidAnnotatedEditOperation[], cursorStateComputer: model.ICursorStateComputer | null, group?: UndoRedoGroup): Selection[] | null {
		// ...省略一万行代码
		// 入栈
		return this._commandManager.pushEditOperation(beforeCursorState, editOperations, cursorStateComputer, group);
	}
```

#### EditStack 入栈

`EditStack`本身并没有保存栈，而是创建了一个`SingleModelEditStackElement`，它是`IUndoRedoElement`其中一个实现。然后交给`UndoRedoService`执行入栈`pushElement()`。

```ts
export type EditStackElement = SingleModelEditStackElement | MultiModelEditStackElement;
export class EditStack {

	private readonly _model: TextModel;
	private readonly _undoRedoService: IUndoRedoService;

	constructor(model: TextModel, undoRedoService: IUndoRedoService) {
		this._model = model;
		this._undoRedoService = undoRedoService;
	}

	private _getOrCreateEditStackElement(beforeCursorState: Selection[] | null, group: UndoRedoGroup | undefined): EditStackElement {
		const lastElement = this._undoRedoService.getLastElement(this._model.uri);
		if (isEditStackElement(lastElement) && lastElement.canAppend(this._model)) {
			return lastElement;
		}
		// 创建一个 SingleModelEditStackElement 其父类为 UndoRedoElement 子类 
		const newElement = new SingleModelEditStackElement(nls.localize('edit', "Typing"), 'undoredo.textBufferEdit', this._model, beforeCursorState);
		// 入栈
		this._undoRedoService.pushElement(newElement, group);
		return newElement;
	}

	public pushEditOperation(beforeCursorState: Selection[] | null, editOperations: ISingleEditOperation[], cursorStateComputer: ICursorStateComputer | null, group?: UndoRedoGroup): Selection[] | null {
		// EditStackElement
		const editStackElement = this._getOrCreateEditStackElement(beforeCursorState, group);
		// 应用编辑，并返回反向操作
		const inverseEditOperations = this._model.applyEdits(editOperations, true);
		// 光标变化
		const afterCursorState = EditStack._computeCursorState(cursorStateComputer, inverseEditOperations);
		// 文本变化数组
		const textChanges = inverseEditOperations.map((op, index) => ({ index: index, textChange: op.textChange }));
		textChanges.sort((a, b) => {
			if (a.textChange.oldPosition === b.textChange.oldPosition) {
				return a.index - b.index;
			}
			return a.textChange.oldPosition - b.textChange.oldPosition;
		});
		// 将变化信息装入 editStackElement
		editStackElement.append(this._model, textChanges.map(op => op.textChange), getModelEOL(this._model), this._model.getAlternativeVersionId(), afterCursorState);
		return afterCursorState;
	}
}
```

`SingleModelEditStackElement`同样也是`editStackElement`类型，保存了编辑的变化信息，它还知道要找谁（`ITextModel`）执行撤销和重做。

```ts
export type IUndoRedoElement = IResourceUndoRedoElement | IWorkspaceUndoRedoElement;
export class SingleModelEditStackElement implements IResourceUndoRedoElement {
	public model: ITextModel | URI;
	private _data: SingleModelEditStackData | ArrayBuffer;

	constructor(
		public readonly label: string,
		public readonly code: string,
		model: ITextModel,
		beforeCursorState: Selection[] | null
	) {
		// 文本模型
		this.model = model;
		this._data = SingleModelEditStackData.create(model, beforeCursorState);
	}

	public append(model: ITextModel, textChanges: TextChange[], afterEOL: EndOfLineSequence, afterVersionId: number, afterCursorState: Selection[] | null): void {
		// 保存文本变化，光标变化等
		if (this._data instanceof SingleModelEditStackData) {
			this._data.append(model, textChanges, afterEOL, afterVersionId, afterCursorState);
		}
	}
}

export interface IResourceUndoRedoElement {
	readonly type: UndoRedoElementType.Resource;
	/**
	 * The resource impacted by this element.
	 */
	readonly resource: URI;
	/**
	 * A user presentable label. May be localized.
	 */
	readonly label: string;
	/**
	 * A code describing the operation. Will not be localized.
	 */
	readonly code: string;
	/**
	 * Show a message to the user confirming when trying to undo this element
	 */
	readonly confirmBeforeUndo?: boolean;
	// 撤销
	undo(): Promise<void> | void;
	// 重做
	redo(): Promise<void> | void;
}

export interface IWorkspaceUndoRedoElement {
	readonly type: UndoRedoElementType.Workspace;
	/**
	 * The resources impacted by this element.
	 */
	readonly resources: readonly URI[];
	/**
	 * A user presentable label. May be localized.
	 */
	readonly label: string;
	/**
	 * A code describing the operation. Will not be localized.
	 */
	readonly code: string;
	/**
	 * Show a message to the user confirming when trying to undo this element
	 */
	readonly confirmBeforeUndo?: boolean;
	// 撤销
	undo(): Promise<void> | void;
	// 重做
	redo(): Promise<void> | void;

	/**
	 * If implemented, indicates that this undo/redo element can be split into multiple per resource elements.
	 */
	split?(): IResourceUndoRedoElement[];

	/**
	 * If implemented, will be invoked before calling `undo()` or `redo()`.
	 * This is a good place to prepare everything such that the calls to `undo()` or `redo()` are synchronous.
	 * If a disposable is returned, it will be invoked to clean things up.
	 */
	prepareUndoRedo?(): Promise<IDisposable> | IDisposable | void;
}
```

#### UndoRedoService 入栈

VSCode 里有很多编辑栈，比如一个工作区可以存在多个正在编辑的文本文件，它们都有各自的文本模型，它们也各自拥有编辑栈，而`UndoRedoService`就是管理栈的神，所以每一次入栈、撤销和重做都需要经过`UndoRedoService`，它会找出对应的栈，并执行操作。

```ts
export class UndoRedoService implements IUndoRedoService {
	declare readonly _serviceBrand: undefined;

	private readonly _editStacks: Map<string, ResourceEditStack>;
	private readonly _uriComparisonKeyComputers: [string, UriComparisonKeyComputer][];

	constructor(
		@IDialogService private readonly _dialogService: IDialogService,
		@INotificationService private readonly _notificationService: INotificationService,
	) {
		this._editStacks = new Map<string, ResourceEditStack>();
		this._uriComparisonKeyComputers = [];
	}
	public pushElement(element: IUndoRedoElement, group: UndoRedoGroup = UndoRedoGroup.None, source: UndoRedoSource = UndoRedoSource.None): void {
		if (element.type === UndoRedoElementType.Resource) {
			// 单个资源操作
			const resourceLabel = getResourceLabel(element.resource);
			const strResource = this.getUriComparisonKey(element.resource);
			// 创建 ResourceStackElement，它是栈保存的基本单位
			this._pushElement(new ResourceStackElement(element, resourceLabel, strResource, group.id, group.nextOrder(), source.id, source.nextOrder()));
		} else {
			// 涉及多个资源操作
			const seen = new Set<string>();
			const resourceLabels: string[] = [];
			const strResources: string[] = [];
			for (const resource of element.resources) {
				const resourceLabel = getResourceLabel(resource);
				const strResource = this.getUriComparisonKey(resource);

				if (seen.has(strResource)) {
					continue;
				}
				seen.add(strResource);
				resourceLabels.push(resourceLabel);
				strResources.push(strResource);
			}

			if (resourceLabels.length === 1) {
				this._pushElement(new ResourceStackElement(element, resourceLabels[0], strResources[0], group.id, group.nextOrder(), source.id, source.nextOrder()));
			} else {
				this._pushElement(new WorkspaceStackElement(element, resourceLabels, strResources, group.id, group.nextOrder(), source.id, source.nextOrder()));
			}
		}
	}

	private _pushElement(element: StackElement): void {
		for (let i = 0, len = element.strResources.length; i < len; i++) {
			const resourceLabel = element.resourceLabels[i];
			const strResource = element.strResources[i];

			let editStack: ResourceEditStack;
			// 查找相关的栈
			if (this._editStacks.has(strResource)) {
				editStack = this._editStacks.get(strResource)!;
			} else {
				editStack = new ResourceEditStack(resourceLabel, strResource);
				this._editStacks.set(strResource, editStack);
			}
			// 入栈
			editStack.pushElement(element);
		}
	}
}
```

#### EditStack 入栈

`ResourceEditStack`保存了过去栈`_past: StackElement[]`和未来栈`_future: StackElement[]`，入栈时，新的`StackElement`被推入到过去栈中，并清空未来栈。

```ts
type StackElement = ResourceStackElement | WorkspaceStackElement;

class ResourceEditStack {
	public readonly resourceLabel: string;
	private readonly strResource: string;
	// 过去栈
	private _past: StackElement[];
	// 未来栈
	private _future: StackElement[];
	public locked: boolean;
	public versionId: number;

	constructor(resourceLabel: string, strResource: string) {
		this.resourceLabel = resourceLabel;
		this.strResource = strResource;
		this._past = [];
		this._future = [];
		this.locked = false;
		this.versionId = 1;
	}

	public pushElement(element: StackElement): void {
		// 清空未来栈
		for (const futureElement of this._future) {
			if (futureElement.type === UndoRedoElementType.Workspace) {
				futureElement.removeResource(this.resourceLabel, this.strResource, RemovedResourceReason.NoParallelUniverses);
			}
		}
		this._future = [];
		// 入栈
		this._past.push(element);
		this.versionId++;
	}

	// 出栈历史栈栈顶元素，将传入元素放入未来栈栈顶
	public moveBackward(element: StackElement): void {
		this._past.pop();
		this._future.push(element);
		this.versionId++;
	}

	// 出栈未来栈栈顶元素，将传入元素放入历史栈栈顶
	public moveForward(element: StackElement): void {
		this._future.pop();
		this._past.push(element);
		this.versionId++;
	}
}
```

至此，编辑变化已经保存入栈中，等待后续操作。如果是撤销，读取历史栈栈顶元素，放入未来栈栈顶。如果是重做，读取未来栈栈顶，放入历史栈栈顶。这里使用了两个栈，相比使用一个队列+指针，前者更简单且拥有更好性能。

## 撤销

用户通过快捷键<kbd>Ctrl</kbd> + <kbd>Z</kbd>，或者菜单栏中的编辑菜单等可以执行撤销（Undo）操作。以快捷键操作为例，撤销执行流程如下，具体细节看源代码解读。

1. 按下<kbd>Ctrl</kbd> + <kbd>Z</kbd>
2. 按键绑定服务`KeybindingService`服务找到`UndoCommand`并执行`runCommand()`
3. `UndoCommand`是多命令（一个命令包含多个实现），执行时找到编辑器的实现`Undo`，执行`runEditorCommand()`
4. 获取文本模型`TextModel`，执行`undo()`
5. 获取`UndoRedoService`，执行`undo()`
6. 找到`ResourceEditStack`，执行`getClosestPastElement()`获得最近的历史`StackElement`，并执行`moveBackward()`，向后移动栈
7. 从`StackElement`获得撤销重做元素`UndoRedoElement`，并执行`undo()`
8. （以`SingleModelEditStackElement`为例）获取文本模型`TextModel`，从`SingleModelEditStackData`获取编辑数据（新、旧文本等），`TextModel`执行`_applyUndo()`，传入编辑数据、指针状态等
9.  `TextModel`执行编辑操作`applyEdits`，用旧文本替换新文本


![undo flow chart](/images/undo-flow-chart.png)

### 源码解读

#### UndoCommand

用户按下<kbd>Ctrl</kbd> + <kbd>Z</kbd>，按键绑定服务`KeybindingService`会找到`UndoCommand`，并执行该命令。`UndoCommand`是个多命令`MultiCommand`，表示一个命令有多个实现，因为 VSCode 的撤销重做除了文本编辑，还支持资源的操作和原生组件（比如输入框 Input）的撤销重做，根据不同的上下文，执行不同的实现。`UndoCommand `注册了快捷键`KeyMod.CtrlCmd | KeyCode.KeyZ`。

```ts
export const UndoCommand = registerCommand(new MultiCommand({
	id: 'undo',
	precondition: undefined,
	kbOpts: {
		weight: KeybindingWeight.EditorCore,
		primary: KeyMod.CtrlCmd | KeyCode.KeyZ
	},
	menuOpts: [{
		menuId: MenuId.MenubarEditMenu,
		group: '1_do',
		title: nls.localize({ key: 'miUndo', comment: ['&& denotes a mnemonic'] }, "&&Undo"),
		order: 1
	}, {
		menuId: MenuId.CommandPalette,
		group: '',
		title: nls.localize('undo', "Undo"),
		order: 1
	}]
}));
```

`Undo`是`EditorOrNativeTextInputCommand`的子类，`EditorOrNativeTextInputCommand`会将`Undo`实现注册到`UndoCommand`中，并且会根据聚焦元素，决定执行原生元素（Input, Textarea）命令，还是执行当前编辑器的编辑器的命令。


```ts
export const Undo = new class extends EditorOrNativeTextInputCommand {
	constructor() {
		super(UndoCommand);
	}
	public runDOMCommand(activeElement: Element): void {
		activeElement.ownerDocument.execCommand('undo');
	}
	public runEditorCommand(accessor: ServicesAccessor | null, editor: ICodeEditor, args: unknown): void | Promise<void> {
		if (!editor.hasModel() || editor.getOption(EditorOption.readOnly) === true) {
			return;
		}
		// 调用 TextModel 撤销
		return editor.getModel().undo();
	}
}();
```

#### TextModel 撤销

看代码不解释。

```ts
export class TextModel extends Disposable implements model.ITextModel, IDecorationsTreesHost {
	public undo(): void | Promise<void> {
		// 撤销
		return this._undoRedoService.undo(this.uri);
	}
}
```

#### UndoRedoService 撤销

`UndoRedoService`找到资源对应的编辑栈，获取过去栈栈顶元素`StackElement`，根据栈顶元素类型执行不同操作：资源撤销调用`EditStack`的`moveBackward`移动栈中元素，并调用栈元素`StackElement`中的`UndoRedoElement`执行撤销操作；工作区撤销更加复杂，涉及到多个栈，但最后栈操作与资源撤销类似。

```ts
export class UndoRedoService implements IUndoRedoService {
	declare readonly _serviceBrand: undefined;

	private readonly _editStacks: Map<string, ResourceEditStack>;
	private readonly _uriComparisonKeyComputers: [string, UriComparisonKeyComputer][];

	constructor(
		@IDialogService private readonly _dialogService: IDialogService,
		@INotificationService private readonly _notificationService: INotificationService,
	) {
		this._editStacks = new Map<string, ResourceEditStack>();
		this._uriComparisonKeyComputers = [];
	}

	public undo(resourceOrSource: URI | UndoRedoSource): Promise<void> | void {
		if (resourceOrSource instanceof UndoRedoSource) {
			const [, matchedStrResource] = this._findClosestUndoElementWithSource(resourceOrSource.id);
			return matchedStrResource ? this._undo(matchedStrResource, resourceOrSource.id, false) : undefined;
		}
		if (typeof resourceOrSource === 'string') {
			return this._undo(resourceOrSource, 0, false);
		}
		return this._undo(this.getUriComparisonKey(resourceOrSource), 0, false);
	}

	private _undo(strResource: string, sourceId: number = 0, undoConfirmed: boolean): Promise<void> | void {
		if (!this._editStacks.has(strResource)) {
			return;
		}

		// 获取资源对应的编辑栈
		const editStack = this._editStacks.get(strResource)!;
		// 获取过去栈栈顶元素
		const element = editStack.getClosestPastElement();
		if (!element) {
			return;
		}

		// 组操作
		if (element.groupId) {
			// this element is a part of a group, we need to make sure undoing in a group is in order
			const [matchedElement, matchedStrResource] = this._findClosestUndoElementInGroup(element.groupId);
			if (element !== matchedElement && matchedStrResource) {
				// there is an element in the same group that should be undone before this one
				return this._undo(matchedStrResource, sourceId, undoConfirmed);
			}
		}

		// 确认操作
		const shouldPromptForConfirmation = (element.sourceId !== sourceId || element.confirmBeforeUndo);
		if (shouldPromptForConfirmation && !undoConfirmed) {
			// Hit a different source or the element asks for prompt before undo, prompt for confirmation
			return this._confirmAndContinueUndo(strResource, sourceId, element);
		}

		try {
			if (element.type === UndoRedoElementType.Workspace) {
				// 工作空间撤销
				return this._workspaceUndo(strResource, element, undoConfirmed);
			} else {
				// 资源撤销
				return this._resourceUndo(editStack, element, undoConfirmed);
			}
		} finally {
			if (DEBUG) {
				this._print('undo');
			}
		}
	}

	// 资源撤销
	private _resourceUndo(editStack: ResourceEditStack, element: ResourceStackElement, undoConfirmed: boolean): Promise<void> | void {
		if (!element.isValid) {
			// invalid element => immediately flush edit stack!
			editStack.flushAllElements();
			return;
		}
		// 锁定检测
		if (editStack.locked) {
			const message = nls.localize(
				{ key: 'cannotResourceUndoDueToInProgressUndoRedo', comment: ['{0} is a label for an operation.'] },
				"Could not undo '{0}' because there is already an undo or redo operation running.", element.label
			);
			this._notificationService.warn(message);
			return;
		}
		// 准备资源
		return this._invokeResourcePrepare(element, (cleanup) => {
			// 移动栈
			editStack.moveBackward(element);
			// 安全调用
			return this._safeInvokeWithLocks(element, () => element.actual.undo() /** 撤销 */, new EditStackSnapshot([editStack]), cleanup, () => this._continueUndoInGroup(element.groupId, undoConfirmed));
		});
	}
}
```

#### SingleModelEditStackElement 撤销

`SingleModelEditStackElement`保存了文本模型`TextModel`的引用和编辑变化数据`SingleModelEditStackData`，将变化数据传入`_applyUndo()`将变化数据应用到编辑。

```ts
export class SingleModelEditStackElement implements IResourceUndoRedoElement {

	public model: ITextModel | URI;
	private _data: SingleModelEditStackData | ArrayBuffer;

	constructor(
		public readonly label: string,
		public readonly code: string,
		model: ITextModel,
		beforeCursorState: Selection[] | null
	) {
		this.model = model;
		this._data = SingleModelEditStackData.create(model, beforeCursorState);
	}

	public undo(): void {
		if (URI.isUri(this.model)) {
			// don't have a model
			throw new Error(`Invalid SingleModelEditStackElement`);
		}
		if (this._data instanceof SingleModelEditStackData) {
			// 序列化数据为 ArrayBuffer
			this._data = this._data.serialize();
		}
		// 反序列化为 SingleModelEditStackData
		const data = SingleModelEditStackData.deserialize(this._data);
		// TextModel 应用撤销，并传入文本变化、光标状态
		this.model._applyUndo(data.changes, data.beforeEOL, data.beforeVersionId, data.beforeCursorState);
	}
}
```
`SingleModelEditStackData`保存了变化信息。

```ts
export class SingleModelEditStackData {
	constructor(
		public readonly beforeVersionId: number,
		public afterVersionId: number,
		public readonly beforeEOL: EndOfLineSequence,
		public afterEOL: EndOfLineSequence,
		public readonly beforeCursorState: Selection[] | null, // 前光标状态
		public afterCursorState: Selection[] | null, // 后光标状态
		public changes: TextChange[] // 文本变化
	) { }
}

export class TextChange {

	public get oldEnd(): number {
		return this.oldPosition + this.oldText.length;
	}

	public get newEnd(): number {
		return this.newPosition + this.newText.length;
	}

	constructor(
		public readonly oldPosition: number,  // 旧文本位置
		public readonly oldText: string,  // 旧文本
		public readonly newPosition: number, // 新文本位置
		public readonly newText: string // 新文本
	) { }
}
```

#### TextModel 撤销

调用`_applyUndo()`，读取`TextChange[]`保存的旧本文`oldText`，用旧的文本替换掉新文本（用新文本的位置范围`newPosition`至`newEnd`表示），从而实现撤销。

撤销操作被转化为了一次编辑操作`ISingleEditOperation`，和其它操作一样交给`applyEdits()`去完成一次编辑。该操作不会触发入栈。具体如何实现编辑超过本文讨论范围，感兴趣读者自行研究。

```ts
export class TextModel extends Disposable implements model.ITextModel, IDecorationsTreesHost {
	_applyUndo(changes: TextChange[], eol: model.EndOfLineSequence, resultingAlternativeVersionId: number, resultingSelection: Selection[] | null): void {
		const edits = changes.map<ISingleEditOperation>((change) => {
			// 新文本范围
			const rangeStart = this.getPositionAt(change.newPosition);
			const rangeEnd = this.getPositionAt(change.newEnd);
			return {
				range: new Range(rangeStart.lineNumber, rangeStart.column, rangeEnd.lineNumber, rangeEnd.column),
				text: change.oldText // 旧文本
			};
		});
		// 将旧文本覆盖到新文本范围内
		this._applyUndoRedoEdits(edits, eol, true, false, resultingAlternativeVersionId, resultingSelection);
	}

	_applyRedo(changes: TextChange[], eol: model.EndOfLineSequence, resultingAlternativeVersionId: number, resultingSelection: Selection[] | null): void {
		const edits = changes.map<ISingleEditOperation>((change) => {
			const rangeStart = this.getPositionAt(change.oldPosition);
			const rangeEnd = this.getPositionAt(change.oldEnd);
			return {
				range: new Range(rangeStart.lineNumber, rangeStart.column, rangeEnd.lineNumber, rangeEnd.column),
				text: change.newText
			};
		});
		this._applyUndoRedoEdits(edits, eol, false, true, resultingAlternativeVersionId, resultingSelection);
	}

	private _applyUndoRedoEdits(edits: ISingleEditOperation[], eol: model.EndOfLineSequence, isUndoing: boolean, isRedoing: boolean, resultingAlternativeVersionId: number, resultingSelection: Selection[] | null): void {
		try {
			this._onDidChangeDecorations.beginDeferredEmit();
			this._eventEmitter.beginDeferredEmit();
			this._isUndoing = isUndoing;
			this._isRedoing = isRedoing;
			// 应用编辑
			this.applyEdits(edits, false);
			this.setEOL(eol);
			this._overwriteAlternativeVersionId(resultingAlternativeVersionId);
		} finally {
			this._isUndoing = false;
			this._isRedoing = false;
			this._eventEmitter.endDeferredEmit(resultingSelection);
			this._onDidChangeDecorations.endDeferredEmit();
		}
	}
}
```

## 重做

重做的流程与撤销相似。用户通过快捷键<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>，或者菜单栏中的编辑菜单等可以执行撤销（Redo）操作。以快捷键操作为例，重做执行流程如下，具体细节看源代码解读。

1. <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>Z</kbd>
2. 按键绑定服务`KeybindingService`服务找到`RedoCommand`并执行`runCommand()`
3. `RedoCommand`是多命令（一个命令包含多个实现），执行时找到编辑器的实现`Redo`，执行`runEditorCommand()`
4. 获取文本模型`TextModel`，执行`redo()`
5. 获取`UndoRedoService`，执行`redo()`
6. 找到`ResourceEditStack`，执行`getClosestFutureElement()`获得最近的未来`StackElement`，并执行`moveForward()`，向前移动栈
7. 从`StackElement`获得撤销重做元素`UndoRedoElement`，并执行`redo()`
8. （以`SingleModelEditStackElement`为例）获取文本模型`TextModel`，从`SingleModelEditStackData`获取编辑数据（新、旧文本等），`TextModel`执行`_applyRedo()`，传入编辑数据、指针状态等
9.  `TextModel`执行编辑操作`applyEdits`，用新文本替换旧文本

![redo flow chart](/images/redo-flow-chart.png)

### 源码解读

#### RedoCommand

用户按下<kbd>Ctrl</kbd> + <kbd>Z</kbd>，按键绑定服务`KeybindingService`会找到`RedoCommand`，并执行该命令。`RedoCommand`是个多命令`MultiCommand`，表示一个命令有多个实现，因为 VSCode 的撤销重做除了文本编辑，还支持资源的操作和原生组件（比如输入框 Input）的撤销重做，根据不同的上下文，执行不同的实现。`RedoCommand `注册了快捷键`KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyZ`。

```ts
export const RedoCommand = registerCommand(new MultiCommand({
	id: 'redo',
	precondition: undefined,
	kbOpts: {
		weight: KeybindingWeight.EditorCore,
		primary: KeyMod.CtrlCmd | KeyCode.KeyY,
		secondary: [KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyZ],
		mac: { primary: KeyMod.CtrlCmd | KeyMod.Shift | KeyCode.KeyZ }
	},
	menuOpts: [{
		menuId: MenuId.MenubarEditMenu,
		group: '1_do',
		title: nls.localize({ key: 'miRedo', comment: ['&& denotes a mnemonic'] }, "&&Redo"),
		order: 2
	}, {
		menuId: MenuId.CommandPalette,
		group: '',
		title: nls.localize('redo', "Redo"),
		order: 1
	}]
}));
```

`Redo`是`EditorOrNativeTextInputCommand`的子类，`EditorOrNativeTextInputCommand`会将`Redo`实现注册到`RedoCommand`中，并且会根据聚焦元素，决定执行原生元素（Input, Textarea）命令，还是执行当前编辑器的编辑器的命令。


```ts
export const Redo = new class extends EditorOrNativeTextInputCommand {
	constructor() {
		super(RedoCommand);
	}
	public runDOMCommand(activeElement: Element): void {
		activeElement.ownerDocument.execCommand('redo');
	}
	public runEditorCommand(accessor: ServicesAccessor | null, editor: ICodeEditor, args: unknown): void | Promise<void> {
		if (!editor.hasModel() || editor.getOption(EditorOption.readOnly) === true) {
			return;
		}
		// 重做
		return editor.getModel().redo();
	}
}();
```

#### TextModel 重做

看代码不解释。

```ts
export class TextModel extends Disposable implements model.ITextModel, IDecorationsTreesHost {
	public redo(): void | Promise<void> {
		// 重做
		return this._undoRedoService.redo(this.uri);
	}
}
```

#### UndoRedoService 重做

`UndoRedoService`找到资源对应的编辑栈，获取未来栈栈顶元素`StackElement`，根据栈顶元素类型执行不同操作：资源撤销调用`EditStack`的`moveForward`移动栈中元素，并调用栈元素`StackElement`中的`UndoRedoElement`执行撤销操作；工作区撤销更加复杂，涉及到多个栈，但最后栈操作与资源重做类似。

```ts
export class UndoRedoService implements IUndoRedoService {
	declare readonly _serviceBrand: undefined;
	// 编辑栈映射表
	private readonly _editStacks: Map<string, ResourceEditStack>;
	private readonly _uriComparisonKeyComputers: [string, UriComparisonKeyComputer][];

	constructor(
		@IDialogService private readonly _dialogService: IDialogService,
		@INotificationService private readonly _notificationService: INotificationService,
	) {
		this._editStacks = new Map<string, ResourceEditStack>();
		this._uriComparisonKeyComputers = [];
	}

	// 重做
	public redo(resourceOrSource: URI | UndoRedoSource | string): Promise<void> | void {
		if (resourceOrSource instanceof UndoRedoSource) {
			const [, matchedStrResource] = this._findClosestRedoElementWithSource(resourceOrSource.id);
			return matchedStrResource ? this._redo(matchedStrResource) : undefined;
		}
		if (typeof resourceOrSource === 'string') {
			return this._redo(resourceOrSource);
		}
		return this._redo(this.getUriComparisonKey(resourceOrSource));
	}

	private _redo(strResource: string): Promise<void> | void {
		if (!this._editStacks.has(strResource)) {
			return;
		}

		// 找到对应的编辑栈
		const editStack = this._editStacks.get(strResource)!;
		// 获得未来栈栈顶元素
		const element = editStack.getClosestFutureElement();
		if (!element) {
			return;
		}

		// 组操作
		if (element.groupId) {
			// this element is a part of a group, we need to make sure redoing in a group is in order
			const [matchedElement, matchedStrResource] = this._findClosestRedoElementInGroup(element.groupId);
			if (element !== matchedElement && matchedStrResource) {
				// there is an element in the same group that should be redone before this one
				return this._redo(matchedStrResource);
			}
		}

		try {
			if (element.type === UndoRedoElementType.Workspace) {
				// 工作区重做
				return this._workspaceRedo(strResource, element);
			} else {
				// 资源重做
				return this._resourceRedo(editStack, element);
			}
		} finally {
			if (DEBUG) {
				this._print('redo');
			}
		}
	}

	private _resourceRedo(editStack: ResourceEditStack, element: ResourceStackElement): Promise<void> | void {
		if (!element.isValid) {
			// invalid element => immediately flush edit stack!
			editStack.flushAllElements();
			return;
		}
		// 栈锁
		if (editStack.locked) {
			const message = nls.localize(
				{ key: 'cannotResourceRedoDueToInProgressUndoRedo', comment: ['{0} is a label for an operation.'] },
				"Could not redo '{0}' because there is already an undo or redo operation running.", element.label
			);
			this._notificationService.warn(message);
			return;
		}

		// 准备资源
		return this._invokeResourcePrepare(element, (cleanup) => {
			// 移动栈
			editStack.moveForward(element);
			// 安全调用
			return this._safeInvokeWithLocks(element, () => element.actual.redo() /* 重做 */, new EditStackSnapshot([editStack]), cleanup, () => this._continueRedoInGroup(element.groupId));
		});
	}
}
```

#### SingleModelEditStackElement 重做

`SingleModelEditStackElement`保存了文本模型`TextModel`的引用和编辑变化数据`SingleModelEditStackData`，将变化数据传入`_applyRedo()`将变化数据应用到编辑。撤销和重做用的都是相同的编辑栈元素。

```ts
export class SingleModelEditStackElement implements IResourceUndoRedoElement {

	public model: ITextModel | URI;
	private _data: SingleModelEditStackData | ArrayBuffer;

	constructor(
		public readonly label: string,
		public readonly code: string,
		model: ITextModel,
		beforeCursorState: Selection[] | null
	) {
		this.model = model;
		this._data = SingleModelEditStackData.create(model, beforeCursorState);
	}

	public redo(): void {
		if (URI.isUri(this.model)) {
			// don't have a model
			throw new Error(`Invalid SingleModelEditStackElement`);
		}
		if (this._data instanceof SingleModelEditStackData) {
			// 序列化数据为 ArrayBuffer
			this._data = this._data.serialize();
		}
		// 反序列化为 SingleModelEditStackData
		const data = SingleModelEditStackData.deserialize(this._data);
		// TextModel 应用撤销，并传入文本变化、光标状态
		this.model._applyRedo(data.changes, data.afterEOL, data.afterVersionId, data.afterCursorState);
	}
}
```

#### TextModel 重做


调用`_applyRedo()`，读取`TextChange[]`保存的新本文`newText`，用新的文本替换掉旧文本（用旧文本的位置范围`oldPosition`至`oldEnd`表示），从而实现重做。

重做被转化为了一次编辑操作`ISingleEditOperation`，和其它操作一样交给`applyEdits()`去完成一次编辑。该操作不会入栈。

```ts
export class TextModel extends Disposable implements model.ITextModel, IDecorationsTreesHost {
	_applyRedo(changes: TextChange[], eol: model.EndOfLineSequence, resultingAlternativeVersionId: number, resultingSelection: Selection[] | null): void {
		// 旧文本范围
		const edits = changes.map<ISingleEditOperation>((change) => {
			const rangeStart = this.getPositionAt(change.oldPosition);
			const rangeEnd = this.getPositionAt(change.oldEnd);
			return {
				range: new Range(rangeStart.lineNumber, rangeStart.column, rangeEnd.lineNumber, rangeEnd.column),
				text: change.newText // 新文本
			};
		});
		// 将新文本覆盖到旧文本范围内
		this._applyUndoRedoEdits(edits, eol, false, true, resultingAlternativeVersionId, resultingSelection);
	}
}
```

## 总结

对于复杂的编辑类应用，撤销重做是相当常见的需求。相同的功能 VSCode 实际业务场景十分复杂，而我们项目往往要简单的多。学习它的设计思想，而非实现细节，帮助我们在项目开发中更好的完成抽象，设计出更好的系统架构。文章很长，希望对读者有所启发。

