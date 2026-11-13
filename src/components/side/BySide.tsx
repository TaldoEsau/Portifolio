"use client";

import type { ReactNode } from "react";
import { useSide } from "@/components/side/SideProvider";

/** Renders only the active side's subtree, so heavy effects passed as next/dynamic components never load for the other side. */
export function BySide({ light, dark }: { light: ReactNode; dark: ReactNode }) {
  const { side } = useSide();
  return <>{side === "light" ? light : dark}</>;
}
