import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import sheshankHero from "@/assets/sheshank-hero.jpg";
import projCrack from "@/assets/proj-crack.jpg";
import projWeed from "@/assets/proj-weed.jpg";
import { t, type Lang } from "@/lib/portfolio-i18n";

import certPython from "@/assets/cert-python.pdf.asset.json";
import certC from "@/assets/cert-c.pdf.asset.json";
import certCpp from "@/assets/cert-cpp.pdf.asset.json";
import certFoundationMern from "@/assets/cert-foundation-mern.pdf.asset.json";
import resumeEn from "@/assets/resume-en.pdf.asset.json";
import resumeFr from "@/assets/resume-fr.pdf.asset.json";
import journal1 from "@/assets/journal-1.pdf.asset.json";
import journal2 from "@/assets/journal-2.pdf.asset.json";

type JournalItem = { y: string; n: string; i: string; url: string };
const JOURNALS: JournalItem[] = [
  { y: "B.Tech", n: "Draft Journal — Concrete Crack Detection", i: "Bachelor's Research Draft · VIT Chennai", url: journal1.url },
  { y: "B.Tech", n: "Draft Journal — Weed Detection (Deep Learning)", i: "Bachelor's Research Draft · VIT Chennai", url: journal2.url },
];

const PROFILE_PHOTOS = [sheshankHero];
const PROJECT_IMAGES = [projCrack, projWeed];

type CertItem = { y: string; n: string; i: string; url: string };
const CERTS: CertItem[] = [
  { y: "2023", n: "Foundation Course — MERN Stack", i: "Ethnus · MERN Internship Certificate", url: certFoundationMern.url },
  { y: "2024", n: "Python for Data Science", i: "NPTEL / Participant Certificate", url: certPython.url },
  { y: "2023", n: "C Programming", i: "Participant Certificate", url: certC.url },
  { y: "2023", n: "C++ Programming", i: "Participant Certificate", url: certCpp.url },
];

function ProfileCarousel() {
  // Static hero image — no auto-rotation (prevents layout shift & jank on mobile).
  return (
    <img
      src={PROFILE_PHOTOS[0]}
      alt="Sheshank Boddu"
      width={768}
      height={768}
      loading="eager"
      decoding="async"
      className="absolute inset-0 w-full h-full object-cover"
    />
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sheshank Boddu — Data Scientist · EPITA Paris" },
      { name: "description", content: "Portfolio of Sheshank Boddu — Data Science & Analytics graduate student. Python, Machine Learning, AI projects. MSc @ EPITA Paris." },
      { property: "og:title", content: "Sheshank Boddu — Data Scientist Portfolio" },
      { property: "og:description", content: "MSc Data Science & Analytics student at EPITA Paris. ML, AI and Analytics work." },
    ],
  }),
  component: Portfolio,
});

function Portfolio() {
  const [lang, setLang] = useState<Lang>("en");
  const [splashShown, setSplashShown] = useState(true);
  const [splashOut, setSplashOut] = useState(false);
  const L = t[lang];

  const enter = (l: Lang) => {
    setLang(l);
    setSplashOut(true);
    setTimeout(() => setSplashShown(false), 700);
  };

  return (
    <>
      <CustomCursor />
      <ParticleBackground />
      <ScrollProgress />
      {splashShown && <Splash lang={lang} setLang={setLang} onEnter={enter} out={splashOut} />}
      <main className="relative z-10">
        <Nav L={L} lang={lang} setLang={setLang} />
        <Hero L={L} />
        <About L={L} />
        <Education L={L} />
        <Experience L={L} />
        <Skills L={L} />
        <Projects L={L} />
        <Certifications L={L} />
        <Journals L={L} />
        <Hire L={L} />
        <Contact L={L} />
        <Footer L={L} />
      </main>
      <BackToTop />
    </>
  );
}

/* =================== CURSOR =================== */
function CustomCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    // Desktop / fine-pointer only — no custom cursor on touch devices.
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);
    let rx = 0, ry = 0, x = 0, y = 0;
    const move = (e: MouseEvent) => {
      x = e.clientX; y = e.clientY;
      if (dot.current) { dot.current.style.left = x + "px"; dot.current.style.top = y + "px"; }
      const target = e.target as HTMLElement;
      if (ring.current) {
        const interactive = target?.closest?.("a,button,input,textarea,[data-cursor='hover']");
        ring.current.classList.toggle("hover", !!interactive);
      }
    };
    const loop = () => {
      rx += (x - rx) * 0.18; ry += (y - ry) * 0.18;
      if (ring.current) { ring.current.style.left = rx + "px"; ring.current.style.top = ry + "px"; }
      id = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move, { passive: true });
    let id = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); cancelAnimationFrame(id); };
  }, []);
  if (!enabled) return null;
  return (<>
    <div ref={ring} className="cursor-ring" aria-hidden />
    <div ref={dot} className="cursor-dot" aria-hidden />
  </>);
}

