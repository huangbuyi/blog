---
title: WebAssembly（Wasm）简介
date: 2024-10-31
---

WebAssembly（通常缩写为 Wasm）是一种二进制指令格式，用于表示结构化栈式的简单函数。它是为 Web 设计的一种序列化二进制文件格式，可以以接近原生性能的速度运行，并且可以与 JavaScript 进行互操作。WebAssembly 最初是为浏览器设计的，但它也可以在服务端或独立的应用程序中使用。

WebAssembly 的主要用途之一是让开发人员能够在网页上使用 C 或 C++ 等语言编写高性能的代码，而不仅仅是 JavaScript。这对于需要高性能计算的应用特别有用，比如游戏、图像处理、音频处理等。

随着技术的发展，WebAssembly 的应用范围也在不断扩展，不仅限于 Web 开发，还包括云服务、物联网（IoT）设备等领域。

当然可以！下面我将给出一个简单的 WebAssembly 代码示例，以及如何在 HTML 页面中使用它。

首先，你需要有一个 WebAssembly 模块。这里我们用一个简单的加法函数作为例子。你可以使用像 Emscripten 这样的工具将 C/C++ 代码编译成 WebAssembly，或者使用 Rust 编译器直接编译 Rust 代码到 WebAssembly。

## 示例

### 示例 C 代码
假设我们有以下 C 代码，用于定义一个加法函数：
```c
int add(int a, int b) {
    return a + b;
}
```

### 使用 Emscripten 编译
使用 Emscripten 将上述 C 代码编译成 WebAssembly 和 JavaScript 绑定文件：
```bash
emcc add.c -s WASM=1 -o add.html
```
这会产生 `add.wasm` 和一些支持文件。

### 在 HTML 中使用 WebAssembly
接下来，在 HTML 页面中加载并使用这个 WebAssembly 模块。

```html
<!DOCTYPE html>
<html>
<body>

<h2>WebAssembly Example</h2>
<p id="demo"></p>

<script>
let wasmModule;

async function initWasm() {
    const response = await fetch('add_bg.wasm');
    const arrayBuffer = await response.arrayBuffer();
    
    wasmModule = await WebAssembly.instantiate(arrayBuffer, {
        'add': { // 这里假设模块的环境名字是 'add'
            'memoryBase': 0,
            'tableBase': 0,
        }
    });

    const addFunc = wasmModule.instance.exports.add;
    const result = addFunc(5, 3);
    document.getElementById("demo").innerHTML = "The result is " + result;
}

initWasm();
</script>

</body>
</html>
```

在这个例子中，我们通过 `fetch` 加载了 WebAssembly 模块，并使用 `WebAssembly.instantiate` 方法实例化它。一旦模块准备就绪，我们就可以调用它导出的 `add` 函数，并更新页面上的内容来显示结果。

请注意，实际的文件名和环境配置可能因编译设置而异。在上面的例子中，我假设使用的是默认的环境名字 `add`，并且输出的 WebAssembly 文件名为 `add_bg.wasm`。

如果你没有实际的 `.wasm` 文件，你可以使用在线工具如 [WABT](https://wabt.github.io/) 的 wat2wasm 工具从 WebAssembly 文本格式（`.wat`）转换到二进制格式（`.wasm`）。如果你使用的是 Rust，则可以直接通过 Cargo 构建命令生成 `.wasm` 文件。

## 编写 Wasm

WebAssembly (Wasm) 本身不是用任何特定的高级编程语言编写的。WebAssembly 是一种低级的中间表示形式，用于表示可以在 Web 浏览器中高效运行的二进制代码。它是一个二进制格式，主要用于存储和传输可以在各种平台上运行的函数。

然而，WebAssembly 模块通常是通过编译其他编程语言生成的，这些语言支持编译到 WebAssembly。以下是一些常见的编程语言及其编译到 WebAssembly 的工具：

1. **C/C++**：使用 Emscripten 编译器将 C/C++ 代码转换为 WebAssembly。
2. **Rust**：使用 Rust 的标准编译器，通过添加特定的编译目标来生成 WebAssembly。
3. **AssemblyScript**：这是一种 TypeScript 的超集，它可以通过类似于 TypeScript 的编译器编译成 WebAssembly。
4. **Swift**：可以使用像 SwiftyWASM 这样的工具将 Swift 代码编译为 WebAssembly。
5. **Go**：Go 语言也支持直接编译成 WebAssembly。
6. **Python**：虽然 Python 不是静态类型语言，但可以通过像 Pyodide 这样的项目将 Python 解释器移植到 WebAssembly 上运行。

这些工具和技术使得开发者能够将他们的应用程序或库编译成 WebAssembly，以便在 Web 环境中高效地运行。WebAssembly 的核心优势在于它提供了一个通用的平台，使得不同语言编写的代码可以在多种平台上无缝运行，同时保持高性能和安全隔离。