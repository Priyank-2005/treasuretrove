export interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export type OrderStatus = "Pending" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled" | "Refunded";
export type PaymentStatus = "Unpaid" | "Paid" | "Refunded";

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: "UPI" | "Card" | "COD";
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  date: string;
  transactionId?: string;
  shippingAddress: string;
}

export const MOCK_ORDERS: Order[] = [
  {
    id: "LM10284",
    customerId: "CUST-001",
    customerName: "Aarushi Mehta",
    customerEmail: "aarushi@example.com",
    items: [
      { productId: "e1", name: "Aurelia Gold Hoops", quantity: 2, price: 699, image: "/images/products/e1-1.png" },
      { productId: "n3", name: "Mila Heart Necklace", quantity: 1, price: 799, image: "/images/products/n3-1.png" }
    ],
    subtotal: 2197,
    discount: 200,
    shipping: 0,
    total: 1997,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "Processing",
    date: "2024-08-12T10:30:00Z",
    transactionId: "DEMO_TXN_48291",
    shippingAddress: "Flat 4B, Sea View Apartments, Bandra West, Mumbai, Maharashtra 400050"
  },
  {
    id: "LM10283",
    customerId: "CUST-002",
    customerName: "Riya Sharma",
    customerEmail: "riya.sharma@example.com",
    items: [
      { productId: "r4", name: "Aria Signet Ring", quantity: 1, price: 799, image: "/images/products/r4-1.png" }
    ],
    subtotal: 799,
    discount: 0,
    shipping: 99,
    total: 898,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    status: "Shipped",
    date: "2024-08-11T14:15:00Z",
    transactionId: "DEMO_TXN_48290",
    shippingAddress: "12/A, Koramangala 4th Block, Bengaluru, Karnataka 560034"
  },
  {
    id: "LM10282",
    customerId: "CUST-003",
    customerName: "Nisha Patel",
    customerEmail: "nisha.p@example.com",
    items: [
      { productId: "b2", name: "Mia Tennis Bracelet", quantity: 1, price: 1299, image: "/images/products/b2-1.png" }
    ],
    subtotal: 1299,
    discount: 100,
    shipping: 0,
    total: 1199,
    paymentMethod: "COD",
    paymentStatus: "Unpaid",
    status: "Pending",
    date: "2024-08-12T09:00:00Z",
    shippingAddress: "Sector 14, MG Road, Gurugram, Haryana 122001"
  },
  {
    id: "LM10281",
    customerId: "CUST-004",
    customerName: "Sneha Reddy",
    customerEmail: "sneha.r@example.com",
    items: [
      { productId: "e6", name: "Luna Pearl Huggies", quantity: 1, price: 799, image: "/images/products/e6-1.png" },
      { productId: "n1", name: "Elena Pendant Necklace", quantity: 1, price: 899, image: "/images/products/n1-1.png" }
    ],
    subtotal: 1698,
    discount: 0,
    shipping: 0,
    total: 1698,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "Delivered",
    date: "2024-08-09T11:20:00Z",
    transactionId: "DEMO_TXN_48289",
    shippingAddress: "Plot 45, Jubilee Hills, Hyderabad, Telangana 500033"
  },
  {
    id: "LM10280",
    customerId: "CUST-005",
    customerName: "Ananya Desai",
    customerEmail: "ananya.d@example.com",
    items: [
      { productId: "r1", name: "Ava Stackable Ring", quantity: 3, price: 499, image: "/images/products/r1-1.png" }
    ],
    subtotal: 1497,
    discount: 150,
    shipping: 0,
    total: 1347,
    paymentMethod: "Card",
    paymentStatus: "Refunded",
    status: "Cancelled",
    date: "2024-08-08T16:45:00Z",
    transactionId: "DEMO_TXN_48288",
    shippingAddress: "C-201, Vasant Kunj, New Delhi, Delhi 110070"
  },
  {
    id: "LM10279",
    customerId: "CUST-006",
    customerName: "Priya Singh",
    customerEmail: "priya.singh@example.com",
    items: [
      { productId: "b1", name: "Olivia Chain Bracelet", quantity: 1, price: 799, image: "/images/products/b1-1.png" }
    ],
    subtotal: 799,
    discount: 0,
    shipping: 99,
    total: 898,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "Confirmed",
    date: "2024-08-12T15:30:00Z",
    transactionId: "DEMO_TXN_48287",
    shippingAddress: "A-12, Sector 62, Noida, Uttar Pradesh 201309"
  },
  {
    id: "LM10278",
    customerId: "CUST-007",
    customerName: "Meera Iyer",
    customerEmail: "meera.iyer@example.com",
    items: [
      { productId: "n5", name: "Sofia Tennis Necklace", quantity: 1, price: 1499, image: "/images/products/n5-1.png" },
      { productId: "e4", name: "Elara Stud Earrings", quantity: 1, price: 499, image: "/images/products/e4-1.png" }
    ],
    subtotal: 1998,
    discount: 100,
    shipping: 0,
    total: 1898,
    paymentMethod: "Card",
    paymentStatus: "Paid",
    status: "Shipped",
    date: "2024-08-10T10:15:00Z",
    transactionId: "DEMO_TXN_48286",
    shippingAddress: "Villa 5, OMR Road, Chennai, Tamil Nadu 600119"
  },
  {
    id: "LM10277",
    customerId: "CUST-008",
    customerName: "Kavya Nair",
    customerEmail: "kavya.nair@example.com",
    items: [
      { productId: "r6", name: "Luna Dome Ring", quantity: 1, price: 899, image: "/images/products/r6-1.png" }
    ],
    subtotal: 899,
    discount: 0,
    shipping: 99,
    total: 998,
    paymentMethod: "COD",
    paymentStatus: "Unpaid",
    status: "Processing",
    date: "2024-08-11T18:20:00Z",
    shippingAddress: "TC 14/123, Trivandrum, Kerala 695033"
  },
  {
    id: "LM10276",
    customerId: "CUST-009",
    customerName: "Tanvi Kapoor",
    customerEmail: "tanvi.k@example.com",
    items: [
      { productId: "e2", name: "Celeste Pearl Drops", quantity: 1, price: 899, image: "/images/products/e2-1.png" },
      { productId: "n4", name: "Clara Pearl Chain", quantity: 1, price: 999, image: "/images/products/n4-1.png" },
      { productId: "r5", name: "Nova Pearl Ring", quantity: 1, price: 749, image: "/images/products/r5-1.png" }
    ],
    subtotal: 2647,
    discount: 264,
    shipping: 0,
    total: 2383,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "Delivered",
    date: "2024-08-05T09:45:00Z",
    transactionId: "DEMO_TXN_48285",
    shippingAddress: "45, Model Town, Ludhiana, Punjab 141002"
  },
  {
    id: "LM10275",
    customerId: "CUST-010",
    customerName: "Ishita Verma",
    customerEmail: "ishita.v@example.com",
    items: [
      { productId: "b4", name: "Isla Cuff Bracelet", quantity: 1, price: 999, image: "/images/products/b4-1.png" }
    ],
    subtotal: 999,
    discount: 0,
    shipping: 0,
    total: 999,
    paymentMethod: "UPI",
    paymentStatus: "Paid",
    status: "Pending",
    date: "2024-08-12T16:10:00Z",
    transactionId: "DEMO_TXN_48284",
    shippingAddress: "Flat 102, Gokuldham Society, Goregaon East, Mumbai 400063"
  }
];
