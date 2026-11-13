import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

export type IllustrationCardGridItem = {
  id?: string;
  title: ReactNode;
  description?: ReactNode;
  illustration: ReactNode;
  /** Rendered under the illustration, e.g. the list of tools in that module. */
  children?: ReactNode;
  className?: string;
};

export type IllustrationCardGridProps = ComponentProps<"div"> & {
  items: IllustrationCardGridItem[];
  cardClassName?: string;
};

/**
 * Cult UI illustration card grid: one bordered grid, cards split by hairlines.
 * The borders are drawn per card (right + bottom) so the grid survives any
 * item count, including the odd last row of a 3-column layout.
 */
export function IllustrationCardGrid({
  items,
  className,
  cardClassName,
  ...props
}: IllustrationCardGridProps) {
  return (
    <div
      className={cn(
        "grid w-full grid-cols-1 border-l border-t border-line md:grid-cols-2 xl:grid-cols-3",
        className,
      )}
      data-slot="illustration-card-grid"
      {...props}
    >
      {items.map((item, index) => (
        <article
          key={item.id ?? index}
          className={cn(
            "flex flex-col gap-6 border-b border-r border-line bg-surface/60 p-6",
            cardClassName,
            item.className,
          )}
          data-slot="illustration-card-grid-item"
        >
          <div className="flex flex-col gap-2" data-slot="illustration-card-grid-content">
            {item.title}
            {item.description ? (
              <p className="text-sm text-muted" data-slot="illustration-card-grid-description">
                {item.description}
              </p>
            ) : null}
          </div>
          <div
            className="pointer-events-none flex select-none items-center justify-center"
            data-slot="illustration-card-grid-illustration"
          >
            {item.illustration}
          </div>
          {item.children}
        </article>
      ))}
    </div>
  );
}