/* =================== PARTICLES =================== */
function ParticleBackground() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Skip particles on mobile, coarse pointers, or reduced-motion users — huge perf win.
    const isMobile = window.matchMedia("(max-width: 768px), (pointer: coarse)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isMobile || reduced) return;
    setEnabled(true);
    const c = canvas.current!; const ctx = c.getContext("2d")!;
    let w = c.width = window.innerWidth, h = c.height = window.innerHeight;
    const N = Math.min(60, Math.floor((w * h) / 30000));
    const pts = Array.from({ length: N }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.6 + 0.5,
    }));
    const onResize = () => { w = c.width = window.innerWidth; h = c.height = window.innerHeight; };
    window.addEventListener("resize", onResize);
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of pts) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = "rgba(125, 211, 252, 0.7)";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14000) {
            const a = 1 - d2 / 14000;
            ctx.strokeStyle = `rgba(129, 140, 248, ${a * 0.25})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => { window.removeEventListener("resize", onResize); cancelAnimationFrame(raf); };
  }, []);
  if (!enabled) return null;
  return <canvas ref={canvas} className="fixed inset-0 z-0 opacity-60 pointer-events-none" aria-hidden />;
}

/* =================== PROGRESS =================== */
function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / (h.scrollHeight - h.clientHeight || 1);
      if (ref.current) ref.current.style.transform = `scaleX(${p})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return <div ref={ref} className="scroll-progress" style={{ transform: "scaleX(0)" }} aria-hidden />;
}

