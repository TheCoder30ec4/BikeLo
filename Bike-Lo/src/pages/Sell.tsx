import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { createSellListing } from "@/services/sellListingService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select } from "@/components/ui/select";

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: 30 }, (_, i) => currentYear - i);

export default function Sell() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [model, setModel] = useState("");
  const [year, setYear] = useState<number | "">("");
  const [noOfOwners, setNoOfOwners] = useState<number | "">(1);
  const [insuranceAvailable, setInsuranceAvailable] = useState<"yes" | "no">("no");
  const [financeHypothecation, setFinanceHypothecation] = useState<"yes" | "no">("no");
  const [originalRcAvailable, setOriginalRcAvailable] = useState<"yes" | "no">("no");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!model.trim()) {
      setError("Model is required.");
      return;
    }
    const y = year === "" ? 0 : Number(year);
    if (!y || y < 1900 || y > currentYear) {
      setError("Please enter a valid year.");
      return;
    }
    const owners = noOfOwners === "" ? 0 : Number(noOfOwners);
    if (owners < 1) {
      setError("Number of owners must be at least 1.");
      return;
    }

    setLoading(true);
    try {
      await createSellListing({
        model: model.trim(),
        year: y,
        no_of_owners: owners,
        insurance_available: insuranceAvailable === "yes",
        finance_hypothecation: financeHypothecation === "yes",
        original_rc_available: originalRcAvailable === "yes",
      });
      setSuccess(true);
      setModel("");
      setYear("");
      setNoOfOwners(1);
      setInsuranceAvailable("no");
      setFinanceHypothecation("no");
      setOriginalRcAvailable("no");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit listing.");
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle style={{ fontFamily: "'Noto Serif', serif" }}>Sell Your Bike</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Please log in to submit your bike for sale.</p>
            <Button onClick={() => navigate("/login")} className="w-full">
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-xl mx-auto">
          <h1
            className="text-3xl font-bold text-black dark:text-white mb-2"
            style={{ fontFamily: "'Noto Serif', serif" }}
          >
            Sell Your Bike
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Fill in the details below to list your bike for sale.
          </p>

          {success && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200">
              Your listing has been submitted successfully.
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle style={{ fontFamily: "'Noto Serif', serif" }}>Bike Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="model">Model</Label>
                  <Input
                    id="model"
                    type="text"
                    placeholder="e.g. Activa 6G, Classic 350"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year</Label>
                  <Select
                    id="year"
                    value={year === "" ? "" : String(year)}
                    onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))}
                    required
                  >
                    <option value="">Select year</option>
                    {yearOptions.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="noOfOwners">No. of owners</Label>
                  <Input
                    id="noOfOwners"
                    type="number"
                    min={1}
                    value={noOfOwners === "" ? "" : noOfOwners}
                    onChange={(e) =>
                      setNoOfOwners(e.target.value === "" ? "" : Math.max(1, Number(e.target.value)))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Insurance available</Label>
                  <Select
                    value={insuranceAvailable}
                    onChange={(e) => setInsuranceAvailable(e.target.value as "yes" | "no")}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Finance or hypothecation</Label>
                  <Select
                    value={financeHypothecation}
                    onChange={(e) => setFinanceHypothecation(e.target.value as "yes" | "no")}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Original RC available</Label>
                  <Select
                    value={originalRcAvailable}
                    onChange={(e) => setOriginalRcAvailable(e.target.value as "yes" | "no")}
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </Select>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setError(null);
                      setSuccess(false);
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
