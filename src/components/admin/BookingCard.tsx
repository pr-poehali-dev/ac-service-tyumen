import { useEffect, useState } from "react";
import Icon from "@/components/ui/icon";

export interface Booking {
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
  price: number | null;
  manager_note: string;
  address: string;
  scheduled_at: string | null;
  assignee: string;
}

export interface BookingNote {
  id: number;
  author: string;
  text: string;
  created_at: string;
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  new: { label: "Новая", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  in_progress: { label: "В работе", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  done: { label: "Выполнена", color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30" },
  rejected: { label: "Отклонена", color: "bg-rose-500/15 text-rose-400 border-rose-500/30" },
};

interface Props {
  bookingId: number;
  url: string;
  password: string;
  onClose: () => void;
  onUpdated: () => void;
}

export default function BookingCard({ bookingId, url, password, onClose, onUpdated }: Props) {
  const [item, setItem] = useState<Booking | null>(null);
  const [notes, setNotes] = useState<BookingNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [error, setError] = useState("");
  const [edits, setEdits] = useState<Partial<Booking>>({});

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${url}?id=${bookingId}`, {
        headers: { "X-Admin-Password": password },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка");
      setItem(data.item);
      setNotes(data.notes || []);
      setEdits({});
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingId]);

  const change = <K extends keyof Booking>(key: K, value: Booking[K]) => {
    setEdits((p) => ({ ...p, [key]: value }));
  };

  const value = <K extends keyof Booking>(key: K): Booking[K] => {
    if (edits[key] !== undefined) return edits[key] as Booking[K];
    return (item ? item[key] : "") as Booking[K];
  };

  const save = async () => {
    if (!Object.keys(edits).length) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Password": password },
        body: JSON.stringify({ action: "update_fields", id: bookingId, fields: edits }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка сохранения");
      setItem(data.item);
      setEdits({});
      onUpdated();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  const addNote = async () => {
    if (!noteText.trim()) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Password": password },
        body: JSON.stringify({ action: "add_note", id: bookingId, text: noteText }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Не удалось добавить");
      setNotes((p) => [data.note, ...p]);
      setNoteText("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  const changeStatus = async (s: string) => {
    change("status", s);
  };

  const hasChanges = Object.keys(edits).length > 0;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-none sm:rounded-2xl w-full max-w-3xl my-0 sm:my-8 shadow-2xl">
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border px-5 py-3.5 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-neon-blue/15 border border-neon-blue/30 flex items-center justify-center shrink-0">
              <Icon name="ClipboardList" size={16} className="text-neon-blue" />
            </div>
            <div className="min-w-0">
              <div className="font-oswald font-bold text-sm sm:text-base truncate">Заявка #{bookingId}</div>
              {item && <div className="text-foreground/55 text-xs truncate">{item.name} • {item.phone}</div>}
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted text-foreground/65 hover:text-foreground">
            <Icon name="X" size={18} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-foreground/55">
            <Icon name="Loader2" size={28} className="animate-spin mx-auto mb-3" />
            Загружаем...
          </div>
        ) : !item ? (
          <div className="p-8 text-center text-rose-400">{error || "Заявка не найдена"}</div>
        ) : (
          <div className="p-4 sm:p-5 space-y-5">
            <div className="flex flex-wrap gap-2">
              {Object.entries(STATUS_LABELS).map(([k, conf]) => {
                const active = value("status") === k;
                return (
                  <button key={k} onClick={() => changeStatus(k)}
                    className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${active ? conf.color : "border-border text-foreground/65 hover:text-foreground"}`}>
                    {conf.label}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Имя клиента" icon="User">
                <input className="field" value={value("name") as string}
                  onChange={(e) => change("name", e.target.value)} />
              </Field>
              <Field label="Телефон" icon="Phone">
                <input className="field" value={value("phone") as string}
                  onChange={(e) => change("phone", e.target.value)} />
              </Field>
              <Field label="Услуга" icon="Wrench">
                <input className="field" value={value("service") as string}
                  onChange={(e) => change("service", e.target.value)} />
              </Field>
              <Field label="Адрес выезда" icon="MapPin">
                <input className="field" placeholder="г. Тюмень, ул..."
                  value={value("address") as string}
                  onChange={(e) => change("address", e.target.value)} />
              </Field>
              <Field label="Цена, ₽" icon="Banknote">
                <input className="field" type="number" inputMode="decimal" placeholder="0"
                  value={(value("price") as number | null) ?? ""}
                  onChange={(e) => change("price", e.target.value ? Number(e.target.value) : null)} />
              </Field>
              <Field label="Ответственный" icon="UserCheck">
                <input className="field" placeholder="Имя мастера"
                  value={value("assignee") as string}
                  onChange={(e) => change("assignee", e.target.value)} />
              </Field>
              <Field label="Запланированный визит" icon="CalendarClock">
                <input className="field" type="datetime-local"
                  value={(value("scheduled_at") as string | null)?.slice(0, 16) || ""}
                  onChange={(e) => change("scheduled_at", e.target.value || null)} />
              </Field>
              <Field label="Желаемое клиентом" icon="Clock">
                <div className="field !cursor-default !bg-muted/20 text-foreground/70">
                  {(item.date || item.time) ? `${item.date} ${item.time && `в ${item.time}`}` : "—"}
                </div>
              </Field>
            </div>

            <Field label="Заметка менеджера (видна только в админке)" icon="StickyNote">
              <textarea className="field min-h-[80px] resize-y" rows={3}
                placeholder="Например: клиент перезвонит после 15:00, нужна доп. деталь..."
                value={value("manager_note") as string}
                onChange={(e) => change("manager_note", e.target.value)} />
            </Field>

            {item.comment && (
              <div className="rounded-xl bg-muted/40 border border-border p-3">
                <div className="text-foreground/45 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Icon name="MessageSquare" size={12} /> Комментарий клиента
                </div>
                <div className="text-sm text-foreground/85 whitespace-pre-wrap">{item.comment}</div>
              </div>
            )}

            <div className="rounded-xl border border-border bg-muted/20 p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="font-semibold text-sm flex items-center gap-2">
                  <Icon name="History" size={14} className="text-neon-blue" />
                  История ({notes.length})
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                <input className="field flex-1" placeholder="Добавить комментарий менеджера..."
                  value={noteText} onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") addNote(); }} />
                <button onClick={addNote} disabled={!noteText.trim() || saving}
                  className="btn-primary px-3 rounded-lg text-xs flex items-center gap-1.5 disabled:opacity-50">
                  <Icon name="Plus" size={14} /> Добавить
                </button>
              </div>
              {notes.length === 0 ? (
                <div className="text-foreground/45 text-xs text-center py-4">Заметок пока нет</div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {notes.map((n) => (
                    <div key={n.id} className="rounded-lg bg-background/50 border border-border p-2.5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] text-neon-blue font-semibold">{n.author}</span>
                        <span className="text-[11px] text-foreground/45">{new Date(n.created_at).toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <div className="text-sm text-foreground/85 whitespace-pre-wrap">{n.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
                <Icon name="AlertCircle" size={14} /> {error}
              </div>
            )}

            <div className="sticky bottom-0 -mx-4 sm:-mx-5 -mb-4 sm:-mb-5 px-4 sm:px-5 py-3 bg-card/95 backdrop-blur border-t border-border rounded-b-2xl flex flex-wrap items-center gap-2">
              <a href={`tel:${item.phone}`} className="px-3 py-2 rounded-lg bg-neon-blue text-white text-xs flex items-center gap-1.5 hover:bg-neon-blue/85">
                <Icon name="Phone" size={13} /> Позвонить
              </a>
              <a href={`https://t.me/+${item.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                className="px-3 py-2 rounded-lg border border-cyan-500/40 text-cyan-400 text-xs flex items-center gap-1.5 hover:bg-cyan-500/10">
                <Icon name="Send" size={13} /> Telegram
              </a>
              <a href={`https://max.ru/+${item.phone.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
                className="px-3 py-2 rounded-lg border border-sky-500/40 text-sky-400 text-xs flex items-center gap-1.5 hover:bg-sky-500/10">
                <Icon name="Send" size={13} /> Написать в MAX
              </a>
              <button onClick={save} disabled={!hasChanges || saving}
                className={`ml-auto px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${hasChanges && !saving ? "btn-primary" : "bg-muted text-foreground/40 cursor-not-allowed border border-border"}`}>
                <Icon name={saving ? "Loader2" : "Save"} size={14} className={saving ? "animate-spin" : ""} />
                {saving ? "Сохраняем..." : hasChanges ? "Сохранить изменения" : "Нет изменений"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, icon, children }: { label: string; icon: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-foreground/55 text-[11px] uppercase tracking-wider mb-1 flex items-center gap-1.5">
        <Icon name={icon} size={11} />
        {label}
      </span>
      {children}
    </label>
  );
}