/* =================== SPLASH =================== */
function Splash({ lang, setLang, onEnter, out }: { lang: Lang; setLang: (l: Lang) => void; onEnter: (l: Lang) => void; out: boolean; }) {
  const L = t[lang];
  return (
    <div className={`splash ${out ? "out" : ""}`} role="dialog" aria-label="Welcome">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -inset-40 animate-orbit opacity-30" style={{ background: "conic-gradient(from 0deg, transparent, #38bdf8, transparent, #c084fc, transparent)" }} />
      </div>

      {/* Top-right corner language prompt */}
      <div className="absolute top-4 right-4 flex flex-col items-end gap-2 z-10 animate-section-in">
        <div className="glass rounded-full px-4 py-2 text-[11px] font-mono tracking-wider text-[color:var(--neon-cyan)] flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[color:var(--neon-cyan)] animate-pulse" />
          {lang === "en" ? L.splash.langPrompt : L.splash.langPromptFr}
        </div>
        <div className="glass-strong rounded-full p-1 flex text-xs font-mono">
          {(["en", "fr"] as Lang[]).map((l) => (
            <button key={l} onClick={() => setLang(l)}
              className={`px-3 py-1.5 rounded-full transition-all duration-300 ${lang === l ? "bg-[color:var(--neon-blue)] text-background scale-105" : "text-muted-foreground hover:text-foreground"}`}>
              {l === "en" ? "🇬🇧 EN" : "🇫🇷 FR"}
            </button>
          ))}
        </div>
      </div>

      <div className="relative glass-strong rounded-3xl p-10 sm:p-16 max-w-2xl w-[92%] text-center neon-border animate-pulse-glow">
        <div className="font-mono text-xs tracking-[0.4em] text-[color:var(--neon-cyan)] mb-4">SHESHANK BODDU · v2.0</div>

        <div className="flex flex-col items-center gap-2 mb-6">
          <h1 className="text-5xl sm:text-7xl font-black neon-text leading-none transition-all duration-500">
            {lang === "en" ? "Hello 👋" : "Bonjour 👋"}
          </h1>
          <p className="text-lg sm:text-2xl font-display text-foreground/85 mt-2">
            {lang === "en" ? L.splash.welcome : L.splash.welcomeFr}
          </p>
          <p className="text-xs font-mono tracking-widest text-muted-foreground uppercase mt-2">{L.splash.tag}</p>
        </div>

        <button onClick={() => onEnter(lang)} className="btn-neon primary w-full justify-center text-base py-3 hover:scale-[1.02] transition-transform">
          {lang === "en" ? L.splash.enter : L.splash.enterFr} →
        </button>
      </div>
    </div>
  );
}

/* =================== NAV =================== */
function Nav({ L, lang, setLang }: { L: typeof t["en"]; lang: Lang; setLang: (l: Lang) => void; }) {
  const [open, setOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const switchLang = (l: Lang) => {
    setLang(l);
    setToast(t[l].toast);
    setTimeout(() => setToast(null), 2000);
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "l" || e.key === "L") switchLang(lang === "en" ? "fr" : "en");
      const map: Record<string, string> = { "1": "home", "2": "about", "3": "projects", "4": "contact" };
      if (map[e.key]) document.getElementById(map[e.key])?.scrollIntoView({ behavior: "smooth" });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const items = [
    ["about", L.nav.about], ["education", L.nav.education], ["experience", L.nav.experience], ["skills", L.nav.skills],
    ["projects", L.nav.projects], ["certs", L.nav.certs], ["journals", L.nav.journals],
    ["hire", L.nav.hire], ["contact", L.nav.contact],
  ] as const;

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-6xl">
      <nav className="glass-strong rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all duration-300 hover:shadow-[0_8px_40px_oklch(0.65_0.27_300/30%)]">
        <a href="#home" className="flex items-center gap-2 group">
          <span className="grid place-items-center w-8 h-8 rounded-lg font-display font-black text-sm transition-transform group-hover:rotate-6 group-hover:scale-110" style={{ background: "var(--grad-hero)" }}>SB</span>
          <span className="hidden sm:block font-display font-bold tracking-widest text-sm">SHESHANK</span>
        </a>
        <div className="hidden lg:flex items-center gap-1">
          {items.map(([id, label]) => (
            <a key={id} href={`#${id}`} className="px-3 py-1.5 text-xs font-display tracking-wider uppercase text-muted-foreground hover:text-[color:var(--neon-cyan)] hover:-translate-y-0.5 transition-all duration-200">{label}</a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <div className="glass rounded-full p-0.5 flex text-xs font-mono">
            {(["en", "fr"] as Lang[]).map((l) => (
              <button key={l} onClick={() => switchLang(l)} className={`px-2.5 py-1 rounded-full transition-all duration-300 ${lang === l ? "bg-[color:var(--neon-blue)] text-background" : "text-muted-foreground hover:text-foreground"}`}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button onClick={() => setOpen((v) => !v)} className="lg:hidden glass rounded-full w-9 h-9 grid place-items-center" aria-label="Menu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
        </div>
      </nav>
      {open && (
        <div className="lg:hidden glass-strong rounded-2xl mt-2 p-3 grid grid-cols-2 gap-1 animate-section-in">
          {items.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="px-3 py-2 text-xs font-display tracking-wider uppercase rounded-lg hover:bg-white/5 transition">{label}</a>
          ))}
        </div>
      )}
      {toast && (
        <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 glass-strong rounded-full px-4 py-2 text-xs font-mono text-[color:var(--neon-cyan)] animate-section-in">
          {toast}
        </div>
      )}
    </header>
  );
}

/* =================== Brand SVG icons =================== */
const Icon = {
  LinkedIn: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM3.56 20.45h3.56V9H3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" /></svg>
  ),
  GitHub: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2.2c-3.3.7-4-1.4-4-1.4-.6-1.4-1.4-1.8-1.4-1.8-1.1-.8.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1.1 1.9 2.9 1.4 3.6 1 .1-.8.4-1.4.8-1.7-2.7-.3-5.5-1.3-5.5-6 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.3a11.4 11.4 0 0 1 6 0c2.3-1.6 3.3-1.3 3.3-1.3.6 1.7.2 2.9.1 3.2.8.9 1.2 2 1.2 3.3 0 4.7-2.8 5.7-5.5 6 .4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" /></svg>
  ),
  Mail: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>
  ),
  Instagram: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...p}><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></svg>
  ),
  Blog: (p: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...p}><path d="M4 4h12a4 4 0 0 1 4 4v12H8a4 4 0 0 1-4-4V4z" /><path d="M4 4v0a4 4 0 0 1 4 4v12" /><path d="M8 14h8M8 10h4" /></svg>
  ),
};

/* =================== HERO =================== */
function useTyping(words: readonly string[]) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [del, setDel] = useState(false);
  useEffect(() => {
    const cur = words[i % words.length];
    const speed = del ? 50 : 90;
    const tm = setTimeout(() => {
      const next = del ? cur.slice(0, text.length - 1) : cur.slice(0, text.length + 1);
      setText(next);
      if (!del && next === cur) setTimeout(() => setDel(true), 1400);
      else if (del && next === "") { setDel(false); setI((v) => v + 1); }
    }, speed);
    return () => clearTimeout(tm);
  }, [text, del, i, words]);
  return text;
}

