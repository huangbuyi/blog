要点：
- Promise 实例化后立即执行
- reject函数的参数通常是Error对象的实例，表示抛出的错误
- resolve函数的参数除了正常的值以外，还可能是另一个 Promise 实例，该实例的状态决定了 resolve 所在实例的状态。
- then 和 catch 方法返回的是新的 Promise 实例，因此后面很可以接着调用 then 方法

Promise.all([p1, p2, p3])
所有实例都 fulfilled 时才会 fulfilled，只要有一个 rejected 就会 rejected
