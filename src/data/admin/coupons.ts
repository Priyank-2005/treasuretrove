export interface Coupon {
  id: string;
  code: string;
  discountType: "Percentage" | "Fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  usageLimit: number | "Unlimited";
  usageCount: number;
  expiryDate: string;
  status: "Active" | "Inactive";
  applicableTo: "All Products" | "Category" | "Selected Products";
}

export const MOCK_COUPONS: Coupon[] = [
  {
    id: "COUP-001",
    code: "WELCOME10",
    discountType: "Percentage",
    discountValue: 10,
    minOrderValue: 999,
    maxDiscount: 500,
    usageLimit: 500,
    usageCount: 124,
    expiryDate: "2024-12-31T23:59:59Z",
    status: "Active",
    applicableTo: "All Products"
  },
  {
    id: "COUP-002",
    code: "LUMERA20",
    discountType: "Percentage",
    discountValue: 20,
    minOrderValue: 2999,
    maxDiscount: 1000,
    usageLimit: 200,
    usageCount: 82,
    expiryDate: "2024-09-15T23:59:59Z",
    status: "Active",
    applicableTo: "All Products"
  },
  {
    id: "COUP-003",
    code: "FIRSTORDER",
    discountType: "Fixed",
    discountValue: 150,
    minOrderValue: 499,
    usageLimit: "Unlimited",
    usageCount: 54,
    expiryDate: "2024-12-31T23:59:59Z",
    status: "Active",
    applicableTo: "All Products"
  },
  {
    id: "COUP-004",
    code: "FESTIVE25",
    discountType: "Percentage",
    discountValue: 25,
    minOrderValue: 4999,
    maxDiscount: 2000,
    usageLimit: 100,
    usageCount: 100,
    expiryDate: "2023-11-15T23:59:59Z",
    status: "Inactive",
    applicableTo: "All Products"
  }
];