function Hero({ L }: { L: typeof t["en"] }) {
  const typed = useTyping(L.hero.typing);
  const [docModal, setDocModal] = useState<null | "resume">(null);
  return (
    <section id="home" className="relative min-h-dvh flex items-center pt-28 pb-16 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center w-full">
        <div className="animate-section-in">
          <span className="section-label text-sm">{L.hero.label}</span>
          <h1 className="mt-4 text-6xl sm:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight">
            <span className="neon-text">{L.hero.name}</span>
          </h1>
          <p className="mt-4 text-2xl sm:text-3xl text-foreground/90 font-semibold">{L.hero.role}</p>
          <p className="mt-2 text-base sm:text-lg text-muted-foreground">{L.hero.sub}</p>
          <div className="mt-5 glass rounded-xl px-4 py-3 flex sm:inline-flex max-w-full items-start gap-3 font-mono text-base sm:text-lg min-h-[3rem]">
            <span className="shrink-0 text-[color:var(--neon-cyan)]">{`>`}</span>
            <span className="min-w-0 break-words leading-snug">{typed}</span>
            <span className="inline-block w-[2px] h-5 bg-[color:var(--neon-cyan)] animate-blink" />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={() => setDocModal("resume")} className="btn-neon primary text-base hover:scale-105 transition-transform">↓ {L.hero.resume}</button>
            <a href="#projects" className="btn-neon text-base hover:scale-105 transition-transform">{L.hero.projects}</a>
            <a href="#contact" className="btn-neon text-base hover:scale-105 transition-transform">{L.hero.contact}</a>
          </div>
          <SocialLinks className="mt-6" />
        </div>

        <div className="relative mx-auto w-full max-w-md aspect-square">
          <div className="absolute inset-0 rounded-full animate-pulse-glow" style={{ background: "var(--grad-glow)" }} />
          <div className="absolute inset-4 rounded-full border border-[color:var(--neon-cyan)]/30 animate-orbit" />
          <div className="absolute inset-10 rounded-full border border-dashed border-[color:var(--neon-purple)]/40 animate-orbit" style={{ animationDuration: "30s", animationDirection: "reverse" }} />
          <div className="absolute inset-0 animate-orbit" style={{ animationDuration: "18s" }}>
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <span key={deg} className="absolute w-2.5 h-2.5 rounded-full" style={{
                background: "var(--neon-cyan)",
                top: "50%", left: "50%",
                transform: `rotate(${deg}deg) translate(160px) translate(-50%, -50%)`,
                boxShadow: "0 0 10px var(--neon-cyan)",
              }} />
            ))}
          </div>
          <div className="absolute inset-12 rounded-full overflow-hidden neon-border" style={{ boxShadow: "0 0 60px oklch(0.65 0.27 300 / 50%)" }}>
            <ProfileCarousel />
            <div className="scan-line" />
          </div>
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 glass-strong rounded-full px-4 py-2 font-mono text-xs text-[color:var(--neon-cyan)] whitespace-nowrap">
            ● AVAILABLE · 2026
          </div>
        </div>
      </div>
      {docModal && <DocDownloadModal kind={docModal} L={L} onClose={() => setDocModal(null)} />}
    </section>
  );
}

/* =================== DOC DOWNLOAD MODAL =================== */
function DocDownloadModal({ kind, L, onClose }: { kind: "resume"; L: typeof t["en"]; onClose: () => void }) {
  const map = {
    resume: { en: resumeEn.url, fr: resumeFr.url, title: L.docModal.resumeTitle, filename: "Sheshank-Boddu-Resume" },
  }[kind];

  const [preview, setPreview] = useState<"en" | "fr" | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const trigger = (href: string, name: string) => {
    const a = document.createElement("a");
    a.href = href; a.download = name; a.target = "_blank"; a.rel = "noreferrer";
    document.body.appendChild(a); a.click(); a.remove();
  };
  const dl = (which: "en" | "fr" | "both") => {
    if (which === "both") {
      trigger(map.en, `${map.filename}-EN.pdf`);
      setTimeout(() => trigger(map.fr, `${map.filename}-FR.pdf`), 400);
    } else trigger(map[which], `${map.filename}-${which.toUpperCase()}.pdf`);
  };

  const showPicker = !preview;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 animate-section-in" style={{ background: "oklch(0.05 0 0 / 75%)", backdropFilter: "blur(10px)" }} onClick={onClose}>
      <div className={`glass-strong neon-border rounded-2xl p-4 sm:p-5 w-full ${showPicker ? "max-w-md" : "max-w-4xl h-[85vh]"} flex flex-col`} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3 gap-3">
          <div className="min-w-0">
            <div className="font-display font-bold text-xl neon-text truncate">{map.title}</div>
            <div className="text-[11px] font-mono text-[color:var(--neon-cyan)]">{L.docModal.diff}</div>
          </div>
          <div className="flex gap-2 items-center">
            {kind === "resume" && preview && (
              <button onClick={() => setPreview(preview === "en" ? "fr" : "en")} className="btn-neon !text-xs !py-2 !px-3">
                {preview === "en" ? "🇫🇷 FR" : "🇬🇧 EN"}
              </button>
            )}
            {preview && (
              <>
                <a href={map[preview]} target="_blank" rel="noreferrer" className="btn-neon !text-xs !py-2 !px-3">↗ Open</a>
                <a href={map[preview]} download={`${map.filename}-${preview.toUpperCase()}.pdf`} className="btn-neon primary !text-xs !py-2 !px-3">↓ Download</a>
              </>
            )}
            <button onClick={onClose} className="btn-neon !text-xs !py-2 !px-3" aria-label="Close">✕</button>
          </div>
        </div>

        {showPicker ? (
          <>
            <p className="text-sm text-muted-foreground mb-4">{L.docModal.choose}</p>
            <div className="grid gap-3">
              <button onClick={() => setPreview("en")} className="btn-neon w-full justify-between hover:scale-[1.02] transition">
                <span className="flex items-center gap-2">🇬🇧 {L.docModal.en}</span><span>→</span>
              </button>
              <button onClick={() => setPreview("fr")} className="btn-neon w-full justify-between hover:scale-[1.02] transition">
                <span className="flex items-center gap-2">🇫🇷 {L.docModal.fr}</span><span>→</span>
              </button>
              <button onClick={() => dl("both")} className="btn-neon primary w-full justify-between hover:scale-[1.02] transition">
                <span>✦ {L.docModal.both}</span><span>↓↓</span>
              </button>
            </div>
          </>
        ) : (
          <iframe src={preview ? map[preview] : map.en} title={map.title} className="flex-1 w-full rounded-xl border border-[color:var(--neon-cyan)]/20 bg-background" />
        )}
      </div>
    </div>
  );
}

