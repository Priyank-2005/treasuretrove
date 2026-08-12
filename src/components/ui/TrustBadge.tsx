import { ReactNode } from "react";

interface TrustBadgeProps {
  icon: ReactNode;
  title: string;
  description?: string;
}

export function TrustBadge({ icon, title, description }: TrustBadgeProps) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="w-12 h-12 rounded-full bg-brand-champagne flex items-center justify-center text-brand-charcoal">
        {icon}
      </div>
      <div>
        <h4 className="font-serif text-lg md:text-xl font-medium tracking-wide">
          {title}
        </h4>
        {description && (
          <p className="text-sm text-gray-500 mt-2">{description}</p>
        )}
      </div>
    </div>
  );
}
