# Google Search Console 设置

## 推荐方式：域名资源验证

1. 打开 Google Search Console。
2. 选择“网域”资源。
3. 输入 `hipobuyvip.net`。
4. Google 会给出一条 TXT 记录。
5. 进入 Cloudflare DNS，为 `hipobuyvip.net` 添加该 TXT 记录。
6. 等待 DNS 生效后返回 GSC 点击“验证”。

域名资源可同时覆盖：

- `https://hipobuyvip.net`
- `https://www.hipobuyvip.net`
- 其他协议或子域名版本

## URL 前缀验证

也可以添加：

```text
https://hipobuyvip.net/
```

选择 HTML 文件验证时，Google 会提供一个类似：

```text
google1234567890abcdef.html
```

的文件。把该文件原样放到本部署包根目录，再提交 GitHub。

不要改动文件名或文件内容。

## Sitemap 提交

验证成功后进入“站点地图”，提交：

```text
sitemap.xml
```

最终地址：

```text
https://hipobuyvip.net/sitemap.xml
```

## 建议请求收录的页面

```text
https://hipobuyvip.net/
https://hipobuyvip.net/articles/
https://hipobuyvip.net/articles/how-to-use-hipobuy-spreadsheet-2026.html
https://hipobuyvip.net/articles/are-hipobuy-qc-photos-free.html
https://hipobuyvip.net/articles/how-hipobuy-shipping-cost-works.html
```

## 上线后检查

浏览器直接打开：

```text
https://hipobuyvip.net/robots.txt
https://hipobuyvip.net/sitemap.xml
```

确认均返回 200，且没有跳转到错误页面。
