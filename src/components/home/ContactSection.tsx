import Reveal from "../ui/Reveal";

export default function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 py-16 md:py-24">
      <Reveal y={24}>
        <div className="rounded-[2rem] border border-gray-500/20 bg-gray-500/10 p-6 md:p-10">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-sm tracking-[0.25em] opacity-50 uppercase">
                Contact
              </p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                Let&apos;s build something meaningful.
              </h2>
              <p className="mt-4 max-w-md leading-7 opacity-70">
                I’m open to freelance work, collaborations, and interesting
                product ideas. Feel free to reach out.
              </p>
            </div>

            <form className="grid gap-4">
              {/* 输入框背景换成更浅的 bg-gray-500/5，聚焦时加深边框 */}
              <input
                type="text"
                placeholder="Your name"
                className="rounded-2xl border border-gray-500/20 bg-gray-500/5 px-4 py-3 outline-none placeholder:opacity-50 focus:border-gray-500/40"
              />
              <input
                type="email"
                placeholder="Your email"
                className="rounded-2xl border border-gray-500/20 bg-gray-500/5 px-4 py-3 outline-none placeholder:opacity-50 focus:border-gray-500/40"
              />
              <textarea
                rows={6}
                placeholder="Tell me about your project"
                className="rounded-2xl border border-gray-500/20 bg-gray-500/5 px-4 py-3 outline-none placeholder:opacity-50 focus:border-gray-500/40"
              />
              {/* 发送按钮改成了线框按钮，这样无论白底黑底它都能自动变色 */}
              <button
                type="submit"
                className="w-fit rounded-full border-2 border-current px-6 py-3 text-sm font-medium transition hover:opacity-70"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </Reveal>
    </section>
  );
}