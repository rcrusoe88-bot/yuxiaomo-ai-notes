# 部署说明

这是一个 Next.js 静态导出项目，不需要数据库、服务端 API 或环境变量。

## 直接发布

将 `out/` 目录中的全部文件上传到任意静态网站托管服务的站点根目录即可，例如腾讯云 COS 静态网站、Cloudflare Pages 或 Vercel 静态托管。

## 重新构建

部署环境建议使用 Node.js 20 或 22 LTS：

```bash
npm ci
npm run build
```

构建完成后发布 `out/` 目录。不要使用 `npm run start`，因为站点已配置为静态导出。

## 内容更新

文章源文件位于 `content/codex`、`content/claude`、`content/reasonix` 和 `content/workbuddy`。新增或修改 `.mdx` 文件后重新运行构建即可。
