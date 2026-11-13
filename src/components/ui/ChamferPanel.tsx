import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function ChamferPanel({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("panel chamfer-md p-4 md:p-5", className)}>
      <span className="corner-mark left-2 top-2" aria-hidden="true">
        +
      </span>
      <span className="corner-mark right-2 top-2" aria-hidden="true">
        +
      </span>
      <span className="corner-mark bottom-2 left-2" aria-hidden="true">
        +
      </span>
      <span className="corner-mark bottom-2 right-2" aria-hidden="true">
        +
      </span>
      {children}
    </div>
  );
}
