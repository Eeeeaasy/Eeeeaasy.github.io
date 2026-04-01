import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const directories = [
  'src/content/blog',
  'src/components',
  'src/layouts',
  'src/pages/blog'
];

const files = {
  'src/content.config.ts': `import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blogCollection = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string(),
    pubDate: z.date(),
    description: z.string(),
    tags: z.array(z.string()),
  }),
});

export const collections = {
  'blog': blogCollection,
};
`,

  'src/content/blog/first-post.md': `---
title: "从零手搓：CLI 与 Open Peeps 的视觉融合"
pubDate: 2026-03-31
description: "尝试用 Astro 和 React 将两种截然不同的前端风格完美融合。"
tags: ["Astro", "React", "开源", "手搓UI"]
---

# Hello World

欢迎来到 Eeeeaasy 的全新数字花园！

这是一个融合了极客 CLI 严谨感与 Pablo Stanley 手绘 Open Peeps 卡通感的博客。完全手搓，页面自写。

这是一段测试代码：
\`\`\`javascript
console.log("Hello, Astro + React + CLI + Peeps!");
\`\`\`
`,

  'src/components/Header.jsx': `export default function Header() {
  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur-md bg-[#13151A]/80 border-b border-[#2A2C35]">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center max-w-4xl">
        <div className="flex items-center space-x-2">
          <span className="px-1.5 py-0.5 rounded-sm bg-[#38BDF8] text-[#13151A] text-xs font-mono font-bold">
            blog
          </span>
          <h1 className="text-xl font-bold font-mono text-[#D1D5DB]">
            Eeeeaasy.github.io
          </h1>
        </div>
        <nav>
          <ul className="flex items-center space-x-5 text-sm font-medium text-gray-400 font-mono">
            <li className="flex items-center space-x-1.5 p-1 rounded-md bg-[#8B5CF6]/10">
              <span className="px-1.5 py-0.5 rounded-sm bg-[#8B5CF6] text-[#13151A] text-xs font-bold">
                dir
              </span>
              <a href="/" className="hover:text-[#D1D5DB] transition-colors">
                $ astro dev
              </a>
            </li>
            <li>
              <a href="https://github.com/Eeeeaasy" target="_blank" className="hover:text-blue-500 flex items-center space-x-1">
                <span>$ git push</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
`,

  'src/components/CharacterGenerator.jsx': `import { useState } from 'react';

export default function CharacterGenerator() {
  const peepHeads = ['curly', 'long', 'short', 'none'];
  const peepFacialHairs = ['beard', 'mustache', 'stacheBeard', 'none'];
  const peepEmotions = ['happy', 'sad', 'angry', 'surprised'];
  const peepAccessories = ['clearLenses', 'sunnies', 'shades', 'none'];
  const peepBodies = ['armCross', 'waving', 'standing', 'crossedArms'];

  const [selectedHead, setSelectedHead] = useState(peepHeads[0]);
  const [selectedFacialHair, setSelectedFacialHair] = useState(peepFacialHairs[0]);
  const [selectedEmotion, setSelectedEmotion] = useState(peepEmotions[0]);
  const [selectedAccessory, setSelectedAccessory] = useState(peepAccessories[0]);
  const [selectedBody, setSelectedBody] = useState(peepBodies[0]);

  const characterDescription = (
    <div className="space-y-1.5 text-xs text-gray-600 font-serif leading-relaxed">
      <p>
        <span className="font-bold text-gray-900">头部搭配:</span> {selectedHead} ({peepHeads.length} 种选择).
      </p>
      <p>
        <span className="font-bold text-gray-900">表情搭配:</span> {selectedEmotion} ({peepEmotions.length} 种表情).
      </p>
      <p>
        <span className="font-bold text-gray-900">胡子搭配:</span> {selectedFacialHair} ({peepFacialHairs.length} 种胡须).
      </p>
      <p>
        <span className="font-bold text-gray-900">身体搭配:</span> {selectedBody} ({peepBodies.length} 种姿态).
      </p>
      <p className="mt-3 text-sm font-bold text-gray-900">
        总共超过 584,688 种可能的组合。
      </p>
    </div>
  );

  return (
    <section className="py-12 px-4 rounded-xl border border-dashed border-[#2A2C35] bg-[#1A1C23]">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <h2 className="text-4xl font-serif font-extrabold text-[#D1D5DB] mb-3 tracking-tight">
          How to mix a Peep.
        </h2>
        <p className="text-gray-400 text-center max-w-2xl text-sm mb-12 font-serif leading-relaxed">
          创建一个角色很容易！使用这些表单控件来混合不同的嵌套组件，拼装出你的专属极客形象。
        </p>

        <div className="relative w-full flex justify-center mb-16 h-80">
          <div className="relative border-4 border-[#D1D5DB] rounded-full w-72 h-72 flex justify-center items-end p-4 bg-[#E5E7EB] overflow-hidden shadow-xl">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-gray-800 w-full px-4">
              <div className="mb-4">{characterDescription}</div>
             </div>
          </div>
          
          <div className="absolute top-0 right-10 text-right space-y-2 text-xs text-gray-500 font-serif">
            <p>这里是你拼装的角色。</p>
            <p>使用下面的控制面板进行修改。</p>
          </div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-10 text-[#D1D5DB]">
          {[
            { label: '发型搭配', state: selectedHead, setState: setSelectedHead, options: peepHeads },
            { label: '表情搭配', state: selectedEmotion, setState: setSelectedEmotion, options: peepEmotions },
            { label: '胡子搭配', state: selectedFacialHair, setState: setSelectedFacialHair, options: peepFacialHairs },
            { label: '配件搭配', state: selectedAccessory, setState: setSelectedAccessory, options: peepAccessories },
            { label: '身体搭配', state: selectedBody, setState: setSelectedBody, options: peepBodies },
          ].map((item, index) => (
            <div key={index} className="space-y-3">
              <label className="block text-sm font-bold text-gray-300 font-serif">
                {item.label}
              </label>
              <select
                value={item.state}
                onChange={(e) => item.setState(e.target.value)}
                className="w-full p-3 rounded-md border border-[#2A2C35] bg-[#13151A] text-sm font-serif focus:ring-2 focus:ring-[#38BDF8] focus:border-[#38BDF8] text-[#D1D5DB]"
              >
                {item.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
`,

  'src/components/BlogList.jsx': `export default function BlogList({ posts }) {
  return (
    <section className="space-y-6">
      <h3 className="text-xl font-bold font-mono text-gray-400">
        $ ls ./blog/
      </h3>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id} className="p-6 border border-[#2A2C35] rounded-xl bg-[#13151A]/70 hover:border-[#38BDF8] transition-colors duration-200">
            <a href={\`/blog/\${post.id}\`}>
              <h4 className="text-lg font-bold font-mono text-[#D1D5DB] mb-2">{post.data.title}</h4>
              <p className="text-gray-500 text-sm font-mono mb-3">
                $ date -d "{post.data.pubDate.toLocaleDateString()}"
              </p>
              <p className="text-gray-600 text-sm font-sans line-clamp-2">{post.data.description}</p>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
`,

  'src/layouts/BaseLayout.astro': `---
import ParticleBackground from '../components/ParticleBackground.jsx';
const { title = "Eeeeaasy's Blog" } = Astro.props;
---

<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{title}</title>
  </head>
  <body class="bg-[#13151A] text-gray-200 font-sans min-h-screen relative">
    <ParticleBackground client:only="react" />
    <div class="relative z-10 pt-24 pb-12">
      <slot />
    </div>
  </body>
</html>
`,

  'src/pages/index.astro': `---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/Header.jsx';
import BlogList from '../components/BlogList.jsx';
import CharacterGenerator from '../components/CharacterGenerator.jsx';
import { getCollection } from 'astro:content';

const allPosts = await getCollection('blog');
const sortedPosts = allPosts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
---

<BaseLayout title="首页 | Eeeeaasy.github.io">
  <Header />
  <main class="container mx-auto px-4 max-w-4xl space-y-16">
    <CharacterGenerator client:load="react" />
    <BlogList posts={sortedPosts} />
  </main>
</BaseLayout>
`,

  'src/pages/blog/[id].astro': `---
import { getCollection, render } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/Header.jsx';

export async function getStaticPaths() {
  const blogEntries = await getCollection('blog');
  return blogEntries.map(entry => ({
    params: { id: entry.id },
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---

<BaseLayout title={\`\${entry.data.title} | Eeeeaasy.github.io\`}>
  <Header />
  <main class="container mx-auto px-4 max-w-3xl py-12 space-y-10 relative z-10">
    <div class="text-center">
      <h1 class="text-4xl font-extrabold text-[#D1D5DB] mb-3 tracking-tight font-serif">
        {entry.data.title}
      </h1>
      <div class="text-sm text-gray-500 font-serif leading-relaxed">
        发布于 $ date -d "{entry.data.pubDate.toLocaleDateString()}"
      </div>
    </div>
    <div class="prose prose-invert prose-blue prose-sm leading-relaxed text-gray-300 font-serif">
        <Content />
    </div>
  </main>
</BaseLayout>
`
};

console.log('🚀 开始初始化融合了 CLI 与 Open Peeps 风格的博客架构...\n');

directories.forEach(dir => {
  const targetDir = path.join(__dirname, dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
    console.log(`📁 创建目录: ${dir}`);
  }
});

Object.entries(files).forEach(([filePath, content]) => {
  const targetFile = path.join(__dirname, filePath);
  if (!fs.existsSync(targetFile)) {
    fs.writeFileSync(targetFile, content, 'utf8');
    console.log(`📄 创建文件: ${filePath}`);
  } else {
    console.log(`⚠️ 文件已存在，跳过: ${filePath}`);
  }
});

console.log('\n✅ 架构部署完成！运行 npm run dev 起飞吧。');