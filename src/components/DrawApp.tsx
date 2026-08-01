"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { DEFAULT_OPTIONS, generateDraw, type DrawOptions } from "@/lib/draw";
import { decodeSeed, encodeSeed, freshSeed } from "@/lib/rng";
import { downloadCsv, downloadIcs } from "@/lib/export";
import { DIR, LANGS, T, isLang, nf, type Lang } from "@/lib/i18n";
import { TEAMS } from "@/lib/teams";
import { Crest } from "./Crest";
import { RoundsView } from "./RoundsView";
import { TeamView } from "./TeamView";
import { GridView } from "./GridView";
import { AuditView } from "./AuditView";
import { PrintSheet } from "./PrintSheet";
import { Landing } from "./Landing";

type Phase = "idle" | "drawing" | "done";
type Tab = "rounds" | "teams" | "grid" | "audit";

const REVEAL_MS = 900;

/**
 * L'URL est la source de vérité unique : le tirage affiché, les réglages et la
 * langue s'y lisent intégralement, et rien n'est dupliqué dans un état React.
 *
 * C'est ce qui fait marcher la navigation. Un tirage empile une entrée
 * d'historique (`pushState`), donc « Précédent » ramène à l'accueil, et
 * l'accueil est simplement l'URL sans graine. Tant que le résultat vivait dans
 * un `useState`, il masquait l'URL et aucun retour arrière n'était possible.
 *
 * `pushState` n'émet aucun événement : on prévient nous-mêmes les abonnés.
 */
const locationListeners = new Set<() => void>();

function navigate(url: string, { replace = false } = {}) {
  if (replace) window.history.replaceState(null, "", url);
  else window.history.pushState(null, "", url);
  for (const notify of locationListeners) notify();
}

const subscribeToLocation = (onChange: () => void) => {
  locationListeners.add(onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    locationListeners.delete(onChange);
    window.removeEventListener("popstate", onChange);
  };
};
const readEnv = () => `${window.location.search}|${navigator.language ?? ""}`;
const readEnvOnServer = () => "|";

