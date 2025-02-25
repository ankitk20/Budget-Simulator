import { SimulationSummary } from "@/app/utils/data";
import { TrendingUp, TrendingDown, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function FinancialAnalysis({ simulationSummaryRef }: { simulationSummaryRef: React.RefObject<SimulationSummary> }) {
  const { data: session } = useSession(); // Get user session data
  const [data, setData] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAnalysis() {
      try {
        setLoading(true);
        const token = session?.idToken; // Extract token
        const response = await fetch("/api/analysis", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token ? `Bearer ${token}` : "",
                "Accept": "application/json",
            },
            body: JSON.stringify(simulationSummaryRef.current),
        });
        if (!response.ok) throw new Error("Failed to fetch analysis");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError("Error loading analysis. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-32"><Loader2 className="animate-spin text-blue-500" size={32} /></div>;
  }

  if (error) {
    return <div className="text-red-500 font-medium text-center">{error}</div>;
  }

  return (
    <section className="w-full min-h-screen py-1 bg-gray-900 text-white">
      <div className="container mx-auto max-w-6xl px-6">

        {/* Summary Section */}
        <h3 className="text-3xl font-semibold mt-16 mb-6 text-center">📝 Summary</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.Summary?.map((item: string, index: number) => {
            const text = item as string;
            const isPositive = text.includes("✅");

            return (
              <div
                key={index}
                className={`flex items-center p-6 rounded-2xl border border-gray-700 shadow-lg`}
                // ${isPositive ? "text-green-300" : "text-red-300"}`}
              >
                {item.includes("✅") ? (
                  <CheckCircle className="mr-4 text-green-400 w-8 h-8" />
                ) : (
                  <AlertTriangle className="mr-4 text-yellow-400 w-8 h-8" />
                )}
                <span className="text-lg font-medium">
                    {text.slice(2)}
                </span>
              </div>
            );
          })}
        </ul>

        {/* Trend Section */}
        <h3 className="text-3xl font-semibold mt-16 mb-6 text-center">📊 Financial Trend</h3>
        <div className="grid grid-cols-1 mb-16 md:grid-cols-2 gap-6">
          {data.Trend?.map((item: string, index: number) => {
            const text = item as string;
            const isPositive = text.includes("🔼");
            const isDebt = text.includes("Debt");
            const isExpense = text.includes("Expense");

            return (
              <div
                key={item}
                className={`flex items-center p-6 rounded-2xl border border-gray-700 shadow-lg`}
              >
                {isDebt || isExpense ? (
                  isPositive ? (
                    <TrendingUp className="mr-4 text-red-400 w-8 h-8" />
                  ) : (
                    <TrendingDown className="mr-4 text-green-400 w-8 h-8" />
                  )
                ) : isPositive ? (
                  <TrendingUp className="mr-4 text-green-400 w-8 h-8" />
                ) : (
                  <TrendingDown className="mr-4 text-red-400 w-8 h-8" />
                )}
                <span className="text-lg font-medium">
                  {text.slice(2)}
                </span>
              </div>
            );
          })
        }
        </div>
      </div>
    </section>
  );
}
