import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMG = "https://cdn.poehali.dev/projects/1ca52ef0-91c2-41c6-b9e5-c074d8171504/files/e7a12b38-603c-4b7e-aa71-c81471d5a276.jpg";
const TEAM_IMG = "https://cdn.poehali.dev/projects/1ca52ef0-91c2-41c6-b9e5-c074d8171504/files/086dbf83-d7c3-46f3-8cc0-7d6b81f1c0d2.jpg";
const WORK_IMG = "https://cdn.poehali.dev/projects/1ca52ef0-91c2-41c6-b9e5-c074d8171504/files/07cb9d08-f736-4d24-88b9-2d451b59fcff.jpg";

const SERVICES = [
  { icon: "Wrench", title: "Техническое обслуживание", desc: "Плановое ТО оборудования по регламенту производителя. Продляем срок службы техники.", price: "от 3 500 ₽" },
  { icon: "Zap", title: "Ремонт и диагностика", desc: "Быстрая диагностика неисправностей и профессиональный ремонт любой сложности.", price: "от 2 000 ₽" },
  { icon: "Settings", title: "Настройка систем", desc: "Тонкая настройка и калибровка оборудования под ваши задачи и условия работы.", price: "от 1 500 ₽" },
  { icon: "Shield", title: "Гарантийный сервис", desc: "Гарантийное и постгарантийное обслуживание всех марок и моделей оборудования.", price: "Бесплатно" },
  { icon: "Clock", title: "Экстренный выезд", desc: "Выезд специалиста в течение 2 часов при срочных поломках и авариях 24/7.", price: "от 5 000 ₽" },
  { icon: "FileCheck", title: "Техническая экспертиза", desc: "Независимая экспертиза состояния оборудования с выдачей официального заключения.", price: "от 4 000 ₽" },
];

const PORTFOLIO = [
  { category: "Промышленное", title: "Завод «РосМеталл»", desc: "Комплексное ТО 120 единиц оборудования", tag: "Производство" },
  { category: "Коммерческое", title: "ТЦ «Галерея»", desc: "Обслуживание инженерных систем 45 000 м²", tag: "Торговля" },
  { category: "Медицинское", title: "Клиника «МедЦентр»", desc: "Сертифицированный сервис медоборудования", tag: "Медицина" },
  { category: "Пищевое", title: "Комбинат «ВкусПром»", desc: "Поддержка производственной линии 24/7", tag: "Пищепром" },
  { category: "Логистика", title: "Склад «ПолярЛог»", desc: "Обслуживание 80 единиц складской техники", tag: "Логистика" },
  { category: "Энергетика", title: "ПС «ЭлектроСеть»", desc: "Техобслуживание трансформаторных подстанций", tag: "Энергетика" },
];

const REVIEWS = [
  { name: "Андрей Смирнов", role: "Директор «РосМеталл»", text: "Работаем уже три года. Профессионализм команды на высшем уровне — ни одной серьёзной поломки с момента начала сотрудничества.", stars: 5 },
  { name: "Марина Козлова", role: "Управляющая ТЦ «Галерея»", text: "Оперативность просто поражает. Вызвала мастера в 23:00, в полночь он уже был на объекте. Проблема решена за час.", stars: 5 },
  { name: "Дмитрий Петров", role: "Главный инженер «ВкусПром»", text: "Экономим около 30% на содержании техники по сравнению со штатными мастерами. Качество работ не страдает — только растёт.", stars: 5 },
  { name: "Елена Воронова", role: "Зав. отделом МедЦентра", text: "Работа с медицинским оборудованием требует особой точности. Специалисты имеют все необходимые допуски и сертификаты.", stars: 5 },
];

const BLOG_POSTS = [
  { date: "12 мая 2026", category: "ТО", title: "Как часто нужно проводить плановое ТО промышленного оборудования", read: "5 мин" },
  { date: "5 мая 2026", category: "Советы", title: "7 признаков того, что ваше оборудование требует срочного ремонта", read: "4 мин" },
  { date: "28 апр 2026", category: "Технологии", title: "Предиктивное обслуживание: как IoT-датчики снижают расходы на 40%", read: "7 мин" },
];

const TICKER_ITEMS = ["ПРОФЕССИОНАЛЬНЫЙ СЕРВИС", "ГАРАНТИЯ КАЧЕСТВА", "ВЫЕЗД ЗА 2 ЧАСА", "РАБОТАЕМ 24/7", "1200+ КЛИЕНТОВ", "15 ЛЕТ НА РЫНКЕ"];

