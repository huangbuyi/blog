NodeJS 是异步单线程的，这并不意味着 NodeJS 只能使用一个线程，单线程指的是它的 JavaScript 执行线程是单线程，它的 IO 线程、套接字线程完全可以在其它线程执行。所以 NodeJS CPU 使用效率是非常高的。

在浏览器端，JavaScript 单线程指的是 JavaScript 的执行线程与 UI 渲染线程共用一个线程。

## 相比于其它服务器模型：
同步式一次只能处理一个请求，其它请求被阻塞
每进程/每请求，为每个请求启动一个进程，能同时处理多个请求，但系统资源有限，不具备扩展性
每线程/每请求，为每个请求启动一个线程，它比每进程/每请求更具有扩展性，但每个线程都占用一定内存，面对大并发情况，内存吃紧，对大型站点仍不够
。该模式目前为 Apache 采用
NodeJS 通过事件驱动的方式处理请求，省掉创建线程和销毁线程的开销，线程少，上下文切换的代价小，这是 Node 高性能的一个原因。
Nginx 也采用了事件驱动的方式，采用 C 语言编写，性能更高，但适用场景有限，适合反向代理和负载均衡。

NodeJS 的主线程就像个调度器，将任务分配到其它线程执行，例如 IO 线程。为了避免大量的计算对任务分配造成影响，将计算放到其它线程执行，或者将大量计算拆分成多次小量计算，使用 setImmediate() 进行调度，这样大量计算执行多个循环，避免阻塞事件的执行，建议计算对 CPU 的耗时不超过 10 ms。

## 事件发布/订阅模式：
事件发布/订阅模式自身并无同步和异步调用的问题，，但在 Node 中，emit() 调用多半是事件循环而异步触发的，所以说它广泛应用于异步编程


## 利用事件队列解决雪崩问题
雪崩问题：指高访问量、大并发量的情况下的缓存失效情景，大量请求涌入数据库，超出数据库的承受能力

假设下面的场景：查询语句
```
var select = function (callback) {
    db.select("SQL", function (results) {
        callbac(results)
    })
}
```

为避免重复查询，添加状态锁
```
var status = 'ready'
var select = function (callback) {
    if (status === 'ready') {
        status === 'pending'
        db.select("SQL", function (results) {
            status = 'ready'
            callback(results)
        })
    }
}
```

该情景下，多次查询只有一次回调函数返回了数据，这就要引入事件队列，让所有查询回调得到执行
```
var proxy = new events.EventEmitter()
var status = 'ready'
var select = function (callback) {
    proxy.once('selected', callback)
    if (status === 'ready') {
        status === 'pending'
        db.select("SQL", function (results) {
            proxy.emit('selected', results)
            status = 'ready'
        })
    }
}
```

使用 once() 方法而不是 on() 方法是为了保证所有回调执行一次就会被移除。这样一次查询的结果能共同使用，节省开销。

setMaxListeners(0) 取消监听器过多的警告信息。

## 多异步协作
利用事件队列可以解决一对多（一个事件对应多个调用）的问题。对应多异步协作，即多对一、多对多的问题，原生代码利用 after 实现示例。
```
var after = function (times, callback) {
    var count = 0, results = {}
    return function (key, value) {
        results[key] = value 
        count++
        if (count === times) {
            callback(results)
        }
    }
} 
```

```
var emitter = new events.Emitter()
var done = after(timers, renders)

emitter.on('done', done)
emitter.on('done', other)

fs.readFile(path, 'utf8', function (err, template) {
    emitter.emit('done', 'template', template)
})
db.query(sql, function (err, data) {
    emitter.emit('done', 'data', data)
})
l10n.get(function (err, resources) {
    emitter.emit('done', 'resources', resources)
})
```

使用 EventPoxy 模块不需要用到 after 方法：
```
var proxy = new EventProxy()

proxy.all('template', 'data', 'resources', function(template, data, resources) {
    // TODO
})

fs.readFile(path, 'utf8', function (err, template) {
    emitter.emit('done', template)
})
db.query(sql, function (err, data) {
    emitter.emit('done', data)
})
l10n.get(function (err, resources) {
    emitter.emit('done', resources)
})
```


另外，after() 方法执行多次后调用，tail() 方法类似 all() 方法，all() 在满足条件后执行一次，tail() 会在执行一次后，事件再次触发会更新数据再次执行。
```
proxy.after('data', 10, function (datas) {
    // TODO
})
```







