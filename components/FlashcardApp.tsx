"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { allTeams, allPlayers, groups, tagColors } from "@/data";
import { Team, PlayerCard, PlayerDetail } from "@/lib/types";
import {
  Lang, ui, tagMap, confMap, ratingMap, trPosition, trClub, trCoach, anglicize,
} from "@/lib/i18n";
import { track } from "@/lib/track";
import {
  Match, allMatches, matchesOnLocalDate, localDateStr, localKickoff, trStage, matchCity,
} from "@/lib/matches";
import { signOut } from "next-auth/react";
import SignInModal from "@/components/SignInModal";
import playerPhotosJson from "@/data/player-photos.json";
import type { SquadEntry } from "@/data/heavy";
import type { PlayerEn } from "@/data/en";
import type { TeamEn } from "@/data/en";

const playerImages = playerPhotosJson as Record<string, string>;

// 列表/搜索/卡背用96px小头像（~2KB），卡片正面才用640px大图
const thumbOf = (p: string) => p.replace("/players/", "/thumbs/");

// 重数据（详情/英文内容/官方名单）在首屏渲染后异步加载，避免拖慢首包
interface HeavyData {
  playerDetails: Record<string, PlayerDetail>;
  playersEn: Record<string, PlayerEn>;
  teamsEn: Record<string, TeamEn>;
  squadIndex: SquadEntry[];
}

type Mode = "team" | "player";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function playerId(p: PlayerCard) {
  return `${p.teamId}:${p.nameEn}`;
}

type View = "landing" | "matches" | "deck" | "browse";

