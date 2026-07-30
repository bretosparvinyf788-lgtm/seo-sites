# 部署检查清单

## GitHub

- [ ] 文件位于正确仓库根目录或 `hipobuyvip.net/` 目录
- [ ] `index.html` 位于 Cloudflare Pages Root directory 的根目录
- [ ] 已提交到 `main` 分支
- [ ] 没有遗漏 `assets/`、`articles/`、`robots.txt`、`sitemap.xml`

## Cloudflare Pages

- [ ] Framework preset 为 None
- [ ] Build command 留空
- [ ] Output directory 为 `/`
- [ ] Production branch 为 main
- [ ] 首次部署状态为 Success
- [ ] `hipobuyvip.net` 已绑定
- [ ] SSL 状态正常
- [ ] www 已重定向至裸域名

## 页面测试

- [ ] 首页正常打开
- [ ] 移动端汉堡菜单正常
- [ ] 多语言切换正常
- [ ] 三篇文章卡片能打开全文
- [ ] View All Guides 能打开文章列表
- [ ] 商品卡片能打开目标页面
- [ ] FAQ 可以展开
- [ ] Logo 与 favicon 正常显示
- [ ] 404 页面正常

## SEO / GSC

- [ ] robots.txt 返回 200
- [ ] sitemap.xml 返回 200
- [ ] GSC 域名资源验证成功
- [ ] sitemap.xml 已提交
- [ ] 首页及三篇文章已请求编入索引
- [ ] HTTPS 版本为唯一规范版本
