import Icon from "@/components/ui/icon";

interface DailyPoint {
  date: string;
  count: number;
}

const WEEKDAYS = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];

const SOURCE_CONF: Record<string, { label: string; icon: string; color: string; bar: string }> = {
  site: { label: "С сайта", icon: "Globe", color: "text-emerald-400", bar: "bg-emerald-400" },
  manual: { label: "Вручную", icon: "PenLine", color: "text-amber-400", bar: "bg-amber-400" },
  avito: { label: "Авито", icon: "ShoppingBag", color: "text-green-500", bar: "bg-green-500" },
};

export default function DailyChart({
  daily,
  sourceCounts,
}: {
  daily: DailyPoint[];
  sourceCounts?: Record<string, number>;
}) {
  if (!daily || daily.length === 0) return null;

  const max = Math.max(...daily.map((d) => d.count), 1);
  const totalPeriod = daily.reduce((sum, d) => sum + d.count, 0);

  const sources = Object.entries(sourceCounts || {})
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);
  const sourceTotal = sources.reduce((sum, [, v]) => sum + v, 0);

  const fmt = (iso: string) => {
    const dt = new Date(iso + "T00:00:00");
    return { day: dt.getDate(), wd: WEEKDAYS[dt.getDay()] };
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-neon-blue/15 border border-neon-blue/30 flex items-center justify-center">
            <Icon name="BarChart3" size={18} className="text-neon-blue" />
          </div>
          <div>
            <h2 className="font-oswald font-black text-lg">ЗАЯВКИ ПО ДНЯМ</h2>
            <p className="text-foreground/55 text-xs">За последние 14 дней — всего {totalPeriod}</p>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-1 sm:gap-2 h-40">
        {daily.map((d) => {
          const { day, wd } = fmt(d.date);
          const h = d.count === 0 ? 3 : Math.max(8, Math.round((d.count / max) * 100));
          const isWeekend = wd === "Сб" || wd === "Вс";
          return (
            <div key={d.date} className="flex-1 flex flex-col items-center justify-end h-full group">
              <div className="text-[11px] font-semibold text-foreground/70 mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {d.count}
              </div>
              <div
                className={`w-full rounded-t-md transition-all ${
                  d.count > 0 ? "bg-neon-blue group-hover:bg-neon-green" : "bg-muted"
                }`}
                style={{ height: `${h}%` }}
                title={`${day} ${wd}: ${d.count} заявок`}
              />
              <div className={`text-[10px] mt-1.5 ${isWeekend ? "text-rose-400/70" : "text-foreground/45"}`}>
                {day}
              </div>
            </div>
          );
        })}
      </div>

      {sources.length > 0 && (
        <div className="mt-6 pt-5 border-t border-border">
          <div className="text-foreground/40 text-[10px] uppercase tracking-widest mb-3">
            Откуда приходят заявки
          </div>
          <div className="space-y-2.5">
            {sources.map(([key, value]) => {
              const conf = SOURCE_CONF[key] || { label: key, icon: "HelpCircle", color: "text-foreground/70", bar: "bg-foreground/40" };
              const pct = sourceTotal ? Math.round((value / sourceTotal) * 100) : 0;
              return (
                <div key={key} className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 w-28 shrink-0 text-xs ${conf.color}`}>
                    <Icon name={conf.icon} size={13} />
                    {conf.label}
                  </div>
                  <div className="flex-1 h-2.5 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${conf.bar}`} style={{ width: `${pct}%` }} />
                  </div>
                  <div className="w-20 shrink-0 text-right text-xs text-foreground/70">
                    <span className="font-semibold text-foreground/90">{value}</span> · {pct}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}