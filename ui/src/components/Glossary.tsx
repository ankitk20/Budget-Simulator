// Mock column definitions (same for all countries)
const columnDefinitions = [
  { key: "inflRt", name: "Inflation Rate", description: "" },
  { key: "capGnTaxRate", name: "Capital Gain Tax Rate", description: "" },
  { key: "homeLoanRtOfInt", name: "Home Loan Rate of Interest", description: "" },
  { key: "vehicleLoanRtOfInt", name: "Vehicle Loan Rate of Interest", description: "" },
  { key: "eduLoanRtOfInt", name: "Education Loan Rate of Interest", description: "" }, 
  { key: "highRiskRtOfRet", name: "High Risk Investment Rate of Return", description: "" },
  { key: "moderateRiskRtOfRet", name: "Moderate Risk Investment Rate of Return", description: "" },
  { key: "lowRiskRtOfRet", name: "Low Risk Investment Rate of Return", description: "" },
  { key: "savingsRtOfRet", name: "Savings Rate of Return", description: "" }, 
];

export default function Glossary({ countryMap, open, onClose }: { countryMap: Record<string, number>; open: boolean; onClose: () => void }) {

  if (!open) return; // Return if note opened

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50 pointer-events-auto">
      <div className="bg-gray-900 text-white p-8 rounded-lg shadow-2xl w-full max-w-2xl">
        <h2 className="text-xl font-bold mb-4">Glossary</h2>
        <div className="mt-4 grid grid-cols-2 gap-4">
          {columnDefinitions.map((col) => (
            <div key={col.key} className="border-b border-gray-700 pb-2">
                <p className="font-bold text-white-400">{countryMap[col.key]}%</p>
              <p className="text-sm font-bold text-gray-400">{col.name}</p>
              <p className="text-xs text-gray-500">{col.description}</p>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg">
          Close
        </button>
      </div>
    </div>
  );  
}