const MONTHS = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
const TIME_SLOTS = ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00"];
const TAKEN_SLOTS = ["09:30", "11:00", "14:00", "15:30"];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return { ref, inView };
}

export default function Index() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const [bookMonth, setBookMonth] = useState(new Date().getMonth());
  const [bookYear, setBookYear] = useState(new Date().getFullYear());
  const [bookDay, setBookDay] = useState<number | null>(null);
  const [bookTime, setBookTime] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState({ name: "", phone: "", service: "", comment: "" });
  const [bookSent, setBookSent] = useState(false);

  const heroSection = useInView(0.1);
  const servicesSection = useInView(0.1);
  const portfolioSection = useInView(0.1);
  const aboutSection = useInView(0.1);
  const blogSection = useInView(0.1);
  const reviewsSection = useInView(0.1);
  const bookingSection = useInView(0.1);
  const contactsSection = useInView(0.1);

  const today = new Date();

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => {
    const d = new Date(y, m, 1).getDay();
    return d === 0 ? 6 : d - 1;
  };

  const calDays = getDaysInMonth(bookYear, bookMonth);
  const calStart = getFirstDayOfMonth(bookYear, bookMonth);

  const isPastDay = (d: number) => {
    const date = new Date(bookYear, bookMonth, d);
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return date < todayStart;
  };

  const prevMonth = () => {
    if (bookMonth === 0) { setBookMonth(11); setBookYear(y => y - 1); }
    else setBookMonth(m => m - 1);
    setBookDay(null); setBookTime(null);
  };
  const nextMonth = () => {
    if (bookMonth === 11) { setBookMonth(0); setBookYear(y => y + 1); }
    else setBookMonth(m => m + 1);
    setBookDay(null); setBookTime(null);
  };

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookSent(true);
  };

  const navItems = [
    { href: "#services", label: "Услуги" },
    { href: "#portfolio", label: "Портфолио" },
    { href: "#about", label: "О компании" },
    { href: "#blog", label: "Блог" },
    { href: "#reviews", label: "Отзывы" },
    { href: "#contacts", label: "Контакты" },
  ];

  return (
    <div className="min-h-screen bg-[#0A0E17] text-white font-golos overflow-x-hidden">

      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#hero" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-neon-blue flex items-center justify-center glow-blue">
              <Icon name="Zap" size={16} className="text-[#0A0E17]" />
            </div>
            <span className="font-oswald font-bold text-lg tracking-wide">ТЕХСЕРВИС<span className="text-neon-blue">.</span>PRO</span>
          </a>

          <nav className="hidden lg:flex items-center gap-8">
            {navItems.map(n => (
              <a key={n.href} href={n.href} className="nav-link">{n.label}</a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a href="tel:+74951234567" className="hidden sm:flex items-center gap-2 text-sm text-white/60 hover:text-neon-blue transition-colors">
              <Icon name="Phone" size={14} />
              +7 (495) 123-45-67
            </a>
            <a href="#booking" className="btn-primary px-5 py-2 rounded-lg text-sm hidden sm:block">
              Записаться
            </a>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-white/70">
              <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden glass border-t border-white/5 px-6 py-4 space-y-3">
            {navItems.map(n => (
              <a key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
                className="block py-2 text-white/70 hover:text-white transition-colors font-medium">
                {n.label}
              </a>
            ))}
            <a href="#booking" onClick={() => setMobileOpen(false)}
              className="btn-primary block text-center px-5 py-2.5 rounded-lg mt-2">
              Записаться на обслуживание
            </a>
          </div>
        )}
      </header>

      {/* HERO */}
      <section id="hero" ref={heroSection.ref} className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A0E17] via-[#0A0E17]/90 to-transparent" />

        <div className="absolute right-0 top-0 w-full lg:w-3/5 h-full">
          <img src={HERO_IMG} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0E17] via-[#0A0E17]/60 to-transparent" />
        </div>

        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/5 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 bg-neon-green/5 rounded-full blur-[80px] animate-float" style={{ animationDelay: '3s' }} />

        <div className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="max-w-2xl">
            <div className={`section-tag mb-6 ${heroSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-neon-green inline-block" />
              Работаем 24/7
            </div>

            <h1 className={`font-oswald text-5xl lg:text-7xl font-black leading-none mb-6 ${heroSection.inView ? 'animate-fade-in-up delay-100' : 'opacity-0'}`}>
              ПРОФЕССИОНАЛЬНЫЙ<br />
              <span className="text-neon-blue text-glow-blue">ТЕХНИЧЕСКИЙ</span><br />
              СЕРВИС
            </h1>

            <p className={`text-lg text-white/65 leading-relaxed mb-10 max-w-lg ${heroSection.inView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
              Обслуживаем промышленное, коммерческое и медицинское оборудование. Выезд специалиста за 2 часа. Гарантия на все виды работ.
            </p>

            <div className={`flex flex-wrap gap-4 mb-16 ${heroSection.inView ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}>
              <a href="#booking" className="btn-primary px-8 py-3.5 rounded-xl text-base flex items-center gap-2">
                <Icon name="CalendarCheck" size={18} />
                Записаться на сервис
              </a>
              <a href="#services" className="btn-outline px-8 py-3.5 rounded-xl text-base flex items-center gap-2">
                Наши услуги
                <Icon name="ArrowRight" size={18} />
              </a>
            </div>

            <div className={`grid grid-cols-3 gap-6 ${heroSection.inView ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}>
              {[
                { num: "15", label: "лет опыта", suffix: "+" },
                { num: "1200", label: "клиентов", suffix: "+" },
                { num: "2", label: "часа выезд", suffix: "" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="font-oswald text-3xl lg:text-4xl font-black text-neon-blue">
                    {s.num}<span className="text-neon-green">{s.suffix}</span>
                  </div>
                  <div className="text-sm text-white/50 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30 text-xs">
          <span className="tracking-widest uppercase text-[10px]">Прокрути</span>
          <div className="w-px h-10 bg-gradient-to-b from-neon-blue/40 to-transparent animate-pulse" />
        </div>
      </section>

      {/* TICKER */}
      <div className="relative overflow-hidden border-y border-neon-blue/20 bg-neon-blue/5 py-3">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="mx-8 font-oswald text-sm font-semibold tracking-[0.15em] text-white/40">
              {item} <span className="text-neon-blue mx-4">◆</span>
            </span>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <section id="services" ref={servicesSection.ref} className="py-24 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6">
          <div className={`mb-16 ${servicesSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="section-tag mb-4">Что мы делаем</div>
            <h2 className="font-oswald text-4xl lg:text-5xl font-black">НАШИ <span className="text-neon-blue">УСЛУГИ</span></h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <div key={i} className={`card-service rounded-2xl p-7 ${servicesSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-12 h-12 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mb-5">
                  <Icon name={s.icon} size={22} className="text-neon-blue" />
                </div>
                <h3 className="font-oswald text-xl font-bold mb-3">{s.title}</h3>
                <p className="text-white/55 text-sm leading-relaxed mb-6">{s.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/8">
                  <span className="text-neon-green font-semibold text-sm">{s.price}</span>
                  <a href="#booking" className="text-neon-blue/70 text-xs hover:text-neon-blue transition-colors flex items-center gap-1">
                    Записаться <Icon name="ArrowRight" size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PORTFOLIO */}
      <section id="portfolio" ref={portfolioSection.ref} className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`mb-16 ${portfolioSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="section-tag mb-4">Наши работы</div>
            <h2 className="font-oswald text-4xl lg:text-5xl font-black">ПОРТФОЛИО</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PORTFOLIO.map((p, i) => (
              <div key={i} className={`card-service rounded-2xl overflow-hidden group cursor-pointer ${portfolioSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="h-44 relative overflow-hidden">
                  <img src={WORK_IMG} alt="" className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-105 transition-all duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className="text-xs font-semibold uppercase tracking-widest text-neon-green bg-neon-green/10 border border-neon-green/30 px-3 py-1 rounded-full">
                      {p.tag}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-white/40 text-xs uppercase tracking-widest mb-2">{p.category}</div>
                  <h3 className="font-oswald text-xl font-bold mb-2">{p.title}</h3>
                  <p className="text-white/55 text-sm">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" ref={aboutSection.ref} className="py-24 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neon-green/4 rounded-full blur-[150px]" />
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className={`${aboutSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <div className="section-tag mb-6">О компании</div>
              <h2 className="font-oswald text-4xl lg:text-5xl font-black mb-8 leading-tight">
                15 ЛЕТ ДЕЛАЕМ<br />
                <span className="text-neon-blue">ТЕХНИКУ</span><br />
                НАДЁЖНОЙ
              </h2>
              <p className="text-white/60 leading-relaxed mb-6">
                Мы — команда сертифицированных инженеров и технических специалистов с опытом работы в промышленном, коммерческом и медицинском секторах.
              </p>
              <p className="text-white/60 leading-relaxed mb-10">
                За 15 лет работы мы обслужили более 1200 клиентов и провели свыше 50 000 сервисных выездов. Наша цель — чтобы ваше оборудование работало без сбоев.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { icon: "Award", text: "Сертифицированные специалисты" },
                  { icon: "Clock", text: "Выезд в течение 2 часов" },
                  { icon: "Shield", text: "Гарантия на все работы" },
                  { icon: "Headphones", text: "Поддержка 24/7/365" },
                ].map((f, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/6">
                    <Icon name={f.icon} size={18} className="text-neon-blue flex-shrink-0" />
                    <span className="text-sm text-white/70">{f.text}</span>
                  </div>
                ))}
              </div>

              <a href="#booking" className="btn-primary inline-flex items-center gap-2 px-8 py-3.5 rounded-xl">
                Записаться на консультацию
                <Icon name="ArrowRight" size={18} />
              </a>
            </div>

            <div className={`relative ${aboutSection.inView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
              <div className="absolute -inset-4 bg-neon-blue/10 rounded-3xl blur-xl" />
              <img src={TEAM_IMG} alt="Команда" className="relative rounded-3xl w-full h-96 lg:h-[520px] object-cover border border-neon-blue/20" />
              <div className="absolute bottom-6 left-6 right-6 glass rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {["АС", "МК", "ДП", "ЕВ"].map((k, idx) => (
                      <div key={idx} className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-blue to-neon-green border-2 border-[#0A0E17] flex items-center justify-center text-xs font-bold text-[#0A0E17]">
                        {k}
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">50+ специалистов</div>
                    <div className="text-xs text-white/50">в команде по всей России</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" ref={blogSection.ref} className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`flex flex-wrap items-end justify-between gap-6 mb-16 ${blogSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div>
              <div className="section-tag mb-4">Знания</div>
              <h2 className="font-oswald text-4xl lg:text-5xl font-black">БЛОГ</h2>
            </div>
            <a href="#" className="btn-outline px-6 py-2.5 rounded-xl text-sm flex items-center gap-2">
              Все статьи <Icon name="ArrowRight" size={16} />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {BLOG_POSTS.map((post, i) => (
              <article key={i} className={`card-service rounded-2xl p-7 cursor-pointer ${blogSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="section-tag text-xs">{post.category}</span>
                  <span className="text-white/30 text-xs">{post.read} чтения</span>
                </div>
                <h3 className="font-oswald text-lg font-bold leading-tight mb-4">{post.title}</h3>
                <div className="flex items-center justify-between pt-4 border-t border-white/8">
                  <span className="text-white/40 text-xs">{post.date}</span>
                  <span className="text-neon-blue text-xs flex items-center gap-1">
                    Читать <Icon name="ArrowRight" size={12} />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <section id="reviews" ref={reviewsSection.ref} className="py-24 relative">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-[100px]" />
        <div className="max-w-7xl mx-auto px-6">
          <div className={`mb-16 ${reviewsSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="section-tag mb-4">Клиенты о нас</div>
            <h2 className="font-oswald text-4xl lg:text-5xl font-black">ОТЗЫВЫ</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {REVIEWS.map((r, i) => (
              <div key={i} className={`card-service rounded-2xl p-7 ${reviewsSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.12}s` }}>
                <div className="flex text-neon-green text-lg mb-5">{"★".repeat(r.stars)}</div>
                <p className="text-white/70 leading-relaxed mb-6 text-[15px]">«{r.text}»</p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/8">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-blue to-neon-green flex items-center justify-center text-xs font-bold text-[#0A0E17]">
                    {r.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{r.name}</div>
                    <div className="text-white/40 text-xs">{r.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKING */}
      <section id="booking" ref={bookingSection.ref} className="py-24 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className={`mb-16 text-center ${bookingSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="section-tag mb-4 mx-auto w-fit">Онлайн-запись</div>
            <h2 className="font-oswald text-4xl lg:text-5xl font-black mb-4">
              ЗАПИСЬ НА <span className="text-neon-blue">ОБСЛУЖИВАНИЕ</span>
            </h2>
            <p className="text-white/50 max-w-lg mx-auto">Выберите удобную дату и время — мастер приедет точно в срок</p>
          </div>

          {bookSent ? (
            <div className="max-w-lg mx-auto text-center glass rounded-3xl p-12">
              <div className="w-20 h-20 rounded-full bg-neon-green/15 border border-neon-green/40 flex items-center justify-center mx-auto mb-6 glow-green">
                <Icon name="CheckCircle" size={36} className="text-neon-green" />
              </div>
              <h3 className="font-oswald text-2xl font-bold mb-3">Заявка принята!</h3>
              <p className="text-white/55 mb-2">Мы перезвоним вам в течение 30 минут для подтверждения.</p>
              {bookDay && bookTime && (
                <div className="mt-6 p-4 bg-neon-blue/10 border border-neon-blue/20 rounded-xl">
                  <div className="text-neon-blue font-semibold">
                    {bookDay} {MONTHS[bookMonth]} {bookYear}, {bookTime}
                  </div>
                </div>
              )}
              <button onClick={() => { setBookSent(false); setBookDay(null); setBookTime(null); setBookForm({ name: "", phone: "", service: "", comment: "" }); }}
                className="btn-outline mt-6 px-6 py-2.5 rounded-xl text-sm">
                Записаться снова
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Calendar */}
              <div className={`glass rounded-3xl p-7 ${bookingSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <h3 className="font-oswald text-xl font-bold mb-6 flex items-center gap-2">
                  <Icon name="Calendar" size={20} className="text-neon-blue" />
                  Выберите дату
                </h3>

                <div className="flex items-center justify-between mb-5">
                  <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <Icon name="ChevronLeft" size={18} className="text-white/60" />
                  </button>
                  <span className="font-oswald font-semibold text-lg">{MONTHS[bookMonth]} {bookYear}</span>
                  <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <Icon name="ChevronRight" size={18} className="text-white/60" />
                  </button>
                </div>

                <div className="grid grid-cols-7 mb-2">
                  {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(d => (
                    <div key={d} className="text-center text-xs text-white/30 font-semibold py-2">{d}</div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {Array(calStart).fill(null).map((_, i) => <div key={`e-${i}`} />)}
                  {Array(calDays).fill(null).map((_, i) => {
                    const d = i + 1;
                    const past = isPastDay(d);
                    const isToday = d === today.getDate() && bookMonth === today.getMonth() && bookYear === today.getFullYear();
                    const selected = bookDay === d;
                    return (
                      <button key={d} disabled={past}
                        onClick={() => { setBookDay(d); setBookTime(null); }}
                        className={`calendar-day mx-auto ${past ? "disabled" : ""} ${selected ? "selected" : ""} ${isToday && !selected ? "today" : ""}`}>
                        {d}
                      </button>
                    );
                  })}
                </div>

                {bookDay && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-white/80">
                      <Icon name="Clock" size={15} className="text-neon-blue" />
                      Доступное время — {bookDay} {MONTHS[bookMonth]}
                    </h4>
                    <div className="grid grid-cols-4 gap-2">
                      {TIME_SLOTS.map(t => (
                        <button key={t} disabled={TAKEN_SLOTS.includes(t)}
                          onClick={() => setBookTime(t)}
                          className={`time-slot ${TAKEN_SLOTS.includes(t) ? "taken" : ""} ${bookTime === t ? "selected" : ""}`}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Form */}
              <div className={`glass rounded-3xl p-7 ${bookingSection.inView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
                <h3 className="font-oswald text-xl font-bold mb-6 flex items-center gap-2">
                  <Icon name="ClipboardList" size={20} className="text-neon-blue" />
                  Ваши данные
                </h3>

                {bookDay && bookTime && (
                  <div className="mb-6 p-3 bg-neon-blue/10 border border-neon-blue/25 rounded-xl flex items-center gap-3">
                    <Icon name="CalendarCheck" size={18} className="text-neon-blue" />
                    <span className="text-sm text-white/80">
                      <span className="text-neon-blue font-semibold">{bookDay} {MONTHS[bookMonth]}</span> в <span className="text-neon-blue font-semibold">{bookTime}</span>
                    </span>
                  </div>
                )}

                <form onSubmit={handleBookSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5 font-medium">Ваше имя *</label>
                    <input required value={bookForm.name}
                      onChange={e => setBookForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Александр Иванов"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-neon-blue/50 focus:bg-neon-blue/5 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5 font-medium">Телефон *</label>
                    <input required value={bookForm.phone}
                      onChange={e => setBookForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+7 (___) ___-__-__"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-neon-blue/50 focus:bg-neon-blue/5 transition-all" />
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5 font-medium">Вид услуги</label>
                    <select value={bookForm.service}
                      onChange={e => setBookForm(f => ({ ...f, service: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-neon-blue/50 focus:bg-neon-blue/5 transition-all appearance-none">
                      <option value="" className="bg-[#1a2035]">Выберите услугу...</option>
                      {SERVICES.map(s => <option key={s.title} value={s.title} className="bg-[#1a2035]">{s.title}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-white/50 mb-1.5 font-medium">Комментарий</label>
                    <textarea value={bookForm.comment}
                      onChange={e => setBookForm(f => ({ ...f, comment: e.target.value }))}
                      placeholder="Опишите проблему или пожелания..."
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 focus:outline-none focus:border-neon-blue/50 focus:bg-neon-blue/5 transition-all resize-none" />
                  </div>
                  <button type="submit"
                    disabled={!bookDay || !bookTime}
                    className={`w-full py-4 rounded-xl font-oswald font-semibold tracking-wide text-sm transition-all duration-300 flex items-center justify-center gap-2
                      ${bookDay && bookTime ? "btn-primary" : "bg-white/5 text-white/25 cursor-not-allowed border border-white/10"}`}>
                    <Icon name="Send" size={16} />
                    {!bookDay ? "Сначала выберите дату" : !bookTime ? "Выберите время" : "Отправить заявку"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* CONTACTS */}
      <section id="contacts" ref={contactsSection.ref} className="py-24 relative">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-6">
          <div className={`mb-16 ${contactsSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="section-tag mb-4">Связаться</div>
            <h2 className="font-oswald text-4xl lg:text-5xl font-black">КОНТАКТЫ</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {[
              { icon: "Phone", title: "Телефон", value: "+7 (495) 123-45-67", sub: "Пн–Вс, 00:00–24:00", href: "tel:+74951234567" },
              { icon: "Mail", title: "Email", value: "info@techservice.ru", sub: "Ответим за 2 часа", href: "mailto:info@techservice.ru" },
              { icon: "MapPin", title: "Адрес", value: "Москва, ул. Тверская, 1", sub: "Головной офис", href: "#" },
              { icon: "MessageCircle", title: "Telegram", value: "@techservice_pro", sub: "Быстрая связь", href: "https://t.me/techservice_pro" },
            ].map((c, i) => (
              <a key={i} href={c.href}
                className={`card-service rounded-2xl p-6 block group ${contactsSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-11 h-11 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mb-4 group-hover:bg-neon-blue/20 transition-colors">
                  <Icon name={c.icon} size={20} className="text-neon-blue" />
                </div>
                <div className="text-white/40 text-xs uppercase tracking-widest mb-1">{c.title}</div>
                <div className="font-semibold text-sm mb-1">{c.value}</div>
                <div className="text-white/40 text-xs">{c.sub}</div>
              </a>
            ))}
          </div>

          <div className={`relative overflow-hidden rounded-3xl p-10 lg:p-14 ${contactsSection.inView ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}
            style={{ background: 'linear-gradient(135deg, rgba(0,200,255,0.12) 0%, rgba(57,255,20,0.06) 100%)', border: '1px solid rgba(0,200,255,0.2)' }}>
            <div className="absolute top-0 right-0 w-64 h-64 bg-neon-blue/10 rounded-full blur-[80px]" />
            <div className="relative flex flex-wrap items-center justify-between gap-8">
              <div>
                <h3 className="font-oswald text-3xl lg:text-4xl font-black mb-3">ГОТОВЫ НАЧАТЬ?</h3>
                <p className="text-white/55 max-w-md">
                  Оставьте заявку — мастер перезвонит в течение 30 минут и согласует удобное время выезда
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="#booking" className="btn-primary px-8 py-4 rounded-xl flex items-center gap-2">
                  <Icon name="CalendarCheck" size={18} />
                  Записаться онлайн
                </a>
                <a href="tel:+74951234567" className="btn-outline px-8 py-4 rounded-xl flex items-center gap-2">
                  <Icon name="Phone" size={18} />
                  Позвонить
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/8 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neon-blue flex items-center justify-center">
              <Icon name="Zap" size={14} className="text-[#0A0E17]" />
            </div>
            <span className="font-oswald font-bold tracking-wide">ТЕХСЕРВИС<span className="text-neon-blue">.</span>PRO</span>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-white/40">
            {navItems.map(n => (
              <a key={n.href} href={n.href} className="hover:text-white transition-colors">{n.label}</a>
            ))}
          </div>
          <div className="text-xs text-white/25">© 2026 ТехСервис.PRO. Все права защищены.</div>
        </div>
      </footer>
    </div>
  );
}