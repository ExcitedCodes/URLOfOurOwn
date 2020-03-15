# URL of Our Own
URL of Our Own 是面对 [archiveofourown.org ](https://archiveofourown.org)（下称 AO3）网站 的一个提供反向代理配置的项目。

该项目旨在帮助各位内容创作者自由地进行创作，保障在特殊网络情形下对 AO3 网站的正常访问.

## 如何使用?

演示站点：~[https://ao3.wtf](https://ao3.wtf)~ _(我们采用了全新的边缘计算代理模式, 此项目仍会继续维护但我们不再提供演示站点.)_

### 备用站点

直接访问 [urls.jsonc](https://github.com/ExcitedCodes/URLOfOurOwn/blob/master/urls.jsonc) 中打开 "available" 一节下的任意域名即可（有待后续添加更多）。

例如如下内容，直接访问 [ao3.wtf](https://ao3.wtf) 即可。

```jsonc
{
	"available": [
		"ao3.wtf"
	],
	"blocked": []
}
```

## 如何搭建?

1. 首先，你需要准备一个在目标地区可以正常解析域名和一个能访问到 AO3 的服务器（即位于海外），并且拥有 `root` 访问权限；

   * _我们建议使用主流 Linux 发行版，如 Ubuntu、CentOS 等。_
   * _我们建议使用注册于海外域名注册商，并且开启了域名隐私保护服务的域名作为反代域名。_
   * _我们建议使用 [Cloudflare](https://cloudflare.com) 。申请账户和添加域名请见（[官方文档](https://support.cloudflare.com/hc/zh-cn/articles/201720164-%E5%88%9B%E5%BB%BA-Cloudflare-%E5%B8%90%E6%88%B7%E5%B9%B6%E6%B7%BB%E5%8A%A0%E7%BD%91%E7%AB%99))_

2. 接下来，在你的服务器上安装必要软件
   * [Nginx](https://nginx.org/) - 请参阅 [安装 Nginx](#%E5%AE%89%E8%A3%85-nginx) 一节
   * 未来操作需要用到的软件 - [git](https://git-scm.com) 和 [vim](https://www.vim.org):
      * Ubuntu: `sudo apt update && apt install -y git vim`
      * CentOS: `sudo yum update && yum install -y git vim`

3. 使用 `git clone` 命令复制所需的文件：在任意路径执行 `git clone https://github.com/ExcitedCodes/URLOfOurOwn.git`

4. 准备 Nginx 配置文件：在当前执行 `cp URLOfOurOwn/proxy/nginx/* /etc/nginx/conf.d`

5. 准备一个放置代理文件的路径，可以直接在同一目录执行 `cp -r URLOfOurOwn/proxy/ao3 /var/www/html/ao3`；若安装方式不同，`Nginx` 的安装目录也可能会不同；若 `Nginx` 是用其他方式安装，你可以使用 `whereis nginx` 命令快速查找 `Nginx` 的位置

6. 修改配置文件使其符合你的域名，请全程使用**英文输入方式**，并注意不要误删任何无关的字符；执行 `vim /etc/nginx/conf.d/site.conf`（也可以使用任何其他你喜爱的编辑器），下文介绍 `vim` 的使用方法：
   * 按一下 i 进入编辑模式，你应该会注意到左下角出现 `-- INSERT --` 字样
   * 在第3行左右找到 `server_name <Fill_Domain>;` 并将其替换为你的域名，如 `server_name  ao3.wtf;`
   * 在第18行左右找到 `root <Fill_AO3>;` 并将其替换为第5步中的路径. 如果你直接执行了那行路径，请输入 `/var/www/html/ao3`
   * 我们不提供配置缓存的教程也不建议您配置缓存, 因为这可能引发一系列安全问题
   * 如果你 __不__ 使用 Cloudflare:
     * 找到 `$http_cf_connecting_ip` 并替换为 `$remote_addr`
     * 找到文件末尾的 `include conf.d/cloudflare.inc;` 和 `deny all;` 两行并在最前面加上 `#`
   * 配置完毕后按下 ESC 按键并输入 `:wq`，按回车退出 vim

7. 接下来，启动（或重启）你的 Nginx，执行 `systemctl restart nginx` 或者 `service nginx restart`
   * 如果你希望 Nginx 在未来自动启动，请执行 `systemctl enable nginx`

8. 解析域名到你的服务器 IP；可以使用 `curl ipv4.ip.sb` 命令快速查询服务器 IP

9. 现在，你的代理网站应该可以工作了。尝试在浏览器中访问它，如果它工作并且你愿意与我们共享这一域名，我们建议你到[这里](https://github.com/ExcitedCodes/URLOfOurOwn/issues)提交你的域名作为备用站点的一部分。

### 安装 Nginx

暂时只提供 Linux 下的安装简介

* Ubuntu 18.04:
   * [详细教程（英文）](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-ubuntu-18-04)
   * 简化版本:
     ```console
     $ sudo apt update
     $ sudo apt install nginx
     $ sudo ufw allow 'Nginx HTTP'
     ```
 * CentOS 7:
   * [详细教程（英文）](https://www.digitalocean.com/community/tutorials/how-to-install-nginx-on-centos-7)
   * 简化版本:
     ```console
     $ sudo yum install epel-release
     $ sudo yum install nginx
     $ sudo firewall-cmd --permanent --zone=public --add-service=http
     $ sudo firewall-cmd --reload
     ```
