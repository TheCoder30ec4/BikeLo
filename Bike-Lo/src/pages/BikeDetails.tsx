import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getBikes, bikeImageUrl } from "@/services/bikeService";
import type { BikeResponse } from "@/types/api";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Shield, Gauge, Calendar, CheckCircle2 } from "lucide-react";

export default function BikeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bike, setBike] = useState<BikeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
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
        if (mounted) setError("Failed to load bike details");
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [id]);

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#f7931e]/30 border-t-[#f7931e] rounded-full animate-spin" />
          <p className="text-neutral-400 text-sm uppercase tracking-widest font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (error || !bike) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center space-y-4">
          <p className="text-2xl font-bold text-black dark:text-white">{error ?? "Bike not found"}</p>
          <button
            onClick={() => navigate("/buy")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#f7931e] text-white font-bold rounded-full
             hover:bg-[#e6851a] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Catalog
          </button>
        </div>
      </div>
    );
  }

  const imageUrls = (bike.images ?? []).map((img) => bikeImageUrl(img.url));
  const formatPrice = (p: number) => `₹ ${(p).toLocaleString("en-IN")}`;
  const ownership = bike.ownership === 1 ? "1st Owner" : bike.ownership === 2 ? "2nd Owner" : `${bike.ownership}th Owner`;

  // Specs to display in the grid
  const specs = [
    { label: "Year", value: String(bike.year) },
    { label: "KM Driven", value: bike.km_driven.toLocaleString("en-IN") + " km" },
    { label: "Ownership", value: ownership },
    { label: "Insurance", value: bike.insurance ? "Available" : "Not Available" },
  ];

  // Key features derived from data
  const keyFeatures = [
    { icon: <Calendar className="w-5 h-5" />, label: `${bike.year} Model` },
    { icon: <Gauge className="w-5 h-5" />, label: `${bike.km_driven.toLocaleString()} km driven` },
    { icon: <Shield className="w-5 h-5" />, label: bike.insurance ? "Insurance Included" : "No Insurance" },
    { icon: <CheckCircle2 className="w-5 h-5" />, label: ownership },
  ];

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-12 pb-16">
      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => navigate("/buy")}
        className="flex items-center gap-2 text-sm text-neutral-500 hover:text-[#f7931e] transition-colors mb-8 mt-4 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="uppercase tracking-widest font-bold text-[11px]">Back to Catalog</span>
      </motion.button>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

        {/* ── LEFT: Image Gallery ─────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-3"
        >
          {/* Main Image */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            {mainImage ? (
              <img
                src={mainImage}
                alt={`${bike.make} ${bike.model_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                No Image Available
              </div>
            )}
            {/* Ownership badge */}
            <div className="absolute top-4 left-4">
              <Badge className="bg-[#f7931e] text-white text-[10px] px-3 py-1 font-black uppercase tracking-wide italic border-0">
                {ownership}
              </Badge>
            </div>
          </div>

          {/* Thumbnails */}
          {imageUrls.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {imageUrls.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => setMainImage(src)}
                  className={`aspect-[4/3] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                    mainImage === src
                      ? "border-[#f7931e] shadow-[0_0_12px_rgba(247,147,30,0.4)]"
                      : "border-neutral-200 dark:border-neutral-800 hover:border-[#f7931e]/50"
                  }`}
                >
                  <img src={src} alt={`view-${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* ── RIGHT: Details ──────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-7"
        >
          {/* Title & Price */}
          <div>
            <h1
              className="text-3xl sm:text-4xl font-black italic tracking-tight text-black dark:text-white uppercase leading-tight"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              {bike.make} {bike.model_name}
            </h1>
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-400 mt-1">
              {bike.year} · {ownership}
            </p>
            <p
              className="text-3xl font-black text-[#f7931e] mt-3"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              {formatPrice(bike.price)}
              <span className="text-sm font-medium text-neutral-400 ml-2">(Ex-showroom)</span>
            </p>
          </div>

          {/* Specs Grid */}
          <div className="grid grid-cols-2 gap-3">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3"
              >
                <p className="text-[10px] uppercase tracking-[0.15em] text-neutral-400 font-semibold mb-0.5">
                  {spec.label}
                </p>
                <p className="text-sm font-bold text-black dark:text-white">
                  {spec.value}
                </p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-neutral-200 dark:border-neutral-800" />

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              className="flex-1 py-4 bg-gradient-to-r from-[#f7931e] to-[#e6851a] text-white font-black uppercase tracking-widest text-sm rounded-xl hover:brightness-110 active:scale-[0.98] transition-all shadow-lg shadow-orange-500/20"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Book Now
            </button>
            <button
              className="flex-1 py-4 bg-transparent border-2 border-neutral-300 dark:border-neutral-700 text-black dark:text-white font-bold uppercase tracking-widest text-sm rounded-xl hover:border-[#f7931e]/60 hover:text-[#f7931e] transition-all"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Check On-Road Price
            </button>
          </div>

          <p className="text-xs text-neutral-400 text-center sm:text-left">
            💬 Contact for best deal · EMI options available
          </p>

          {/* Divider */}
          <div className="border-t border-neutral-200 dark:border-neutral-800" />

          {/* Key Features */}
          <div>
            <h2
              className="text-lg font-black uppercase italic tracking-tight text-black dark:text-white mb-4"
              style={{ fontFamily: "'Noto Serif', serif" }}
            >
              Key Features
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {keyFeatures.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 group hover:border-[#f7931e]/40 transition-colors"
                >
                  <span className="text-[#f7931e] flex-shrink-0">{feat.icon}</span>
                  <span className="text-sm font-semibold text-black dark:text-white leading-tight">
                    {feat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Posted date */}
          <p className="text-[10px] text-neutral-400 uppercase tracking-widest">
            Listed on {new Date(bike.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
