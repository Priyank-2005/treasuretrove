import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ProductGridProps {
  children: ReactNode;
  className?: string;
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ children, className, columns = 4 }: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-12",
        {
          "grid-cols-2 md:grid-cols-3 lg:grid-cols-4": columns === 4,
          "grid-cols-2 md:grid-cols-3": columns === 3,
          "grid-cols-2": columns === 2,
        },
        className
      )}
    >
      {children}
    </div>
  );
}
