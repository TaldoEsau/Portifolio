"use client";

import { DeckButton } from "@/components/deck/DeckButton";
import { useCopy } from "@/hooks/useCopy";
import { SCENES } from "@/lib/scenes";

export function SceneDeck() {
  const copy = useCopy();

  return (
    <nav
      aria-label={copy.deck.sectors.intro.name}
      className="z-30 border-t border-line bg-surface px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:h-full lg:w-36 lg:border-t-0 lg:border-r lg:pb-2 lg:overflow-y-auto"
    >
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-1">
        {SCENES.map((scene) => (
          <DeckButton
            key={scene.id}
            scene={scene.id}
            shortcut={scene.shortcut}
            label={copy.deck.sectors[scene.id].code}
            name={`${copy.deck.sectors[scene.id].code} ${copy.deck.sectors[scene.id].name}`}
          />
        ))}
      </div>
    </nav>
  );
}
