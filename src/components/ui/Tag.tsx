export function Tag({ children }: { children: string }) {
  return (
    <li className="border border-line px-2 py-1 font-mono text-xs text-muted">
      {children}
    </li>
  );
}
