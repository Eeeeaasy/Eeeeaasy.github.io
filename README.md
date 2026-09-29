# Eeeeaasy!

我的个人作品站，也是一个持续生长的前端实验场。

这里收集了我的项目、技术栈和日常灵感。网站以 Astro 为骨架，混合 React 交互、3D 角色、动效和音乐，希望它不只是一份履历，也能保留一点属于自己的趣味。

## 在线访问

[eeeeaasy.github.io](https://eeeeaasy.github.io)

## 页面

- **Home**：个人介绍、一言和可切换的 3D 角色
- **Skills**：键盘风格的交互式技术栈展示
- **Inspiration**：灵感卡片、视频与详情页
- **Demo**：项目实验与作品展示
- **Blog**：基于 Astro Content Collections 的文章页面

## 技术栈

- Astro 6
- React 19
- Tailwind CSS 4
- React Three Fiber / Three.js
- Spline
- GSAP / Framer Motion
- TypeScript

## 本地运行

需要 Node.js 22.12 或更高版本。

```bash
npm install
npm run dev
```

开发服务器默认运行在 `http://localhost:4321`。

## 可用命令

```bash
npm run dev              # 启动开发服务器
npm run build            # 生成生产版本
npm run preview          # 本地预览生产版本
npm run astro -- check   # 运行 Astro 与 TypeScript 检查
```

## 内容与资源

- 页面位于 `src/pages`
- React 与 Astro 组件位于 `src/components`
- 博客文章位于 `src/content/blog`
- 图片、视频、压缩后的 3D 模型位于 `public`

站点部署前只保留浏览器实际使用的压缩模型。大型源模型请在本地或独立存储中维护，不要放入 `public`，以免被复制进部署产物。

## 部署

推送到 `master` 分支后，GitHub Actions 会自动构建并发布到 GitHub Pages。部署配置位于 `.github/workflows/deploy.yml`。

## License

网站代码与内容仅用于个人作品展示。未经许可，请勿直接复制个人内容、图片和 3D 资源。
