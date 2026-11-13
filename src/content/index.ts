import { en } from "@/content/en";
import { pt, type Copy } from "@/content/pt";
import type { Locale } from "@/lib/locale";

export type { Copy };

export function getCopy(locale: Locale): Copy {
  return locale === "en" ? en : pt;
}