function SocialLinks({ className = "" }: { className?: string }) {
  const items = [
    { label: "LinkedIn", href: "https://linkedin.com/in/sheshank-boddu", I: Icon.LinkedIn, color: "#0a66c2" },
    { label: "GitHub", href: "https://github.com/sheshank1212", I: Icon.GitHub, color: "#f5f5f5" },
    { label: "Email", href: "mailto:boddusheshank@gmail.com", I: Icon.Mail, color: "#5eead4" },
    { label: "Instagram", href: "https://instagram.com/sheshank1212", I: Icon.Instagram, color: "#e1306c" },
  ];
  return (
    <div className={`flex flex-wrap gap-3 ${className}`}>
      {items.map((s) => (
        <a key={s.label} href={s.href} aria-label={s.label} title={s.label}
          target={s.href.startsWith("#") || s.href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer"
          className="group glass rounded-2xl w-14 h-14 grid place-items-center transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-[0_10px_30px_oklch(0.65_0.27_300/45%)] hover:border-[color:var(--neon-cyan)]"
          style={{ color: "var(--foreground)" }}>
          <s.I width="24" height="24" className="transition-colors duration-300 group-hover:text-[color:var(--neon-cyan)]" style={{ color: s.color }} />
        </a>
      ))}
    </div>
  );
}

/* =================== Reveal on scroll =================== */
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setVisible(true)), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

