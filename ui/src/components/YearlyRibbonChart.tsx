import { ComposedChart, XAxis, YAxis, Tooltip, Legend, Area, Line, ResponsiveContainer } from "recharts";

export interface RibbonChartData {
  year: number;
  [key: string]: number; // Allows dynamic keys for categories
}

interface RibbonChartProps {
  data: RibbonChartData[];
}

const formatYAxis = (value: number) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
};

const getCategoryKeys = (data: RibbonChartData[]) => {
  if (!data?.length) return [];
  return Object.keys(data[0]).filter((key) => key !== "year"); // Exclude 'year'
};

const getColor = (index: number) => {
  const colors = ["#008000", "#ff6666", "#ffcc66", "#6666ff", "#66ccff", "#ff33cc", "#9900cc"];
  return colors[index % colors.length]; // Cycle through colors
};

const RibbonChart: React.FC<RibbonChartProps> = ({ data }) => {
  const categories = getCategoryKeys(data);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data}>
        <XAxis dataKey="year" />
        <YAxis tickFormatter={formatYAxis} />
        <Tooltip formatter={(value) => formatYAxis(value as number)} />
        <Legend />

        {categories.map((category, index) => (
          category === "income" ? (
            <Line key={category} type="monotone" dataKey={category} stroke={getColor(index)} strokeWidth={2} name={category} />
          ) : (
            <Area key={category} type="monotone" dataKey={category} stackId="1" fill={getColor(index)} stroke={getColor(index)} name={category} />
          )
        ))}
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default RibbonChart;
