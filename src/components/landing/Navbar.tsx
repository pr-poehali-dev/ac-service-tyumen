import { useState } from "react";
import Icon from "@/components/ui/icon";
import { NAV_ITEMS } from "./data";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-neon-blue flex items-center justify-center glow-blue">
            <Icon name="Zap" size={16} className="text-[#0A0E17]" />
          </div>
          <span className="font-oswald font-bold text-lg tracking-wide">СТРАЙК<span className="text-neon-blue"> </span>СЕРВИС</span>
        </a>

        <nav className="hidden lg:flex items-center gap-8">
          {NAV_ITEMS.map(n => (
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
          {NAV_ITEMS.map(n => (
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
  );
}