export default function FlashcardApp() {
  const [lang, setLang] = useState<Lang>("en");
  const [view, setView] = useState<View>("landing");
  const [matchDeck, setMatchDeck] = useState<Match | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("player");
  const [group, setGroup] = useState<string>("all");
  const [groupListOpen, setGroupListOpen] = useState(false); // 组内球员列表（方块→列表→卡组）

  useEffect(() => {
    setMounted(true);
    // 深链：/?browse=team|player 直达二级浏览列表（SEO页CTA入口）
    try {
      const b = new URLSearchParams(window.location.search).get("browse");
      if (b === "team" || b === "player") {
        setView("browse");
        setMode(b);
        setGroup("all");
      }
    } catch {}
  }, []);
  const [onlyUnmastered, setOnlyUnmastered] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [order, setOrder] = useState<string[] | null>(null);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState<Set<string>>(new Set());
  const [anim, setAnim] = useState<"" | "anim-out-left" | "anim-out-right" | "anim-in">("");
  const [query, setQuery] = useState("");
  const [premiumOpen, setPremiumOpen] = useState(false);
  const [premiumThanks, setPremiumThanks] = useState(false);
  const [me, setMe] = useState<{
    user: { name: string; email: string; image: string } | null;
    premium: boolean;
    authEnabled: boolean;
    emailEnabled?: boolean;
  }>({ user: null, premium: false, authEnabled: false });
  const [signInOpen, setSignInOpen] = useState(false);
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 登录后：拉取云端进度并与本地合并（取并集），再写回云端
  useEffect(() => {
    if (!me.user) return;
    (async () => {
      try {
        const r = await fetch("/api/progress");
        if (!r.ok) return;
        const cloud = (await r.json()) as { team: string[]; player: string[]; viewed: number };
        const merged: Record<string, string[]> = {};
        for (const m of ["team", "player"] as const) {
          const localRaw = localStorage.getItem(`wc26-mastered-${m}`);
          const local: string[] = localRaw ? JSON.parse(localRaw) : [];
          merged[m] = [...new Set([...local, ...cloud[m]])];
          localStorage.setItem(`wc26-mastered-${m}`, JSON.stringify(merged[m]));
        }
        setMastered(new Set(merged[mode]));
        const v = Math.max(cloud.viewed, Number(localStorage.getItem("wc26-viewed") ?? 0));
        localStorage.setItem("wc26-viewed", String(v));
        setViewed(v);
        fetch("/api/progress", {
          method: "POST",
          body: JSON.stringify({ team: merged.team, player: merged.player, viewed: v }),
        }).catch(() => {});
      } catch {}
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [me.user]);

  // 进度变更后防抖2秒同步云端
  const scheduleSync = useCallback(() => {
    if (!me.user) return;
    if (syncTimer.current) clearTimeout(syncTimer.current);
    syncTimer.current = setTimeout(() => {
      try {
        const team = JSON.parse(localStorage.getItem("wc26-mastered-team") ?? "[]");
        const player = JSON.parse(localStorage.getItem("wc26-mastered-player") ?? "[]");
        const viewed = Number(localStorage.getItem("wc26-viewed") ?? 0);
        fetch("/api/progress", {
          method: "POST",
          body: JSON.stringify({ team, player, viewed }),
          keepalive: true,
        }).catch(() => {});
      } catch {}
    }, 2000);
  }, [me.user]);
  const [heavy, setHeavy] = useState<HeavyData | null>(null);
  // 登录门槛：未登录用户刷满15张卡后引导登录
  const FREE_SWIPES = 15;
  const [viewed, setViewed] = useState(0);
  const [loginGateOpen, setLoginGateOpen] = useState(false);

  useEffect(() => {
    try {
      setViewed(Number(localStorage.getItem("wc26-viewed") ?? 0));
    } catch {}
  }, []);

  const bumpViewed = useCallback(() => {
    setViewed((v) => {
      const next = v + 1;
      try {
        localStorage.setItem("wc26-viewed", String(next));
      } catch {}
      return next;
    });
    scheduleSync();
  }, [scheduleSync]);

  useEffect(() => {
    fetch("/api/me")
      .then((r) => r.json())
      .then(setMe)
      .catch(() => {});
    import("@/data/heavy").then((m) =>
      setHeavy({
        playerDetails: m.playerDetails,
        playersEn: m.playersEn,
        teamsEn: m.teamsEn,
        squadIndex: m.squadIndex,
      })
    );
  }, []);
  const missTracked = useRef<Set<string>>(new Set());
  const attemptTracked = useRef<Set<string>>(new Set());
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const storageKey = `wc26-mastered-${mode}`;
  const t = useCallback(
    (key: keyof typeof ui) => ui[key][lang],
    [lang]
  );

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem("wc26-lang");
      if (savedLang === "zh" || savedLang === "en") setLang(savedLang);
    } catch {}
  }, []);

  const switchLang = (l: Lang) => {
    setLang(l);
    try {
      localStorage.setItem("wc26-lang", l);
    } catch {}
  };

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      setMastered(new Set(raw ? (JSON.parse(raw) as string[]) : []));
    } catch {
      setMastered(new Set());
    }
  }, [storageKey]);

  const saveMastered = useCallback(
    (next: Set<string>) => {
      setMastered(next);
      try {
        localStorage.setItem(storageKey, JSON.stringify([...next]));
      } catch {}
      scheduleSync();
    },
    [storageKey, scheduleSync]
  );

  const baseDeck: { id: string; team?: Team; player?: PlayerCard }[] = useMemo(() => {
    // 比赛卡组：双方全部已有球员卡（仅球员）
    if (view === "deck" && matchDeck?.team1 && matchDeck?.team2) {
      const ids = [matchDeck.team1, matchDeck.team2];
      return allPlayers
        .filter((p) => ids.includes(p.teamId))
        .map((p) => ({ id: playerId(p), player: p }));
    }
    if (mode === "team") {
      return allTeams
        .filter((t) => group === "all" || t.group === group)
        .map((t) => ({ id: t.id, team: t }));
    }
    return allPlayers
      .filter((p) => group === "all" || p.group === group)
      .map((p) => ({ id: playerId(p), player: p }));
  }, [mode, group, view, matchDeck]);

  const openMatch = useCallback((m: Match) => {
    if (!m.team1 || !m.team2) return;
    setMatchDeck(m);
    setView("deck");
    setIndex(0);
    setFlipped(false);
    // 每次进入比赛卡组随机洗牌，首张球员每次不同
    const ids = allPlayers
      .filter((p) => p.teamId === m.team1 || p.teamId === m.team2)
      .map((p) => playerId(p));
    setOrder(shuffleArray(ids));
    setShuffled(true);
    setOnlyUnmastered(false);
  }, []);

  const deck = useMemo(() => {
    let d = baseDeck;
    if (onlyUnmastered) d = d.filter((c) => !mastered.has(c.id));
    if (shuffled && order) {
      const pos = new Map(order.map((id, i) => [id, i]));
      d = [...d].sort((a, b) => (pos.get(a.id) ?? 0) - (pos.get(b.id) ?? 0));
    }
    return d;
  }, [baseDeck, onlyUnmastered, mastered, shuffled, order]);

  const safeIndex = deck.length === 0 ? 0 : Math.min(index, deck.length - 1);
  const card = deck[safeIndex];

  // 预加载相邻卡片照片
  useEffect(() => {
    [1, 2, -1].forEach((off) => {
      const c = deck[(safeIndex + off + deck.length) % deck.length];
      if (c?.player) {
        const src = playerImages[c.id];
        if (src) {
          const img = new Image();
          img.src = src;
        }
      }
    });
  }, [deck, safeIndex]);

  const go = useCallback(
    (dir: 1 | -1) => {
      if (deck.length <= 1) return;
      // 未登录且超过免费浏览额度 → 弹登录浮窗并拦截
      if (me.authEnabled && !me.user && viewed >= FREE_SWIPES) {
        setLoginGateOpen(true);
        track("login_gate_view", { lang });
        return;
      }
      bumpViewed();
      setAnim(dir === 1 ? "anim-out-left" : "anim-out-right");
      setTimeout(() => {
        setFlipped(false);
        setIndex((i) => (i + dir + deck.length) % deck.length);
        setAnim("anim-in");
        setTimeout(() => setAnim(""), 300);
      }, 240);
    },
    [deck.length, me.authEnabled, me.user, viewed, lang, bumpViewed]
  );

  const toggleMastered = useCallback(() => {
    if (!card) return;
    if (me.authEnabled && !me.user) return; // 未登录不开放标记
    const next = new Set(mastered);
    if (next.has(card.id)) next.delete(card.id);
    else next.add(card.id);
    saveMastered(next);
    if (!mastered.has(card.id) && deck.length > 1) go(1);
  }, [card, mastered, saveMastered, deck.length, go, me.authEnabled, me.user]);

  const doShuffle = useCallback(() => {
    setOrder(shuffleArray(baseDeck.map((c) => c.id)));
    setShuffled(true);
    setIndex(0);
    setFlipped(false);
  }, [baseDeck]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) {
        if (e.key === "Escape") setQuery("");
        return;
      }
      if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (e.key.toLowerCase() === "m") toggleMastered();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, toggleMastered]);

  const onTouchStartHandler = (e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEndHandler = (e: React.TouchEvent) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      go(dx < 0 ? 1 : -1);
    }
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setGroup("all"); // 始终回到总览列表，避免困在组内卡组无路可退
    setGroupListOpen(false);
    setIndex(0);
    setFlipped(false);
    setShuffled(false);
    setOrder(null);
  };
  const switchGroup = (g: string) => {
    setGroup(g);
    setGroupListOpen(mode === "player"); // 球员模式先看组内列表
    setIndex(0);
    setFlipped(false);
  };

  const masteredCount = baseDeck.filter((c) => mastered.has(c.id)).length;
  // 标记功能仅向登录用户开放（auth 未配置的环境保持旧行为）
  const canMark = !me.authEnabled || !!me.user;

  // All 筛选 = 总览列表（仅 browse 视图）
  const teamListView = view === "browse" && mode === "team" && group === "all";
  const playerListView = view === "browse" && mode === "player" && group === "all";
  const playerGroupList =
    view === "browse" && mode === "player" && group !== "all" && groupListOpen;
  const listView = teamListView || playerListView || playerGroupList;

  // 赛程数据（挂载后按用户时区计算，避免 SSR 时区错位）
  const todayStr = mounted ? localDateStr(new Date()) : "";
  const todayMatches = mounted ? matchesOnLocalDate(todayStr) : [];
  const nextDateStr = mounted
    ? [...new Set(allMatches.map((m) => m.date))].sort().find((d) => d > todayStr) ?? ""
    : "";
  const upcomingMatches =
    mounted && nextDateStr ? allMatches.filter((m) => m.date === nextDateStr) : [];

  const jumpToTeam = useCallback((team: Team) => {
    setView("browse");
    setMatchDeck(null);
    setMode("team");
    setGroup(team.group);
    setShuffled(false);
    setOrder(null);
    setOnlyUnmastered(false);
    const idx = allTeams.filter((x) => x.group === team.group).findIndex((x) => x.id === team.id);
    setIndex(Math.max(0, idx));
    setFlipped(false);
    setQuery("");
  }, []);

  const jumpToPlayer = useCallback((p: PlayerCard) => {
    setView("browse");
    setMatchDeck(null);
    setGroupListOpen(false);
    setMode("player");
    setGroup(p.group);
    setShuffled(false);
    setOrder(null);
    setOnlyUnmastered(false);
    const idx = allPlayers
      .filter((x) => x.group === p.group)
      .findIndex((x) => playerId(x) === playerId(p));
    setIndex(Math.max(0, idx));
    setFlipped(false);
    setQuery("");
  }, []);

  const searchResults = useMemo(() => {
    const q = anglicize(query.trim()).toLowerCase();
    if (!q) return { teams: [] as Team[], players: [] as PlayerCard[], squad: [] as SquadEntry[] };
    const teams = allTeams
      .filter(
        (x) => x.name.includes(query.trim()) || anglicize(x.nameEn).toLowerCase().includes(q)
      )
      .slice(0, 4);
    const players = allPlayers
      .filter(
        (x) => x.name.includes(query.trim()) || anglicize(x.nameEn).toLowerCase().includes(q)
      )
      .slice(0, 8);
    // 官方名单中存在、但不在我们卡组里的球员 → Premium 锁定结果
    const squad =
      q.length >= 3 && heavy
        ? heavy.squadIndex.filter((s) => s.key.includes(q)).slice(0, 6)
        : [];
    return { teams, players, squad };
  }, [query, heavy]);

  // 仅当查询命中官方名单（真实球员、未收录）时记录 miss 并触发 Premium 浮窗；
  // 无效输入只显示普通无结果，不弹窗
  const noResults =
    query.trim().length >= 2 &&
    searchResults.teams.length === 0 &&
    searchResults.players.length === 0;
  const premiumWorthy = noResults && searchResults.squad.length > 0;

  // 记录搜索尝试（停顿0.8s后，同会话同词去重）
  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return;
    const timer = setTimeout(() => {
      if (!attemptTracked.current.has(q)) {
        attemptTracked.current.add(q);
        track("search_attempt", { lang });
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [query, lang]);

  useEffect(() => {
    if (!premiumWorthy) return;
    const q = query.trim().toLowerCase();
    const timer = setTimeout(() => {
      if (!missTracked.current.has(q)) {
        missTracked.current.add(q);
        track("search_miss", { q, lang });
      }
      let shown = false;
      try {
        shown = sessionStorage.getItem("wc26-premium-shown") === "1";
      } catch {}
      if (!shown) {
        try {
          sessionStorage.setItem("wc26-premium-shown", "1");
        } catch {}
        setPremiumOpen(true);
        track("premium_modal_view", { trigger: "search_miss", lang });
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [premiumWorthy, query, lang]);

  const openPremium = (trigger: string) => {
    setPremiumOpen(true);
    track("premium_modal_view", { trigger, lang });
  };

  const handlePremiumCta = () => {
    track("premium_cta_click", { lang });
    setPremiumThanks(true);
  };

  return (
    <div className="flex flex-col flex-1 max-w-lg w-full mx-auto px-4 pb-6 pt-4 select-none">
      {/* 顶栏 */}
      <header className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 mb-3">
        <h1
          onClick={() => { setView("landing"); setMatchDeck(null); }}
          className="font-bold tracking-tight leading-tight text-sm sm:text-lg whitespace-nowrap cursor-pointer select-none"
        >
          {lang === "en" ? (
            <>
              <span className="block">
                ⚽️ {t("title1")} <span className="text-emerald-400">2026</span>
              </span>
              <span className="block text-center">{t("title2")}</span>
            </>
          ) : (
            <>
              ⚽️ {t("title1")} <span className="text-emerald-400">2026</span> {t("title2")}
            </>
          )}
        </h1>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
          {view === "browse" && (
            <div className="flex rounded-full bg-zinc-800/80 p-1 text-xs sm:text-sm">
              <button
                onClick={() => switchMode("team")}
                className={`px-2.5 sm:px-3 py-1 rounded-full transition ${
                  mode === "team" ? "bg-emerald-500 text-zinc-950 font-semibold" : "text-zinc-400"
                }`}
              >
                {t("teams")}
              </button>
              <button
                onClick={() => switchMode("player")}
                className={`px-2.5 sm:px-3 py-1 rounded-full transition ${
                  mode === "player" ? "bg-emerald-500 text-zinc-950 font-semibold" : "text-zinc-400"
                }`}
              >
                {t("players")}
              </button>
            </div>
          )}
          <button
            onClick={() => switchLang(lang === "en" ? "zh" : "en")}
            className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-zinc-800/80 text-xs text-zinc-300 border border-zinc-700 hover:border-zinc-500 transition"
          >
            {lang === "en" ? "中" : "EN"}
          </button>
          {me.authEnabled &&
            (me.user ? (
              <button
                onClick={() => {
                  if (window.confirm(`${me.user!.email}\n${t("signOut")}?`)) {
                    signOut({ callbackUrl: "/" });
                  }
                }}
                title={`${me.user.email} · ${t("signOut")}`}
                className="relative shrink-0"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={me.user.image}
                  alt={me.user.name}
                  referrerPolicy="no-referrer"
                  className={`w-7 h-7 rounded-full border-2 ${
                    me.premium ? "border-amber-400" : "border-zinc-600"
                  }`}
                />
                {me.premium && (
                  <span className="absolute -top-1 -right-1 text-[9px]">✨</span>
                )}
              </button>
            ) : (
              <button
                onClick={() => setSignInOpen(true)}
                className="px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-full bg-zinc-100 text-zinc-900 text-xs font-semibold whitespace-nowrap"
              >
                {t("signIn")}
              </button>
            ))}
        </div>
      </header>

      {/* Landing：极简首屏 */}
      {view === "landing" && (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2 pb-16">
          <span className="text-6xl mb-6">⚽️</span>
          <h2 className="text-3xl font-bold mb-3">{t("landingTag")}</h2>
          <p className="text-sm text-zinc-400 leading-relaxed max-w-xs mb-8">{t("landingSub")}</p>
          <button
            onClick={() => setView("matches")}
            className="px-10 h-14 rounded-2xl bg-emerald-500 text-zinc-950 text-lg font-bold active:scale-95 transition shadow-lg shadow-emerald-500/20"
          >
            {t("getStarted")}
          </button>
          <p className="mt-10 text-[11px] text-zinc-700">
            <a href="/teams" className="hover:text-zinc-400">All 48 Teams</a>
            {" · "}
            <a href="/players" className="hover:text-zinc-400">All Players</a>
          </p>
        </div>
      )}

      {/* 今日比赛列表 */}
      {view === "matches" && mounted && (
        <div className="flex-1">
          <h2 className="text-sm font-semibold tracking-widest text-emerald-400 mb-3">
            {todayMatches.length > 0 ? t("todaysMatches") : t("noMatchesToday")}
          </h2>
          <div className="grid gap-2">
            {(todayMatches.length > 0 ? todayMatches : upcomingMatches).map((m) => {
              const t1 = allTeams.find((x) => x.id === m.team1);
              const t2 = allTeams.find((x) => x.id === m.team2);
              const playable = !!(t1 && t2);
              return (
                <button
                  key={m.id}
                  onClick={() => playable && openMatch(m)}
                  disabled={!playable}
                  className={`rounded-2xl border bg-zinc-900 px-4 py-3.5 text-left transition ${
                    playable
                      ? "border-zinc-800 hover:border-emerald-500/50 active:scale-[0.99]"
                      : "border-zinc-800/60 opacity-60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-2 min-w-0 flex-1">
                      <span className="text-2xl">{t1?.flag ?? "🏳️"}</span>
                      <span className="font-semibold text-sm truncate">
                        {t1 ? (lang === "en" ? anglicize(t1.nameEn) : t1.name) : m.label1}
                      </span>
                    </span>
                    <span className="shrink-0 text-center px-2">
                      {m.score ? (
                        <span className="text-base font-black text-zinc-200">
                          {m.score}
                          {m.pens && (
                            <span className="block text-[10px] font-medium text-zinc-500">
                              {lang === "zh" ? `点球 ${m.pens}` : `pens ${m.pens}`}
                            </span>
                          )}
                        </span>
                      ) : (
                        <span className="text-xs text-zinc-500">vs</span>
                      )}
                    </span>
                    <span className="flex items-center gap-2 min-w-0 flex-1 justify-end">
                      <span className="font-semibold text-sm truncate text-right">
                        {t2 ? (lang === "en" ? anglicize(t2.nameEn) : t2.name) : m.label2}
                      </span>
                      <span className="text-2xl">{t2?.flag ?? "🏳️"}</span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[11px] text-zinc-500">
                    <span className="min-w-0 truncate pr-2">
                      {trStage(m.stage, lang)} · {matchCity(m, lang)} · {m.venue.split(",")[0]}
                    </span>
                    <span className="shrink-0">{m.score ? t("fullTime") : localKickoff(m, lang)}</span>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="text-center mt-6">
            <button
              onClick={() => setView("browse")}
              className="text-xs text-zinc-500 hover:text-zinc-300 underline underline-offset-4"
            >
              {t("browseAllLink")}
            </button>
            <span className="block mt-1 text-[10px] text-amber-500/70">{t("launchFree")}</span>
          </p>
        </div>
      )}

      {/* 比赛卡组页头 */}
      {view === "deck" && matchDeck && (
        <div className="flex items-center gap-2 mb-3 text-sm">
          <button
            onClick={() => { setView("matches"); setMatchDeck(null); }}
            className="px-2.5 py-1 rounded-full bg-zinc-800/80 text-zinc-300 text-xs shrink-0"
          >
            {t("backMatches")}
          </button>
          <span className="min-w-0 flex-1 truncate text-zinc-300 font-medium">
            {allTeams.find((x) => x.id === matchDeck.team1)?.flag}{" "}
            {lang === "en"
              ? anglicize(allTeams.find((x) => x.id === matchDeck.team1)?.nameEn ?? "")
              : allTeams.find((x) => x.id === matchDeck.team1)?.name}
            {" vs "}
            {lang === "en"
              ? anglicize(allTeams.find((x) => x.id === matchDeck.team2)?.nameEn ?? "")
              : allTeams.find((x) => x.id === matchDeck.team2)?.name}{" "}
            {allTeams.find((x) => x.id === matchDeck.team2)?.flag}
          </span>
          <span className="text-[11px] text-zinc-600 shrink-0">
            {deck.length} {t("matchCards")}
          </span>
        </div>
      )}

      {/* 搜索（browse 视图） */}
      {view === "browse" && (
      <div className="mb-3">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full h-11 px-4 rounded-2xl bg-zinc-800/80 border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500/60"
          />
          {query.trim() && (
            <div className="mt-2 rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden max-h-[50vh] overflow-y-auto scrollbar-thin">
              {searchResults.teams.length === 0 &&
              searchResults.players.length === 0 &&
              searchResults.squad.length === 0 ? (
                <p className="px-4 py-3 text-sm text-zinc-500">{t("noResults")}</p>
              ) : (
                <>
                  {searchResults.teams.map((team) => (
                    <button
                      key={team.id}
                      onClick={() => jumpToTeam(team)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-800/70 transition border-b border-zinc-800/60 last:border-b-0"
                    >
                      <span className="text-xl">{team.flag}</span>
                      <span className="flex-1 text-sm font-medium">
                        {lang === "en" ? anglicize(team.nameEn) : team.name}
                      </span>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                        {lang === "en" ? `Group ${team.group}` : `${team.group}组`}
                      </span>
                    </button>
                  ))}
                  {searchResults.players.map((p) => {
                    const pid = playerId(p);
                    const photo = playerImages[pid];
                    return (
                      <button
                        key={pid}
                        onClick={() => jumpToPlayer(p)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-800/70 transition border-b border-zinc-800/60 last:border-b-0"
                      >
                        {photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumbOf(photo)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="w-8 h-8 shrink-0 rounded-full object-cover border border-zinc-700"
                          />
                        ) : (
                          <span className="w-8 h-8 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center text-base">
                            {p.teamFlag}
                          </span>
                        )}
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-medium truncate">
                            {lang === "en" ? anglicize(p.nameEn) : p.name}
                          </span>
                          <span className="block text-[10px] text-zinc-500 truncate">
                            {p.teamFlag}{" "}
                            {lang === "en"
                              ? `${anglicize(allTeams.find((x) => x.id === p.teamId)?.nameEn ?? p.teamName)} · ${trPosition(p.position)}`
                              : `${p.teamName} · ${p.position}`}
                          </span>
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-sky-500/15 text-sky-400 border border-sky-500/30 shrink-0">
                          {lang === "en" ? `Group ${p.group}` : `${p.group}组`}
                        </span>
                      </button>
                    );
                  })}
                  {searchResults.squad.map((s) => {
                    const team = allTeams.find((x) => x.id === s.teamId);
                    if (!team) return null;
                    return (
                      <button
                        key={`${s.teamId}:${s.name}`}
                        onClick={() => openPremium("locked_player")}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-zinc-800/70 transition border-b border-zinc-800/60 last:border-b-0 opacity-90"
                      >
                        <span className="w-8 h-8 shrink-0 rounded-full bg-zinc-800 border border-amber-500/30 flex items-center justify-center text-sm">
                          🔒
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-medium truncate">
                            {anglicize(s.name)}
                          </span>
                          <span className="block text-[10px] text-zinc-500 truncate">
                            {team.flag}{" "}
                            {lang === "en" ? anglicize(team.nameEn) : team.name} ·{" "}
                            {lang === "en" ? `Group ${team.group}` : `${team.group}组`}
                          </span>
                        </span>
                        <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                          Premium
                        </span>
                      </button>
                    );
                  })}
                </>
              )}
            </div>
          )}
      </div>
      )}

      {/* 总览列表（All 筛选）与卡片区 */}
      {(view === "deck" || view === "browse") && (playerListView ? (
        /* 球员模式 All：12个小组方块（含4国），点入再看组内球员 */
        <div className="flex-1 -mx-4 px-4 overflow-y-auto scrollbar-thin">
          <div className="grid grid-cols-2 gap-2">
            {groups.map((g) => (
              <button
                key={g}
                onClick={() => switchGroup(g)}
                className="rounded-2xl bg-zinc-900 border border-zinc-800 p-3.5 text-left hover:border-emerald-500/50 active:scale-[0.98] transition"
              >
                <span className="block text-xs font-semibold tracking-widest text-emerald-400 mb-2">
                  {lang === "en" ? `GROUP ${g}` : `${g} 组`}
                </span>
                {allTeams
                  .filter((x) => x.group === g)
                  .map((x) => (
                    <span key={x.id} className="flex items-center gap-1.5 text-xs text-zinc-300 leading-6">
                      <span className="text-base">{x.flag}</span>
                      <span className="truncate">
                        {lang === "en" ? anglicize(x.nameEn) : x.name}
                      </span>
                    </span>
                  ))}
              </button>
            ))}
          </div>
        </div>
      ) : playerGroupList ? (
        /* 组内球员列表 */
        <div className="flex-1 -mx-4 px-4 overflow-y-auto scrollbar-thin">
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => { setGroup("all"); setGroupListOpen(false); }}
              className="px-2.5 py-1 rounded-full bg-zinc-800/80 text-zinc-300 text-xs"
            >
              ‹ {lang === "en" ? "Groups" : "小组"}
            </button>
            <span className="text-xs font-semibold tracking-widest text-emerald-400">
              {lang === "en" ? `GROUP ${group}` : `${group} 组`}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {allPlayers
                  .filter((p) => p.group === group)
                  .map((p) => {
                    const pid = playerId(p);
                    const photo = playerImages[pid];
                    const detail = heavy?.playerDetails[pid];
                    return (
                      <button
                        key={pid}
                        onClick={() => jumpToPlayer(p)}
                        className="flex items-center gap-3 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2 text-left hover:border-zinc-600 active:scale-[0.99] transition"
                      >
                        {photo ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={thumbOf(photo)}
                            alt=""
                            loading="lazy"
                            decoding="async"
                            className="w-9 h-9 shrink-0 rounded-full object-cover border border-zinc-700"
                          />
                        ) : (
                          <span className="w-9 h-9 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center text-base">
                            {p.teamFlag}
                          </span>
                        )}
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm font-medium truncate">
                            {lang === "en" ? anglicize(p.nameEn) : p.name}
                          </span>
                          <span className="block text-[10px] text-zinc-500 truncate">
                            {p.teamFlag}{" "}
                            {lang === "en"
                              ? `${anglicize(allTeams.find((x) => x.id === p.teamId)?.nameEn ?? p.teamName)} · ${trPosition(p.position)}`
                              : `${p.teamName} · ${p.position}`}
                          </span>
                        </span>
                        {detail && (
                          <span
                            className={`w-8 h-8 shrink-0 rounded-md bg-gradient-to-b ${overallColor(detail.overall)} flex items-center justify-center text-xs font-black`}
                          >
                            {detail.overall}
                          </span>
                        )}
                        {canMark && mastered.has(pid) && (
                          <span className="text-emerald-400 text-xs">✓</span>
                        )}
                      </button>
                    );
                  })}
          </div>
        </div>
      ) : teamListView ? (
        <div className="flex-1 -mx-4 px-4 overflow-y-auto scrollbar-thin">
          {groups.map((g) => (
            <div key={g} className="mb-4">
              <h2 className="text-xs font-semibold tracking-widest text-emerald-400 mb-2">
                <button onClick={() => switchGroup(g)} className="w-full text-left">
                  {lang === "en" ? `GROUP ${g}` : `${g} 组`}
                </button>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {allTeams
                  .filter((x) => x.group === g)
                  .map((team) => (
                    <button
                      key={team.id}
                      onClick={() => jumpToTeam(team)}
                      className="flex items-center gap-3 rounded-xl bg-zinc-900 border border-zinc-800 px-3 py-2.5 text-left hover:border-zinc-600 active:scale-[0.99] transition"
                    >
                      <span className="text-2xl">{team.flag}</span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-sm font-medium truncate">
                          {lang === "en" ? anglicize(team.nameEn) : team.name}
                        </span>
                        <span className="block text-[10px] text-zinc-500 truncate">
                          {lang === "en" ? tagMap[team.tag] ?? team.tag : team.tag}
                        </span>
                      </span>
                      {canMark && mastered.has(team.id) && (
                        <span className="text-emerald-400 text-xs">✓</span>
                      )}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
      <div
        className="relative flex-1 perspective min-h-[420px]"
        onTouchStart={onTouchStartHandler}
        onTouchEnd={onTouchEndHandler}
      >
        {card ? (
          <div className={`absolute inset-0 ${anim}`}>
            <div
              className={`card-inner relative h-full cursor-pointer ${flipped ? "flipped" : ""}`}
              onClick={() => setFlipped((f) => !f)}
            >
              {card.team ? (
                <TeamCard
                  team={card.team}
                  isMastered={canMark && mastered.has(card.id)}
                  lang={lang}
                  t={t}
                  heavy={heavy}
                />
              ) : (
                <PlayerCardView
                  player={card.player!}
                  isMastered={canMark && mastered.has(card.id)}
                  lang={lang}
                  t={t}
                  heavy={heavy}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 gap-3">
            <span className="text-4xl">🎉</span>
            <p>{t("allDone")}</p>
            <button
              onClick={() => setOnlyUnmastered(false)}
              className="text-emerald-400 underline underline-offset-4"
            >
              {t("showAll")}
            </button>
          </div>
        )}
      </div>
      ))}

      {/* 控制区 */}
      {(view === "deck" || view === "browse") && !listView && (
      <div
        className={`mt-4 grid items-center gap-3 ${
          canMark ? "grid-cols-[1fr_auto_1fr]" : "grid-cols-2"
        }`}
      >
        <button
          onClick={() => go(-1)}
          className="h-12 rounded-2xl bg-zinc-800/80 text-zinc-300 active:scale-95 transition"
        >
          {t("prev")}
        </button>
        {canMark && (
          <button
            onClick={toggleMastered}
            className={`h-12 px-5 rounded-2xl font-semibold active:scale-95 transition ${
              card && mastered.has(card.id)
                ? "bg-zinc-700 text-zinc-300"
                : "bg-emerald-500 text-zinc-950"
            }`}
          >
            {card && mastered.has(card.id) ? t("unknow") : t("know")}
          </button>
        )}
        <button
          onClick={() => go(1)}
          className="h-12 rounded-2xl bg-zinc-800/80 text-zinc-300 active:scale-95 transition"
        >
          {t("next")}
        </button>
      </div>
      )}

      {(view === "deck" || view === "browse") && !listView && (
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-zinc-500">
        <button onClick={doShuffle} className="hover:text-zinc-300 transition">
          {t("shuffle")}
        </button>
        {canMark && (
          <button
            onClick={() => {
              setOnlyUnmastered((v) => !v);
              setIndex(0);
              setFlipped(false);
            }}
            className={`transition ${onlyUnmastered ? "text-emerald-400" : "hover:text-zinc-300"}`}
          >
            {onlyUnmastered ? `✓ ${t("unmasteredOnly")}` : t("unmasteredOnly")}
          </button>
        )}
        <span className="hidden sm:inline">{t("keysHint")}</span>
        <span className="text-zinc-700">
          <a href="/teams" className="hover:text-zinc-400">Teams</a>
          {" · "}
          <a href="/players" className="hover:text-zinc-400">Players</a>
        </span>
      </div>
      )}

      {/* masteredCount 保留供未来统计 */}
      <span className="hidden">{masteredCount}</span>

      {/* 登录浮窗 */}
      <SignInModal
        open={signInOpen}
        onClose={() => setSignInOpen(false)}
        lang={lang}
        emailEnabled={!!me.emailEnabled}
      />

      {/* 登录引导浮窗（15张免费额度用尽） */}
      {loginGateOpen && !me.user && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-sm"
          onClick={() => setLoginGateOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-emerald-500/30 bg-zinc-900 p-6 anim-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-bold mb-2">{t("loginGateTitle")}</h2>
            <p className="text-sm text-zinc-400 leading-relaxed mb-5">{t("loginGateBody")}</p>
            <button
              onClick={() => {
                track("login_gate_click", { lang });
                setLoginGateOpen(false);
                setSignInOpen(true);
              }}
              className="block w-full h-12 rounded-2xl bg-emerald-500 text-zinc-950 font-semibold active:scale-95 transition"
            >
              {t("loginGateCta")}
            </button>
            <button
              onClick={() => setLoginGateOpen(false)}
              className="w-full h-10 mt-2 rounded-2xl text-zinc-500 text-sm hover:text-zinc-300 transition"
            >
              {t("loginGateLater")}
            </button>
          </div>
        </div>
      )}

      {/* Premium 浮窗 */}
      {premiumOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-sm"
          onClick={() => setPremiumOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-amber-500/30 bg-zinc-900 p-6 anim-in"
            onClick={(e) => e.stopPropagation()}
          >
            {me.premium ? (
              <div className="text-center py-4">
                <p className="text-lg mb-2">{t("premiumOwned")}</p>
                <button
                  onClick={() => setPremiumOpen(false)}
                  className="mt-3 px-5 h-11 rounded-2xl bg-zinc-800 text-zinc-300 text-sm"
                >
                  OK
                </button>
              </div>
            ) : premiumThanks ? (
              <div className="text-center py-4">
                <p className="text-2xl mb-2">{t("premiumThanks")}</p>
                <button
                  onClick={() => setPremiumOpen(false)}
                  className="mt-3 px-5 h-11 rounded-2xl bg-zinc-800 text-zinc-300 text-sm"
                >
                  OK
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-lg font-bold mb-2">{t("premiumTitle")}</h2>
                <p className="text-sm text-zinc-400 leading-relaxed mb-5">{t("premiumBody")}</p>
                {process.env.NEXT_PUBLIC_CREEM_CHECKOUT_URL ? (
                  me.user ? (
                    <a
                      href={`${process.env.NEXT_PUBLIC_CREEM_CHECKOUT_URL}?customer_email=${encodeURIComponent(me.user.email)}`}
                      onClick={() => track("premium_cta_click", { lang })}
                      className="block w-full h-12 leading-[48px] text-center rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 font-semibold active:scale-95 transition"
                    >
                      {t("premiumBuy")}
                    </a>
                  ) : (
                    <button
                      onClick={() => {
                        track("premium_cta_click", { lang });
                        setPremiumOpen(false);
                        setSignInOpen(true);
                      }}
                      className="block w-full h-12 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 font-semibold active:scale-95 transition"
                    >
                      {t("premiumSignInFirst")}
                    </button>
                  )
                ) : (
                  <button
                    onClick={handlePremiumCta}
                    className="w-full h-12 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 font-semibold active:scale-95 transition"
                  >
                    {t("premiumCta")}
                  </button>
                )}
                <button
                  onClick={() => setPremiumOpen(false)}
                  className="w-full h-10 mt-2 rounded-2xl text-zinc-500 text-sm hover:text-zinc-300 transition"
                >
                  {t("premiumClose")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type TFunc = (key: keyof typeof ui) => string;

function TeamCard({
  team, isMastered, lang, t, heavy,
}: {
  team: Team; isMastered: boolean; lang: Lang; t: TFunc; heavy: HeavyData | null;
}) {
  const en = heavy?.teamsEn[team.id];
  const primaryName = lang === "en" ? anglicize(team.nameEn) : team.name;
  const secondaryName = lang === "en" ? null : team.nameEn;
  const tag = lang === "en" ? tagMap[team.tag] ?? team.tag : team.tag;
  const style = lang === "en" && en ? anglicize(en.style) : team.style;
  const expectation = lang === "en" && en ? anglicize(en.expectation) : team.expectation;
  const bestResult = lang === "en" && en ? en.bestResult : team.bestResult;
  const conf = lang === "en" ? confMap[team.confederation] ?? team.confederation : team.confederation;
  const coach = lang === "en" ? anglicize(trCoach(team.coach)) : team.coach.split(" (")[0];
  return (
    <>
      {/* 正面 */}
      <div className="card-face absolute inset-0 rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 flex flex-col items-center justify-center gap-4 p-6">
        {isMastered && <Badge>{t("mastered")}</Badge>}
        <span className="text-zinc-600 text-sm tracking-widest">GROUP {team.group}</span>
        <span className="text-7xl drop-shadow">{team.flag}</span>
        <div className="text-center">
          <h2 className="text-3xl font-bold">{primaryName}</h2>
          {secondaryName && <p className="text-zinc-500 mt-1">{secondaryName}</p>}
        </div>
        <span className={`text-xs px-3 py-1 rounded-full border ${tagColors[team.tag]}`}>
          {tag}
        </span>
        <p className="text-zinc-600 text-xs mt-2">{t("tapHint")}</p>
      </div>
      {/* 背面 */}
      <div className="card-face card-back absolute inset-0 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 overflow-y-auto scrollbar-thin">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{team.flag}</span>
          <div>
            <h2 className="text-xl font-bold leading-tight">
              {primaryName}
              <span className="text-zinc-500 text-sm font-normal ml-2">
                {lang === "en" ? `Group ${team.group}` : `${team.group}组`}
              </span>
            </h2>
            <p className="text-xs text-zinc-500">
              {conf} · {t("fifaRank")} #{team.ranking} ·{" "}
              {lang === "en"
                ? `${team.appearances}${ordinal(team.appearances)} appearance`
                : `第${team.appearances}次参赛`}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
          <Info label={t("bestResult")} value={bestResult} />
          <Info label={t("coach")} value={coach} />
        </div>
        <Section title={t("styleSection")}>{style}</Section>
        <Section title={t("expectationSection")}>{expectation}</Section>
        <h3 className="text-sm font-semibold text-emerald-400 mt-3 mb-2">
          {t("keyPlayersSection")}
        </h3>
        <ul className="space-y-2">
          {team.keyPlayers.map((p) => {
            const pid = `${team.id}:${p.nameEn}`;
            const pen = heavy?.playersEn[pid];
            return (
              <li key={p.nameEn} className="rounded-xl bg-zinc-800/60 p-3">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-sm">
                    {lang === "en" ? anglicize(p.nameEn) : p.name}
                  </span>
                  <span className="text-[11px] text-zinc-500 shrink-0">
                    {lang === "en"
                      ? `${trPosition(p.position)} · ${anglicize(trClub(p.club))}`
                      : `${p.position} · ${p.club}`}
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  {lang === "en" && pen ? anglicize(pen.blurb) : p.blurb}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

function ordinal(n: number): string {
  if (n % 100 >= 11 && n % 100 <= 13) return "th";
  return ["th", "st", "nd", "rd"][n % 10 < 4 ? n % 10 : 0];
}

function ratingColor(v: number) {
  if (v >= 85) return "bg-emerald-500";
  if (v >= 75) return "bg-sky-500";
  if (v >= 60) return "bg-amber-500";
  return "bg-zinc-500";
}

function overallColor(v: number) {
  if (v >= 88) return "from-amber-400 to-yellow-600 text-zinc-950";
  if (v >= 82) return "from-emerald-400 to-emerald-600 text-zinc-950";
  if (v >= 76) return "from-sky-400 to-sky-600 text-zinc-950";
  return "from-zinc-400 to-zinc-600 text-zinc-950";
}

function PlayerCardView({
  player, isMastered, lang, t, heavy,
}: {
  player: PlayerCard; isMastered: boolean; lang: Lang; t: TFunc; heavy: HeavyData | null;
}) {
  const id = `${player.teamId}:${player.nameEn}`;
  const photo = playerImages[id];
  const detail = heavy?.playerDetails[id];
  const en = heavy?.playersEn[id];
  const age = detail?.birthYear ? 2026 - detail.birthYear : undefined;
  const primaryName = lang === "en" ? anglicize(player.nameEn) : player.name;
  const secondaryName = lang === "en" ? null : player.nameEn;
  const teamName = lang === "en"
    ? anglicize(allTeams.find((x) => x.id === player.teamId)?.nameEn ?? player.teamName)
    : player.teamName;
  const position = lang === "en" ? trPosition(player.position) : player.position;
  const club = lang === "en" ? anglicize(trClub(player.club)) : player.club;
  const blurb = lang === "en" && en ? anglicize(en.blurb) : player.blurb;
  const background = lang === "en" && en ? anglicize(en.background) : detail?.background;
  const funFact =
    lang === "en" && en
      ? en.funFact
        ? anglicize(en.funFact)
        : undefined
      : detail?.funFact;
  return (
    <>
      <div className="card-face absolute inset-0 rounded-3xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 overflow-hidden">
        {photo && (
          <div
            className="absolute inset-0 bg-cover bg-top"
            style={{ backgroundImage: `url(${photo})` }}
          />
        )}
        {photo && (
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/45 to-transparent" />
        )}
        {detail && (
          <div
            className={`absolute top-4 left-4 w-14 h-14 rounded-xl bg-gradient-to-b ${overallColor(detail.overall)} flex flex-col items-center justify-center shadow-lg`}
          >
            <span className="text-2xl font-black leading-none">{detail.overall}</span>
            <span className="text-[9px] font-bold tracking-wider">OVR</span>
          </div>
        )}
        {isMastered && <Badge>{t("mastered")}</Badge>}
        {photo ? (
          <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col items-center gap-2 text-center">
            <span className="text-zinc-300 text-xs tracking-widest drop-shadow">
              {player.teamFlag} {teamName} · GROUP {player.group}
            </span>
            <h2 className="text-3xl font-bold drop-shadow">{primaryName}</h2>
            {secondaryName && (
              <p className="text-zinc-300 text-sm drop-shadow">{secondaryName}</p>
            )}
            <span className="text-xs px-3 py-1 rounded-full border border-sky-400/40 bg-sky-500/30 text-sky-100 backdrop-blur-sm">
              {position}
            </span>
            <p className="text-zinc-400 text-xs mt-1">{t("tapHint")}</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
            <span className="text-zinc-600 text-sm tracking-widest">
              {player.teamFlag} {teamName} · GROUP {player.group}
            </span>
            <div className="text-center">
              <h2 className="text-3xl font-bold">{primaryName}</h2>
              {secondaryName && <p className="text-zinc-500 mt-1">{secondaryName}</p>}
            </div>
            <span className="text-xs px-3 py-1 rounded-full border border-sky-500/30 bg-sky-500/15 text-sky-400">
              {position}
            </span>
            <p className="text-zinc-600 text-xs mt-2">{t("tapHint")}</p>
          </div>
        )}
      </div>
      <div className="card-face card-back absolute inset-0 rounded-3xl border border-zinc-800 bg-zinc-900 p-5 overflow-y-auto scrollbar-thin">
        <div className="flex items-center gap-3 mb-3">
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbOf(photo)}
              alt=""
              loading="lazy"
              decoding="async"
              className="w-14 h-14 shrink-0 rounded-full object-cover border-2 border-zinc-700"
            />
          ) : (
            <div className="w-14 h-14 shrink-0 rounded-full bg-zinc-800 flex items-center justify-center text-2xl">
              {player.teamFlag}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-bold leading-tight truncate">{primaryName}</h2>
            {secondaryName && (
              <p className="text-xs text-zinc-500 truncate">{secondaryName}</p>
            )}
            <p className="text-[11px] text-zinc-400 truncate">
              {player.teamFlag} {teamName} · {position} · {club}
            </p>
          </div>
          {detail && (
            <div
              className={`w-12 h-12 shrink-0 rounded-lg bg-gradient-to-b ${overallColor(detail.overall)} flex flex-col items-center justify-center`}
            >
              <span className="text-xl font-black leading-none">{detail.overall}</span>
              <span className="text-[8px] font-bold tracking-wider">OVR</span>
            </div>
          )}
        </div>
        {detail && (age || detail.height) && (
          <div className="flex gap-2 text-[11px] text-zinc-400 mb-3">
            {age && (
              <span className="px-2 py-0.5 rounded bg-zinc-800">
                {lang === "en" ? `${age} ${t("ageSuffix")}` : `${age}岁`}
              </span>
            )}
            {detail.height && (
              <span className="px-2 py-0.5 rounded bg-zinc-800">{detail.height}cm</span>
            )}
            <span className="px-2 py-0.5 rounded bg-zinc-800">
              {lang === "en" ? `Group ${player.group}` : `${player.group}组`}
            </span>
          </div>
        )}
        {detail && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-3">
            {detail.ratings.map((r) => (
              <div key={r.label}>
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className="text-zinc-400">
                    {lang === "en" ? ratingMap[r.label] ?? r.label : r.label}
                  </span>
                  <span className="font-bold text-zinc-200">{r.value}</span>
                </div>
                <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${ratingColor(r.value)}`}
                    style={{ width: `${r.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
        <h3 className="text-xs font-semibold text-emerald-400 mb-1">{t("traitSection")}</h3>
        <p className="text-[13px] text-zinc-300 leading-relaxed mb-3">{blurb}</p>
        {background && (
          <>
            <h3 className="text-xs font-semibold text-emerald-400 mb-1">{t("careerSection")}</h3>
            <p className="text-[13px] text-zinc-300 leading-relaxed mb-3">{background}</p>
          </>
        )}
        {funFact && (
          <>
            <h3 className="text-xs font-semibold text-amber-400 mb-1">{t("funFactSection")}</h3>
            <p className="text-[13px] text-zinc-300 leading-relaxed">{funFact}</p>
          </>
        )}
      </div>
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <h3 className="text-sm font-semibold text-emerald-400 mb-1">{title}</h3>
      <p className="text-[13px] text-zinc-300 leading-relaxed">{children}</p>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-zinc-800/60 px-3 py-2">
      <span className="text-zinc-500 block text-[10px]">{label}</span>
      <span className="text-zinc-200">{value}</span>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="absolute top-4 right-4 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
      {children}
    </span>
  );
}
