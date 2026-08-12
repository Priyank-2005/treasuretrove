export interface Campaign {
  id: string;
  name: string;
  type: "Discount" | "Featured Collection" | "Banner" | "Product Promotion";
  startDate: string;
  endDate: string;
  discount?: string;
  status: "Active" | "Scheduled" | "Expired";
  image?: string;
}

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "CAMP-001",
    name: "Monsoon Edit",
    type: "Discount",
    startDate: "2024-08-10T00:00:00Z",
    endDate: "2024-08-25T23:59:59Z",
    discount: "15% OFF",
    status: "Active",
    image: "/images/banners/hero.jpg"
  },
  {
    id: "CAMP-002",
    name: "Rakhi Collection",
    type: "Featured Collection",
    startDate: "2024-08-15T00:00:00Z",
    endDate: "2024-08-20T23:59:59Z",
    status: "Scheduled"
  },
  {
    id: "CAMP-003",
    name: "Weekend Sale",
    type: "Discount",
    startDate: "2024-08-02T00:00:00Z",
    endDate: "2024-08-04T23:59:59Z",
    discount: "20% OFF",
    status: "Expired"
  }
];
