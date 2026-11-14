"use client";

import { useState } from "react";
import { Download, ExternalLink, Eye, FileText } from "lucide-react";
import { useCopy } from "@/hooks/useCopy";
import { cn } from "@/lib/utils";

const CV_PATH = "/curriculo/Curriculo_Esau_Santana.pdf";

export function CurriculumSection({ className }: { className?: string }) {
  const copy = useCopy();
  const [showPreview, setShowPreview] = useState(false);

  return (
    <section
      aria-labelledby="curriculo-title"
      className={cn(
        "chamfer-md border border-line bg-surface/80 p-4 sm:p-6 transition-colors hover:border-accent/40",
        className,
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="grid h-10 w-10 sm:h-12 sm:w-12 shrink-0 place-items-center rounded border border-accent/30 bg-accent/10 text-accent">
            <FileText aria-hidden="true" className="size-5 sm:size-6" />
          </div>
          <div className="grid gap-1">
            <p className="font-mono text-xs tracking-wider text-accent uppercase">
              Data Pad // Documento Oficial
            </p>
            <h2 id="curriculo-title" className="font-display text-xl sm:text-2xl text-text">
              {copy.contact.cv}
            </h2>
            <p className="max-w-[62ch] text-xs sm:text-sm text-muted">
              {copy.contact.cvDescription}
            </p>
            <div className="mt-1 flex flex-wrap gap-2 font-mono text-[0.6875rem] text-muted">
              <span className="border border-line px-1.5 py-0.5">FORMATO: PDF (A4)</span>
              <span className="border border-line px-1.5 py-0.5">ESTADO: DISPONÍVEL</span>
              <span className="border border-line px-1.5 py-0.5">AUTOR: ESAÚ SANTANA</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          <a
            href={CV_PATH}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 bg-accent px-4 font-mono text-xs font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            <ExternalLink aria-hidden="true" className="size-3.5" />
            <span>{copy.contact.cvView}</span>
          </a>

          <a
            href={CV_PATH}
            download="Curriculo_Esau_Santana.pdf"
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 border border-line-bright px-3.5 font-mono text-xs text-text transition-colors hover:border-accent hover:text-accent"
          >
            <Download aria-hidden="true" className="size-3.5" />
            <span>{copy.contact.cvDownload}</span>
          </a>

          <button
            type="button"
            className="inline-flex min-h-11 cursor-pointer items-center gap-1.5 border border-line px-3 font-mono text-xs text-muted transition-colors hover:text-text"
            onClick={() => setShowPreview(!showPreview)}
          >
            <Eye aria-hidden="true" className="size-3.5" />
            <span>{showPreview ? "Ocultar prévia" : copy.contact.cvPreview}</span>
          </button>
        </div>
      </div>

      {/* Embedded Preview */}
      {showPreview ? (
        <div className="mt-5 overflow-hidden rounded border border-line bg-bg">
          <div className="flex items-center justify-between border-b border-line bg-surface px-3 py-2 font-mono text-xs text-muted">
            <span>PREVIEW // Curriculo_Esau_Santana.pdf</span>
            <a
              href={CV_PATH}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Abrir em tela cheia ↗
            </a>
          </div>
          <object
            data={CV_PATH}
            type="application/pdf"
            className="h-[550px] w-full"
            aria-label="Prévia do Currículo de Esaú Santana"
          >
            <div className="grid h-64 place-items-center p-6 text-center font-mono text-sm text-muted">
              <p>
                O seu navegador não suporta visualização inline de PDF.
                <br />
                <a
                  href={CV_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-accent underline"
                >
                  Clique aqui para abrir o currículo diretamente ↗
                </a>
              </p>
            </div>
          </object>
        </div>
      ) : null}
    </section>
  );
}
