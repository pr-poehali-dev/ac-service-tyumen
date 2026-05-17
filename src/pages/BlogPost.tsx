import { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Navbar from "@/components/landing/Navbar";
import { BLOG_POSTS } from "@/components/landing/data";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = BLOG_POSTS.find(p => p.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) return <Navigate to="/" replace />;

  const otherPosts = BLOG_POSTS.filter(p => p.slug !== slug);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-[120px]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-neon-blue transition-colors mb-6">
            <Icon name="ArrowLeft" size={16} />
            На главную
          </Link>

          <div className="flex items-center gap-3 mb-5">
            <span className="section-tag text-xs">{post.category}</span>
            <span className="text-foreground/50 text-xs">{post.date}</span>
            <span className="text-foreground/50 text-xs flex items-center gap-1">
              <Icon name="Clock" size={12} /> {post.read} чтения
            </span>
          </div>

          <h1 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-foreground/75 leading-relaxed mb-8">
            {post.seoText}
          </p>

          <div className="relative mb-8">
            <div className="absolute -inset-3 bg-neon-blue/10 rounded-3xl blur-xl" />
            <img src={post.image} alt={post.title} className="relative rounded-2xl w-full h-64 sm:h-96 object-cover border border-neon-blue/20" />
          </div>
        </div>
      </section>

      <article className="pb-12 sm:pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <p className="text-foreground/80 leading-relaxed text-base sm:text-lg mb-10 sm:mb-12 p-5 sm:p-6 rounded-2xl bg-neon-blue/5 border border-neon-blue/20">
            {post.intro}
          </p>

          <div className="space-y-8 sm:space-y-10">
            {post.sections.map((s, i) => (
              <div key={i}>
                <h2 className="font-oswald text-2xl sm:text-3xl font-black mb-4 text-neon-blue flex items-start gap-3">
                  <span className="text-neon-green font-mono text-xl sm:text-2xl mt-1">0{i + 1}.</span>
                  {s.heading}
                </h2>
                <p className="text-foreground/75 leading-relaxed text-base">{s.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 sm:p-8 rounded-2xl bg-muted/40 border border-border">
            <div className="text-[10px] uppercase tracking-widest text-foreground/45 mb-3 flex items-center gap-1.5">
              <Icon name="Search" size={12} className="text-neon-blue" />
              Популярные поисковые запросы по теме
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {post.seoQueries.map((q, qi) => (
                <li key={qi} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="text-neon-green mt-1 shrink-0">•</span>
                  <span>{q}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>

      <section className="py-12 sm:py-16 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-14"
            style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 60%, #115e59 100%)', boxShadow: '0 30px 80px -20px rgba(13,148,136,0.55)' }}>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
            <div className="absolute inset-0 grid-pattern opacity-15" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h3 className="font-oswald text-2xl sm:text-3xl lg:text-4xl font-black mb-3 text-white">НУЖНА КОНСУЛЬТАЦИЯ?</h3>
                <p className="text-white/85 max-w-md text-sm sm:text-base">
                  Оставьте заявку — мастер перезвонит в течение 30 минут
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link to="/#booking" className="bg-white text-[#0f766e] hover:bg-white/95 px-6 sm:px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-oswald font-semibold uppercase tracking-wider text-sm transition-all hover:-translate-y-0.5">
                  <Icon name="CalendarCheck" size={18} />
                  Записаться
                </Link>
                <a href="tel:+74951234567" className="border-2 border-white/60 text-white hover:bg-white/10 px-6 sm:px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-oswald font-semibold uppercase tracking-wider text-sm transition-all hover:-translate-y-0.5">
                  <Icon name="Phone" size={18} />
                  Позвонить
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="section-tag mb-4">Другие статьи</div>
          <h2 className="font-oswald text-2xl sm:text-3xl lg:text-4xl font-black mb-8 sm:mb-10">
            ЧИТАЙТЕ <span className="text-neon-blue">ТАКЖЕ</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {otherPosts.map((p, i) => (
              <Link to={`/blog/${p.slug}`} key={i} className="card-service rounded-2xl p-5 sm:p-7 block group">
                <div className="flex items-center justify-between mb-4">
                  <span className="section-tag text-xs">{p.category}</span>
                  <span className="text-foreground/50 text-xs">{p.read} чтения</span>
                </div>
                <h3 className="font-oswald text-lg sm:text-xl font-bold leading-tight mb-3 group-hover:text-neon-blue transition-colors">{p.title}</h3>
                <p className="text-foreground/65 text-sm leading-relaxed mb-4">{p.seoText}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-foreground/50 text-xs">{p.date}</span>
                  <span className="text-neon-blue text-xs flex items-center gap-1">
                    Читать <Icon name="ArrowRight" size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center text-xs text-foreground/40">
          © 2026 Страйк Сервис. Все права защищены.
        </div>
      </footer>
    </div>
  );
}
