export default function Pricing() {
    const plans = [
      {
        name: "Pay As You Go",
        price: "$5/simulation",
        features: [
        ],
        buttonText: "Get started",
        buttonColor: "bg-gray-600 hover:bg-gray-500",
      },
      {
        name: "Monthly",
        price: "$29.99/month",
        features: [
        ],
        buttonText: "Get started",
        buttonColor: "bg-blue-600 hover:bg-blue-500",
      },
      {
        name: "Yearly",
        price: "$299.99/month",
        features: [
        ],
        buttonText: "Get started",
        buttonColor: "bg-green-600 hover:bg-green-500",
      },
    ];
  
    return (
      <section className="py-16 bg-gray-900 text-white text-center">
        <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Choose Your Plan</h2>
          <p className="text-gray-400 mb-12">
            Find the perfect plan to match your financial planning needs.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <div
                key={index}
                className="p-8 bg-gray-800 rounded-xl shadow-lg border border-gray-700"
              >
                <h3 className="text-2xl font-semibold">{plan.name}</h3>
                <p className="text-3xl font-bold mt-4">{plan.price}</p>
                <ul className="mt-6 text-gray-400 space-y-2">
                  {plan.features.map((feature, idx) => (
                    <li key={idx}>✔ {feature}</li>
                  ))}
                </ul>
                <button
                  className={`mt-6 px-6 py-3 w-full text-lg font-semibold rounded-lg transition ${plan.buttonColor}`}
                >
                  {plan.buttonText}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  