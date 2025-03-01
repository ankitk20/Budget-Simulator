import { typeInflAdjNetWorth, typeNetWorth } from "@/utils/constant";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

export interface LineChartData {
  data: { [key: string]: number }[]; // Allows dynamic keys
}

const formatYAxis = (value: number) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
};

const YearlyLineChart: React.FC<LineChartData> = ({ data }) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-200 mb-2">Net Worth</h2>
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
            contentStyle={{ backgroundColor: "#121820", color: "#fff", border: "none" }} 
            itemStyle={{ color: "#fff" }} // Removes color indicators from items
            formatter={(value) => formatYAxis(value as number)} 
          />
          <Legend wrapperStyle={{ color: "#ddd" }} />

          {/* Line for inflAdjNtWrth */}
          <Line type="monotone" dataKey={typeInflAdjNetWorth} stroke="#8884d8" strokeWidth={2} dot={{ fill: "#8884d8" }} />

          {/* Line for ntWrth */}
          <Line type="monotone" dataKey={typeNetWorth} stroke="#82ca9d" strokeWidth={2} dot={{ fill: "#82ca9d" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YearlyLineChart;
