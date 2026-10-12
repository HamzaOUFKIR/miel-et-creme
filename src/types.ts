export interface BakeryConfig {
  name: string;
  email: string;
  phone: string;
  isDemo: boolean;
}

export type Category = "cakes" | "little-treats";
export interface Product {
  id: string;
  name: string;
  description: string;
  category: Category;
  image: string;
  imageAlt: string;
  flavor: string;
  tag: string;
}

export interface InquiryData {
  flavor: string;
  size: string;
  tiers: string;
  occasion: string;
  date: string;
  fulfillment: string;
  deliveryArea: string;
  dietary: string[];
  notes: string;
  name: string;
  email: string;
  phone: string;
  consent: boolean;
}

export type FieldName = keyof InquiryData;
export type ValidationErrors = Partial<Record<FieldName, string>>;

export interface InquiryReceipt {
  status: "prepared" | "submitted";
  summary: string;
  emailUrl: string | null;
}
