interface SimulationButtonProps {
    fetchStream: () => Promise<void>;
    loading: boolean;
  }
  
  export default function SimulationButton({ fetchStream, loading }: SimulationButtonProps) {
    return (
      <button
        onClick={fetchStream}
        disabled={loading}
        className={`text-white px-4 py-2 my-2 rounded-lg font-semibold transition-all duration-200 bg-gray-700 text-gray-200 
          ${loading 
            ? "cursor-not-allowed" 
            : "rounded hover:bg-gray-600 transition"
          }
        `}
      >
        {loading ? "Simulating..." : "Run Simulation"}
      </button>
    );
  }