export function DrawApp() {
  const env = useSyncExternalStore(subscribeToLocation, readEnv, readEnvOnServer);
  const [search, navLang] = useMemo(() => {
    const i = env.lastIndexOf("|");
    return [env.slice(0, i), env.slice(i + 1, i + 3)];
  }, [env]);
  const params = useMemo(() => new URLSearchParams(search), [search]);

  // Réglages et tirage éventuellement transportés par le lien partagé
  const urlOptions = useMemo<DrawOptions>(
    () => ({
      ...DEFAULT_OPTIONS,
      maxSameMetroHome: clampMetro(Number(params.get("m"))),
      protectOpeningAndFinale: params.get("p") !== "0",
    }),
    [params],
  );
  const urlSeed = useMemo(() => decodeSeed(params.get("s") ?? ""), [params]);
  const urlResult = useMemo(
    () => (urlSeed === null ? null : generateDraw(urlSeed, urlOptions)),
    [urlSeed, urlOptions],
  );

  // Seuls des états d'interface, jamais l'état de navigation.
  const [drawing, setDrawing] = useState(false);
  const [seedEdit, setSeedEdit] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("rounds");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const urlLang = params.get("lang");
  const lang: Lang = isLang(urlLang) ? urlLang : isLang(navLang) ? navLang : "fr";
  const options = urlOptions;
  const result = urlResult;
  // Sans résultat on est à l'accueil, quoi qu'ait pu laisser traîner le minuteur.
  const phase: Phase = !result ? "idle" : drawing ? "drawing" : "done";
  const seedInput = seedEdit ?? (result ? encodeSeed(result.seed) : "");

  const t = T[lang];
  const dir = DIR[lang];
  const revealTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
  }, [lang, dir]);

  useEffect(() => () => {
    if (revealTimer.current) clearTimeout(revealTimer.current);
  }, []);

  /* ── construction des URLs ─────────────────────────────────────────────── */
  /** Fabrique l'URL décrivant un état donné ; `seed: null` = l'accueil. */
  const buildUrl = useCallback(
    (next: { seed?: number | null; opts?: DrawOptions; lang?: Lang }) => {
      const seed = next.seed !== undefined ? next.seed : urlSeed;
      const o = next.opts ?? options;
      const l = next.lang ?? lang;
      const p = new URLSearchParams();
      if (seed !== null) p.set("s", encodeSeed(seed));
      if (o.maxSameMetroHome !== DEFAULT_OPTIONS.maxSameMetroHome)
        p.set("m", String(o.maxSameMetroHome));
      if (!o.protectOpeningAndFinale) p.set("p", "0");
      p.set("lang", l);
      return `${window.location.pathname}?${p}`;
    },
    [urlSeed, options, lang],
  );

  const shareUrl = result ? `${window.location.origin}${buildUrl({})}` : "";

  /* ── navigation ────────────────────────────────────────────────────────── */
  const runDraw = useCallback(
    (explicitSeed?: number, opts: DrawOptions = options) => {
      const seed = explicitSeed ?? freshSeed();
      setSeedEdit(null);

      // Empile une entrée : « Précédent » ramènera à l'écran actuel.
      navigate(buildUrl({ seed, opts }));

      // Le calcul est synchrone et tient en quelques millisecondes ; l'animation
      // ne sert qu'à donner à voir le tirage.
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      if (revealTimer.current) clearTimeout(revealTimer.current);
      if (reduced) return;
      setDrawing(true);
      revealTimer.current = setTimeout(() => setDrawing(false), REVEAL_MS);
    },
    [options, buildUrl],
  );

  /** Retour à l'accueil — même geste que « Précédent », en explicite. */
  const goHome = useCallback(() => {
    if (revealTimer.current) clearTimeout(revealTimer.current);
    setDrawing(false);
    navigate(buildUrl({ seed: null }));
  }, [buildUrl]);

  /** La langue ne mérite pas une entrée d'historique : on remplace. */
  const changeLang = (l: Lang) => navigate(buildUrl({ lang: l }), { replace: true });

  const applySeed = () => {
    const s = decodeSeed(seedInput);
    if (s !== null) runDraw(s);
  };

  const changeOptions = (patch: Partial<DrawOptions>) => {
    navigate(buildUrl({ opts: { ...options, ...patch } }), { replace: true });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("", shareUrl);
    }
  };

  const stats = result?.stats;
  const conflictFree = (stats?.hardViolations ?? 1) === 0;

  return (
    <>
      {/**
       * Deux régimes d'affichage volontairement différents :
       *
       *  - accueil : page qui défile normalement, c'est une page de présentation
       *    et le défilement y est le mode de lecture attendu ;
       *  - résultats : console à hauteur d'écran, en-tête et outils fixes, seule
       *    la zone de contenu défile. Le tirage ne renvoie donc jamais
       *    l'utilisateur « plus bas dans la page » — il n'y a pas de plus bas.
       */}
      <div
        className={`screen-only relative z-10 flex flex-col ${
          phase === "idle" ? "min-h-dvh" : "h-dvh overflow-hidden"
        }`}
      >
        {/* ─── en-tête ───────────────────────────────────────────────────── */}
        <header className="no-print sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-line bg-canvas/75 px-4 backdrop-blur-xl">
          {/* La marque ramène à l'accueil — le réflexe attendu sur tout site. */}
          <button
            type="button"
            onClick={goHome}
            disabled={phase === "idle"}
            aria-label={t.backHome}
            className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-start transition disabled:cursor-default enabled:hover:opacity-80"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-flag text-sm font-black text-white">
              1
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-bold leading-tight">{t.brand}</span>
              <span className="block truncate text-[11px] leading-tight text-mute">
                {t.season}
              </span>
            </span>
          </button>

          {phase !== "idle" && (
            <button
              type="button"
              onClick={goHome}
              className="shrink-0 rounded-lg border border-line bg-surface px-3 py-2 text-xs font-semibold shadow-sm transition hover:border-line-strong hover:bg-sunken"
            >
              {t.backHome}
            </button>
          )}

          {phase === "idle" ? (
            <a
              href="#contact"
              className="hidden shrink-0 rounded-lg px-3 py-2 text-xs font-semibold text-mute transition hover:text-ink sm:block"
            >
              {t.contactKicker}
            </a>
          ) : (
            <button
              type="button"
              onClick={() => runDraw()}
              disabled={phase === "drawing"}
              className="hidden shrink-0 rounded-lg bg-flag px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-flag/25 transition hover:bg-flag-soft active:scale-[0.98] disabled:opacity-70 sm:block"
            >
              {t.ctaAgain}
            </button>
          )}

          <div className="flex shrink-0 gap-1 rounded-lg bg-sunken p-0.5">
            {LANGS.map((l) => (
              <button
                key={l.id}
                onClick={() => changeLang(l.id)}
                aria-pressed={lang === l.id}
                className={`rounded-md px-2.5 py-1 text-xs font-bold transition ${
                  lang === l.id
                    ? "bg-surface text-ink shadow-sm ring-1 ring-line"
                    : "text-mute hover:text-ink"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </header>

        {/* ─── accueil ───────────────────────────────────────────────────── */}
        {phase === "idle" && <Landing lang={lang} t={t} onDraw={() => runDraw()} />}

        {/* ─── mise en scène du tirage ───────────────────────────────────── */}
        {phase === "drawing" && (
          <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-6 px-4">
            <div className="flex max-w-lg flex-wrap justify-center gap-2">
              {TEAMS.map((team, i) => (
                <span
                  key={team.id}
                  className="sweep relative overflow-hidden rounded-lg"
                  style={{ animationDelay: `${i * 45}ms` }}
                >
                  <Crest team={team} size={34} />
                </span>
              ))}
            </div>
            <p className="text-sm font-semibold text-mute">{t.ctaWorking}</p>
          </div>
        )}

        {/* ─── résultats ─────────────────────────────────────────────────── */}
        {result && phase === "done" && (
          <div className="flex min-h-0 flex-1 flex-col">
            {/* barre de contrôle : mesures à gauche, actions à droite */}
            <div className="no-print flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2 border-b border-line px-4 py-2.5">
              <div className="flex items-center gap-3 text-xs">
                <Chip
                  value={`${stats!.computeMs.toFixed(1)} ms`}
                  label={t.statCompute}
                  tone="accent"
                />
                <Chip value={nf(lang, result.matches.length)} label={t.statMatches} />
                <Chip value={nf(lang, result.rounds.length)} label={t.statRounds} />
                <Chip
                  value={conflictFree ? t.noConflict : nf(lang, stats!.hardViolations)}
                  label={t.statConflicts}
                  tone={conflictFree ? "good" : "bad"}
                />
              </div>

              <div className="flex flex-1 flex-wrap items-center justify-end gap-1.5">
                <div className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-2 py-1 shadow-sm">
                  <label htmlFor="seed" className="text-[10px] font-semibold uppercase text-mute">
                    {t.optSeed}
                  </label>
                  <input
                    id="seed"
                    value={seedInput}
                    onChange={(e) => setSeedEdit(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && applySeed()}
                    spellCheck={false}
                    dir="ltr"
                    className="w-20 bg-transparent font-mono text-sm font-bold tracking-wider outline-none"
                  />
                  <button
                    onClick={applySeed}
                    className="rounded bg-sunken px-1.5 py-0.5 text-[10px] font-semibold transition hover:bg-ink/12"
                  >
                    {t.apply}
                  </button>
                </div>

                <ToolButton onClick={copyLink}>{copied ? t.shared : t.share}</ToolButton>
                <ToolButton onClick={() => downloadCsv(result)}>{t.csv}</ToolButton>
                <ToolButton onClick={() => downloadIcs(result)}>{t.ics}</ToolButton>
                <ToolButton onClick={() => window.print()}>{t.print}</ToolButton>
                <ToolButton onClick={() => setSettingsOpen((v) => !v)} pressed={settingsOpen}>
                  {t.optionsTitle}
                </ToolButton>
                <button
                  type="button"
                  onClick={() => runDraw()}
                  className="rounded-lg bg-flag px-3 py-2 text-xs font-bold text-white shadow-sm shadow-flag/25 transition hover:bg-flag-soft active:scale-[0.98] sm:hidden"
                >
                  {t.ctaAgain}
                </button>
              </div>
            </div>

            {settingsOpen && (
              <div className="no-print grid shrink-0 gap-4 border-b border-line bg-surface px-4 py-3 sm:grid-cols-2">
                <label className="text-xs">
                  <span className="font-semibold">{t.optMetro}</span>
                  <select
                    value={options.maxSameMetroHome}
                    onChange={(e) => changeOptions({ maxSameMetroHome: Number(e.target.value) })}
                    className="mt-1.5 w-full rounded-lg border border-line bg-canvas px-2 py-1.5 text-sm"
                  >
                    {/* 2 est mathématiquement impossible : le Grand Tunis compte
                        6 clubs, dont l'Espérance et le Club Africain qui
                        alternent déjà à Radès. */}
                    {[3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>
                        {n}
                        {n === 3 ? ` — ${t.strict}` : ""}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex items-start gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={options.protectOpeningAndFinale}
                    onChange={(e) => changeOptions({ protectOpeningAndFinale: e.target.checked })}
                    className="mt-0.5 h-4 w-4 accent-flag"
                  />
                  <span className="font-semibold">{t.optProtect}</span>
                </label>

                <p className="text-[11px] leading-relaxed text-mute sm:col-span-2">{t.legNote}</p>
              </div>
            )}

            {/* onglets */}
            <div
              role="tablist"
              aria-label={t.brand}
              className="no-print flex shrink-0 gap-1 overflow-x-auto border-b border-line px-4"
            >
              {(
                [
                  ["rounds", t.tabRounds],
                  ["teams", t.tabTeams],
                  ["grid", t.tabGrid],
                  ["audit", t.tabAudit],
                ] as Array<[Tab, string]>
              ).map(([id, label]) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => setTab(id)}
                  className={`-mb-px shrink-0 border-b-2 px-4 py-2.5 text-sm font-semibold transition ${
                    tab === id
                      ? "border-flag text-ink"
                      : "border-transparent text-mute hover:text-ink"
                  }`}
                >
                  {label}
                  {id === "audit" && (
                    <span
                      className={`ms-1.5 inline-block h-1.5 w-1.5 rounded-full ${
                        conflictFree ? "bg-jade" : "bg-flag-soft"
                      }`}
                      aria-hidden
                    />
                  )}
                </button>
              ))}
            </div>

            {/* seule cette zone défile */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
              {tab === "rounds" && <RoundsView result={result} lang={lang} t={t} />}
              {tab === "teams" && <TeamView result={result} lang={lang} t={t} />}
              {tab === "grid" && <GridView result={result} lang={lang} t={t} />}
              {tab === "audit" && <AuditView result={result} lang={lang} t={t} />}
            </div>
          </div>
        )}
      </div>

      {/* Document papier — invisible à l'écran, seul visible à l'impression. */}
      {result && <PrintSheet result={result} lang={lang} t={t} />}
    </>
  );
}

/** 2 réceptions simultanées maximum est impossible avec 6 clubs dans le Grand Tunis. */
function clampMetro(n: number) {
  return Number.isFinite(n) && n >= 3 && n <= 6 ? n : DEFAULT_OPTIONS.maxSameMetroHome;
}

/** Mesure compacte de la barre de contrôle. */
function Chip({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone?: "good" | "bad" | "accent";
}) {
  return (
    <span className="flex items-baseline gap-1.5 whitespace-nowrap" title={label}>
      <span
        className={`font-mono text-sm font-black tabular-nums ${
          tone === "good"
            ? "text-jade"
            : tone === "bad"
              ? "text-flag-soft"
              : tone === "accent"
                ? "text-gold"
                : ""
        }`}
      >
        {value}
      </span>
      <span className="hidden text-[10px] uppercase tracking-wide text-mute lg:inline">
        {label}
      </span>
    </span>
  );
}

function ToolButton({
  onClick,
  children,
  pressed,
}: {
  onClick: () => void;
  children: React.ReactNode;
  pressed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={pressed}
      className={`rounded-lg border border-line px-2.5 py-2 text-xs font-semibold shadow-sm transition hover:border-line-strong hover:bg-sunken ${
        pressed ? "bg-sunken text-ink" : "bg-surface"
      }`}
    >
      {children}
    </button>
  );
}
