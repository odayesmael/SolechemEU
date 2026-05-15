export interface Product {
  id: string;
  name: string;
  slug: string;
  cas: string;
  ec?: string;
  formula: string;
  mw: string;
  category: string;
  industry: string[];
  grade: string;
  moq: string;
  description: string;
  applications: string[];
  physicalProperties: string;
  safetyHandling?: string;
  tradeRegulatory?: string;
  otherNames?: string;
  compliance: string[];
  packing: string[];
  leadTime: string;
  imageUrl?: string;
  similarProducts?: string[];
}

export interface Industry {
  id: string;
  name: string;
  slug: string;
  icon: string;
  imageUrl?: string;
  description: string;
  compliance: string[];
  productCount: number;
}

export interface RFQItem {
  productId: string;
  productName: string;
  quantity: string;
  grade: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  jobTitle?: string;
  companyName?: string;
  vatNumber?: string;
  annualVolume?: string;
  companySize?: string;
}
