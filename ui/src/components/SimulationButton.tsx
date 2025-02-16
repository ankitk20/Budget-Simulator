import Button from "./Button";

export default function SimulationButton({ fetchStream, loading }: { fetchStream: () => Promise<void>; loading: boolean }) {
  return (
    <div className="flex justify-between items-center my-2">
      {/* Summary Button on the Left */}
      <Button label={loading ? "Simulating..." : "Run Simulation"} onClick={fetchStream} loading={loading} />

      {/* Simulation Button on the Right */}
      <Button label="View Insights" onClick={() => console.log("insights clicked")} loading={loading} />
    </div>
  );
}