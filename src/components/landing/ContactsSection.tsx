import Icon from "@/components/ui/icon";
import { useInView } from "./useInView";
import { NAV_ITEMS } from "./data";

export default function ContactsSection() {
  const contactsSection = useInView(0.1);

  return (
    <>
      {/* CONTACTS */}
      <section id="contacts" ref={contactsSection.ref} className="py-16 sm:py-24 relative">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`mb-10 sm:mb-16 ${contactsSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
            <div className="section-tag mb-4">Связаться</div>
            <h2 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-black">КОНТАКТЫ</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-10 sm:mb-12">
            {[
              { icon: "Phone", title: "Телефон", value: "+7 (495) 123-45-67", sub: "Пн–Вс, 00:00–24:00", href: "tel:+74951234567" },
              { icon: "Mail", title: "Email", value: "info@techservice.ru", sub: "Ответим за 2 часа", href: "mailto:info@techservice.ru" },
              { icon: "MapPin", title: "Адрес", value: "Тюмень, ул. Республики, 1", sub: "Головной офис", href: "#" },
              { icon: "MessageCircle", title: "Telegram", value: "@techservice_pro", sub: "Быстрая связь", href: "https://t.me/techservice_pro" },
            ].map((c, i) => (
              <a key={i} href={c.href}
                className={`card-service rounded-2xl p-5 sm:p-6 block group ${contactsSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-11 h-11 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mb-4 group-hover:bg-neon-blue/20 transition-colors">
                  <Icon name={c.icon} size={20} className="text-neon-blue" />
                </div>
                <div className="text-foreground/50 text-xs uppercase tracking-widest mb-1">{c.title}</div>
                <div className="font-semibold text-sm mb-1">{c.value}</div>
                <div className="text-foreground/50 text-xs">{c.sub}</div>
              </a>
            ))}
          </div>

          <div className={`relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-14 ${contactsSection.inView ? 'animate-fade-in-up delay-400' : 'opacity-0'}`}
            style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 60%, #115e59 100%)', boxShadow: '0 30px 80px -20px rgba(13,148,136,0.55)' }}>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-white/5 rounded-full blur-[90px]" />
            <div className="absolute inset-0 grid-pattern opacity-15" />
            <div className="relative flex flex-col lg:flex-row lg:flex-wrap lg:items-center lg:justify-between gap-6 lg:gap-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/25 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-[0.15em] mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  Свободные слоты сегодня
                </div>
                <h3 className="font-oswald text-2xl sm:text-3xl lg:text-5xl font-black mb-3 text-white">ГОТОВЫ НАЧАТЬ?</h3>
                <p className="text-white/85 max-w-md text-sm sm:text-base lg:text-lg">
                  Оставьте заявку — мастер перезвонит в течение 30 минут и согласует удобное время выезда
                </p>
              </div>
              <div className="flex flex-col sm:flex-row flex-wrap gap-3 w-full sm:w-auto">
                <a href="#booking" className="bg-white text-[#0f766e] hover:bg-white/95 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 font-oswald font-semibold uppercase tracking-wider text-sm transition-all hover:-translate-y-0.5 hover:shadow-2xl">
                  <Icon name="CalendarCheck" size={18} />
                  Записаться онлайн
                </a>
                <a href="tel:+74951234567" className="border-2 border-white/60 text-white hover:bg-white/10 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 font-oswald font-semibold uppercase tracking-wider text-sm transition-all hover:-translate-y-0.5">
                  <Icon name="Phone" size={18} />
                  Позвонить
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-5 sm:gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neon-blue flex items-center justify-center">
              <Icon name="Zap" size={14} className="text-white" />
            </div>
            <span className="font-oswald font-bold tracking-wide">СТРАЙК<span className="text-neon-blue"> </span>СЕРВИС</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 sm:gap-6 text-xs sm:text-sm text-foreground/55">
            {NAV_ITEMS.map(n => (
              <a key={n.href} href={n.href} className="hover:text-foreground transition-colors">{n.label}</a>
            ))}
          </div>
          <div className="text-xs text-foreground/40">© 2026 Страйк Сервис. Все права защищены.</div>
        </div>
      </footer>
    </>
  );
}