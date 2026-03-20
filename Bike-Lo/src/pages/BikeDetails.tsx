import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBikes, bikeImageUrl } from "@/services/bikeService";
import type { BikeResponse } from "@/types/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function BikeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState<BikeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    Promise.resolve().then(() => { if (mounted) setLoading(true); });
    const decodedId = id ? decodeURIComponent(id) : id;
    getBikes()
      .then((data) => {
        if (!mounted) return;
        const found = data.find((b) => String(b.id) === decodedId);
        if (found) {
          setBike(found);
          const first = found.images?.[0]?.url;
          setMainImage(first ? bikeImageUrl(first) : null);
        } else {
          setError("Bike not found");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load bike");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading)
    return (
      <div className="p-8 pt-24">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="p-8 pt-24">
        <p>{error}</p>
        <Button variant="outline" onClick={() => navigate("/buy")}>
          Back to bikes
        </Button>
      </div>
    );
  if (!bike) return null;

  const imageUrls = (bike.images ?? []).map((img) => bikeImageUrl(img.url));

  return (
    <div className="min-h-screen px-4 py-8 pt-24">
      <div className="container mx-auto max-w-4xl">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>
                  {bike.make} {bike.model_name}
                </CardTitle>
                <CardDescription className="mt-1">
                  Posted: {new Date(bike.created_at).toLocaleString()}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="default" className="bg-[#f7931e] text-white px-3 py-1">
                  {bike.ownership} owner{bike.ownership !== 1 ? "s" : ""}
                </Badge>
                <Button variant="outline" onClick={() => navigate("/buy")}>
                  Back
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                {mainImage ? (
                  <img
                    src={mainImage}
                    alt={`${bike.make} ${bike.model_name}`}
                    className="w-full h-80 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-80 bg-muted rounded-lg" />
                )}

                {imageUrls.length > 0 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto">
                    {imageUrls.map((src, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setMainImage(src)}
                        className="rounded overflow-hidden border"
                      >
                        <img src={src} alt={`thumb-${idx}`} className="w-24 h-16 object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <span className="text-sm text-muted-foreground">Year</span>
                  <div className="text-lg font-semibold">{bike.year}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">KM Driven</span>
                  <div className="text-lg">{bike.km_driven.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Price</span>
                  <div className="text-2xl font-bold text-[#f7931e]">
                    ₹{Number(bike.price).toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Insurance</span>
                  <div>{bike.insurance ? "Yes" : "No"}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
