import { useState } from "react";
import Icon from "@/components/ui/icon";
import { Link } from "react-router-dom";
import { downloadCommercialOffer } from "@/lib/commercialOffer";
import func2url from "../../../backend/func2url.json";
import { formatPhone } from "@/lib/phoneMask";

interface OfferEmailDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function OfferEmailDialog({ open, onClose }: OfferEmailDialogProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  if (!open) return null;

  const reset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setStatus("idle");
    setErrorMsg("");
  };

  const handleClose = () => {
    if (loading) return;
    reset();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setStatus("error");
      setErrorMsg("Введите корректный email");
      return;
    }

    setLoading(true);
    setStatus("idle");
    setErrorMsg("");

    try {
      const res = await fetch(func2url["send-offer"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), phone: phone.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Не удалось отправить");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative w-full max-w-md bg-background border border-border rounded-2xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center text-foreground/60 hover:text-foreground transition-colors"
          aria-label="Закрыть"
        >
          <Icon name="X" size={18} />
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-neon-green/15 border border-neon-green/30 flex items-center justify-center mx-auto mb-4">
              <Icon name="MailCheck" size={26} className="text-neon-green" />
            </div>
            <h3 className="font-oswald text-2xl font-black mb-2">КП ОТПРАВЛЕНО!</h3>
            <p className="text-foreground/70 text-sm mb-5">
              Коммерческое предложение отправлено на <b>{email}</b>. Проверьте почту через 1–2 минуты, в том числе папку «Спам».
            </p>
            <button
              type="button"
              onClick={() => {
                downloadCommercialOffer();
                handleClose();
              }}
              className="btn-outline px-5 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 mx-auto mb-3"
            >
              <Icon name="Download" size={16} />
              Скачать копию сейчас
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="text-foreground/55 hover:text-foreground text-sm transition-colors"
            >
              Закрыть
            </button>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-neon-blue/15 border border-neon-blue/30 flex items-center justify-center mb-4">
              <Icon name="Mail" size={22} className="text-neon-blue" />
            </div>
            <h3 className="font-oswald text-2xl font-black mb-2">ПОЛУЧИТЬ КП НА EMAIL</h3>
            <p className="text-foreground/65 text-sm mb-5">
              Заполните форму — пришлём коммерческое предложение со всеми услугами и ценами на вашу почту
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-foreground/60 mb-1.5">Имя</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Как к вам обращаться"
                  className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border focus:border-neon-blue focus:outline-none transition-colors text-sm"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs text-foreground/60 mb-1.5">Email <span className="text-neon-blue">*</span></label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="example@mail.ru"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border focus:border-neon-blue focus:outline-none transition-colors text-sm"
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-xs text-foreground/60 mb-1.5">Телефон</label>
                <input
                  type="tel"
                  inputMode="tel"
                  value={phone}
                  onChange={(e) => setPhone(formatPhone(e.target.value))}
                  placeholder="+7 (___) ___-__-__"
                  className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border focus:border-neon-blue focus:outline-none transition-colors text-sm"
                  disabled={loading}
                />
              </div>

              {status === "error" && (
                <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
                  <Icon name="AlertCircle" size={14} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full px-6 py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Icon name="Loader2" size={18} className="animate-spin" />
                    Отправляем...
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={16} />
                    Отправить на почту
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  downloadCommercialOffer();
                  handleClose();
                }}
                className="w-full text-foreground/60 hover:text-foreground text-xs flex items-center justify-center gap-1.5 mt-2 transition-colors"
              >
                <Icon name="Download" size={13} />
                Или скачать PDF без email
              </button>

              <p className="text-[11px] text-foreground/45 leading-relaxed text-center mt-3">
                Нажимая «Отправить», вы соглашаетесь с{" "}
                <Link to="/privacy" className="text-neon-blue hover:underline">
                  обработкой персональных данных
                </Link>
              </p>
            </form>
          </>
        )}
      </div>
    </div>
  );
}