"use client";

import { useCopy } from "@/hooks/useCopy";
import { useStage } from "@/store/stage";

export function LocaleToggle() {
  const copy = useCopy();
  const locale = useStage((state) => state.locale);
  const setLocale = useStage((state) => state.setLocale);

  return (
    <button
      type="button"
      className="min-h-11 cursor-pointer px-2 font-mono text-xs"
      aria-label={copy.a11y.locale}
      aria-pressed={locale === "en"}
      onClick={() => setLocale(locale === "pt" ? "en" : "pt")}
    >
      PT // EN
    </button>
  );
}
