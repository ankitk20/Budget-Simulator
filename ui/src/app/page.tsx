import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import BudgetSimulation from "@/components/BudgetSimulation";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-900 text-white px-6 flex flex-col items-center relative">
      {/* Hero & Demo Section */}
      <section className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 mt-10 px-4">
        {/* Left Side - Product Info */}
        <div className="lg:w-[40%] text-center lg:text-left">
          <Hero />
        </div>

        {/* Right Side - Demo Section */}
        <div className="lg:w-[60%] flex items-center justify-center">
          <div className="w-full h-[550px] max-w-[800px] bg-gray-800 rounded-xl shadow-lg overflow-y-auto">
            <BudgetSimulation />
          </div>
        </div>
      </section>

      {/* Features & Pricing Sections */}
      <Features />
      <Pricing />
    </main>
  );
}
