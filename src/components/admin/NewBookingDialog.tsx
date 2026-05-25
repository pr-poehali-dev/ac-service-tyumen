import { useState } from "react";
import Icon from "@/components/ui/icon";
import { formatPhone, isPhoneValid } from "@/lib/phoneMask";
import { SERVICES } from "@/components/landing/data";

interface Props {
  url: string;
  password: string;
  onClose: () => void;
  onCreated: (id: number) => void;
}

export default function NewBookingDialog({ url, password, onClose, onCreated }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [address, setAddress] = useState("");
  const [price, setPrice] = useState<string>("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [comment, setComment] = useState("");
  const [managerNote, setManagerNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");
    if (!name.trim()) return setError("Введите имя клиента");
    if (!isPhoneValid(phone)) return setError("Введите телефон полностью");

    setSaving(true);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Admin-Password": password },
        body: JSON.stringify({
          action: "create",
          name: name.trim(),
          phone,
          service: service.trim(),
          address: address.trim(),
          price: price ? Number(price) : null,
          date: date.trim(),
          time: time.trim(),
          comment: comment.trim(),
          manager_note: managerNote.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Не удалось создать");
      onCreated(data.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Ошибка");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-card border border-border rounded-none sm:rounded-2xl w-full max-w-2xl my-0 sm:my-8 shadow-2xl">
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur border-b border-border px-5 py-3.5 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <Icon name="Plus" size={16} className="text-emerald-400" />
            </div>
            <div>
              <div className="font-oswald font-bold text-sm sm:text-base">Новая заявка</div>
              <div className="text-foreground/55 text-xs">Создание вручную (звонок, мессенджер и т.д.)</div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted text-foreground/65 hover:text-foreground">
            <Icon name="X" size={18} />
          </button>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Имя клиента *" icon="User">
              <input className="field" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Иван Иванов" autoFocus />
            </Field>
            <Field label="Телефон *" icon="Phone">
              <input className="field" type="tel" inputMode="tel" value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                placeholder="+7 (___) ___-__-__" />
            </Field>
            <Field label="Услуга" icon="Wrench">
              <select className="field"
                value={SERVICES.some(s => s.title === service) ? service : (service ? "__custom__" : "")}
                onChange={(e) => {
                  if (e.target.value === "__custom__") setService(" ");
                  else setService(e.target.value);
                }}>
                <option value="">— Выберите услугу —</option>
                {SERVICES.map((s) => (
                  <option key={s.slug} value={s.title}>{s.title}</option>
                ))}
                <option value="__custom__">Свой вариант...</option>
              </select>
              {service && !SERVICES.some(s => s.title === service) && (
                <input className="field mt-1.5" placeholder="Введите название услуги"
                  value={service.trim()} onChange={(e) => setService(e.target.value)} autoFocus />
              )}
            </Field>
            <Field label="Адрес выезда" icon="MapPin">
              <input className="field" value={address} onChange={(e) => setAddress(e.target.value)}
                placeholder="г. Тюмень, ул..." />
            </Field>
            <Field label="Цена, ₽" icon="Banknote">
              <input className="field" type="number" inputMode="decimal" value={price}
                onChange={(e) => setPrice(e.target.value)} placeholder="0" />
            </Field>
            <Field label="Желаемая дата" icon="CalendarDays">
              <input className="field" value={date} onChange={(e) => setDate(e.target.value)}
                placeholder="25 мая" />
            </Field>
            <Field label="Желаемое время" icon="Clock">
              <input className="field" value={time} onChange={(e) => setTime(e.target.value)}
                placeholder="14:00" />
            </Field>
          </div>
          <Field label="Комментарий клиента" icon="MessageSquare">
            <textarea className="field min-h-[70px] resize-y" rows={2}
              value={comment} onChange={(e) => setComment(e.target.value)}
              placeholder="Что просит клиент..." />
          </Field>
          <Field label="Заметка менеджера (внутренняя)" icon="StickyNote">
            <textarea className="field min-h-[70px] resize-y" rows={2}
              value={managerNote} onChange={(e) => setManagerNote(e.target.value)}
              placeholder="Например: первый клиент, перезвонить после 15:00..." />
          </Field>

          {error && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
              <Icon name="AlertCircle" size={14} /> {error}
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-card/95 backdrop-blur border-t border-border px-4 sm:px-5 py-3 rounded-b-2xl flex items-center gap-2 justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border border-border text-xs text-foreground/70 hover:text-foreground">
            Отмена
          </button>
          <button onClick={submit} disabled={saving}
            className={`px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-1.5 ${saving ? "bg-muted text-foreground/40 cursor-not-allowed border border-border" : "btn-primary"}`}>
            <Icon name={saving ? "Loader2" : "Check"} size={14} className={saving ? "animate-spin" : ""} />
            {saving ? "Создаём..." : "Создать заявку"}
          </button>
        </div>
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