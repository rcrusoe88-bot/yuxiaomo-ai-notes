# 余小莫的 AI 笔记

## 内容发布

1. 在 `content/codex`、`content/claude`、`content/reasonix` 或 `content/workbuddy` 新建 `.mdx` 文件。
2. 填写 `title`、`summary`、`date` 三项 front matter。
3. 图片放入 `public/articles/<slug>/`，在 MDX 中用 `/articles/<slug>/image.png` 引用。
4. 运行 `npm run build`，静态站点输出到 `out/`。

公开端没有上传、编辑或下载入口。作者只在本地维护 MDX 内容，部署时上传 `out/`。
