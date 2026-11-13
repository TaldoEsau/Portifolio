export function ChatMessage({
  author,
  text,
}: {
  author: string;
  text: string;
}) {
  return (
    <p className="text-sm leading-snug">
      <span className="font-mono text-xs text-hologram">{author}</span>{" "}
      <span className="text-text">{text}</span>
    </p>
  );
}
