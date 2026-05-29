import { useState, useEffect, useCallback } from "react";
import Icon from "@/components/ui/icon";
import func2url from "../../../backend/func2url.json";

interface Article {
  slug: string;
  title: string;
  category: string;
  date: string;
}

const TOPIC_IDEAS = [
  "Как выбрать кондиционер для квартиры в Тюмени",
  "Почему кондиционер не холодит: причины и решения",
  "Как часто чистить кондиционер: советы для жителей Тюмени",
  "Мульти-сплит система: плюсы и минусы для дома",
  "Подготовка кондиционера к зиме в условиях Тюмени",
];

export default function SeoArticleGenerator({ password }: { password: string }) {
  const url = func2url["seo-articles"];
  const [articles, setArticles] = useState<Article[]>([]);
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      setArticles(data.articles || []);
    } catch {
      /* ignore */
    }
  }, [url]);

  useEffect(() => {
    load();
  }, [load]);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate", topic: topic.trim(), admin_password: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка генерации");
      setMsg({ type: "ok", text: `Статья «${data.title}» создана и опубликована` });
      setTopic("");
      load();
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Ошибка" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-5 sm:p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-xl bg-neon-blue/15 border border-neon-blue/30 flex items-center justify-center">
          <Icon name="Sparkles" size={18} className="text-neon-blue" />
        </div>
        <div>
          <h2 className="font-oswald font-black text-lg">ИИ-ГЕНЕРАТОР СТАТЕЙ</h2>
          <p className="text-foreground/55 text-xs">Нейросеть напишет SEO-статью в блог по вашей теме</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Тема статьи, например: Как выбрать кондиционер для офиса"
          className="flex-1 px-4 py-2.5 rounded-xl bg-muted/40 border border-border focus:border-neon-blue focus:outline-none text-sm"
          onKeyDown={(e) => e.key === "Enter" && generate()}
        />
        <button
          onClick={generate}
          disabled={loading || !topic.trim()}
          className="btn-primary px-5 py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Icon name={loading ? "Loader2" : "Wand2"} size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Пишу статью…" : "Сгенерировать"}
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {TOPIC_IDEAS.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className="text-[11px] px-2.5 py-1 rounded-full bg-muted/50 border border-border text-foreground/60 hover:text-neon-blue hover:border-neon-blue/40 transition-colors"
          >
            {t}
          </button>
        ))}
      </div>

      {msg && (
        <div
          className={`text-xs rounded-lg p-3 mb-4 flex items-center gap-2 ${
            msg.type === "ok"
              ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/20"
              : "text-rose-400 bg-rose-500/10 border border-rose-500/20"
          }`}
        >
          <Icon name={msg.type === "ok" ? "CheckCircle2" : "AlertCircle"} size={14} />
          {msg.text}
        </div>
      )}

      <div className="text-foreground/40 text-[10px] uppercase tracking-widest mb-2">
        Опубликовано статей: {articles.length}
      </div>
      <div className="space-y-1.5 max-h-60 overflow-y-auto">
        {articles.map((a) => (
          <a
            key={a.slug}
            href={`/blog/${a.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-muted/30 hover:bg-muted/60 transition-colors group"
          >
            <span className="text-sm text-foreground/80 group-hover:text-neon-blue transition-colors truncate">{a.title}</span>
            <span className="text-[11px] text-foreground/40 shrink-0">{a.date}</span>
          </a>
        ))}
        {articles.length === 0 && (
          <div className="text-sm text-foreground/40 py-3 text-center">Пока нет сгенерированных статей</div>
        )}
      </div>
    </div>
  );
}
