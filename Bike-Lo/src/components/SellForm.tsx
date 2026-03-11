import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { submitSellBike } from "@/services/sellBikeService";

interface SellFormProps {
  onSuccess?: () => void;
}

export default function SellForm({ onSuccess }: SellFormProps) {
  const [vehicleType, setVehicleType] = useState<"new" | "existing">("existing");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    brand: "",
    year: "",
    model: "",
    exShowroom: "",
    registrationNumber: "",
  });
  const [rcFile, setRcFile] = useState<File | null>(null);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);

  const bikeBrands = [
    "Honda",
    "Yamaha",
    "Suzuki",
    "TVS",
    "Bajaj",
    "Royal Enfield",
    "Hero",
    "KTM",
    "Kawasaki",
    "Harley-Davidson",
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRcFileChange = (file: File | null) => {
    setRcFile(file);
  };

  const handleInvoiceFileChange = (file: File | null) => {
    setInvoiceFile(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const yearNum = parseInt(formData.year, 10);
      if (Number.isNaN(yearNum) || yearNum < 1900 || yearNum > 2100) {
        setError("Enter a valid year (1900–2100).");
        return;
      }
      const fd = new FormData();
      fd.append("vehicle_type", vehicleType);
      fd.append("registration_no", vehicleType === "existing" ? formData.registrationNumber : "");
      fd.append("brand", formData.brand);
      fd.append("model", formData.model);
      fd.append("year", String(yearNum));
      if (vehicleType === "new") {
        const exShowroom = parseFloat(formData.exShowroom);
        if (Number.isNaN(exShowroom) || exShowroom < 0) {
          setError("Ex-showroom price is required for new vehicles.");
          return;
        }
        fd.append("ex_showroom", formData.exShowroom);
        if (invoiceFile) fd.append("invoice", invoiceFile);
      } else {
        if (vehicleType === "existing" && !formData.registrationNumber.trim()) {
          setError("Registration number is required for used vehicles.");
          return;
        }
        if (rcFile) fd.append("rc_card", rcFile);
      }

      await submitSellBike(fd);
      setFormData({ brand: "", year: "", model: "", exShowroom: "", registrationNumber: "" });
      setRcFile(null);
      setInvoiceFile(null);
      setVehicleType("existing");
      setError(null);
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full !bg-white dark:!bg-gray-900/50 border border-gray-300 dark:border-gray-700 shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2 text-black dark:text-white" style={{ fontFamily: "'Noto Serif', serif" }}>
          <svg className="w-6 h-6 text-[#f7931e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Bike Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Vehicle Type Selection */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3" style={{ fontFamily: "'Noto Serif', serif" }}>
              Bike Type
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer block">
                <input
                  type="radio"
                  name="vehicleType"
                  value="new"
                  checked={vehicleType === "new"}
                  onChange={() => setVehicleType("new")}
                  className="peer sr-only"
                />
                <div className="bg-white dark:bg-gray-800/50 border-2 border-gray-300 dark:border-gray-600 peer-checked:bg-emerald-600 peer-checked:border-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all rounded-xl p-4 text-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 peer-checked:text-white block">New Vehicle</span>
                </div>
              </label>
              <label className="cursor-pointer block">
                <input
                  type="radio"
                  name="vehicleType"
                  value="existing"
                  checked={vehicleType === "existing"}
                  onChange={() => setVehicleType("existing")}
                  className="peer sr-only"
                />
                <div className="bg-white dark:bg-gray-800/50 border-2 border-gray-300 dark:border-gray-600 peer-checked:bg-emerald-600 peer-checked:border-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all rounded-xl p-4 text-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-300 peer-checked:text-white block">Used / Existing</span>
                </div>
              </label>
            </div>
          </div>

          <div className="space-y-5">
            
            {/* Common Fields */}
            <div className="grid grid-cols-2 gap-5">
              <div className="col-span-2 md:col-span-1">
                <Label htmlFor="brand" className="text-sm text-gray-700 dark:text-gray-300">Brand</Label>
                <Select
                  id="brand"
                  value={formData.brand}
                  onChange={(e) => handleInputChange("brand", e.target.value)}
                  className="mt-1 !bg-white dark:!bg-gray-800/50 border-gray-300 dark:border-gray-600 !text-black dark:!text-white"
                  required
                >
                  <option value="" className="bg-white dark:bg-gray-800">Select Brand</option>
                  {bikeBrands.map((brand) => (
                    <option key={brand} value={brand.toLowerCase()} className="bg-white dark:bg-gray-800">
                      {brand}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="col-span-2 md:col-span-1">
                <Label htmlFor="year" className="text-sm text-gray-700 dark:text-gray-300">Year</Label>
                <Input
                  id="year"
                  type="number"
                  min="1990"
                  max="2025"
                  placeholder="YYYY"
                  value={formData.year}
                  onChange={(e) => handleInputChange("year", e.target.value)}
                  className="mt-1 !bg-white dark:!bg-gray-800/50 border-gray-300 dark:border-gray-600 !text-black dark:!text-white"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="model" className="text-sm text-gray-700 dark:text-gray-300">Model</Label>
              <Input
                id="model"
                type="text"
                placeholder="e.g. Activa, MT-15, Classic 350"
                value={formData.model}
                onChange={(e) => handleInputChange("model", e.target.value)}
                className="mt-1 !bg-white dark:!bg-gray-800/50 border-gray-300 dark:border-gray-600 !text-black dark:!text-white"
                required
              />
            </div>

            {/* New vehicle: ex-showroom + invoice */}
            {vehicleType === "new" && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="exShowroom" className="text-sm text-gray-700 dark:text-gray-300">Ex-showroom price (₹)</Label>
                  <Input
                    id="exShowroom"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="e.g. 95000"
                    value={formData.exShowroom}
                    onChange={(e) => handleInputChange("exShowroom", e.target.value)}
                    className="mt-1 !bg-white dark:!bg-gray-800/50 border-gray-300 dark:border-gray-600 !text-black dark:!text-white"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Upload Invoice</Label>
                  <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-emerald-300 dark:border-emerald-600 border-dashed rounded-lg cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> PDF, JPG or PNG (MAX. 10MB)
                      </p>
                      {invoiceFile && <p className="text-sm text-emerald-600 font-medium">{invoiceFile.name}</p>}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleInvoiceFileChange(e.target.files?.[0] || null)}
                      required
                    />
                  </label>
                </div>
              </div>
            )}

            {/* Existing Bike: registration + RC */}
            {vehicleType === "existing" && (
              <div className="space-y-5">
                <div>
                  <Label htmlFor="registrationNumber" className="text-sm text-gray-700 dark:text-gray-300">Registration Number</Label>
                  <Input
                    id="registrationNumber"
                    type="text"
                    placeholder="e.g. KA-01-HQ-9999"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange("registrationNumber", e.target.value.toUpperCase())}
                    className="mt-1 !bg-white dark:!bg-gray-800/50 border-gray-300 dark:border-gray-600 !text-black dark:!text-white uppercase tracking-wider"
                    required
                  />
                </div>
                <div>
                  <Label className="text-sm text-gray-700 dark:text-gray-300 mb-2 block">Upload RC Card (Smart Card)</Label>
                  <label className="relative flex flex-col items-center justify-center w-full h-32 border-2 border-emerald-300 dark:border-emerald-600 border-dashed rounded-lg cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> PDF, JPG or PNG (MAX. 10MB)
                      </p>
                      {rcFile && <p className="text-sm text-emerald-600 font-medium">{rcFile.name}</p>}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleRcFileChange(e.target.files?.[0] || null)}
                      required
                    />
                  </label>
                </div>
              </div>
            )}

          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-6 text-base font-semibold rounded-xl transition-all duration-200 bg-emerald-600 hover:bg-emerald-700 text-white"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                Submit Application
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </>
            )}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}
