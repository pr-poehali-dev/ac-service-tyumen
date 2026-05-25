import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import MaxIcon from "@/components/ui/max-icon";
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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5 mb-10 sm:mb-12">
            {[
              { icon: "Phone", title: "Телефон", value: "+7 (932) 624-06-66", sub: "Пн–Вс, 00:00–24:00", href: "tel:+79326240666" },
              { icon: "Mail", title: "Email", value: "Straikpro72.tmn@yandex.ru", sub: "Ответим за 2 часа", href: "mailto:Straikpro72.tmn@yandex.ru" },
              { icon: "MapPin", title: "Адрес", value: "г. Тюмень, ул. Широтная, 165 к.3", sub: "Головной офис", href: "https://yandex.ru/maps/?text=%D0%B3.%20%D0%A2%D1%8E%D0%BC%D0%B5%D0%BD%D1%8C%2C%20%D1%83%D0%BB.%20%D0%A8%D0%B8%D1%80%D0%BE%D1%82%D0%BD%D0%B0%D1%8F%2C%20165%20%D0%BA.3" },
              { icon: "MessageCircle", title: "Telegram", value: "@Semeon72", sub: "Быстрая связь", href: "https://t.me/Semeon72" },
              { icon: "max", title: "MAX", value: "+7 (932) 624-06-66", sub: "Российский мессенджер", href: "https://web.max.ru/-71788242076399" },
            ].map((c, i) => (
              <a key={i} href={c.href}
                target={c.href.startsWith("http") ? "_blank" : undefined}
                rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className={`card-service rounded-2xl p-5 sm:p-6 block group ${contactsSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}
                style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="w-11 h-11 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mb-4 group-hover:bg-neon-blue/20 transition-colors">
                  {c.icon === "max" ? (
                    <MaxIcon size={22} />
                  ) : (
                    <Icon name={c.icon} size={20} className="text-neon-blue" />
                  )}
                </div>
                <div className="text-foreground/50 text-xs uppercase tracking-widest mb-1">{c.title}</div>
                <div className="font-semibold text-sm mb-1 break-all">{c.value}</div>
                <div className="text-foreground/50 text-xs">{c.sub}</div>
              </a>
            ))}
          </div>

          <div
            itemScope
            itemType="https://schema.org/LocalBusiness"
            className={`mb-10 sm:mb-12 rounded-3xl overflow-hidden border border-border ${contactsSection.inView ? 'animate-fade-in-up delay-300' : 'opacity-0'}`}
          >
            <meta itemProp="name" content="Страйк Сервис" />
            <meta itemProp="description" content="Обслуживание, монтаж и ремонт кондиционеров и систем вентиляции в Тюмени. Выезд за 2 часа, гарантия на все работы." />
            <meta itemProp="image" content="https://cdn.poehali.dev/projects/1ca52ef0-91c2-41c6-b9e5-c074d8171504/files/9d752c0a-3126-44f4-a2c7-ff8ccba804b5.jpg" />
            <meta itemProp="url" content="https://strike-service.ru" />
            <meta itemProp="telephone" content="+7 (932) 624-06-66" />
            <meta itemProp="email" content="Straikpro72.tmn@yandex.ru" />
            <meta itemProp="priceRange" content="₽₽" />
            <meta itemProp="sameAs" content="https://t.me/Semeon72" />
            <meta itemProp="sameAs" content="https://web.max.ru/-71788242076399" />
            <meta itemProp="legalName" content='ООО "Страйк Сервис"' />
            <meta itemProp="taxID" content="7203487449" />
            <meta itemProp="vatID" content="7203487449" />
            <meta itemProp="iso6523Code" content="0211:7203487449" />
            <meta itemProp="identifier" content="ОГРН: 1197232021832" />
            <div itemProp="address" itemScope itemType="https://schema.org/PostalAddress" className="sr-only">
              <span itemProp="streetAddress">ул. Широтная, 165 к.3</span>
              <span itemProp="addressLocality">Тюмень</span>
              <span itemProp="addressRegion">Тюменская область</span>
              <span itemProp="postalCode">625049</span>
              <span itemProp="addressCountry">RU</span>
            </div>
            <div itemProp="geo" itemScope itemType="https://schema.org/GeoCoordinates" className="sr-only">
              <meta itemProp="latitude" content="57.156" />
              <meta itemProp="longitude" content="65.638" />
            </div>
            <div itemProp="openingHoursSpecification" itemScope itemType="https://schema.org/OpeningHoursSpecification" className="sr-only">
              <meta itemProp="dayOfWeek" content="Monday Tuesday Wednesday Thursday Friday Saturday Sunday" />
              <meta itemProp="opens" content="00:00" />
              <meta itemProp="closes" content="23:59" />
            </div>
            <meta itemProp="areaServed" content="Тюмень, Тюменская область" />
            <iframe
              title="Страйк Сервис — г. Тюмень, ул. Широтная, 165 к.3"
              src="https://yandex.ru/map-widget/v1/?ll=65.638%2C57.156&mode=search&text=%D0%B3.%20%D0%A2%D1%8E%D0%BC%D0%B5%D0%BD%D1%8C%2C%20%D1%83%D0%BB.%20%D0%A8%D0%B8%D1%80%D0%BE%D1%82%D0%BD%D0%B0%D1%8F%2C%20165%20%D0%BA.3&z=16"
              width="100%"
              height="400"
              frameBorder="0"
              allowFullScreen
              loading="lazy"
              className="block w-full h-[320px] sm:h-[400px]"
            />
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
                <a href="tel:+79326240666" className="border-2 border-white/60 text-white hover:bg-white/10 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl flex items-center justify-center gap-2 font-oswald font-semibold uppercase tracking-wider text-sm transition-all hover:-translate-y-0.5">
                  <Icon name="Phone" size={18} />
                  Позвонить
                </a>
              </div>
              <p className="text-white/65 text-xs leading-relaxed max-w-md lg:basis-full">
                Нажимая «Записаться онлайн» или «Позвонить», вы соглашаетесь с{" "}
                <Link to="/privacy" className="text-white underline hover:text-white/85">
                  обработкой персональных данных
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-5 sm:gap-6">
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
              <Link to="/privacy" className="hover:text-foreground transition-colors">Согласие на обработку ПД</Link>
            </div>
            <div className="text-xs text-foreground/40">© 2026 Страйк Сервис. Все права защищены.</div>
          </div>

          <div className="border-t border-border/60 pt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs sm:text-sm text-foreground/55">
              <div>
                <div className="text-foreground/40 text-[10px] uppercase tracking-widest mb-1">Юр. лицо</div>
                <div className="text-foreground/80 font-medium">ООО «Страйк Сервис»</div>
              </div>
              <div>
                <div className="text-foreground/40 text-[10px] uppercase tracking-widest mb-1">ИНН / КПП</div>
                <div className="text-foreground/80 font-medium">7203487449 / 720301001</div>
              </div>
              <div>
                <div className="text-foreground/40 text-[10px] uppercase tracking-widest mb-1">ОГРН</div>
                <div className="text-foreground/80 font-medium">1197232021832</div>
              </div>
              <div>
                <div className="text-foreground/40 text-[10px] uppercase tracking-widest mb-1">Лицензия</div>
                <div className="text-foreground/80 font-medium break-words">72.ОЦ.04.003.Л.000033.04.26</div>
                <div className="text-foreground/45 text-[11px] mt-0.5 break-words">ЕРУЛ № Л064-00111-72/04921336</div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}