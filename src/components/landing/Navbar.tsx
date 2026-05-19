import { useState } from "react";
import Icon from "@/components/ui/icon";
import { NAV_ITEMS } from "./data";
import OfferEmailDialog from "./OfferEmailDialog";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [offerOpen, setOfferOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <a href="#hero" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neon-blue flex items-center justify-center glow-blue">
            <Icon name="Zap" size={16} className="text-white" />
          </div>
          <span className="font-oswald font-bold text-base sm:text-lg tracking-wide whitespace-nowrap">СТРАЙК<span className="text-neon-blue"> </span>СЕРВИС</span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map(n => (
            <a key={n.href} href={n.href} className="nav-link">{n.label}</a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a href="tel:+74951234567" className="hidden md:flex items-center gap-2 text-sm text-foreground/70 hover:text-neon-blue transition-colors">+7 932 624 06 66</a>
          <a href="tel:+74951234567" className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg bg-neon-blue/10 text-neon-blue">
            <Icon name="Phone" size={16} />
          </a>
          <button
            type="button"
            onClick={() => setOfferOpen(true)}
            className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm text-foreground/75 hover:text-neon-blue border border-border hover:border-neon-blue/50 transition-colors"
            title="Получить коммерческое предложение"
          >
            <Icon name="FileText" size={15} />
            Получить КП
          </button>
          <a href="#booking" className="btn-primary px-5 py-2 rounded-lg text-sm hidden sm:block">
            Записаться
          </a>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden p-2 text-foreground/75" aria-label="Меню">
            <Icon name={mobileOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden glass border-t border-border px-4 sm:px-6 py-4 space-y-2">
          {NAV_ITEMS.map(n => (
            <a key={n.href} href={n.href} onClick={() => setMobileOpen(false)}
              className="block py-2.5 text-foreground/75 hover:text-foreground transition-colors font-medium">
              {n.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => { setMobileOpen(false); setOfferOpen(true); }}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-lg mt-3 border border-border text-foreground/85 hover:border-neon-blue/50 hover:text-neon-blue transition-colors"
          >
            <Icon name="FileText" size={16} />
            Получить коммерческое предложение
          </button>
          <a href="#booking" onClick={() => setMobileOpen(false)}
            className="btn-primary block text-center px-5 py-3 rounded-lg mt-2">
            Записаться на обслуживание
          </a>
        </div>
      )}
      <OfferEmailDialog open={offerOpen} onClose={() => setOfferOpen(false)} />
    </header>
  );
}