// 轻量前端埋点：fire-and-forget，不阻塞 UI，失败静默
export type TrackEvent =
  | "search_attempt"
  | "search_miss"
  | "premium_modal_view"
  | "premium_cta_click"
  | "login_gate_view"
  | "login_gate_click";

export function track(event: TrackEvent, data?: Record<string, string>) {
  try {
    const payload = JSON.stringify({ e: event, ...data });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", payload);
    } else {
      fetch("/api/track", { method: "POST", body: payload, keepalive: true }).catch(() => {});
    }
  } catch {}
}
