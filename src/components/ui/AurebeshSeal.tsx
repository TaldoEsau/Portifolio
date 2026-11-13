export function AurebeshSeal() {
  return (
    <span aria-hidden="true" className="inline-flex gap-1 text-dim">
      {["▭", "⌁", "▹", "▭", "⌁"].map((glyph, index) => (
        <span key={index} className="font-mono text-[10px] tracking-widest">
          {glyph}
        </span>
      ))}
    </span>
  );
}
