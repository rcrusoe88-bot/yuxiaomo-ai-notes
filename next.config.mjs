/** @type {import('next').NextConfig} */
// 部署到 GitHub Pages 时需要带仓库名前缀（/yuxiaomo-ai-notes），
// 通过 GH_PAGES=1 触发；本地 / CloudBase 部署保持空前缀（根目录）。
const isGithubPages = process.env.GH_PAGES === '1';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isGithubPages ? '/yuxiaomo-ai-notes' : ''
};

export default nextConfig;