function Counter({ to, suffix = "", decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  // Show the final value immediately — no scroll-triggered count-up delay.
  return <span>{to.toFixed(decimals)}{suffix}</span>;
}

/* =================== ABOUT =================== */
function About({ L }: { L: typeof t["en"] }) {
  return (
    <section id="about" className="relative py-14 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <span className="section-label">{L.about.label}</span>
        <h2 className="mt-4 text-4xl sm:text-6xl font-bold neon-text max-w-3xl">{L.about.title}</h2>
        <div className="mt-10 grid lg:grid-cols-[1.4fr_1fr] gap-8">
          <div className="glass-strong rounded-2xl p-7 space-y-4 leading-relaxed text-foreground/90 text-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_oklch(0.65_0.27_300/30%)]">
            <p>{L.about.p1}</p>
            <p>{L.about.p2}</p>
            <p className="text-muted-foreground italic">{L.about.p3}</p>
            <div>
              <div className="font-display text-xs tracking-widest text-[color:var(--neon-cyan)] uppercase mb-3">{L.about.focus}</div>
              <div className="flex flex-wrap gap-2">
                {L.about.areas.map((a) => (
                  <span key={a} className="glass rounded-full px-3 py-1 text-xs font-mono transition hover:bg-[color:var(--neon-blue)]/20 hover:-translate-y-0.5">{a}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {L.about.stats.map((s, idx) => (
              <div key={idx} className="glass-strong rounded-2xl p-5 sm:p-6 text-center neon-border relative min-h-[9rem] flex flex-col justify-center transition-all duration-300 hover:-translate-y-1 min-w-0">
                <div className="absolute inset-0 opacity-20" style={{ background: "var(--grad-glow)" }} />
                <div className="relative font-display text-4xl sm:text-4xl lg:text-5xl font-black neon-text break-words leading-tight">
                  <Counter to={s.v} suffix={s.suf} decimals={s.v % 1 === 0 ? 0 : 2} />
                </div>
                <div className="relative text-sm sm:text-base mt-3 font-mono uppercase tracking-wide text-muted-foreground break-words leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================== EXPERIENCE =================== */
function Experience({ L }: { L: typeof t["en"] }) {
  return (
    <section id="experience" className="relative py-14 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <span className="section-label">{L.exp.label}</span>
        <h2 className="mt-4 text-4xl sm:text-6xl font-bold neon-text">{L.exp.title}</h2>
        <div className="mt-12 grid md:grid-cols-2 gap-5">
          {L.exp.items.map((e, i) => (
            <div key={i} className="glass-strong rounded-2xl p-6 neon-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_oklch(0.65_0.27_300/30%)] min-w-0">
              <div className="font-mono text-xs tracking-widest text-[color:var(--neon-cyan)] uppercase">{e.period}</div>
              <div className="font-display text-2xl font-bold mt-1 break-words">{e.role}</div>
              <div className="text-sm text-[color:var(--neon-cyan)]/90 mt-0.5 font-mono">@ {e.company}</div>
              <p className="mt-3 leading-relaxed text-foreground/90 text-lg break-words">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================== EDUCATION =================== */
function Education({ L }: { L: typeof t["en"] }) {
  return (
    <section id="education" className="relative py-14 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <span className="section-label">{L.edu.label}</span>
        <h2 className="mt-4 text-4xl sm:text-6xl font-bold neon-text">{L.edu.title}</h2>
        <div className="relative mt-12 pl-6 sm:pl-10 border-l-2 border-[color:var(--neon-blue)]/40 space-y-10">
          {L.edu.items.map((e, i) => (
            <div key={i} className="relative">
              <span className="absolute -left-[33px] sm:-left-[49px] top-2 w-5 h-5 rounded-full" style={{ background: "var(--grad-hero)", boxShadow: "0 0 18px var(--neon-blue)" }} />
              <div className="glass-strong rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_oklch(0.65_0.27_300/30%)] min-w-0">
                <div className="font-mono text-xs tracking-widest text-[color:var(--neon-cyan)] uppercase">{e.period}</div>
                <div className="font-display text-xl sm:text-2xl font-bold mt-1 break-words">{e.degree}</div>
                <div className="text-base text-muted-foreground mt-1">{e.school}</div>
                <p className="mt-3 leading-relaxed text-foreground/90 text-lg break-words">{e.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================== SKILLS =================== */
function Skills({ L }: { L: typeof t["en"] }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section id="skills" className="relative py-14 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <span className="section-label">{L.skills.label}</span>
        <h2 className="mt-4 text-4xl sm:text-6xl font-bold neon-text">{L.skills.title}</h2>
        <div ref={ref} className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {L.skills.cats.map((cat) => (
            <div key={cat.name} className="glass-strong rounded-2xl p-6 neon-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_oklch(0.65_0.27_300/30%)] min-w-0">
              <div className="font-display tracking-widest text-[color:var(--neon-cyan)] text-sm uppercase mb-4 break-words">{cat.name}</div>
              <div className="space-y-3">
                {cat.items.map(([name, val]) => (
                  <div key={name}>
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 text-sm font-mono mb-1">
                      <span className="min-w-0 break-words">{name}</span><span className="shrink-0 text-muted-foreground">{val}%</span>
                    </div>
                    <div className="skill-bar"><span style={{ width: visible ? `${val}%` : "0%" }} /></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================== PROJECTS =================== */
function Projects({ L }: { L: typeof t["en"] }) {
  return (
    <section id="projects" className="relative py-14 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <span className="section-label">{L.projects.label}</span>
        <h2 className="mt-4 text-4xl sm:text-6xl font-bold neon-text">{L.projects.title}</h2>
        <div className="mt-10 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {L.projects.items.map((p, i) => (
            <article key={p.name} className="glass-strong rounded-2xl overflow-hidden group neon-border transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_oklch(0.65_0.27_300/40%)] min-w-0">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={PROJECT_IMAGES[i % PROJECT_IMAGES.length]} alt={p.name} loading="lazy" width={1024} height={640}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                <div className="scan-line" />
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-2xl break-words">{p.name}</h3>
                <p className="text-lg text-muted-foreground mt-2 leading-relaxed break-words">{p.desc}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {p.tech.map((tt) => <span key={tt} className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[color:var(--neon-blue)]/15 text-[color:var(--neon-cyan)] border border-[color:var(--neon-cyan)]/30">{tt}</span>)}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4">
                  <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-neon !text-xs !py-2 !px-3 flex-1 justify-center hover:scale-105 transition">{L.projects.code}</a>
                  <a href="#" className="btn-neon primary !text-xs !py-2 !px-3 flex-1 justify-center hover:scale-105 transition">{L.projects.live}</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


/* =================== CERTIFICATIONS =================== */
function Certifications({ L }: { L: typeof t["en"] }) {
  const [active, setActive] = useState<CertItem | null>(null);
  return (
    <section id="certs" className="relative py-14 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <span className="section-label">{L.certs.label}</span>
        <h2 className="mt-4 text-4xl sm:text-6xl font-bold neon-text">{L.certs.title}</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CERTS.map((c) => (
            <button key={c.url} onClick={() => setActive(c)}
              className="text-left glass-strong rounded-2xl p-5 neon-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_oklch(0.65_0.27_300/40%)] group min-w-0">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="font-mono text-xs tracking-widest text-[color:var(--neon-cyan)]">{c.y}</div>
                <span className="text-xs font-mono text-muted-foreground opacity-100 sm:opacity-0 group-hover:opacity-100 transition text-right">{L.certs.view} →</span>
              </div>
              <div className="font-display font-bold text-xl mt-2 group-hover:text-[color:var(--neon-cyan)] transition break-words">{c.n}</div>
              <div className="text-base text-muted-foreground mt-1 break-words">{c.i}</div>
              <div className="mt-3 inline-flex items-center gap-2 text-sm font-mono text-[color:var(--neon-cyan)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" /></svg>
                PDF
              </div>
            </button>
          ))}
        </div>
      </div>
      {active && <CertModal cert={active} L={L} onClose={() => setActive(null)} />}
    </section>
  );
}

function CertModal({ cert, L, onClose }: { cert: CertItem; L: typeof t["en"]; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center p-4 animate-section-in" style={{ background: "oklch(0.05 0 0 / 75%)", backdropFilter: "blur(10px)" }} onClick={onClose}>
      <div className="glass-strong neon-border rounded-2xl p-4 sm:p-5 w-full max-w-4xl h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-3">
          <div>
            <div className="font-display font-bold text-xl neon-text">{cert.n}</div>
            <div className="text-xs text-muted-foreground font-mono">{cert.i} · {cert.y}</div>
          </div>
          <div className="flex gap-2">
            <a href={cert.url} target="_blank" rel="noreferrer" className="btn-neon !text-xs !py-2 !px-3">↗ Open</a>
            <a href={cert.url} download className="btn-neon primary !text-xs !py-2 !px-3">↓ Download</a>
            <button onClick={onClose} className="btn-neon !text-xs !py-2 !px-3" aria-label={L.certs.close}>✕</button>
          </div>
        </div>
        <iframe src={cert.url} title={cert.n} className="flex-1 w-full rounded-xl border border-[color:var(--neon-cyan)]/20 bg-background" />
      </div>
    </div>
  );
}



/* =================== JOURNALS =================== */
function Journals({ L }: { L: typeof t["en"] }) {
  const [active, setActive] = useState<JournalItem | null>(null);
  return (
    <section id="journals" className="relative py-14 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <span className="section-label">{L.journals.label}</span>
        <h2 className="mt-4 text-4xl sm:text-6xl font-bold neon-text">{L.journals.title}</h2>
        <p className="mt-3 text-lg text-muted-foreground max-w-3xl">{L.journals.subtitle}</p>
        <div className="mt-10 grid sm:grid-cols-2 gap-4">
          {JOURNALS.map((j) => (
            <button key={j.url} onClick={() => setActive(j)}
              className="text-left glass-strong rounded-2xl p-6 neon-border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_oklch(0.65_0.27_300/40%)] group min-w-0">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                <div className="font-mono text-xs tracking-widest text-[color:var(--neon-cyan)]">{j.y}</div>
                <span className="text-xs font-mono text-muted-foreground opacity-100 sm:opacity-0 group-hover:opacity-100 transition text-right">{L.journals.view} →</span>
              </div>
              <div className="font-display font-bold text-2xl mt-2 group-hover:text-[color:var(--neon-cyan)] transition break-words">{j.n}</div>
              <div className="text-base text-muted-foreground mt-1 break-words">{j.i}</div>
              <div className="mt-3 inline-flex items-center gap-2 text-sm font-mono text-[color:var(--neon-cyan)]">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
                PDF
              </div>
            </button>
          ))}
        </div>
      </div>
      {active && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4 animate-section-in" style={{ background: "oklch(0.05 0 0 / 75%)", backdropFilter: "blur(10px)" }} onClick={() => setActive(null)}>
          <div className="glass-strong neon-border rounded-2xl p-4 sm:p-5 w-full max-w-5xl h-[88vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-3 gap-3">
              <div className="min-w-0">
                <div className="font-display font-bold text-xl neon-text truncate">{active.n}</div>
                <div className="text-xs text-muted-foreground font-mono">{active.i}</div>
              </div>
              <div className="flex gap-2">
                <a href={active.url} target="_blank" rel="noreferrer" className="btn-neon !text-xs !py-2 !px-3">↗ Open</a>
                <a href={active.url} download className="btn-neon primary !text-xs !py-2 !px-3">↓ Download</a>
                <button onClick={() => setActive(null)} className="btn-neon !text-xs !py-2 !px-3" aria-label={L.journals.close}>✕</button>
              </div>
            </div>
            <iframe src={active.url} title={active.n} className="flex-1 w-full rounded-xl border border-[color:var(--neon-cyan)]/20 bg-background" />
          </div>
        </div>
      )}
    </section>
  );
}

/* =================== HIRE =================== */
function Hire({ L }: { L: typeof t["en"] }) {
  return (
    <section id="hire" className="relative py-14 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <span className="section-label">{L.hire.label}</span>
        <h2 className="mt-4 text-4xl sm:text-6xl font-bold neon-text">{L.hire.title}</h2>
        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {L.hire.items.map((it, i) => (
            <div key={it.t} className="glass-strong rounded-2xl p-5 neon-border relative transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_15px_40px_oklch(0.65_0.27_300/30%)] min-w-0">
              <div className="font-mono text-xs text-[color:var(--neon-cyan)]">0{i + 1}</div>
              <div className="font-display font-bold text-xl mt-2 break-words">{it.t}</div>
              <div className="text-lg text-muted-foreground mt-2 leading-relaxed break-words">{it.d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =================== CONTACT =================== */
function Contact({ L }: { L: typeof t["en"] }) {
  const [sent, setSent] = useState(false);
  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); setTimeout(() => setSent(false), 4000); (e.target as HTMLFormElement).reset(); };
  return (
    <section id="contact" className="relative py-14 px-3 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <span className="section-label">{L.contact.label}</span>
        <h2 className="mt-4 text-4xl sm:text-6xl font-bold neon-text">{L.contact.title}</h2>
        <p className="mt-3 text-muted-foreground">{L.contact.sub}</p>
        <div className="mt-10 grid lg:grid-cols-[1.3fr_1fr] gap-6">
          <form onSubmit={onSubmit} className="glass-strong rounded-2xl p-6 neon-border space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <input required placeholder={L.contact.name} className="glass rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--neon-cyan)]/60 transition" />
              <input required type="email" placeholder={L.contact.email} className="glass rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--neon-cyan)]/60 transition" />
            </div>
            <input required placeholder={L.contact.subject} className="w-full glass rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--neon-cyan)]/60 transition" />
            <textarea required rows={5} placeholder={L.contact.message} className="w-full glass rounded-lg px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[color:var(--neon-cyan)]/60 resize-none transition" />
            <button className="btn-neon primary w-full justify-center hover:scale-[1.02] transition" type="submit">{L.contact.send} →</button>
            {sent && <div className="text-xs font-mono text-[color:var(--neon-cyan)] animate-section-in">✓ {L.contact.sent}</div>}
          </form>
          <div className="space-y-3">
            <a href="mailto:boddusheshank@gmail.com" className="glass-strong rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 block">
              <span className="w-10 h-10 grid place-items-center rounded-lg text-background" style={{ background: "var(--grad-hero)" }}><Icon.Mail width="20" height="20" /></span>
              <div><div className="font-display font-bold text-sm">Email</div><div className="text-xs text-muted-foreground">boddusheshank@gmail.com</div></div>
            </a>
            <a href="https://linkedin.com/in/sheshank-boddu" target="_blank" rel="noreferrer" className="glass-strong rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 block">
              <span className="w-10 h-10 grid place-items-center rounded-lg text-background" style={{ background: "var(--grad-hero)" }}><Icon.LinkedIn width="20" height="20" /></span>
              <div><div className="font-display font-bold text-sm">LinkedIn</div><div className="text-xs text-muted-foreground">/in/sheshank-boddu</div></div>
            </a>
            <a href="https://github.com/sheshank1212" target="_blank" rel="noreferrer" className="glass-strong rounded-2xl p-4 flex items-center gap-3 hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 block">
              <span className="w-10 h-10 grid place-items-center rounded-lg text-background" style={{ background: "var(--grad-hero)" }}><Icon.GitHub width="20" height="20" /></span>
              <div><div className="font-display font-bold text-sm">GitHub</div><div className="text-xs text-muted-foreground">/sheshank1212</div></div>
            </a>
            <div className="glass rounded-2xl p-4">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[color:var(--neon-cyan)] mb-2">LOCATION</div>
              {L.contact.locations.map((l) => <div key={l} className="text-sm">📍 {l}</div>)}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* =================== FOOTER =================== */
function Footer({ L }: { L: typeof t["en"] }) {
  return (
    <footer className="relative py-12 px-3 sm:px-6 border-t border-[color:var(--neon-blue)]/20 mt-12">
      <div className="max-w-7xl mx-auto grid sm:grid-cols-[1fr_auto] gap-6 items-center">
        <div>
          <div className="font-display text-xl font-black neon-text">SHESHANK BODDU</div>
          <div className="text-base text-muted-foreground mt-1">{L.footer.tagline}</div>
          <div className="text-[11px] font-mono text-muted-foreground mt-3">© {new Date().getFullYear()} Sheshank Boddu · {L.footer.rights}</div>
        </div>
        <SocialLinks />
      </div>
    </footer>
  );
}

/* =================== BACK TO TOP =================== */
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full glass-strong neon-border grid place-items-center font-bold animate-pulse-glow hover:scale-110 transition"
      aria-label="Back to top">↑</button>
  );
}

