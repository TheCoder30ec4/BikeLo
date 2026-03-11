import { fetchWithAuth } from "@/lib/api";
import type { SellListingRequest, SellListingResponse } from "@/types/api";

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

/** Submit a simple sell listing (model, year, owners, insurance, finance, original RC). Requires auth. */
export async function createSellListing(data: SellListingRequest): Promise<SellListingResponse> {
  const res = await fetchWithAuth("/sell-listings/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return parseJson<SellListingResponse>(res);
}
