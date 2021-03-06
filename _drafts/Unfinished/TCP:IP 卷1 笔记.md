## 链路层




## adp 协议

### 简介

地址解析协议（Address Resolution Protocol），其基本功能为透过目标设备的IP地址，查询目标设备的MAC地址，以保证通信的顺利进行。它是IPv4中网络层必不可少的协议，不过在IPv6中已不再适用，并被邻居发现协议（NDP）所替代。

在以太网协议中规定，同一局域网中的一台主机要和另一台主机进行直接通信，必须要知道目标主机的MAC地址。而在TCP/IP协议中，网络层和传输层只关心目标主机的IP地址。这就导致在以太网中使用IP协议时，数据链路层的以太网协议接到上层IP协议提供的数据中，只包含目的主机的IP地址。于是需要一种方法，根据目的主机的IP地址，获得其MAC地址。这就是ARP协议要做的事情。所谓地址解析（address resolution）就是主机在发送帧前将目标IP地址转换成目标MAC地址的过程。

另外，当发送主机和目的主机不在同一个局域网中时，即便知道目的主机的MAC地址，两者也不能直接通信，必须经过路由转发才可以。所以此时，发送主机通过ARP协议获得的将不是目的主机的真实MAC地址，而是一台可以通往局域网外的路由器的MAC地址。于是此后发送主机发往目的主机的所有帧，都将发往该路由器，通过它向外发送。这种情况称为委托ARP或ARP代理（ARP Proxy）。

在点对点链路中不使用ARP，实际上在点对点网络中也不使用MAC地址，因为在此类网络中分别已经获取了对端的IP地址。

### 流程

1. 发送端发送以太网数据帧给以太网上的每个主机，这个过程称为广播，其意思是"who has aIp? Tell bIp"(谁是aIP的拥有者？请告知bIP它的硬件地址）
2. 目标主机ARP层收到这份广播后，识别出这是发送端询问它的IP地址，于是发送包含IP地址及对应硬件地址的ARP应答，意思是"aIp is at aAddress"(aIP的硬件地址是aAddress)
3. 发送端收到ARP应答后，就可以传送IP数据报了

### ARP分组格式

以太网首部(14)
以太网目的地地址 6
以太网源地址 6
帧类型 2

ARP请求/应答(28)
硬件类型 2
协议类型 2
硬件地址长度 1
协议地址长度 1
op 2
发送端以太网地址 6 
发送端IP地址 4
母的地址 6
目的IP地址 4
