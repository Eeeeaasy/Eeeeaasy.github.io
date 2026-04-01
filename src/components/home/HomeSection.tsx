import React from "react";
import Hero from "./Hero";
import InspirationSection from "./InspirationSection";
import ProjectsSection from "./ProjectsSection";
import ContactSection from "./ContactSection";
// 如果你在 index.astro 已经引入了 ColorButton，这里就不需要再引入了

export default function HomeSection() {
  return (
    // 1. 关键：把 overflow-x-hidden 删掉！有了它，你视频的 sticky 悬浮效果就会彻底失效。
    <section className="relative min-h-screen">
      
      {/* 首页内容 */}
      <main className="mx-auto flex w-full max-w-7xl flex-col px-6 pb-24 pt-24 md:px-10">
        
        {/* 2. 关键：把所有的 client:load 删掉！
             因为这是 React (.tsx) 文件，client:load 是 Astro 独有的语法，不能写在这里。 */}
        <Hero />
        
        {/* 如果你不想在 Home 页面显示 Skills，这里可以注释掉 */}
        {/* <SkillsSection /> */}
        
        <InspirationSection />
        
        <ProjectsSection />
        
        {/* <ContactSection /> */}
      </main>

    </section>
  );
}