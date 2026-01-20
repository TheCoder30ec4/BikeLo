export interface Bike {
  id: string;
  year: number;
  brand: string;
  model: string;
  variant: string;
  price: number; // in lakhs
  emi: number; // per month
  kmsDriven: number;
  fuelType: "Petrol" | "Diesel" | "Electric";
  transmission: "Manual" | "Automatic";
  location: string;
  tags: string[];
  imageUrl: string;
}

