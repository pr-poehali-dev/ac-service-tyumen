import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/icon";
import func2url from "../../backend/func2url.json";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Новая", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  in_progress: { label: "В работе", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  done: { label: "Выполнена", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  rejected: { label: "Отклонена", color: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
};

interface Booking {
  id: number;
  name: string;
  phone: string;
  service: string;
  comment: string;
  date: string;
  time: string;
  status: string;
  source: string;
  created_at: string;
  email_status: string;
  email_error: string;
}

const EMAIL_STATUS_CONF: Record<string, { label: string; icon: string; color: string; tip: string }> = {
  sent: { label: "Письмо отправлено", icon: "MailCheck", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", tip: "Уведомление успешно ушло на почту менеджеру" },
  pending: { label: "Письмо в обработке", icon: "Mail", color: "text-foreground/60 border-border bg-muted/40", tip: "Статус ещё не обновился" },
  failed: { label: "Письмо не отправлено", icon: "MailX", color: "text-rose-400 border-rose-500/30 bg-rose-500/10", tip: "Ошибка при отправке" },
  not_configured: { label: "Почта не настроена", icon: "MailWarning", color: "text-amber-400 border-amber-500/30 bg-amber-500/10", tip: "Нужно добавить ключи SENDGRID_API_KEY и SENDGRID_FROM_EMAIL в настройки проекта" },
};

const PWD_KEY = "strike_admin_pwd";

export default function AdminPage() {
  const [password, setPassword] = useState<string>(() => localStorage.getItem(PWD_KEY) || "");
  const [authed, setAuthed] = useState(false);
  const [inputPwd, setInputPwd] = useState("");
  const [loginError, setLoginError] = useState("");
  const [items, setItems] = useState<Booking[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("");

  const url = func2url["admin-bookings"];

  const load = useCallback(async (pwd: string, statusFilter: string) => {
    setLoading(true);
    setError("");
    try {
      const q = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : "";
      const res = await fetch(url + q, {
        headers: { "X-Admin-Password": pwd },
      });
      if (res.status === 401) {
        localStorage.removeItem(PWD_KEY);
        setAuthed(false);
        setPassword("");
        setLoginError("Неверный пароль");
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      setItems(data.items || []);
      setCounts(data.counts || {});
      setAuthed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (password) load(password, filter);
  }, [password, filter, load]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    localStorage.setItem(PWD_KEY, inputPwd);
    setPassword(inputPwd);
  };

  const handleLogout = () => {
    localStorage.removeItem(PWD_KEY);
    setPassword("");
    setAuthed(false);
    setItems([]);
    setInputPwd("");
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Password": password },
        body: JSON.stringify({ action: "update_status", id, status }),
      });
      load(password, filter);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    }
  };

  const deleteItem = async (id: number) => {
    if (!confirm("Удалить заявку?")) return;
    try {
      await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Password": password },
        body: JSON.stringify({ action: "delete", id }),
      });
      load(password, filter);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    }
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm bg-card border border-border rounded-2xl p-7 sm:p-8 shadow-2xl">
          <div className="w-12 h-12 rounded-xl bg-neon-blue/15 border border-neon-blue/30 flex items-center justify-center mb-5 mx-auto">
            <Icon name="Lock" size={22} className="text-neon-blue" />
          </div>
          <h1 className="font-oswald text-2xl font-black text-center mb-2">АДМИН-ПАНЕЛЬ</h1>
          <p className="text-foreground/60 text-sm text-center mb-6">Введите пароль для доступа к заявкам</p>

          <input
            type="password"
            value={inputPwd}
            onChange={(e) => setInputPwd(e.target.value)}
            placeholder="Пароль"
            required
            autoFocus
            className="w-full px-4 py-3 rounded-xl bg-muted/40 border border-border focus:border-neon-blue focus:outline-none text-sm mb-3"
          />

          {loginError && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-3 flex items-center gap-2">
              <Icon name="AlertCircle" size={14} /> {loginError}
            </div>
          )}

          <button type="submit" className="btn-primary w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2">
            <Icon name="LogIn" size={16} />
            Войти
          </button>

          <Link to="/" className="block text-center text-xs text-foreground/45 hover:text-foreground/70 mt-5 transition-colors">
            ← На главную
          </Link>
        </form>
      </div>
    );
  }

  const total = items.length;
  const newCount = counts.new || 0;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/40 sticky top-0 z-20 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-neon-blue flex items-center justify-center">
              <Icon name="Zap" size={14} className="text-white" />
            </div>
            <span className="font-oswald font-bold text-sm sm:text-base">АДМИН-ПАНЕЛЬ</span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={() => load(password, filter)}
              disabled={loading}
              className="p-2 rounded-lg hover:bg-muted text-foreground/70 hover:text-foreground transition-colors"
              title="Обновить"
            >
              <Icon name={loading ? "Loader2" : "RefreshCw"} size={16} className={loading ? "animate-spin" : ""} />
            </button>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg border border-border text-xs sm:text-sm text-foreground/70 hover:text-foreground hover:border-foreground/40 transition-colors flex items-center gap-1.5"
            >
              <Icon name="LogOut" size={14} />
              Выйти
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6">
          <h1 className="font-oswald text-2xl sm:text-3xl font-black mb-1">Заявки клиентов</h1>
          <p className="text-foreground/55 text-sm">Всего показано: {total}{newCount ? ` • Новых: ${newCount}` : ""}</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => setFilter("")}
            className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm border transition-colors ${
              !filter ? "bg-neon-blue/15 text-neon-blue border-neon-blue/40" : "border-border text-foreground/65 hover:text-foreground"
            }`}
          >
            Все ({Object.values(counts).reduce((a, b) => a + b, 0)})
          </button>
          {Object.entries(STATUS_LABELS).map(([key, conf]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm border transition-colors ${
                filter === key ? conf.color : "border-border text-foreground/65 hover:text-foreground"
              }`}
            >
              {conf.label} ({counts[key] || 0})
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl p-3 mb-4 text-sm flex items-center gap-2">
            <Icon name="AlertCircle" size={14} /> {error}
          </div>
        )}

        {loading && items.length === 0 ? (
          <div className="text-center py-16 text-foreground/55">
            <Icon name="Loader2" size={28} className="animate-spin mx-auto mb-3" />
            Загружаем заявки...
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-foreground/55 bg-card/40 rounded-2xl border border-border">
            <Icon name="Inbox" size={36} className="mx-auto mb-3 opacity-60" />
            Заявок пока нет
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((b) => {
              const statusConf = STATUS_LABELS[b.status] || STATUS_LABELS.new;
              const created = new Date(b.created_at).toLocaleString("ru-RU", {
                day: "2-digit", month: "2-digit", year: "numeric",
                hour: "2-digit", minute: "2-digit",
              });
              return (
                <div key={b.id} className="bg-card border border-border rounded-2xl p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center shrink-0">
                        <Icon name="User" size={18} className="text-neon-blue" />
                      </div>
                      <div>
                        <div className="font-semibold text-sm sm:text-base">{b.name}</div>
                        <a href={`tel:${b.phone}`} className="text-neon-blue text-xs sm:text-sm hover:underline">{b.phone}</a>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {(() => {
                        const ec = EMAIL_STATUS_CONF[b.email_status] || EMAIL_STATUS_CONF.pending;
                        return (
                          <span
                            title={b.email_error ? `${ec.tip}: ${b.email_error}` : ec.tip}
                            className={`px-2 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1 ${ec.color}`}
                          >
                            <Icon name={ec.icon} size={12} />
                            <span className="hidden sm:inline">{ec.label}</span>
                          </span>
                        );
                      })()}
                      <span className={`px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-semibold border ${statusConf.color}`}>
                        {statusConf.label}
                      </span>
                      <span className="text-foreground/45 text-xs hidden sm:inline">#{b.id}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm mb-3 ml-0 sm:ml-[52px]">
                    {b.service && (
                      <div>
                        <div className="text-foreground/45 text-[11px] uppercase tracking-wider mb-0.5">Услуга</div>
                        <div className="text-foreground/85">{b.service}</div>
                      </div>
                    )}
                    {(b.date || b.time) && (
                      <div>
                        <div className="text-foreground/45 text-[11px] uppercase tracking-wider mb-0.5">Желаемое время</div>
                        <div className="text-foreground/85">{b.date} {b.time && `в ${b.time}`}</div>
                      </div>
                    )}
                    <div>
                      <div className="text-foreground/45 text-[11px] uppercase tracking-wider mb-0.5">Поступила</div>
                      <div className="text-foreground/85">{created}</div>
                    </div>
                  </div>

                  {b.comment && (
                    <div className="ml-0 sm:ml-[52px] mb-3 p-3 rounded-lg bg-muted/40 border border-border text-sm text-foreground/75">
                      <span className="text-foreground/45 text-[11px] uppercase tracking-wider block mb-1">Комментарий</span>
                      {b.comment}
                    </div>
                  )}

                  <div className="ml-0 sm:ml-[52px] flex flex-wrap items-center gap-2 pt-3 border-t border-border">
                    <a href={`tel:${b.phone}`} className="px-3 py-1.5 rounded-lg bg-neon-blue text-white text-xs flex items-center gap-1.5 hover:bg-neon-blue/85 transition-colors">
                      <Icon name="Phone" size={13} /> Позвонить
                    </a>
                    {b.status !== "in_progress" && (
                      <button onClick={() => updateStatus(b.id, "in_progress")} className="px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-400 text-xs flex items-center gap-1.5 hover:bg-amber-500/10 transition-colors">
                        <Icon name="Clock" size={13} /> В работу
                      </button>
                    )}
                    {b.status !== "done" && (
                      <button onClick={() => updateStatus(b.id, "done")} className="px-3 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-400 text-xs flex items-center gap-1.5 hover:bg-emerald-500/10 transition-colors">
                        <Icon name="Check" size={13} /> Выполнена
                      </button>
                    )}
                    {b.status !== "rejected" && (
                      <button onClick={() => updateStatus(b.id, "rejected")} className="px-3 py-1.5 rounded-lg border border-rose-500/40 text-rose-400 text-xs flex items-center gap-1.5 hover:bg-rose-500/10 transition-colors">
                        <Icon name="X" size={13} /> Отклонить
                      </button>
                    )}
                    <button onClick={() => deleteItem(b.id)} className="px-3 py-1.5 rounded-lg border border-border text-foreground/55 text-xs flex items-center gap-1.5 hover:text-rose-400 hover:border-rose-500/40 transition-colors ml-auto">
                      <Icon name="Trash2" size={13} /> Удалить
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}