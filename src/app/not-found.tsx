import Link from "next/link";
import { NotFoundRobot } from "@/components/robot/NotFoundRobot";
import { pt } from "@/content/pt";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-dvh max-w-xl place-items-center px-4">
      <div className="grid gap-4 border border-line bg-surface p-6">
        <p className="font-mono text-sm text-accent">{pt.notFound.code}</p>
        <h1 className="display-title text-3xl">{pt.notFound.title}</h1>
        <p>{pt.notFound.body}</p>
        <NotFoundRobot />
        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center bg-accent px-4 font-mono text-sm text-on-accent"
          >
            {pt.notFound.back}
          </Link>
          <Link
            href="/direto"
            className="inline-flex min-h-11 items-center font-mono text-sm text-hologram"
          >
            {pt.notFound.direct}
          </Link>
        </div>
      </div>
    </main>
  );
}
