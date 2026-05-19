import { useState, useEffect } from "react";
import Icon from "@/components/ui/icon";
import MaxIcon from "@/components/ui/max-icon";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[90] flex flex-col items-end gap-3">
      {open && (
        <div className="flex flex-col gap-2.5 animate-fade-in-up">
          <a
            href="https://max.ru/79326240666"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-full bg-card border border-border shadow-xl hover:border-amber-400/50 hover:-translate-x-1 transition-all group"
          >
            <div className="w-9 h-9 rounded-full flex items-center justify-center">
              <MaxIcon size={28} />
            </div>
            <span className="text-sm font-semibold whitespace-nowrap pr-1">MAX</span>
          </a>

          <a
            href="https://t.me/Semeon72"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-full bg-card border border-border shadow-xl hover:border-neon-blue/50 hover:-translate-x-1 transition-all group"
          >
            <div className="w-9 h-9 rounded-full bg-neon-blue/15 border border-neon-blue/30 flex items-center justify-center">
              <Icon name="Send" size={16} className="text-neon-blue" />
            </div>
            <span className="text-sm font-semibold whitespace-nowrap pr-1">Telegram</span>
          </a>

          <a
            href="tel:+79326240666"
            className="flex items-center gap-3 pl-3 pr-4 py-2.5 rounded-full bg-card border border-border shadow-xl hover:border-emerald-500/50 hover:-translate-x-1 transition-all group"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Icon name="Phone" size={16} className="text-emerald-500" />
            </div>
            <span className="text-sm font-semibold whitespace-nowrap pr-1">Позвонить</span>
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Закрыть меню связи" : "Связаться с нами"}
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        style={{
          background: open
            ? "linear-gradient(135deg, #475569 0%, #334155 100%)"
            : "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
          boxShadow: open
            ? "0 12px 30px -6px rgba(15,23,42,0.5)"
            : "0 14px 30px -6px rgba(14,165,233,0.55)",
        }}
      >
        {!open && (
          <span className="absolute inset-0 rounded-full bg-neon-blue/40 animate-ping" />
        )}
        <Icon
          name={open ? "X" : "MessageCircle"}
          size={open ? 22 : 26}
          className="relative text-white"
        />
        {!open && (
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background animate-pulse" />
        )}
      </button>
    </div>
  );
}
