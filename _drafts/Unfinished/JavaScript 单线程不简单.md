我们常听说 JavaScript 是单线程的，那这个单线程是什么意思呢？单线程是否意味 JavaScript 存在性能缺陷呢？

在浏览器端，JavaScript 单线程指的是 JavaScript 的执行线程与 UI 渲染线程共用一个线程。对于 NodeJS 而言，单线程指的是它的 JavaScript 执行线程是单线程。虽然 JavaScript 只能单线程执行，但 JavaScript 引擎可不是，它能够创建多个线程为主线程服务。Web Worker 已经得到大部分浏览器的支持，NodeJS 也拥有自己的线程池来处理 I/O 操作。无论前端还是后端，JavaScript 已经能够利用多个线程来提升程序性能了。

## NodeJS 单线程异步 I/O 模型

NodeJS 是单线程异步 I/O 模型。换句话说，NodeJS 代码执行占用一个线程，而代码中的 I/O 操作则是交给其它线程执行，执行完毕后将结果交还给主线程。

对于 NodeJS 来说，单线程不仅不是劣势，它对于降低编程复杂度还有很重要的作用，单线程避免了多线程编程模型多线程死锁、状态同步等问题。而异步 I/O 避免了单线程同步编程模型的阻塞问题，使 CPU 得到更充分的使用。

NodeJS 异步 I/O 模型的实现离不开 libuv 层，libuv 提供了一个线程池来执行 I/O 操作，执行完毕后再将结果返回给执行线程，因此 I/O 操作不会阻塞执行线程地继续执行。libuv 是一个事件驱动的异步 I/O 库，它是跨平台的，在 *nix 平台下，自行实现了线程池，在 windows 平台采用了 IOCP，IOCP 内部仍是线程池原理，libuv 的线程池默认为 4 个线程。接下来我们在 Linux 环境下看一看 NodeJS 的多个线程。

## 查看 NodeJS 多线程

首先，我们需要先编写一个 js 脚本，写入一个定时器使得脚本不会因为执行完毕而被关掉。

```
setInterval(function () {}, 1000)
```

`node`命令执行该脚本，开启另一个窗口（或者把程序放后台执行）来查看 NodeJS 进程下的线程情况。

```
$ ps -a
  PID TTY          TIME CMD
16699 pts/2    00:00:00 node
16706 pts/0    00:00:00 ps
$ ps -L -p 16699
  PID   LWP TTY          TIME CMD
16699 16699 pts/2    00:00:00 node
16699 16700 pts/2    00:00:00 V8 WorkerThread
16699 16701 pts/2    00:00:00 V8 WorkerThread
16699 16702 pts/2    00:00:00 V8 WorkerThread
16699 16703 pts/2    00:00:00 V8 WorkerThread
16699 16704 pts/2    00:00:00 node
```

可以看到包括 V8 引擎的工作线程在内，已经开启了 6 个线程（MAC OS 系统用`ps -M -p <pid>`命令）。当前，线程池还未被创建，只有进行 I/O 操作后，线程池才会被创建。在脚本中添加异步读取文件的代码来激活线程池。

```
require('fs').readFile('test.js', function () {})
setInterval(function () {}, 1000)
```

重新启动脚本，可以看到，启动的 4 个新线程正是 libuv 线程池默认的 4 个线程。

```
$ ps -a
  PID TTY          TIME CMD
16745 pts/2    00:00:00 node
16755 pts/0    00:00:00 ps
$ ps -L -p 16745
  PID   LWP TTY          TIME CMD
16745 16745 pts/2    00:00:00 node
16745 16746 pts/2    00:00:00 V8 WorkerThread
16745 16747 pts/2    00:00:00 V8 WorkerThread
16745 16748 pts/2    00:00:00 V8 WorkerThread
16745 16749 pts/2    00:00:00 V8 WorkerThread
16745 16750 pts/2    00:00:00 node
16745 16751 pts/2    00:00:00 node
16745 16752 pts/2    00:00:00 node
16745 16753 pts/2    00:00:00 node
16745 16754 pts/2    00:00:00 node
```

可以通过修改环境变量`process.env.UV_THREADPOOL_SIZE`（最大 128）使 NodeJS 支持更多地线程。

```
// js
process.env.UV_THREADPOOL_SIZE = 64
require('fs').readFile('test.js', function () {})
setInterval(function () {}, 1000)

// bash
$ ps -a
  PID TTY          TIME CMD
16782 pts/2    00:00:00 node
16852 pts/0    00:00:00 ps
$ ps -L -p 16782 | wc -l
71
```

重新执行脚本，可以看到减去第一行和 6 个初始线程，有 64 个线程在为 NodeJS 的异步 I/O 服务。

## 高并发和高可用

JavaScript 是单线程，但 JavaScript 引擎能够创建多个线程来服务与主线程，而 NodeJS 的主线程就像一个调度员，它能够将 I/O 操作，例如网络请求，分发给其它线程进行处理，在通过事件机制将结果返回给主线程，因此，NodeJS 编写的服务器能够支持极大的并发量，这也是 NodeJS 的优势所在。NodeJS 主线程不宜进行大量地计算，因为这会阻塞主线程的运行。所以一般来说，NodeJS 适合 I/O 密集型场景，不适合 CPU 密集型场景。

除了多线程的支持，NodeJS 还提供 child_process 和 cluster 接口允许用户创建很多子进程来处理任务。单线程的 NodeJS 应用是脆弱了，但群体的力量是强大的。多进程、多线程的 NodeJS 才是服务器性能和稳定性的保证。

## 参考资料

- [http://docs.libuv.org/en/latest/threadpool.html](http://docs.libuv.org/en/latest/threadpool.html#thread-pool-work-scheduling)
- [《深入浅出 NodeJS》](https://item.jd.com/11355978.html)
- [https://nodejs.org/dist/latest-v8.x/docs/api/child_process.html](https://nodejs.org/dist/latest-v8.x/docs/api/child_process.html)
- [https://nodejs.org/dist/latest-v8.x/docs/api/cluster.html](https://nodejs.org/dist/latest-v8.x/docs/api/cluster.html)