"use client";

import { useEffect, useState } from "react";
import { useStage } from "@/store/stage";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#/[]";

type DecryptedTextProps = {
  text: string;
  className?: string;
  active?: boolean;
};

export function DecryptedText({
  text,
  className,
  active = true,
}: DecryptedTextProps) {
  const reduced = useStage((state) => state.reducedMotion);
  const [source, setSource] = useState(text);
  const [shown, setShown] = useState<string | null>(null);
  if (source !== text) {
    setSource(text);
    setShown(null);
  }

  useEffect(() => {
    if (!active || reduced) return;
    let frame = 0;
    const total = text.length;
    const timer = window.setInterval(() => {
      frame += 1;
      const reveal = Math.min(total, Math.floor(frame / 2));
      const next = text
        .split("")
        .map((char, index) => {
          if (char === " " || index < reveal) return char;
          return GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? char;
        })
        .join("");
      setShown(next);
      if (reveal >= total) window.clearInterval(timer);
    }, 50);
    return () => window.clearInterval(timer);
  }, [active, reduced, text]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="block min-h-[1.15em]">
        {!active || reduced || shown === null ? text : shown}
      </span>
    </span>
  );
}
