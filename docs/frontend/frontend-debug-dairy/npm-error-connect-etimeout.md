---
title: npm 报错 connect ETIMEDOUT
date: 2023-01-14
---

报错信息：

```bash
Error: connect ETIMEDOUT 104.16.23.35:443
    at TCPConnectWrap.afterConnect [as oncomplete] (node:net:1161:16)
Emitted 'error' event on ClientRequest instance at:
    at TLSSocket.socketErrorListener (node:_http_client:447:9)
    at TLSSocket.emit (node:events:390:28)
    at emitErrorNT (node:internal/streams/destroy:157:8)
    at emitErrorCloseNT (node:internal/streams/destroy:122:3)
    at processTicksAndRejections (node:internal/process/task_queues:83:21) {
  errno: -4039,
  code: 'ETIMEDOUT',
  syscall: 'connect',
  address: '104.16.23.35',
  port: 443
}
```
遇到过几次这个问题，都是网络问题，原因应该是某个包要从某个 IP 下载一些资源，国内无法连接上这个地址。这不一定是 npm 连不上库的问题，可能是 shell 连不上的问题。

解决方法是使用代理，要确保你使用 shell 的网络是走代理的。设置 shell 的代理，或者使用类似 SSTap 工具。

> SSTap The full name is SOCKSTap, which is a proxy tool implemented at the network layer using virtual network card technology. SSTap can intercept all connections at the network layer and forward them to HTTP, SOCKS4/5, SHADOWSOCKS(R) proxies without any modifications or settings to the proxied applications. It can forward TCP, UDP data packets at the same time, very suitable for gamers to use.