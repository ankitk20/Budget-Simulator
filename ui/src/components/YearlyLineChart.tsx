import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface LineChartData {
  data: { year: number; inflAdjNtWrth: number; ntWrth: number }[];
}

const formatYAxis = (value: number) => {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(1)}K`;
  }
  return value.toString();
};

const YearlyLineChart: React.FC<LineChartData> = ({ data }) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-200 mb-2">Net Worth Over Time</h2>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <XAxis 
            dataKey="year" 
            tick={{ fill: "#ddd" }} 
            tickLine={{ stroke: "#555" }} 
            axisLine={{ stroke: "#555" }} 
          />
          <YAxis 
            tickFormatter={formatYAxis} 
            tick={{ fill: "#ddd" }} 
            tickLine={{ stroke: "#555" }} 
            axisLine={{ stroke: "#555" }} 
          />
          <Tooltip 
            formatter={(value: number) => formatYAxis(value)}
            contentStyle={{ backgroundColor: "#333", borderColor: "#666", color: "#ddd" }}
            itemStyle={{ color: "#ddd" }}
          />
          <Legend wrapperStyle={{ color: "#ddd" }} />

          {/* Line for inflAdjNtWrth */}
          <Line type="monotone" dataKey="inflAdjNtWrth" stroke="#8884d8" strokeWidth={2} dot={{ fill: "#8884d8" }} />

          {/* Line for ntWrth */}
          <Line type="monotone" dataKey="ntWrth" stroke="#82ca9d" strokeWidth={2} dot={{ fill: "#82ca9d" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YearlyLineChart;
