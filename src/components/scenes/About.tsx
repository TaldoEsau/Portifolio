"use client";

import { TextAnimate } from "@/components/cult-ui/text-animate";
import { Postgrad } from "@/components/scenes/Postgrad";
import { SceneFrame } from "@/components/stage/SceneFrame";
import { CurriculumSection } from "@/components/ui/CurriculumSection";
import { useCopy } from "@/hooks/useCopy";

export function About() {
  const copy = useCopy();

  return (
    <SceneFrame id="sobre">
      <div className="grid max-w-[68ch] gap-4">
        {copy.about.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
      <section aria-labelledby="cronologia" className="grid gap-3">
        <TextAnimate id="cronologia" text={copy.about.timelineTitle} className="font-display text-2xl" />
        <ol className="stagger timeline grid gap-3">
          {copy.about.timeline.map((item) => (
            <li key={item.label} className="timeline-item relative border-l border-accent pl-4">
              <p className="font-mono text-sm text-accent">{item.label}</p>
              <p className="text-muted">{item.detail}</p>
            </li>
          ))}
        </ol>
      </section>
      <CurriculumSection />
      <Postgrad />
      <section aria-labelledby="protocolo" className="grid gap-3">
        <TextAnimate id="protocolo" text={copy.about.protocolTitle} className="font-display text-2xl" />
        <ol className="stagger grid gap-3">
          {copy.about.protocol.map((step) => (
            <li key={step.code} className="lift border border-line bg-surface p-4">
              <p className="font-mono text-sm text-hologram">{step.code}</p>
              <p className="mt-1">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>
      <p>
        <span className="font-mono text-xs text-muted">
          {copy.about.availabilityLabel}:{" "}
        </span>
        {copy.about.availability}
      </p>
    </SceneFrame>
  );
}
