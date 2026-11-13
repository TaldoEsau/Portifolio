"use client";

import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  Expandable,
  ExpandableContent,
  ExpandableTrigger,
} from "@/components/cult-ui/expandable";
import { DEFAULT_NODES, DeployGlobe } from "@/components/cult-ui/illustration-globe-vercel";
import { TextAnimate } from "@/components/cult-ui/text-animate";
import { SpotlightCard } from "@/components/react-bits/SpotlightCard";
import { SceneFrame } from "@/components/stage/SceneFrame";
import { BlueprintSlot } from "@/components/ui/BlueprintSlot";
import { Tag } from "@/components/ui/Tag";
import { getProjects, type Project } from "@/content/projects";
import { useCopy } from "@/hooks/useCopy";
import type { BlueprintId } from "@/remotion/diagram-props";
import { fill } from "@/lib/utils";
import { useStage } from "@/store/stage";

export function Projects() {
  const copy = useCopy();
  const locale = useStage((state) => state.locale);
  const projects = getProjects(locale);
  const live = projects.filter((project) => project.links.length > 0).length;

  return (
    <SceneFrame id="projetos">
      <p className="max-w-[62ch] text-muted">{copy.projects.lead}</p>
      <section aria-labelledby="rede-deploy" className="grid gap-2">
        <TextAnimate
          id="rede-deploy"
          text={copy.projects.globeTitle}
          className="font-display text-2xl"
        />
        <p className="text-sm text-muted">{copy.projects.globeCaption}</p>
        <DeployGlobe
          className="mx-auto mt-4 max-w-xl overflow-hidden pt-2"
          accentColor="var(--color-accent)"
          nodes={DEFAULT_NODES.slice(0, live)}
          statusLabel={fill(copy.projects.globeStatus, { n: live })}
          replayLabel={copy.projects.globeReplay}
        />
      </section>
      <div className="stagger grid items-start gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <MissionCard key={project.id} project={project} />
        ))}
      </div>
    </SceneFrame>
  );
}

function MissionCard({ project }: { project: Project }) {
  const copy = useCopy();
  const pushToast = useStage((state) => state.pushToast);
  const pushSignal = useStage((state) => state.pushSignal);
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const titleId = `missao-${project.id}`;

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (!next) return;
    pushSignal("dossier", project.missionCode);
    pushToast(
      copy.alerts.dossierTitle,
      fill(copy.alerts.dossierBody, { code: project.missionCode }),
    );
  };

  return (
    <SpotlightCard>
      <Expandable
        expanded={open}
        onToggle={toggle}
        onKeyDown={(event) => {
          if (event.key !== "Escape" || !open) return;
          event.stopPropagation();
          setOpen(false);
          triggerRef.current?.focus();
        }}
      >
        <article
          aria-labelledby={titleId}
          className="chamfer-md h-full border border-line bg-surface p-4"
        >
          <p className="font-mono text-xs text-accent">{project.missionCode}</p>
          <h2 id={titleId} className="mt-2 font-display text-2xl">
            {project.title}
          </h2>
          <p className="mt-2 text-sm text-muted">{project.summary}</p>
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.stack.slice(0, 4).map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </ul>
          {project.links.length === 0 ? (
            <p className="mt-4 font-mono text-xs text-accent">{copy.projects.noLink}</p>
          ) : null}
          <ExpandableTrigger
            ref={triggerRef}
            className="mt-4 inline-flex items-center gap-2 border border-line-bright px-3 py-2 font-mono text-xs text-hologram transition-colors hover:border-hologram"
          >
            {open ? copy.projects.less : copy.projects.more}
            <span className="sr-only">: {project.title}</span>
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 transition-transform"
              style={{ transform: open ? "rotate(180deg)" : undefined }}
            />
          </ExpandableTrigger>
          <ExpandableContent preset="blur-sm" stagger staggerChildren={0.06} className="text-sm">
            {dossierSections(project, copy)}
          </ExpandableContent>
        </article>
      </Expandable>
    </SpotlightCard>
  );
}

function dossierSections(project: Project, copy: ReturnType<typeof useCopy>) {
  const blueprint = project.remotionBlueprint as BlueprintId | undefined;
  const sections = [
    <p key="role" className="mt-5 font-mono text-sm text-muted">
      {copy.projects.role}: {project.role}
      {project.period ? ` · ${copy.projects.period}: ${project.period}` : ""}
    </p>,
    <section key="problem" className="mt-4 grid gap-2">
      <h3 className="font-mono text-sm text-hologram">{copy.projects.problem}</h3>
      <p>{project.problem}</p>
    </section>,
    <section key="action" className="mt-4 grid gap-2">
      <h3 className="font-mono text-sm text-hologram">{copy.projects.action}</h3>
      <ul className="grid list-disc gap-2 pl-5">
        {project.actions.map((action) => (
          <li key={action}>{action}</li>
        ))}
      </ul>
    </section>,
  ];

  if (blueprint) {
    sections.push(
      <section key="blueprint" className="mt-4 grid gap-2">
        <h3 className="font-mono text-sm text-hologram">{copy.projects.blueprint}</h3>
        <BlueprintSlot id={blueprint} autoPlay />
      </section>,
    );
  }

  sections.push(
    <section key="result" className="mt-4 grid gap-2">
      <h3 className="font-mono text-sm text-hologram">{copy.projects.result}</h3>
      <dl className="grid gap-2">
        {project.results.map((result) => (
          <div key={result.label}>
            <dt className="font-mono text-xs text-muted">{result.label}</dt>
            <dd className="break-words">{result.value}</dd>
          </div>
        ))}
      </dl>
    </section>,
  );

  if (project.stack.length > 0) {
    sections.push(
      <section key="stack" className="mt-4 grid gap-2">
        <h3 className="font-mono text-sm text-hologram">{copy.projects.stack}</h3>
        <ul className="flex flex-wrap gap-2">
          {project.stack.map((item) => (
            <Tag key={item}>{item}</Tag>
          ))}
        </ul>
      </section>,
    );
  }

  sections.push(
    <section key="links" className="mt-4 grid gap-2">
      <h3 className="font-mono text-sm text-hologram">{copy.projects.links}</h3>
      {project.links.length === 0 ? (
        <p className="font-mono text-sm text-accent">{copy.projects.noLink}</p>
      ) : (
        <ul className="grid gap-2">
          {project.links.map((link) => (
            <li key={link.href}>
              <a
                className="text-hologram underline"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
                <span className="sr-only"> {copy.a11y.external}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>,
  );

  return sections;
}
