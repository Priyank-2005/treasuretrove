import { MOCK_ORDERS, type Order } from "@/data/admin/orders";

// Customer-facing orders for the mock logged-in user
// In production, these will come from the database filtered by userId
export const CUSTOMER_ORDERS: Order[] = MOCK_ORDERS.filter(
  (order) => order.customerId === "CUST-001" || order.customerId === "CUST-004"
).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

export function getCustomerOrderById(orderId: string): Order | undefined {
  return CUSTOMER_ORDERS.find((order) => order.id === orderId);
}

// Helper to generate timeline steps based on order status
export type TimelineStep = {
  label: string;
  date?: string;
  completed: boolean;
  active: boolean;
};

export function getOrderTimeline(order: Order): TimelineStep[] {
  const statusOrder = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];
  const currentIndex = statusOrder.indexOf(order.status);

  if (order.status === "Cancelled" || order.status === "Refunded") {
    return [
      { label: "Order Placed", date: order.date, completed: true, active: false },
      { label: order.status, date: order.date, completed: true, active: true },
    ];
  }

  return statusOrder.map((status, index) => ({
    label: status === "Pending" ? "Order Placed" : status,
    date: index <= currentIndex ? order.date : undefined,
    completed: index <= currentIndex,
    active: index === currentIndex,
  }));
}
