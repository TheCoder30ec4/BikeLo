import { API_BASE, fetchWithAuth, getAccessToken } from "@/lib/api";
import type { BikeResponse, UpdateBikeRequest } from "@/types/api";
import type { Bike } from "@/types/bike";

/** Build full image URL for API image paths. */
export function bikeImageUrl(url: string | undefined | null): string {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
}

/** Map backend BikeResponse to UI Bike type. */
export function mapBikeResponseToBike(b: BikeResponse): Bike {
  const img = b.images?.[0]?.url;
  return {
    id: String(b.id),
    year: b.year,
    brand: b.make,
    model: b.model_name,
    variant: "",
    price: Number(b.price) / 100_000,
    emi: Math.round(Number(b.price) / 60),
    kmsDriven: b.km_driven,
    fuelType: "Petrol",
    transmission: "Manual",
    location: "",
    tags: [],
    imageUrl: bikeImageUrl(img),
  };
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: T;
  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw new Error(text || res.statusText || "Invalid response");
  }
  if (!res.ok) {
    const msg = (data as any)?.detail ?? (data as any)?.message ?? text;
    throw new Error(Array.isArray(msg) ? msg.map((e: any) => e.msg || e).join(", ") : String(msg));
  }
  return data;
}

/** List all bikes (requires auth). */
export async function getBikes(): Promise<BikeResponse[]> {
  const res = await fetchWithAuth("/bikes/");
  return parseJson<BikeResponse[]>(res);
}

/** Create a bike with multipart form (requires auth). */
export async function createBike(formData: FormData): Promise<BikeResponse> {
  const token = getAccessToken();
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}/bikes/`, {
    method: "POST",
    headers,
    body: formData,
  });
  return parseJson<BikeResponse>(res);
}

/** Update a bike by id (requires auth). */
export async function updateBike(bikeId: number, data: UpdateBikeRequest): Promise<BikeResponse> {
  const res = await fetchWithAuth(`/bikes/${bikeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseJson<BikeResponse>(res);
}

/** Capture a lead (Book Now / Sell enquiry). Requires auth. */
export interface LeadCapturePayload {
  email: string;
  subject: string;
  "UserHTML ": string;
  "AdminHTML ": string;
}

export async function bookBikeLeadApi(payload: LeadCapturePayload): Promise<{ message: string }> {
  const res = await fetchWithAuth("/leads/capture", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseJson<{ message: string }>(res);
}

/** Delete a bike by id (requires auth). */
export async function deleteBike(bikeId: number): Promise<void> {
  const res = await fetchWithAuth(`/bikes/${bikeId}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text();
    let detail: unknown;
    try {
      detail = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(text || "Failed to delete bike");
    }
    throw new Error((detail as any)?.detail ?? text);
  }
}
