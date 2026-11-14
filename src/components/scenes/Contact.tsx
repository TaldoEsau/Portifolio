"use client";

import { ChooseAgain } from "@/components/side/ChooseAgain";
import { SceneFrame } from "@/components/stage/SceneFrame";
import { CurriculumSection } from "@/components/ui/CurriculumSection";
import { useCopy } from "@/hooks/useCopy";
import { copyText } from "@/lib/clipboard";
import { playClick } from "@/lib/sound";
import { useStage } from "@/store/stage";

export function Contact() {
  const copy = useCopy();
  const pushToast = useStage((state) => state.pushToast);
  const sound = useStage((state) => state.soundEnabled);

  return (
    <SceneFrame id="contato">
      <p className="max-w-[46rem] font-display text-3xl">{copy.contact.title}</p>
      <p className="max-w-[62ch] text-muted">{copy.contact.lead}</p>
      <ul className="stagger grid gap-3 md:grid-cols-2">
        {copy.contact.doors.map((door) => (
          <li key={door.id} className="lift door border border-line bg-surface p-4">
            <p className="font-mono text-xs text-accent">{door.label}</p>
            <p className="mt-2 break-all sm:break-words">{door.value}</p>
            {door.href ? (
              <a
                className="mt-3 inline-flex min-h-11 items-center text-hologram underline break-all sm:break-words"
                href={door.href}
                target="_blank"
                rel="noreferrer"
              >
                {door.value}
                <span className="sr-only"> {copy.a11y.external}</span>
              </a>
            ) : null}
            {door.copy ? (
              <button
                type="button"
                data-spark=""
                className="mt-3 min-h-11 cursor-pointer bg-accent px-3 font-mono text-xs text-on-accent"
                onClick={() => {
                  if (sound) playClick();
                  void copyText(door.value).then(() => {
                    pushToast(copy.alerts.emailTitle, copy.alerts.emailBody);
                  });
                }}
              >
                {copy.contact.copy}
              </button>
            ) : null}
          </li>
        ))}
      </ul>
      <CurriculumSection />
      <footer className="flex flex-wrap gap-4 border-t border-line pt-4 font-mono text-xs text-muted">
        <p>
          © {copy.year} {copy.contact.footer}
        </p>
        <a
          href="https://www.twitch.tv/taldosatis"
          className="text-hologram"
          target="_blank"
          rel="noreferrer"
        >
          {copy.contact.channel}
        </a>
        <ChooseAgain className="text-muted" />
      </footer>
    </SceneFrame>
  );
}
