// 这是一个标准的、非交互式的 React 组件
export default function BlogList({ posts }) {
  return (
    <section className="space-y-8 py-12 px-6 rounded-xl border border-slate-100 bg-slate-50/50">
      <h3 className="text-2xl font-extrabold text-slate-950 tracking-tight">
        最新文章集
      </h3>
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {posts.map((post) => (
          <article key={post.id} className="p-6 border border-slate-100 rounded-xl bg-white shadow-sm hover:border-slate-200 transition-colors duration-150 group">
            <a href={`/blog/${post.id}`}>
              <h4 className="text-lg font-bold text-slate-950 mb-2 group-hover:text-blue-600">
                {post.data.title}
              </h4>
              <p className="text-gray-500 text-sm mb-3 font-mono">
                发布于 {post.data.pubDate.toLocaleDateString()}
              </p>
              <p className="text-slate-700 text-sm font-sans line-clamp-2 leading-relaxed">
                {post.data.description}
              </p>
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}