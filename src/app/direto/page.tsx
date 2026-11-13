import type { Metadata } from "next";
import { DataPad } from "@/components/direct/DataPad";
import { pt } from "@/content/pt";

export const metadata: Metadata = {
  title: pt.direto.kicker,
  description: pt.meta.description,
  alternates: { canonical: "/direto" },
};

export default function DiretoPage() {
  return <DataPad />;
}
