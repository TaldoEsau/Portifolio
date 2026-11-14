"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatInput } from "@/components/chat/ChatInput";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { reactionLine, sectorLines, type ChatLine } from "@/content/chat";
import { useCopy } from "@/hooks/useCopy";
import { resolveCommand } from "@/lib/chat-engine";
import { useStage } from "@/store/stage";

const LIMIT = 80;

export function ChatDock() {
  const copy = useCopy();
  const locale = useStage((state) => state.locale);
  const scene = useStage((state) => state.scene);
  const open = useStage((state) => state.chatOpen);
  const paused = useStage((state) => state.chatPaused);
  const setOpen = useStage((state) => state.setChatOpen);
  const togglePaused = useStage((state) => state.toggleChatPaused);
  const signal = useStage((state) => state.signal);
  const requestScene = useStage((state) => state.requestScene);
  const pushToast = useStage((state) => state.pushToast);
  const pushSignal = useStage((state) => state.pushSignal);
  const router = useRouter();
  const bank = sectorLines(locale, scene);
  const scope = `${locale}:${scene}`;
  const [activeScope, setActiveScope] = useState(scope);
  const [stream, setStream] = useState<ChatLine[]>([]);
  const [notes, setNotes] = useState<ChatLine[]>([]);
  const [seenSignal, setSeenSignal] = useState(signal.id);
  const cursor = useRef(2);
  const logRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);

  const handleScroll = () => {
    if (!logRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = logRef.current;
    shouldAutoScrollRef.current = scrollHeight - (scrollTop + clientHeight) < 48;
  };

  if (activeScope !== scope) {
    setActiveScope(scope);
    setStream([]);
    setNotes([]);
  }

  if (signal.id !== seenSignal) {
    setSeenSignal(signal.id);
    if (signal.id > 0) {
      setNotes((current) =>
        [
          ...current,
          reactionLine(locale, signal.type, signal.detail ?? ""),
        ].slice(-LIMIT),
      );
    }
  }

  useEffect(() => {
    cursor.current = 2;
  }, [locale, scene]);

  useEffect(() => {
    if (paused || !open) return;
    let timer = 0;
    const queue = () => {
      const bank = sectorLines(locale, scene);
      timer = window.setTimeout(() => {
        if (document.hidden) {
          queue();
          return;
        }
        const line = bank[cursor.current % bank.length];
        cursor.current += 1;
        if (line) {
          setStream((current) =>
            [...current, { ...line, id: `${line.id}-${cursor.current}` }].slice(
              -LIMIT,
            ),
          );
        }
        queue();
      }, 4500 + Math.floor(Math.random() * 4000));
    };
    queue();
    return () => window.clearTimeout(timer);
  }, [locale, open, paused, scene]);

  const lines = [...bank.slice(0, 2), ...stream, ...notes].slice(-LIMIT);

  useEffect(() => {
    if (!logRef.current || !shouldAutoScrollRef.current) return;
    logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [lines]);

  const onCommand = (value: string) => {
    shouldAutoScrollRef.current = true;
    const local: ChatLine = {
      id: `local-${Date.now()}`,
      author: copy.chat.local,
      text: value,
    };
    const command = resolveCommand(value);
    let reply = copy.chat.unknown;
    if (command.type === "help" || command.type === "unknown") {
      reply = command.type === "help" ? copy.chat.help : copy.chat.unknown;
    } else if (command.type === "scene") {
      reply = copy.chat.help;
      requestScene(command.scene);
    } else if (command.type === "direct") {
      router.push("/direto");
      reply = copy.hud.direct;
    } else if (command.type === "interferencia") {
      pushSignal("interferencia");
      pushToast(copy.alerts.interferenceTitle, copy.alerts.interferenceBody);
      reply = copy.alerts.interferenceBody;
    } else if (command.type === "raid") {
      pushSignal("raid");
      pushToast(copy.alerts.raidTitle, copy.alerts.raidBody);
      reply = copy.alerts.raidBody;
    }
    const response: ChatLine = {
      id: `cmd-${Date.now()}`,
      author: "[DROID_LOG]",
      text: reply,
    };
    setNotes((current) => [...current, local, response].slice(-LIMIT));
  };

  if (!open) return null;

  return (
    <aside className="fixed inset-x-0 bottom-[7.5rem] z-40 flex max-h-[min(28rem,60dvh)] flex-col border border-line bg-surface lg:static lg:inset-auto lg:bottom-auto lg:h-full lg:max-h-dvh lg:min-h-0 lg:w-80 lg:border-y-0 lg:border-l">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-line px-3 py-2">
        <p className="font-mono text-[11px] text-accent">{copy.simulated}</p>
        <div className="flex">
          <button
            type="button"
            className="min-h-11 cursor-pointer px-2 font-mono text-xs"
            aria-pressed={paused}
            aria-label={copy.a11y.pauseComms}
            onClick={togglePaused}
          >
            {paused ? copy.chat.resume : copy.chat.pause}
          </button>
          <button
            type="button"
            className="min-h-11 cursor-pointer px-2 font-mono text-xs"
            onClick={() => setOpen(false)}
          >
            {copy.chat.close}
          </button>
        </div>
      </div>
      <div
        ref={logRef}
        onScroll={handleScroll}
        role="log"
        aria-live="off"
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overflow-x-hidden px-3 py-3"
      >
        {lines.map((line) => (
          <ChatMessage key={line.id} author={line.author} text={line.text} />
        ))}
      </div>
      <div className="shrink-0 border-t border-line p-3">
        <ChatInput onSubmit={onCommand} />
      </div>
    </aside>
  );
}
