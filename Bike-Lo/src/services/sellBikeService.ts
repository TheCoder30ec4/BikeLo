import { fetchWithAuth } from "@/lib/api";
import type { SellBikeResponse } from "@/types/api";

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

/** Submit a bike for sale (multipart form; requires auth). */
export async function submitSellBike(formData: FormData): Promise<SellBikeResponse> {
  const res = await fetchWithAuth("/sell-bikes/", {
    method: "POST",
    body: formData,
  });
  return parseJson<SellBikeResponse>(res);
}
