"use client";

import { getCopy } from "@/content";
import { useStage } from "@/store/stage";

export function useCopy() {
  return getCopy(useStage((state) => state.locale));
}
