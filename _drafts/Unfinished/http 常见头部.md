## 常见头部

host: 
from: 123456@gmail.com
cookie:
cookie2:
referer:

## 常见请求头部

Accept 指定接收内容的类型
Accept-Charset
Accept-Encoding
Accept-Language
Accept-Ranges 

Authorization 授权证书
Authorization
- Basic QWxhZGRpbjpvcGVuIHNlc2FtZQ== 基本认证

Cache-Control 指定缓存机制
- no-cache 每次请求都进行再验证
- no-storage 不缓存

Connection 是否持久连接
- close 关闭

Cookie 🍪
- name=value
- $Version=0|1 指定版本
- max-age 以秒为单位的相对过期时间

Content-Length 请求内容长度
Content-Type 请求实体对应的MIME信息

Date: 请求发送时间和日期
- Tue, 15 Nov 2010 09:21:32 GMT

From 发送请求的用户的Email
Host 指定请求的服务器的域名和端口号

If-Match 请求内容与实体匹配才有效
If-Modified-Since 请求的对象在指定时间后被修改则返回修改后的对象，未被修改返回304
If-Range 
If-Unmodified-Since

Max-Forwards 限制代理和网关的转发次数，每经过一次转发参数值-1
Pragma

Proxy-Authorization 代理的授权证书
Range 请求实体的一部分
- bytes=100-800
Referer 发送请求时所在的网址，可用于跟踪用户行为
Upgrade 转换协议
User-Agent 发送请求的客户端信息
Via
Warning


## 常见响应头部

Age
Allow
- GET, HEAD
Cache-Control
Expires 过期绝对时间
Last-Moodified 最后修改时间
Location 重定向URL
Refresh 五秒之后重定向
Retry-After 实体暂不可取，指定时间之后再次尝试
Server web服务器软件名称
Set-Cookie
Vary
WWW-Authenticate 授权方案

cache-control
set-cookie
set-cookie2



