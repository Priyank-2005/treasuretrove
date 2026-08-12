import { cn } from "@/lib/utils";
import { OrderStatus, PaymentStatus } from "@/data/admin/orders";

interface StatusBadgeProps {
  status: OrderStatus | PaymentStatus | "Active" | "Inactive" | "Scheduled" | "Expired" | "Draft" | "Archived";
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getColors = () => {
    switch (status) {
      case "Paid":
      case "Delivered":
      case "Active":
        return "bg-green-100 text-green-700";
      case "Processing":
      case "Shipped":
        return "bg-blue-100 text-blue-700";
      case "Pending":
      case "Unpaid":
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
      case "Refunded":
      case "Inactive":
      case "Expired":
      case "Archived":
        return "bg-gray-100 text-gray-600";
      case "Draft":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <span className={cn("px-2.5 py-1 rounded-full text-xs font-medium", getColors(), className)}>
      {status}
    </span>
  );
}
