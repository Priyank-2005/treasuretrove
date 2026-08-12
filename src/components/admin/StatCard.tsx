import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  trend: string;
  isPositive?: boolean;
  icon: LucideIcon;
}

export function StatCard({ title, value, trend, isPositive = true, icon: Icon }: StatCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className="p-2 bg-gray-50 rounded-md">
          <Icon className="w-5 h-5 text-gray-400" />
        </div>
      </div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-semibold text-gray-900">{value}</div>
        <div className={cn(
          "text-sm font-medium",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          {trend}
        </div>
      </div>
    </div>
  );
}
