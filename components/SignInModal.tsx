"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Lang, ui } from "@/lib/i18n";

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export default function SignInModal({
  open, onClose, lang, emailEnabled,
}: {
  open: boolean;
  onClose: () => void;
  lang: Lang;
  emailEnabled: boolean;
}) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const t = (key: keyof typeof ui) => ui[key][lang];

  if (!open) return null;

  const handleEmail = async () => {
    if (!email.includes("@") || busy) return;
    setBusy(true);
    try {
      await signIn("resend", { email, redirect: false, callbackUrl: "/" });
      setSent(true);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-zinc-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-3xl border border-zinc-700 bg-zinc-900 p-6 anim-in relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 w-8 h-8 rounded-full text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center mt-2">{t("signInTitle")}</h2>
        <p className="text-sm text-zinc-400 text-center mt-1 mb-6">{t("signInSub")}</p>

        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full h-12 rounded-2xl bg-white text-[#1f1f1f] font-semibold flex items-center justify-center gap-3 active:scale-95 transition border border-zinc-300"
        >
          <GoogleLogo />
          {t("continueGoogle")}
        </button>

        {emailEnabled && (
          <>
            <div className="flex items-center gap-3 my-5">
              <span className="flex-1 h-px bg-zinc-800" />
              <span className="text-[10px] tracking-widest text-zinc-500">
                {t("orContinueWith")}
              </span>
              <span className="flex-1 h-px bg-zinc-800" />
            </div>
            {sent ? (
              <p className="text-sm text-emerald-400 text-center py-3">{t("checkInbox")}</p>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEmail()}
                  placeholder="name@example.com"
                  className="w-full h-12 px-4 rounded-2xl bg-zinc-800/80 border border-zinc-700 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-emerald-500/60 mb-2"
                />
                <button
                  onClick={handleEmail}
                  disabled={busy || !email.includes("@")}
                  className="w-full h-12 rounded-2xl bg-zinc-800 text-zinc-200 font-semibold flex items-center justify-center gap-2 active:scale-95 transition disabled:opacity-40"
                >
                  ✉️ {busy ? "…" : t("continueEmail")}
                </button>
              </>
            )}
          </>
        )}

        <p className="text-[11px] text-zinc-600 text-center mt-5">{t("agreeNote")}</p>
      </div>
    </div>
  );
}
