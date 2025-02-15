import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer } from "recharts";

export interface ChartProps {
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

const YearlyLineChart: React.FC<ChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}>
        <XAxis dataKey="year" />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip 
          formatter={(value: number) => formatYAxis(value)}
        />
        <Legend />

        {/* Line for inflAdjNtWrth */}
        <Line type="monotone" dataKey="inflAdjNtWrth" stroke="#8884d8" strokeWidth={2} />

        {/* Line for ntWrth */}
        <Line type="monotone" dataKey="ntWrth" stroke="#82ca9d" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default YearlyLineChart;