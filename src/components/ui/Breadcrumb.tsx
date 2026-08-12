import Link from "next/link";
import { ChevronRight } from "lucide-react";
import React from "react";

interface BreadcrumbProps {
  items: { label: string; href?: string }[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className="flex items-center text-sm text-gray-500 mb-8">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={item.label}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="hover:text-brand-charcoal transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-brand-charcoal font-medium" : ""}>
                {item.label}
              </span>
            )}
            {!isLast && <ChevronRight className="w-4 h-4 mx-2 text-gray-400" />}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
