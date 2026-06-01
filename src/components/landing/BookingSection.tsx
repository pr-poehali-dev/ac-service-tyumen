import { useState } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import { useInView } from "./useInView";
import { SERVICES, MONTHS, TIME_SLOTS, TAKEN_SLOTS } from "./data";
import func2url from "../../../backend/func2url.json";
import { formatPhone, isPhoneValid } from "@/lib/phoneMask";
import { reachGoal } from "@/lib/metrika";

export default function BookingSection() {
  const bookingSection = useInView(0.1);

  const [bookMonth, setBookMonth] = useState(new Date().getMonth());
  const [bookYear, setBookYear] = useState(new Date().getFullYear());
  const [bookDay, setBookDay] = useState<number | null>(null);
  const [bookTime, setBookTime] = useState<string | null>(null);
  const [bookForm, setBookForm] = useState({ name: "", phone: "", service: "", comment: "" });
  const [bookAgree, setBookAgree] = useState(false);
  const [bookSent, setBookSent] = useState(false);
  const [bookLoading, setBookLoading] = useState(false);
  const [bookError, setBookError] = useState("");

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

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bookLoading) return;

    setBookLoading(true);
    setBookError("");

    const dateStr = bookDay ? `${bookDay} ${MONTHS[bookMonth]} ${bookYear}` : "";

    try {
      const res = await fetch(func2url["booking"], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bookForm.name.trim(),
          phone: bookForm.phone.trim(),
          service: bookForm.service,
          comment: bookForm.comment.trim(),
          date: dateStr,
          time: bookTime || "",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Не удалось отправить заявку");
      }
      setBookSent(true);
      reachGoal("booking_sent", { service: bookForm.service || "не указана" });
    } catch (err) {
      setBookError(err instanceof Error ? err.message : "Ошибка отправки");
    } finally {
      setBookLoading(false);
    }
  };

  return (
    <section id="booking" ref={bookingSection.ref} className="py-16 sm:py-24 bg-muted/40 relative overflow-hidden">
      <div className="absolute inset-0 opacity-15">
        <img src="https://cdn.poehali.dev/projects/1ca52ef0-91c2-41c6-b9e5-c074d8171504/files/a85d0d06-15be-4de1-8f7a-964f7ba2c076.jpg" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/70 to-background" />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
        <div className={`mb-10 sm:mb-16 text-center ${bookingSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
          <div className="section-tag mb-4 mx-auto w-fit">Онлайн-запись</div>
          <h2 className="font-oswald text-3xl sm:text-4xl lg:text-5xl font-black mb-4">
            ЗАПИСЬ НА <span className="text-neon-blue">ОБСЛУЖИВАНИЕ</span>
          </h2>
          <p className="text-foreground/60 max-w-lg mx-auto text-sm sm:text-base">Выберите удобную дату и время — мастер приедет точно в срок</p>
        </div>

        {bookSent ? (
          <div className="max-w-lg mx-auto text-center glass rounded-3xl p-6 sm:p-12">
            <div className="w-20 h-20 rounded-full bg-neon-green/15 border border-neon-green/40 flex items-center justify-center mx-auto mb-6 glow-green">
              <Icon name="CheckCircle" size={36} className="text-neon-green" />
            </div>
            <h3 className="font-oswald text-2xl font-bold mb-3">Заявка принята!</h3>
            <p className="text-foreground/65 mb-2">Мы перезвоним вам в течение 30 минут для подтверждения.</p>
            {bookDay && bookTime && (
              <div className="mt-6 p-4 bg-neon-blue/10 border border-neon-blue/20 rounded-xl">
                <div className="text-neon-blue font-semibold">
                  {bookDay} {MONTHS[bookMonth]} {bookYear}, {bookTime}
                </div>
              </div>
            )}
            <button onClick={() => { setBookSent(false); setBookDay(null); setBookTime(null); setBookForm({ name: "", phone: "", service: "", comment: "" }); setBookAgree(false); setBookError(""); }}
              className="btn-outline mt-6 px-6 py-2.5 rounded-xl text-sm">
              Записаться снова
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
            {/* Calendar */}
            <div className={`glass rounded-3xl p-4 sm:p-7 ${bookingSection.inView ? 'animate-fade-in-up' : 'opacity-0'}`}>
              <h3 className="font-oswald text-xl font-bold mb-6 flex items-center gap-2">
                <Icon name="Calendar" size={20} className="text-neon-blue" />
                Выберите дату
              </h3>

              <div className="flex items-center justify-between mb-5">
                <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <Icon name="ChevronLeft" size={18} className="text-foreground/70" />
                </button>
                <span className="font-oswald font-semibold text-lg">{MONTHS[bookMonth]} {bookYear}</span>
                <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <Icon name="ChevronRight" size={18} className="text-foreground/70" />
                </button>
              </div>

              <div className="grid grid-cols-7 mb-2">
                {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(d => (
                  <div key={d} className="text-center text-xs text-foreground/50 font-semibold py-2">{d}</div>
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
                  <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-foreground/85">
                    <Icon name="Clock" size={15} className="text-neon-blue" />
                    Доступное время — {bookDay} {MONTHS[bookMonth]}
                  </h4>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
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
            <div className={`glass rounded-3xl p-4 sm:p-7 ${bookingSection.inView ? 'animate-fade-in-up delay-200' : 'opacity-0'}`}>
              <h3 className="font-oswald text-xl font-bold mb-6 flex items-center gap-2">
                <Icon name="ClipboardList" size={20} className="text-neon-blue" />
                Ваши данные
              </h3>

              {bookDay && bookTime && (
                <div className="mb-6 p-3 bg-neon-blue/10 border border-neon-blue/25 rounded-xl flex items-center gap-3">
                  <Icon name="CalendarCheck" size={18} className="text-neon-blue" />
                  <span className="text-sm text-foreground/85">
                    <span className="text-neon-blue font-semibold">{bookDay} {MONTHS[bookMonth]}</span> в <span className="text-neon-blue font-semibold">{bookTime}</span>
                  </span>
                </div>
              )}

              <form onSubmit={handleBookSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-foreground/60 mb-1.5 font-medium">Ваше имя *</label>
                  <input required value={bookForm.name}
                    onChange={e => setBookForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Александр Иванов"
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/35 focus:outline-none focus:border-neon-blue/60 focus:bg-neon-blue/5 transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-foreground/60 mb-1.5 font-medium">Телефон *</label>
                  <input required value={bookForm.phone}
                    onChange={e => setBookForm(f => ({ ...f, phone: formatPhone(e.target.value) }))}
                    type="tel"
                    inputMode="tel"
                    placeholder="+7 (___) ___-__-__"
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/35 focus:outline-none focus:border-neon-blue/60 focus:bg-neon-blue/5 transition-all" />
                </div>
                <div>
                  <label className="block text-xs text-foreground/60 mb-1.5 font-medium">Вид услуги</label>
                  <select value={bookForm.service}
                    onChange={e => setBookForm(f => ({ ...f, service: e.target.value }))}
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-neon-blue/60 focus:bg-neon-blue/5 transition-all appearance-none">
                    <option value="">Выберите услугу...</option>
                    {SERVICES.map(s => <option key={s.title} value={s.title}>{s.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-foreground/60 mb-1.5 font-medium">Комментарий</label>
                  <textarea value={bookForm.comment}
                    onChange={e => setBookForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Опишите проблему или пожелания..."
                    rows={3}
                    className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder-foreground/35 focus:outline-none focus:border-neon-blue/60 focus:bg-neon-blue/5 transition-all resize-none" />
                </div>
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    required
                    checked={bookAgree}
                    onChange={e => setBookAgree(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-border accent-neon-blue cursor-pointer flex-shrink-0"
                  />
                  <span className="text-xs text-foreground/65 leading-relaxed">
                    Я даю согласие на обработку персональных данных в соответствии с{" "}
                    <Link to="/privacy" target="_blank" className="text-neon-blue hover:underline">
                      Федеральным законом от 27.07.2006 № 152-ФЗ «О персональных данных»
                    </Link>
                  </span>
                </label>
                {bookError && (
                  <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-start gap-2">
                    <Icon name="AlertCircle" size={14} className="shrink-0 mt-0.5" />
                    <span>{bookError}</span>
                  </div>
                )}
                <button type="submit"
                  disabled={!bookDay || !bookTime || !bookAgree || !isPhoneValid(bookForm.phone) || !bookForm.name.trim() || bookLoading}
                  className={`w-full py-3 sm:py-4 rounded-xl font-oswald font-semibold tracking-wide text-sm transition-all duration-300 flex items-center justify-center gap-2
                    ${bookDay && bookTime && bookAgree && isPhoneValid(bookForm.phone) && bookForm.name.trim() && !bookLoading ? "btn-primary" : "bg-muted text-foreground/35 cursor-not-allowed border border-border"}`}>
                  {bookLoading ? (
                    <>
                      <Icon name="Loader2" size={16} className="animate-spin" />
                      Отправляем...
                    </>
                  ) : (
                    <>
                      <Icon name="Send" size={16} />
                      {!bookDay ? "Сначала выберите дату" : !bookTime ? "Выберите время" : !bookForm.name.trim() ? "Введите имя" : !isPhoneValid(bookForm.phone) ? "Введите телефон полностью" : !bookAgree ? "Подтвердите согласие" : "Отправить заявку"}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}