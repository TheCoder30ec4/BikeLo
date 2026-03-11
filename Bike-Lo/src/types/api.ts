/**
 * Types aligned with BikeLo Backend OpenAPI schemas.
 */

// ----- Auth -----
export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
  role?: string;
  status?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type?: string;
}

export interface UserResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  created_at: string;
}

export interface UpdateRoleRequest {
  role: "user" | "admin";
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

// ----- Bikes -----
export interface BikeImageResponse {
  id: number;
  url: string;
  created_at: string;
}

export interface BikeResponse {
  id: number;
  make: string;
  model_name: string;
  year: number;
  km_driven: number;
  ownership: number;
  price: number;
  insurance: boolean;
  image_count: number;
  created_at: string;
  updated_at: string | null;
  images: BikeImageResponse[];
}

export interface UpdateBikeRequest {
  make?: string | null;
  model_name?: string | null;
  year?: number | null;
  km_driven?: number | null;
  ownership?: number | null;
  price?: number | null;
  insurance?: boolean | null;
}

// ----- Sell Bikes -----
export interface SellBikeResponse {
  id: number;
  user_id: number;
  vehicle_type: string;
  registration_no: string | null;
  brand: string;
  model: string;
  year: number;
  ex_showroom: number | null;
  invoice_url: string | null;
  rc_card_url: string | null;
  created_at: string;
  updated_at: string | null;
}

// ----- Sell Listings (simple form) -----
export interface SellListingRequest {
  model: string;
  year: number;
  no_of_owners: number;
  insurance_available: boolean;
  finance_hypothecation: boolean;
  original_rc_available: boolean;
}

export interface SellListingResponse {
  id: number;
  user_id: number;
  model: string;
  year: number;
  no_of_owners: number;
  insurance_available: boolean;
  finance_hypothecation: boolean;
  original_rc_available: boolean;
  created_at: string;
}
