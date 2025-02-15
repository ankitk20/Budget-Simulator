interface SimulationButtonProps {
    fetchStream: () => Promise<void>;
    loading: boolean;
  }
  
  export default function SimulationButton({ fetchStream, loading }: SimulationButtonProps) {
    return (
      <button
        onClick={fetchStream}
        disabled={loading}
        className={`p-2 bg-blue-500 text-white mb-4 rounded ${
          loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
        }`}
      >
        {loading ? "Simulating..." : "Run Simulation"}
      </button>
    );
  }
  