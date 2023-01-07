## 简介

Tag 能够标注一个 Commit 历史，常用来标注发行版本，如`V1.0.0`。


## 常用命令
```
// 列出所有 tag 及其名称
git tag -n

// 按时间排序，列出所有 tag
git tag --sort=-taggerdate

// 指定或新建分支，切换为指定 tag_name commit 版本
git checkout tags/<tag_name> -b <branch_name>
```