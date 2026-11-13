"use client";

import { useState, type FormEvent } from "react";
import { useCopy } from "@/hooks/useCopy";

export function ChatInput({ onSubmit }: { onSubmit: (value: string) => void }) {
  const copy = useCopy();
  const [value, setValue] = useState("");

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = value.trim();
    if (!next) return;
    onSubmit(next);
    setValue("");
  };

  return (
    <form onSubmit={submit} className="flex gap-2">
      <label className="sr-only" htmlFor="holo-command">
        {copy.a11y.command}
      </label>
      <input
        id="holo-command"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={copy.chat.placeholder}
        autoComplete="off"
        className="min-h-11 min-w-0 flex-1 border border-line bg-bg px-2 font-mono text-sm text-text"
      />
      <button
        type="submit"
        className="min-h-11 cursor-pointer border border-line-bright px-3 font-mono text-xs"
      >
        {copy.chat.send}
      </button>
    </form>
  );
}
