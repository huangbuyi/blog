---
title: Tersorflow JS 遇到的一些问题
date: 2024-11-15
---

### 保存训练数据文件不完整

应该是写入到一半的时候强制退出程序导致的。

### 报错 Invalid TF_Status: 8 Error: OOM when allocating tensor with shape

训练跑了80%，好像是 GPU 内存满了，不确定没查清原因。

### 无法使用 GPU 加速，报错 tensorflow: Could not load dynamic library 'cudart64_110.dll'; dlerror: cudart64_110.dll not found

- 安装 CUDA 11.0 版本，[官网下载](https://developer.nvidia.com/cuda-11.0-download-archive)
- 检测安装目录里（C:\Program Files\NVIDIA Corporation\NvStreamSrv）是否存在文件`cudart64_110.dll`
- 其它版本 CUDA 可能存在相似，比如 12.0 版本呢的是文件 `cudart64_101.dll`，不符合 Tensorflow 需要的版本`cudart64_110.dll`


### import @tensorflow/tfjs-node 报错 Error: The specified module could not be found.

只要引入`@tensorflow/tfjs-node`了就会报错` Error: The specified module could not be found.`，试过

- 重新安装包 - 无效
- 重新安装 Windows 工具包 - 无效
- 安装 Python2.X - 无效
- 删除 node_modules 重新安装整个依赖 - 无效
- 重新安装 node-gyp - 无效

解决方法

1. 将`@tensorflow/tfjs-node/lib/napi-v9/tensorflow.dll`复制到`@tensorflow/tfjs-node/lib/napi-v8/tensorflow.dll`
2. 如果文件不存在，试着执行`npm rebuild @tensorflow/tfjs-node-gpu build-addon-from-source`

使用`@tensorflow/tfjs-node-gpu`遇到了同样报错，解决方案相同。

### 安装 @tensorflow/tfjs-node 报错 404 错误

包安装过程中会从非 npm 库下载资源，设置代理后重新安装。

Windows PowerShell 代理设置：

```shell
$env:http_proxy = '127.0.0.1:12345' # 填写自己的代理地址
$env:https_proxy = '127.0.0.1:12345' # 填写自己的代理地址
```