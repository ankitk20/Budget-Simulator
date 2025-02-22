import { Briefcase, BarChart3, TrendingUp, Shield } from "lucide-react";

const features = [
  {
    icon: <TrendingUp className="h-10 w-10 text-blue-500" />,
    title: "Financial Growth Projection",
    description: "See how your finances evolve over time with our detailed simulations.",
  },
  {
    icon: <BarChart3 className="h-10 w-10 text-green-500" />,
    title: "Comprehensive Visualization",
    description: "Get insightful charts that illustrate income, expenses, and investments.",
  },
  {
    icon: <Briefcase className="h-10 w-10 text-yellow-500" />,
    title: "Multi-Aspect Budgeting",
    description: "Track income, expenses, debt, and investments all in one place.",
  },
  {
    icon: <Shield className="h-10 w-10 text-red-500" />,
    title: "Plan with Confidence",
    description: "Make informed financial decisions with accurate projections.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-gray-800 text-white">
      <div className="container mx-auto text-center max-w-6xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Why Choose FiSim?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-8 bg-gray-900 rounded-2xl shadow-lg text-center border border-gray-700"
            >
              <div className="mb-5 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="text-gray-400 mt-3">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
