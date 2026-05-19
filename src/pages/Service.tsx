import { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Navbar from "@/components/landing/Navbar";
import { SERVICES } from "@/components/landing/data";

export default function ServicePage() {
  const { slug } = useParams<{ slug: string }>();
  const service = SERVICES.find(s => s.slug === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!service) return;

    const priceMatch = service.price.match(/[\d\s]+/);
    const priceNumber = priceMatch ? priceMatch[0].replace(/\s/g, "") : "0";

    const schema = {
      "@context": "https://schema.org",
      "@type": "Service",
      "serviceType": service.title,
      "name": service.title,
      "description": service.long,
      "image": service.image,
      "url": `https://straikservis.ru/uslugi/${service.slug}`,
      "areaServed": {
        "@type": "City",
        "name": "Тюмень",
      },
      "provider": {
        "@type": "LocalBusiness",
        "name": "Страйк Сервис",
        "url": "https://straikservis.ru/",
        "telephone": "+79326240666",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Тюмень",
          "addressCountry": "RU",
        },
      },
      "offers": {
        "@type": "Offer",
        "price": priceNumber,
        "priceCurrency": "RUB",
        "availability": "https://schema.org/InStock",
        "url": `https://straikservis.ru/uslugi/${service.slug}`,
      },
    };

    const scriptEl = document.createElement("script");
    scriptEl.type = "application/ld+json";
    scriptEl.dataset.schema = "service";
    scriptEl.text = JSON.stringify(schema);
    document.head.appendChild(scriptEl);

    const prevTitle = document.title;
    document.title = `${service.title} в Тюмени — Страйк Сервис`;

    const metaDesc = document.querySelector('meta[name="description"]');
    const prevDesc = metaDesc?.getAttribute("content") || "";
    if (metaDesc) metaDesc.setAttribute("content", service.desc);

    const canonical = document.querySelector('link[rel="canonical"]');
    const prevCanonical = canonical?.getAttribute("href") || "";
    if (canonical) canonical.setAttribute("href", `https://straikservis.ru/uslugi/${service.slug}`);

    return () => {
      const el = document.querySelector('script[data-schema="service"]');
      if (el) el.remove();
      document.title = prevTitle;
      if (metaDesc && prevDesc) metaDesc.setAttribute("content", prevDesc);
      if (canonical && prevCanonical) canonical.setAttribute("href", prevCanonical);
    };
  }, [service]);

  if (!service) return <Navigate to="/" replace />;

  const otherServices = SERVICES.filter(s => s.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      <section className="relative pt-28 sm:pt-32 pb-12 sm:pb-16 overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-neon-blue/5 rounded-full blur-[120px]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-neon-blue transition-colors mb-6">
            <Icon name="ArrowLeft" size={16} />
            На главную
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="animate-fade-in-up">
              <div className="section-tag mb-5">
                <Icon name={service.icon} size={14} className="text-neon-blue" />
                Услуга
              </div>
              <h1 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-black mb-5 leading-tight">
                {service.title}
              </h1>
              <p className="text-base sm:text-lg text-foreground/70 leading-relaxed mb-8">
                {service.long}
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="px-5 py-3 rounded-xl bg-neon-green/10 border border-neon-green/30">
                  <div className="text-xs text-foreground/55 uppercase tracking-wider mb-0.5">Стоимость</div>
                  <div className="font-oswald text-xl sm:text-2xl font-black text-neon-green">{service.price}</div>
                </div>
                <div className="px-5 py-3 rounded-xl bg-neon-blue/10 border border-neon-blue/30">
                  <div className="text-xs text-foreground/55 uppercase tracking-wider mb-0.5">Выезд</div>
                  <div className="font-oswald text-xl sm:text-2xl font-black text-neon-blue">за 2 часа</div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/#booking" className="btn-primary px-6 sm:px-8 py-3.5 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2">
                  <Icon name="CalendarCheck" size={18} />
                  Записаться на услугу
                </Link>
                <a href="tel:+79326240666" className="btn-outline px-6 sm:px-8 py-3.5 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2">
                  <Icon name="Phone" size={18} />
                  Позвонить
                </a>
              </div>
            </div>

            <div className="relative animate-fade-in-up delay-200">
              <div className="absolute -inset-4 bg-neon-blue/10 rounded-3xl blur-xl" />
              <img src={service.image} alt={service.title} className="relative rounded-3xl w-full h-64 sm:h-96 lg:h-[500px] object-cover border border-neon-blue/20" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div>
              <div className="section-tag mb-4">Преимущества</div>
              <h2 className="font-oswald text-2xl sm:text-3xl lg:text-4xl font-black mb-6 sm:mb-8">
                ПОЧЕМУ ВЫБИРАЮТ <span className="text-neon-blue">НАС</span>
              </h2>
              <div className="space-y-3">
                {service.benefits.map((b, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-neon-green/15 border border-neon-green/30 flex items-center justify-center">
                      <Icon name="Check" size={16} className="text-neon-green" />
                    </div>
                    <span className="text-foreground/85 text-sm sm:text-base pt-1.5">{b}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="section-tag mb-4">Что входит</div>
              <h2 className="font-oswald text-2xl sm:text-3xl lg:text-4xl font-black mb-6 sm:mb-8">
                ЭТАПЫ <span className="text-neon-blue">РАБОТ</span>
              </h2>
              <div className="space-y-3">
                {service.works.map((w, i) => (
                  <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-background border border-border">
                    <div className="w-9 h-9 shrink-0 rounded-lg bg-neon-blue/15 border border-neon-blue/30 flex items-center justify-center font-oswald font-bold text-neon-blue text-sm">
                      {i + 1}
                    </div>
                    <span className="text-foreground/85 text-sm sm:text-base pt-1.5">{w}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="section-tag mb-4">Галерея</div>
          <h2 className="font-oswald text-2xl sm:text-3xl lg:text-4xl font-black mb-8 sm:mb-10">
            НАШИ <span className="text-neon-blue">РАБОТЫ</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {service.gallery.map((src, i) => (
              <div key={i} className="relative overflow-hidden rounded-2xl border border-border group">
                <img src={src} alt={`${service.title} ${i + 1}`} className="w-full h-64 sm:h-80 object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-20 bg-muted/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 lg:p-14"
            style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0f766e 60%, #115e59 100%)', boxShadow: '0 30px 80px -20px rgba(13,148,136,0.55)' }}>
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-[100px]" />
            <div className="absolute inset-0 grid-pattern opacity-15" />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h3 className="font-oswald text-2xl sm:text-3xl lg:text-4xl font-black mb-3 text-white">НУЖНА ЭТА УСЛУГА?</h3>
                <p className="text-white/85 max-w-md text-sm sm:text-base">
                  Оставьте заявку — мастер перезвонит в течение 30 минут и согласует удобное время
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Link to="/#booking" className="bg-white text-[#0f766e] hover:bg-white/95 px-6 sm:px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-oswald font-semibold uppercase tracking-wider text-sm transition-all hover:-translate-y-0.5">
                  <Icon name="CalendarCheck" size={18} />
                  Записаться
                </Link>
                <a href="tel:+79326240666" className="border-2 border-white/60 text-white hover:bg-white/10 px-6 sm:px-8 py-3.5 rounded-xl flex items-center justify-center gap-2 font-oswald font-semibold uppercase tracking-wider text-sm transition-all hover:-translate-y-0.5">
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
          <div className="section-tag mb-4">Другие услуги</div>
          <h2 className="font-oswald text-2xl sm:text-3xl lg:text-4xl font-black mb-8 sm:mb-10">
            СМОТРИТЕ <span className="text-neon-blue">ТАКЖЕ</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {otherServices.map((s, i) => (
              <Link to={`/uslugi/${s.slug}`} key={i} className="card-service rounded-2xl p-5 sm:p-7 block group">
                <div className="w-12 h-12 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mb-5 group-hover:bg-neon-blue/20 transition-colors">
                  <Icon name={s.icon} size={22} className="text-neon-blue" />
                </div>
                <h3 className="font-oswald text-lg sm:text-xl font-bold mb-3 group-hover:text-neon-blue transition-colors">{s.title}</h3>
                <p className="text-foreground/65 text-sm leading-relaxed mb-6">{s.desc}</p>
                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <span className="text-neon-green font-semibold text-sm">{s.price}</span>
                  <span className="text-neon-blue/70 text-xs flex items-center gap-1">
                    Подробнее <Icon name="ArrowRight" size={12} />
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