import { useEffect } from "react";
import { Link, useParams, Navigate } from "react-router-dom";
import Icon from "@/components/ui/icon";
import Navbar from "@/components/landing/Navbar";
import { getLanding } from "@/lib/seoPages";
import { SERVICES } from "@/components/landing/data";
import { useSeo, SITE } from "@/lib/useSeo";

export default function SeoLanding() {
  const { slug } = useParams<{ slug: string }>();
  const landing = getLanding(slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useSeo(
    landing
      ? {
          title: landing.title,
          description: landing.description,
          path: `/${landing.slug}`,
          keywords: landing.keywords,
          schema: [
            {
              "@context": "https://schema.org",
              "@type": "Service",
              name: landing.h1,
              description: landing.description,
              areaServed: { "@type": "City", name: "Тюмень" },
              provider: {
                "@type": "LocalBusiness",
                name: "Страйк Сервис",
                url: `${SITE}/`,
                telephone: "+79326240666",
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Тюмень",
                  addressCountry: "RU",
                },
              },
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: landing.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }
      : { title: "", description: "", path: "/" }
  );

  if (!landing) return <Navigate to="/" replace />;

  const related = (landing.related || [])
    .map((s) => SERVICES.find((x) => x.slug === s))
    .filter(Boolean);

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

          <div className="section-tag mb-5">
            <Icon name="MapPin" size={14} className="text-neon-blue" />
            г. Тюмень
          </div>
          <h1 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-black mb-6 leading-tight">
            {landing.h1}
          </h1>
          <p className="text-base sm:text-lg text-foreground/75 leading-relaxed mb-8">
            {landing.intro}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-2">
            <Link to="/#booking" className="btn-primary px-6 sm:px-8 py-3.5 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2">
              <Icon name="CalendarCheck" size={18} />
              Оставить заявку
            </Link>
            <a href="tel:+79326240666" className="btn-outline px-6 sm:px-8 py-3.5 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2">
              <Icon name="Phone" size={18} />
              +7 (932) 624-06-66
            </a>
          </div>
        </div>
      </section>

      <section className="py-10 sm:py-16 bg-muted/40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
          {landing.blocks.map((b, i) => (
            <div key={i}>
              <h2 className="font-oswald text-2xl sm:text-3xl font-black mb-3">{b.heading}</h2>
              <p className="text-foreground/75 text-sm sm:text-base leading-relaxed">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-10 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="section-tag mb-4">Вопрос-ответ</div>
          <h2 className="font-oswald text-2xl sm:text-3xl lg:text-4xl font-black mb-6 sm:mb-8">
            ЧАСТЫЕ <span className="text-neon-blue">ВОПРОСЫ</span>
          </h2>
          <div className="space-y-3">
            {landing.faq.map((f, i) => (
              <div key={i} className="p-5 rounded-xl bg-card border border-border">
                <h3 className="font-semibold text-base mb-2 flex items-start gap-2">
                  <Icon name="HelpCircle" size={18} className="text-neon-blue shrink-0 mt-0.5" />
                  {f.q}
                </h3>
                <p className="text-foreground/70 text-sm leading-relaxed pl-7">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-10 sm:py-16 bg-muted/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="section-tag mb-4">Услуги</div>
            <h2 className="font-oswald text-2xl sm:text-3xl font-black mb-6 sm:mb-8">
              СВЯЗАННЫЕ <span className="text-neon-blue">УСЛУГИ</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((s) => (
                <Link key={s!.slug} to={`/uslugi/${s!.slug}`} className="card-service rounded-2xl p-5 block group">
                  <div className="w-11 h-11 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center mb-3 group-hover:bg-neon-blue/20 transition-colors">
                    <Icon name={s!.icon} size={20} className="text-neon-blue" />
                  </div>
                  <h3 className="font-oswald text-base font-bold mb-1 group-hover:text-neon-blue transition-colors">{s!.title}</h3>
                  <div className="text-neon-green font-semibold text-sm">{s!.price}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
