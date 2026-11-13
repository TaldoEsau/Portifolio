"use client";

import { Bot, Cable, ChevronDown, Database, Server, Workflow } from "lucide-react";
import { CircuitBoard } from "@/components/cult-ui/circuit-board";
import {
  Expandable,
  ExpandableContent,
  ExpandableTrigger,
} from "@/components/cult-ui/expandable";
import { FluidRendering } from "@/components/cult-ui/illustration-fluid-rendering";
import { TextAnimate } from "@/components/cult-ui/text-animate";
import { useCopy } from "@/hooks/useCopy";

const PILLAR_ICONS = [
  <Bot key="bot" className="h-8 w-8" strokeWidth={1.5} />,
  <Cable key="cable" className="h-8 w-8" strokeWidth={1.5} />,
  <Database key="db" className="h-8 w-8" strokeWidth={1.5} />,
];
const PILLAR_TONES = ["hologram", "telemetry", "accent"] as const;

const flowIcon = (Icon: typeof Bot, color: string) => (
  <Icon width={14} height={14} color={color} strokeWidth={1.75} />
);

export function Postgrad() {
  const copy = useCopy();
  const postgrad = copy.about.postgrad;
  const [p0, p1, p2] = postgrad.pillars.map((pillar, index) => ({
    ...pillar,
    icon: PILLAR_ICONS[index],
    tone: PILLAR_TONES[index],
  }));

  return (
    <section aria-labelledby="pos-graduacao" className="grid gap-5">
      <div className="grid gap-2">
        <TextAnimate
          id="pos-graduacao"
          text={postgrad.title}
          className="font-display text-2xl"
        />
        <p className="font-display text-xl text-accent">{postgrad.course}</p>
        <dl className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs">
          <div className="flex gap-2">
            <dt className="text-muted">{postgrad.statusLabel}:</dt>
            <dd className="text-telemetry">{postgrad.status}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-muted">{postgrad.institutionLabel}:</dt>
            <dd className="text-accent">{postgrad.institution}</dd>
          </div>
        </dl>
        <p className="max-w-[68ch] text-muted">{postgrad.lead}</p>
      </div>

      <CircuitBoard label={postgrad.chip} cards={[p0, p1, p2]} />

      <figure className="grid gap-3 border border-line bg-surface p-4">
        <figcaption className="grid gap-1">
          <TextAnimate
            as="h3"
            type="shiftInUp"
            text={postgrad.flowTitle}
            className="font-mono text-sm text-hologram"
          />
          <p className="max-w-[68ch] text-sm text-muted">{postgrad.flowCaption}</p>
        </figcaption>
        <FluidRendering
          role="img"
          aria-label={postgrad.flowAlt}
          title={postgrad.flowAlt}
          labels={postgrad.flowLabels as [string, string, string, string]}
          className="h-auto w-full max-w-[640px] justify-self-center"
          topIcon={flowIcon(Bot, "var(--color-hologram)")}
          upperMidIcon={flowIcon(Database, "var(--color-live)")}
          lowerMidIcon={flowIcon(Server, "var(--color-accent)")}
          bottomIcon={flowIcon(Workflow, "var(--color-telemetry)")}
        />
      </figure>

      <div className="grid gap-3">
        <TextAnimate
          as="h3"
          type="shiftInUp"
          text={postgrad.modulesTitle}
          className="font-display text-xl"
        />
        <ol className="grid items-start gap-3 md:grid-cols-2">
          {postgrad.modules.map((module) => (
            <li key={module.code}>
              <Expandable className="lift border border-line bg-surface">
                {({ isExpanded }) => (
                  <>
                    <ExpandableTrigger className="flex w-full items-start gap-3 p-4 text-left">
                      <span className="font-mono text-sm text-accent">{module.code}</span>
                      <span className="flex-1">
                        <span className="block">{module.title}</span>
                        <span className="mt-1 block font-mono text-xs text-muted">
                          {isExpanded ? postgrad.close : postgrad.open}
                        </span>
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className="mt-1 h-4 w-4 shrink-0 text-hologram transition-transform"
                        style={{ transform: isExpanded ? "rotate(180deg)" : undefined }}
                      />
                    </ExpandableTrigger>
                    <ExpandableContent preset="slide-up">
                      <ul className="grid list-disc gap-1 px-4 pb-4 pl-10 text-sm text-muted">
                        {module.topics.map((topic) => (
                          <li key={topic}>{topic}</li>
                        ))}
                      </ul>
                    </ExpandableContent>
                  </>
                )}
              </Expandable>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
