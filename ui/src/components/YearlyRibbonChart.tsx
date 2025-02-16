import { ComposedChart, XAxis, YAxis, Tooltip, Legend, Area, ResponsiveContainer } from "recharts";

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
  const colors = ["#34D399", "#F87171", "#FACC15", "#818CF8", "#60A5FA", "#EC4899", "#9333EA"];
  return colors[index % colors.length]; // Cycle through colors
};

const RibbonChart: React.FC<RibbonChartProps> = ({ data }) => {
  const categories = getCategoryKeys(data);

  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow-lg">
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={data}>
          <XAxis dataKey="year" stroke="#ddd" />
          <YAxis tickFormatter={formatYAxis} stroke="#ddd" />
          <Tooltip 
            contentStyle={{ backgroundColor: "#1F2937", color: "#fff", border: "none" }} 
            itemStyle={{ color: "#fff" }} // Removes color indicators from items
            formatter={(value) => formatYAxis(value as number)} 
          />
          <Legend wrapperStyle={{ color: "#ddd" }} />

          {categories.map((category, index) => (
            <Area 
              key={category} 
              type="monotone" 
              dataKey={category} 
              stackId="1" 
              fill={getColor(index)} 
              stroke={getColor(index)} 
              name={category} 
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RibbonChart;
