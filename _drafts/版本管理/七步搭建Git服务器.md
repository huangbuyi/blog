Github 是最大的同性社交，哦不，是代码托管的远程仓库。Github 虽好，但免费托管服务的代码都是公开的，任何人都可以访问你的代码。如果你需要一个私人的远程仓库又不想付费，完全可以自己搭建一个 Git 服务器，当然前提是你需要有一台运行的服务器，最好是 Linux 服务器。

### 第一步：安装 Git

Ubunt /Debian
```
$ sudo apt-get install git
```

CentOS
```
$ sudo yum install git
```

### 第二步：创建新用户提供 Git 服务

出于安全考虑，创建一个名为 git 的新用户，它将只被允许执行 Git 服务相关命令。

```
$ sudo adduser git
$ sudo passwd git
```

接下来，要对 git 用户的 home 目录进行操作，需要切换到 git 用户或者 root 用户才能继续后续操作。

```
$ su git
```

### 第三步：上传用户公钥

在连接 Git 服务器时，需要无密码的 ssh 连接，上传用户的公钥 id_rsa.pub（位于`~/.ssh/id_rsa.pub`）。如果没有，先[生成一个新的公钥](https://confluence.atlassian.com/bitbucketserver/creating-ssh-keys-776639788.html)。把公钥复制到服务器，这里使用 scp 命令.

```
$ scp ~/.ssh/id_rsa.pub user@serverIP:/home/git/.ssh
```

把公钥导入到`/home/git/.ssh/authroied_keys`文件中，有多个用户，一行插入一个公钥，

```
$ cat /home/git/.ssh/id_rsa.pub >> /home/git/.ssh/authorized_keys
```

### 第四步：修改权限

设置 git 用户对 authroied_keys 文件为拥有者和读写权限。
```
$ chmod 600 authorized_keys       
$ ll /home/git/.ssh/authorized_keys
-rw-------. 1 git git 418 Sep 21 06:08 /home/git/.ssh/authorized_keys
```

### 第五步：初始化 git 仓库

选一个目录作为 Git 仓库，将目录所有者改为 git 用户。
```
$ sudo git init --bare sample.git
$ sudo chown -R git:git sample.git
```

### 第六步：使用 git-shell 登录

对于服务器的 git 用户，应该只允许 git 相关操作，所以要把 shell 登录改为 git-shell 登录。编辑`/etc/passwd`文件：

```
git:x:1001:1001:,,,:/home/git:/bin/bash
```

改为：

```
git:x:1001:1001:,,,:/home/git:/usr/bin/git-shell
```

还要复制一个名为`git-shell-commands`的目录：
```
$ cp /usr/share/doc/git-1.7.4.4/contrib/git-shell-commands /home/git -R
$ chown git:developers /home/git/git-shell-commands/ -R
$ chmod +x /home/git/git-shell-commands/help
$ chmod +x /home/git/git-shell-commands/list
```

### 第七步：使用远程仓库
```
$ git clone git@server:/path/to/sample.git
```

## Exception

### 1.ssh failed Permission denied (publickey,gssapi-keyex,gssapi-with-mic)？

先试试 debug 模式连接`ssh -v user@xxx.xxx.xxx.xxx`。我出现这个问题是因为`authorized_keys`文件所有者是 root，git 用户无法读取这个文件造成的，所以遇到这个问题，建议先看看 git 用户是否拥有`authorized_keys`的读写权限。还有一种可能，是[客户端未开启的 ssh 的密码认证](https://www.digitalocean.com/community/questions/ssh-failed-permission-denied-publickey-gssapi-keyex-gssapi-with-mic)。

### 2.fatal: Interactive git shell is not enabled.hint: ~/git-shell-commands should exist and have read and execute access?

按照一些教程，没有复制`git-shell-commands`这个目录，导致 git shell 报错，只要按步骤六复制这个目录就可以了。

参考：[https://serverfault.com/questions/285324/git-shell-not-enabled](https://serverfault.com/questions/285324/git-shell-not-enabled)

## 参考

- [https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/00137583770360579bc4b458f044ce7afed3df579123eca000](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000/00137583770360579bc4b458f044ce7afed3df579123eca000)
- [https://jingyan.baidu.com/article/0f5fb099e2b6236d8334eaf9.html](https://jingyan.baidu.com/article/0f5fb099e2b6236d8334eaf9.html)
- [https://serverfault.com/questions/285324/git-shell-not-enabled](https://serverfault.com/questions/285324/git-shell-not-enabled)