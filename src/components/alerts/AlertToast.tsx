export function AlertToast({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div
      role="status"
      className="chamfer-sm w-72 border border-line-bright bg-surface px-3 py-3 shadow-[var(--glow-amber)]"
    >
      <p className="font-mono text-xs text-accent">{title}</p>
      <p className="mt-1 text-sm text-text">{body}</p>
    </div>
  );
}
