export function SkipLink({ label }: { label: string }) {
  return (
    <a className="skip-link font-mono text-sm" href="#conteudo">
      {label}
    </a>
  );
}
