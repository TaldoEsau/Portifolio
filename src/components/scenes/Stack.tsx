"use client";

import {
  GatewayEndpoint,
  GatewayOverhead,
  GatewayRouting,
} from "@/components/cult-ui/gateway-illustrations";
import { IllustrationCardGrid } from "@/components/cult-ui/illustration-card-grid";
import { TextAnimate } from "@/components/cult-ui/text-animate";
import { SceneFrame } from "@/components/stage/SceneFrame";
import { useCopy } from "@/hooks/useCopy";

const ILLUSTRATIONS = {
  endpoint: GatewayEndpoint,
  overhead: GatewayOverhead,
  routing: GatewayRouting,
} as const;

export function Stack() {
  const copy = useCopy();

  return (
    <SceneFrame id="stack">
      <p className="max-w-[62ch] text-muted">{copy.stack.lead}</p>
      <IllustrationCardGrid
        items={copy.stack.modules.map((module, index) => {
          const Illustration =
            ILLUSTRATIONS[module.graph.kind as keyof typeof ILLUSTRATIONS];
          const headingId = `stack-modulo-${index + 1}`;

          return {
            id: headingId,
            title: (
              <TextAnimate
                id={headingId}
                text={module.title}
                className="font-display text-2xl"
              />
            ),
            description: module.summary,
            illustration: (
              <Illustration
                hub={module.graph.hub}
                nodes={module.graph.nodes}
                label={module.graph.label}
              />
            ),
            children: (
              <ul aria-labelledby={headingId} className="grid divide-y divide-line border-t border-line">
                {module.items.map((item) => (
                  <li key={item.name} className="py-3">
                    <p className="font-mono text-sm text-accent">{item.name}</p>
                    <p className="mt-1 text-sm text-muted">{item.note}</p>
                  </li>
                ))}
              </ul>
            ),
          };
        })}
      />
    </SceneFrame>
  );
}
