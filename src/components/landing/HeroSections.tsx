import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import { useInView } from "./useInView";
import {
  HERO_IMG, TEAM_IMG, WORK_IMG,
  SERVICES, PORTFOLIO, REVIEWS, BLOG_POSTS, TICKER_ITEMS,
} from "./data";

export default function HeroSections() {
  const heroSection = useInView(0.1);
  const servicesSection = useInView(0.1);
  const portfolioSection = useInView(0.1);
  const aboutSection = useInView(0.1);
  const blogSection = useInView(0.1);
  const reviewsSection = useInView(0.1);

  return (
    <>
      {/* HERO */}
      <section id="hero" ref={heroSection.ref} className="relative min-h-screen flex items-center pt-20 sm:pt-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-transparent" />

        <div className="absolute right-0 top-0 w-full lg:w-3/5 h-full">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-neon-green/5 rounded-full blur-[80px] animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <div className={`section-tag mb-5 sm:mb-6 ${heroSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green inline-block" />
              Работаем 24/7
            </div>

            <h1 className={`font-oswald text-4xl sm:text-5xl lg:text-7xl font-black leading-[1.05] mb-3 sm:mb-4 ${heroSection.inView ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>Обслуживание кондиционеров и вентиляции в Тюмени</h1>
            <p className={`font-oswald text-xl sm:text-2xl lg:text-3xl font-semibold text-neon-blue leading-tight mb-5 sm:mb-6 ${heroSection.inView ? 'animate-fade-in-up delay-150' : 'opacity-0'}`}>Аккуратно и точно в срок.</p>

            <p className={`text-base sm:text-lg text-foreground/70 leading-relaxed mb-8 sm:mb-10 max-w-lg ${heroSection.inView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>Монтаж, сезонное ТО, чистка и дезинфекция систем для квартир, офисов, ресторанов и торговых центров.  Дезинфекция систем вентиляции в медицинских учреждениях (есть лицензия на эти виды работ). Выезд специалиста в течении 2 ч. Гарантия на все виды работ.</p>

            <div className={`flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 mb-12 sm:mb-16 ${heroSection.inView ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
              <a href="#booking" className="btn-primary px-6 sm:px-8 py-3.5 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2">
                <Icon name="CalendarCheck" size={18} />
                Записаться на сервис
              </a>
              <a href="#services" className="btn-outline px-6 sm:px-8 py-3.5 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2">
                Наши услуги
                <Icon name="ArrowRight" size={18} />
              </a>
            </div>

            <div className={`grid grid-cols-3 gap-3 sm:gap-6 ${heroSection.inView ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
              {[
                { num: "10", label: "лет опыта", suffix: "+" },
                { num: "1200", label: "клиентов", suffix: "+" },
                { num: "2", label: "часа выезд", suffix: "" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-oswald text-2xl sm:text-3xl lg:text-4xl font-black text-neon-blue">
                    {s.num}<span className="text-neon-green">{s.suffix}</span>
                  </div>
                  <div className="text-xs sm:text-sm text-foreground/60 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-foreground/40 text-xs">
          <span className="tracking-widest uppercase text-[10px]">Прокрути</span>
          <div className="w-px h-10 bg-gradient-to-b from-neon-blue/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* TICKER */}
      <div className="relative overflow-hidden border-y border-neon-blue/20 bg-neon-blue/5 py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="mx-8 font-oswald text-sm font-semibold tracking-[0.15em] text-foreground/50">
              {item} <span className="text-neon-blue mx-4">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" ref={servicesSection.ref} className="py-16 sm:py-24 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`mb-10 sm:mb-16 ${servicesSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="section-tag mb-4">Что мы делаем</div>
            <h2 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-black">НАШИ <span className="text-neon-blue">УСЛУГИ</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {SERVICES.map((s, i) => (
              <Link to={`/uslugi/${s.slug}`} key={i} className={`card-service rounded-2xl p-5 sm:p-7 block group ${servicesSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mb-5 group-hover:bg-neon-blue/20 transition-colors">
                  <Icon name={s.icon} size={22} className="text-neon-blue" />
                </div>
                <h3 className="font-oswald text-xl font-bold mb-3 group-hover:text-neon-blue transition-colors">{s.title}</h3>
                <p className="text-foreground/65 text-sm leading-relaxed mb-6">{s.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-neon-green font-semibold text-sm">{s.price}</span>
                  <span className="text-neon-blue/70 text-xs group-hover:text-neon-blue transition-colors flex items-center gap-1">
                    Подробнее <Icon name="ArrowRight" size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" ref={portfolioSection.ref} className="py-16 sm:py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`mb-10 sm:mb-16 ${portfolioSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="section-tag mb-4">Наши работы</div>
            <h2 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-black">ПОРТФОЛИО</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {PORTFOLIO.map((p, i) => (
              <div key={i} className={`card-service rounded-2xl overflow-hidden group cursor-pointer ${portfolioSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="h-44 relative overflow-hidden">
                  <img src={WORK_IMG} alt="" className="w-full h-full object-cover opacity-75 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-neon-green bg-neon-green/10 border border-neon-green/30 px-3 py-1 rounded-full">
                      {p.tag}
                    </span>
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <div className="text-foreground/50 text-xs uppercase tracking-widest mb-2">{p.category}</div>
                  <h3 className="font-oswald text-lg sm:text-xl font-bold mb-2">{p.title}</h3>
                  <p className="text-foreground/65 text-sm">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" ref={aboutSection.ref} className="py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-green/4 rounded-full blur-[150px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className={`${aboutSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="section-tag mb-5 sm:mb-6">О компании</div>
              <h2 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-black mb-6 sm:mb-8 leading-tight">
                10 ЛЕТ ДЕЛАЕМ<br />
                <span className="text-neon-blue">ТЕХНИКУ</span><br />
                НАДЁЖНОЙ
              </h2>
              <p className="text-foreground/70 leading-relaxed mb-5 sm:mb-6 text-sm sm:text-base">
                Мы — команда сертифицированных инженеров и технических специалистов с опытом работы в промышленном, коммерческом и медицинском секторах.
              </p>
              <p className="text-foreground/70 leading-relaxed mb-8 sm:mb-10 text-sm sm:text-base">
                За 10 лет работы мы обслужили более 1200 клиентов и провели свыше 50 000 сервисных выездов. Наша цель — чтобы ваше оборудование работало без сбоев.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
                {[
                  { icon: "Award", text: "Сертифицированные специалисты" },
                  { icon: "Clock", text: "Выезд в течение 2 часов" },
                  { icon: "Shield", text: "Гарантия на все работы" },
                  { icon: "Headphones", text: "Поддержка 24/7/365" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border">
                    <Icon name={f.icon} size={18} className="text-neon-blue flex-shrink-0" />
                    <span className="text-sm text-foreground/75">{f.text}</span>
                  </div>
                ))}
              </div>

              <a href="#booking" className="btn-primary inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 rounded-xl text-sm sm:text-base w-full sm:w-auto">
                Записаться на консультацию
                <Icon name="ArrowRight" size={18} />
              </a>
            </div>

            <div className={`relative ${aboutSection.inView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
              <div className="absolute -inset-4 bg-neon-blue/10 rounded-3xl blur-xl" />
              <img src={TEAM_IMG} alt="Команда" className="relative rounded-3xl w-full h-64 sm:h-96 lg:h-[520px] object-cover border border-neon-blue/20" />
              <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {["АС", "МК", "ДП", "ЕВ"].map((k, idx) => (
                      <div key={idx} className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-blue to-neon-green border-2 border-card flex items-center justify-center text-xs font-bold text-white">
                        {k}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">50+ специалистов</div>
                    <div className="text-xs text-foreground/60">в команде по всей России</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" ref={blogSection.ref} className="py-16 sm:py-24 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`flex flex-col sm:flex-row sm:flex-wrap sm:items-end sm:justify-between gap-4 sm:gap-6 mb-10 sm:mb-16 ${blogSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div>
              <div className="section-tag mb-4">Знания</div>
              <h2 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-black">БЛОГ</h2>
            </div>
            <a href="#" className="btn-outline px-6 py-2.5 rounded-xl text-sm inline-flex w-fit items-center gap-2">
              Все статьи <Icon name="ArrowRight" size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {BLOG_POSTS.map((post, i) => (
              <Link to={`/blog/${post.slug}`} key={i} className={`card-service rounded-2xl p-5 sm:p-7 cursor-pointer flex flex-col group ${blogSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="section-tag text-xs">{post.category}</span>
                  <span className="text-foreground/50 text-xs">{post.read} чтения</span>
                </div>
                <h3 className="font-oswald text-lg font-bold leading-tight mb-3 group-hover:text-neon-blue transition-colors">{post.title}</h3>
                <p className="text-foreground/65 text-sm leading-relaxed mb-4">{post.seoText}</p>

                <div className="mb-5">
                  <div className="text-[10px] uppercase tracking-widest text-foreground/45 mb-2.5 flex items-center gap-1.5">
                    <Icon name="Search" size={11} className="text-neon-blue" />
                    Популярные запросы
                  </div>
                  <ul className="space-y-1.5">
                    {post.seoQueries.map((q, qi) => (
                      <li key={qi} className="flex items-start gap-2 text-xs text-foreground/70">
                        <span className="text-neon-green mt-1 shrink-0">•</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                  <span className="text-foreground/50 text-xs">{post.date}</span>
                  <span className="text-neon-blue text-xs flex items-center gap-1">
                    Читать <Icon name="ArrowRight" size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" ref={reviewsSection.ref} className="py-16 sm:py-24 relative">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`mb-10 sm:mb-16 ${reviewsSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="section-tag mb-4">Клиенты о нас</div>
            <h2 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-black">ОТЗЫВЫ</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {REVIEWS.map((r, i) => (
              <div key={i} className={`card-service rounded-2xl p-5 sm:p-7 ${reviewsSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="flex text-neon-green text-lg mb-5">{"★".repeat(r.stars)}</div>
                <p className="text-foreground/75 leading-relaxed mb-6 text-[15px]">«{r.text}»</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center text-xs font-bold text-white">
                    {r.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-foreground/50 text-xs">{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}