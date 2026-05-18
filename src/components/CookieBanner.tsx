import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";

const STORAGE_KEY = "cookie_consent_v1";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!localStorage.getItem(STORAGE_KEY)) setVisible(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-3 left-3 right-3 sm:bottom-5 sm:left-5 sm:right-5 z-[100] flex justify-center pointer-events-none animate-fade-in-up">
      <div className="pointer-events-auto max-w-3xl w-full bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5">
        <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center flex-shrink-0">
          <Icon name="Cookie" size={20} className="text-neon-blue" />
        </div>
        <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed flex-1">
          Мы используем cookie для улучшения работы сайта. Продолжая пользоваться сайтом, вы соглашаетесь с{" "}
          <Link to="/privacy" className="text-neon-blue hover:underline">
            обработкой персональных данных
          </Link>
          .
        </p>
        <button
          onClick={accept}
          className="btn-primary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap w-full sm:w-auto"
        >
          Принять
        </button>
      </div>
    </div>
  );
}
