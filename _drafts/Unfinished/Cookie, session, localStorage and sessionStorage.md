localStorage, sessionStorage, cookies 存储于客户端，session 数据存储于服务端 

localStorage 和 sessionStorage 继承自 Storage 接口的新接口，有些老式浏览器并不支持，存储的数据容易被删除和修改，不适合存放重要数据，但很适合在不同页面间共享的非敏感数据（如用户偏好，游戏分数）

localStorage 数据一直存储在客户端，指导被删除。
seesionStorage 数据存续周期到关闭网页标签或浏览器窗口，刷新网页、打开新页面不会影响存续。

| type | 存储位置 | 删除 |



# 参考
- [Session原理简述](https://www.pureweber.com/article/how-session-works/)