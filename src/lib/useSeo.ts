import { useEffect } from "react";

const SITE = "https://straikservis.ru";

export interface SeoOptions {
  title: string;
  description: string;
  path: string;
  image?: string;
  keywords?: string;
  schema?: Record<string, unknown> | Record<string, unknown>[];
}

function setMeta(selector: string, attr: string, value: string): string {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  const prev = el?.getAttribute(attr) || "";
  if (!el) {
    el = document.createElement("meta");
    const m = selector.match(/\[(name|property)="(.+?)"\]/);
    if (m) el.setAttribute(m[1], m[2]);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
  return prev;
}

export function useSeo(opts: SeoOptions) {
  useEffect(() => {
    const url = `${SITE}${opts.path}`;
    const prevTitle = document.title;
    document.title = opts.title;

    const prevDesc = setMeta('meta[name="description"]', "content", opts.description);
    const prevKw = opts.keywords ? setMeta('meta[name="keywords"]', "content", opts.keywords) : "";
    const prevOgTitle = setMeta('meta[property="og:title"]', "content", opts.title);
    const prevOgDesc = setMeta('meta[property="og:description"]', "content", opts.description);
    const prevOgUrl = setMeta('meta[property="og:url"]', "content", url);
    const prevOgImg = opts.image ? setMeta('meta[property="og:image"]', "content", opts.image) : "";

    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    const prevCanonical = canonical?.getAttribute("href") || "";
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);

    let scriptEl: HTMLScriptElement | null = null;
    if (opts.schema) {
      scriptEl = document.createElement("script");
      scriptEl.type = "application/ld+json";
      scriptEl.dataset.schema = "page";
      scriptEl.text = JSON.stringify(opts.schema);
      document.head.appendChild(scriptEl);
    }

    return () => {
      document.title = prevTitle;
      if (prevDesc) setMeta('meta[name="description"]', "content", prevDesc);
      if (prevKw) setMeta('meta[name="keywords"]', "content", prevKw);
      if (prevOgTitle) setMeta('meta[property="og:title"]', "content", prevOgTitle);
      if (prevOgDesc) setMeta('meta[property="og:description"]', "content", prevOgDesc);
      if (prevOgUrl) setMeta('meta[property="og:url"]', "content", prevOgUrl);
      if (prevOgImg) setMeta('meta[property="og:image"]', "content", prevOgImg);
      if (prevCanonical && canonical) canonical.setAttribute("href", prevCanonical);
      if (scriptEl) scriptEl.remove();
    };
  }, [opts.title, opts.description, opts.path, opts.image, opts.keywords]);
}

export { SITE };
