import Link from "next/link";
import { pt } from "@/content/pt";
import { getProjects } from "@/content/projects";

export function DataPad() {
  const projects = getProjects("pt");

  return (
    <article className="data-pad mx-auto w-full max-w-3xl px-4 py-8 text-text">
      <a className="skip-link" href="#pad-conteudo">
        {pt.a11y.skip}
      </a>
      <header className="grid gap-3 border-b border-line pb-6" id="pad-conteudo">
        <p className="font-mono text-xs text-accent">{pt.direto.kicker}</p>
        <h1 className="display-title">{pt.direto.title}</h1>
        <p>{pt.direto.role}</p>
        <p className="text-muted">{pt.direto.location}</p>
        <p className="text-sm text-muted">{pt.direto.printHint}</p>
        <p className="flex flex-wrap items-center gap-4 font-mono text-sm">
          <a className="text-accent underline font-semibold" href="/curriculo/Curriculo_Esau_Santana.pdf" target="_blank" rel="noopener noreferrer">📄 Baixar Currículo Oficial (PDF)</a>
          <a className="text-hologram" href="https://www.twitch.tv/taldosatis">
            {pt.contact.channel}
          </a>
          <Link className="text-hologram" href="/">
            {pt.direto.back}
          </Link>
        </p>
      </header>

      <section className="grid gap-3 py-6" aria-labelledby="pad-resumo">
        <h2 id="pad-resumo" className="font-display text-2xl">
          {pt.direto.summary}
        </h2>
        {pt.about.paragraphs.map((paragraph) => (
          <p key={paragraph} className="max-w-[68ch]">
            {paragraph}
          </p>
        ))}
        <p>
          {pt.about.availabilityLabel}: {pt.about.availability}
        </p>
      </section>

      <section className="grid gap-6 py-6" aria-labelledby="pad-missoes">
        <h2 id="pad-missoes" className="font-display text-2xl">
          {pt.direto.missions}
        </h2>
        {projects.map((project) => (
          <article key={project.id} className="grid gap-3 border border-line p-4">
            <h3 className="font-display text-xl">{project.title}</h3>
            <p className="font-mono text-xs text-accent">{project.missionCode}</p>
            <p>
              {pt.projects.role}: {project.role}
              {project.period ? `. ${pt.projects.period}: ${project.period}.` : "."}
            </p>
            <p>{project.summary}</p>
            <h4 className="font-mono text-sm text-hologram">{pt.projects.problem}</h4>
            <p>{project.problem}</p>
            <h4 className="font-mono text-sm text-hologram">{pt.projects.action}</h4>
            <ul className="list-disc pl-5">
              {project.actions.map((action) => (
                <li key={action}>{action}</li>
              ))}
            </ul>
            <h4 className="font-mono text-sm text-hologram">{pt.projects.result}</h4>
            <ul>
              {project.results.map((result) => (
                <li key={result.label}>
                  {result.label}: {result.value}
                </li>
              ))}
            </ul>
            {project.stack.length > 0 ? (
              <p className="font-mono text-sm">{project.stack.join(" · ")}</p>
            ) : null}
            {project.links.length === 0 ? (
              <p className="font-mono text-sm text-accent">{pt.projects.noLink}</p>
            ) : (
              <ul>
                {project.links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </section>

      <section className="grid gap-4 py-6" aria-labelledby="pad-arsenal">
        <h2 id="pad-arsenal" className="font-display text-2xl">
          {pt.direto.arsenal}
        </h2>
        {pt.stack.modules.map((module) => (
          <div key={module.title}>
            <h3 className="font-display text-xl">{module.title}</h3>
            <table className="mt-2 w-full border-collapse text-left text-sm">
              <tbody>
                {module.items.map((item) => (
                  <tr key={item.name} className="border-t border-line align-top">
                    <th className="w-36 py-2 pr-3 font-mono font-medium" scope="row">
                      {item.name}
                    </th>
                    <td className="py-2 text-muted">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </section>

      <section className="grid gap-3 py-6" aria-labelledby="pad-formacao">
        <h2 id="pad-formacao" className="font-display text-2xl">
          {pt.direto.formation}
        </h2>
        <h3 className="font-display text-xl">{pt.about.timelineTitle}</h3>
        <ul className="grid gap-2">
          {pt.about.timeline.map((item) => (
            <li key={item.label}>
              <strong>{item.label}.</strong> {item.detail}
            </li>
          ))}
        </ul>
        <h3 className="font-display text-xl">{pt.about.postgrad.title}</h3>
        <p>
          <strong>{pt.about.postgrad.course}.</strong> {pt.about.postgrad.status}.
        </p>
        <ol className="grid gap-1">
          {pt.about.postgrad.modules.map((module) => (
            <li key={module.code}>
              <span className="font-mono text-sm">{module.code}.</span> {module.title}
            </li>
          ))}
        </ol>
        <h3 className="font-display text-xl">{pt.about.protocolTitle}</h3>
        <ol className="grid gap-2">
          {pt.about.protocol.map((step) => (
            <li key={step.code}>
              <span className="font-mono text-sm">{step.code}.</span> {step.body}
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-3 py-6" aria-labelledby="pad-contato">
        <h2 id="pad-contato" className="font-display text-2xl">
          {pt.direto.contact}
        </h2>
        <ul className="grid gap-2">
          {pt.contact.doors.map((door) => (
            <li key={door.id}>
              {door.label}:{" "}
              {door.href ? <a href={door.href}>{door.value}</a> : door.value}
            </li>
          ))}
          <li>
            {pt.contact.cv}: {pt.contact.cvMissing}
          </li>
        </ul>
        <p>
          {pt.contact.statusLabel}: {pt.contact.status}
        </p>
        <p>{pt.contact.response}</p>
      </section>
      <footer className="border-t border-line pt-4 font-mono text-xs text-muted">
        © {pt.year} {pt.contact.footer}
      </footer>
    </article>
  );
}
