/** @type {import('next').NextConfig} */
// 部署到 GitHub Pages 时需要带仓库名前缀（/yuxiaomo-ai-notes），
// 通过 GH_PAGES=1 触发；本地 / CloudBase 部署保持空前缀（根目录）。
const isGithubPages = process.env.GH_PAGES === '1';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isGithubPages ? '/yuxiaomo-ai-notes' : '',
  webpack(config) {
    // Lanyard 通过 import './card.glb' 加载 3D 模型，Next 默认不处理 .glb。
    // 这里把 .glb/.gltf 作为静态资源导出（asset/resource），保证静态导出时文件可用。
    config.module.rules.push({
      test: /\.(glb|gltf)$/i,
      type: 'asset/resource',
      generator: {
        filename: 'static/media/[name][ext]'
      }
    });
    return config;
  }
};

export default nextConfig;
