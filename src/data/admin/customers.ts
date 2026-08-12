export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  joinedDate: string;
  lastOrder: string;
}

export const MOCK_CUSTOMERS: Customer[] = [
  { id: "CUST-001", name: "Aarushi Mehta", email: "aarushi@example.com", phone: "+91 9876543210", orders: 12, totalSpent: 14280, joinedDate: "2023-01-15", lastOrder: "2024-08-12" },
  { id: "CUST-002", name: "Riya Sharma", email: "riya.sharma@example.com", phone: "+91 9988776655", orders: 4, totalSpent: 4500, joinedDate: "2023-05-20", lastOrder: "2024-08-10" },
  { id: "CUST-003", name: "Nisha Patel", email: "nisha.p@example.com", phone: "+91 9123456789", orders: 1, totalSpent: 699, joinedDate: "2024-08-01", lastOrder: "2024-08-01" },
  { id: "CUST-004", name: "Sneha Reddy", email: "sneha.r@example.com", phone: "+91 9876123450", orders: 8, totalSpent: 9650, joinedDate: "2023-02-10", lastOrder: "2024-07-28" },
  { id: "CUST-005", name: "Ananya Desai", email: "ananya.d@example.com", phone: "+91 9765432109", orders: 3, totalSpent: 3200, joinedDate: "2023-11-05", lastOrder: "2024-08-05" },
  { id: "CUST-006", name: "Priya Singh", email: "priya.singh@example.com", phone: "+91 9811223344", orders: 2, totalSpent: 2400, joinedDate: "2024-01-15", lastOrder: "2024-06-20" },
  { id: "CUST-007", name: "Meera Iyer", email: "meera.iyer@example.com", phone: "+91 9922334455", orders: 6, totalSpent: 7800, joinedDate: "2023-08-12", lastOrder: "2024-08-02" },
  { id: "CUST-008", name: "Kavya Nair", email: "kavya.nair@example.com", phone: "+91 9632587410", orders: 5, totalSpent: 5900, joinedDate: "2023-09-25", lastOrder: "2024-07-15" },
  { id: "CUST-009", name: "Tanvi Kapoor", email: "tanvi.k@example.com", phone: "+91 9852147369", orders: 15, totalSpent: 18500, joinedDate: "2022-12-01", lastOrder: "2024-08-11" },
  { id: "CUST-010", name: "Ishita Verma", email: "ishita.v@example.com", phone: "+91 9741258963", orders: 1, totalSpent: 899, joinedDate: "2024-08-08", lastOrder: "2024-08-08" },
  { id: "CUST-011", name: "Neha Joshi", email: "neha.joshi@example.com", phone: "+91 9321456987", orders: 7, totalSpent: 8200, joinedDate: "2023-04-18", lastOrder: "2024-07-30" },
  { id: "CUST-012", name: "Ritika Sen", email: "ritika.sen@example.com", phone: "+91 9152437680", orders: 2, totalSpent: 1500, joinedDate: "2024-02-22", lastOrder: "2024-05-10" },
  { id: "CUST-013", name: "Aditi Rao", email: "aditi.rao@example.com", phone: "+91 9081726354", orders: 9, totalSpent: 11200, joinedDate: "2023-06-30", lastOrder: "2024-08-09" },
  { id: "CUST-014", name: "Pooja Hegde", email: "pooja.hegde@example.com", phone: "+91 9977553311", orders: 3, totalSpent: 2800, joinedDate: "2023-10-14", lastOrder: "2024-04-25" },
  { id: "CUST-015", name: "Shruti Hassan", email: "shruti.h@example.com", phone: "+91 9888777666", orders: 11, totalSpent: 13500, joinedDate: "2023-03-05", lastOrder: "2024-08-04" },
  { id: "CUST-016", name: "Kriti Sanon", email: "kriti.s@example.com", phone: "+91 9555444333", orders: 1, totalSpent: 1299, joinedDate: "2024-07-12", lastOrder: "2024-07-12" },
  { id: "CUST-017", name: "Kiara Advani", email: "kiara.a@example.com", phone: "+91 9444333222", orders: 5, totalSpent: 6400, joinedDate: "2023-07-21", lastOrder: "2024-06-18" },
  { id: "CUST-018", name: "Sara Ali", email: "sara.ali@example.com", phone: "+91 9333222111", orders: 8, totalSpent: 9800, joinedDate: "2023-12-10", lastOrder: "2024-08-07" },
  { id: "CUST-019", name: "Janhvi Kapoor", email: "janhvi.k@example.com", phone: "+91 9222111000", orders: 2, totalSpent: 1798, joinedDate: "2024-03-15", lastOrder: "2024-05-22" },
  { id: "CUST-020", name: "Anushka Sharma", email: "anushka.s@example.com", phone: "+91 9111000999", orders: 14, totalSpent: 17200, joinedDate: "2022-11-28", lastOrder: "2024-08-03" }
];
