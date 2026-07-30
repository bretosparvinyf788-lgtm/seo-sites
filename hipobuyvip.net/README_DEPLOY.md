# hipobuyvip.net 部署包

这是可直接用于 **GitHub 仓库 + Cloudflare Pages + Google Search Console** 的静态站部署包。

## 目录说明

- `index.html`：网站首页
- `articles/`：文章列表与三篇独立文章
- `assets/`：Logo、文章主图、CTA 图片及外置优化资源
- `robots.txt`：搜索引擎抓取规则
- `sitemap.xml`：GSC 提交的网站地图
- `_headers`：Cloudflare Pages 缓存及安全响应头
- `_redirects`：Cloudflare Pages 静态跳转
- `404.html`：自定义 404 页面
- `site.webmanifest`：站点图标与 PWA 基础配置
- `GSC_SETUP.md`：GSC 验证与提交步骤
- `DEPLOYMENT_CHECKLIST.md`：部署前后检查清单
- `VALIDATION_REPORT.md`：本包自动检查结果

## GitHub 上传方式

### 独立仓库
把本压缩包解压后，**将里面的文件直接上传到仓库根目录**。不要再套一层文件夹。

### 多站点仓库
如果仓库中包含多个网站，可把所有文件放入：

```text
hipobuyvip.net/
```

然后在 Cloudflare Pages 项目中把 Root directory 设置成 `hipobuyvip.net`。

## Cloudflare Pages 设置

- Framework preset：`None`
- Build command：留空
- Build output directory：`/`
- Production branch：`main`
- Root directory：独立仓库留空；多站点仓库填写 `hipobuyvip.net`

绑定域名后建议统一使用：

```text
https://hipobuyvip.net
```

如果同时绑定 `www.hipobuyvip.net`，在 Cloudflare Redirect Rules 中把 `www` 301 跳转到裸域名，避免重复收录。

## GSC

部署成功后提交：

```text
https://hipobuyvip.net/sitemap.xml
```

详细步骤见 `GSC_SETUP.md`。
