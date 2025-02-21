import { catDebt, catExpense, catIncome, catInv, FlattenedData } from "@/app/utils/data";
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface SimulationData {
  year: number;
  [category: string]: number;  // Dynamic category with amounts
}

interface StackedBarChartProps {
  data: FlattenedData[];  // Data for each year and category amounts
  categories: string[];     // Categories like "Income", "Expense", "Investment", "Debt"
}

const formatYAxis = (value: number) => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
};

const formatYAxisLabel = (value: number) => {
  return `${value * 100}%`;
};

export const StackedBarChart: React.FC<StackedBarChartProps> = ({ data, categories }) => {
  return (
    <div className="p-4 bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-200 mb-2">Category Breakdown</h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} stackOffset="expand">
          <XAxis 
            dataKey="year" 
            tick={{ fill: "#ddd" }} 
            tickLine={{ stroke: "#555" }} 
            axisLine={{ stroke: "#555" }} 
          />
          <YAxis 
            tickFormatter={formatYAxisLabel} 
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
          {categories
            .map((category, index) => (
              <Bar
                key={category}
                dataKey={category}
                stackId="a"
                fill={['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'][index % 4]} // Dynamic colors
              />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StackedBarChart;
