export interface Address {
  id: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export const MOCK_ADDRESSES: Address[] = [
  {
    id: "addr-1",
    name: "Ayushi Sainani",
    phone: "+91 9876543210",
    address: "Flat 4B, Sea View Apartments, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400050",
    isDefault: true,
  },
  {
    id: "addr-2",
    name: "Ayushi Sainani",
    phone: "+91 9876543210",
    address: "203, Sunshine Residency, Andheri East",
    city: "Mumbai",
    state: "Maharashtra",
    pincode: "400069",
    isDefault: false,
  },
  {
    id: "addr-3",
    name: "Ayushi Sainani (Mom)",
    phone: "+91 9123456789",
    address: "15, MG Road, Camp Area",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    isDefault: false,
  },
];
