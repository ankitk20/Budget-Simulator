"use client";

import { useRef, useState } from "react";
import { initialData, simulationInput, DataEntry } from "../app/utils/data";
import SimulationButton from "./SimulationButton";
import BudgetTable from "./BudgetTable";
import YearlyLineChart from "./YearlyLineChart";
import { ChartProps } from "./YearlyLineChart";

export default function BudgetSimulation() {
  const [tableData, setTableData] = useState<DataEntry[]>(initialData);
  const editDataRef = useRef<DataEntry[]>([...initialData]);
  const [loading, setLoading] = useState(false);
  const chartDataRef = useRef<ChartProps>({data: []});
  const [chartData, setChartData] = useState<ChartProps>({data: []});

  editDataRef.current.forEach((row) => {
    const category = row.category;
    const type = row.type;

    const entry = {
      currAmt: row.currAmt || 0,
      monthlyAmt: row.monthlyAmt || 0,
      downPay: row.downPayment || 0,
      stYr: row.startYear || 2025,
      numOfYr: row.numOfYears || 0,
      rateOfInt: row.rateOfInterest || 0,
      rateOfInc: row.rateOfIncrement || 0
    };

    if (!simulationInput[category]) {
      simulationInput[category] = {};
    }

    simulationInput[category][type] = entry;
  });

  const fetchStream = async () => {
    setTableData([...editDataRef.current]);
    chartDataRef.current = {data: []};
    const simulationInput = {
      simYr: 30,
      inflRate: 7,
      ltcgTaxRate: 12.5,
      stcgTaxRate: 20.0,
      country: "USA",
      currency: "USD",
      income: {},
      expense: {},  
      debt: {},
      inv: {}
    };
    
    editDataRef.current.forEach((row) => {
      const category = row.category;
      const type = row.type;
      
      const entry = {
        currAmt: row.currAmt || 0,
        monthlyAmt: row.monthlyAmt || 0,
        downPay: row.downPayment || 0,
        stYr: row.startYear || 2025,
        numOfYr: row.numOfYears || 0,
        rateOfInt: row.rateOfInterest || 0,
        rateOfInc: row.rateOfIncrement || 0
      };
    
      if (!simulationInput[category]) {
        simulationInput[category] = {};
      }
      
      simulationInput[category][type] = entry;
    });

    setLoading(true);

    const response = await fetch("/api/simulation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(simulationInput),
    });

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      accumulated += decoder.decode(value, { stream: true });

      const lines = accumulated.split("\n");
      accumulated = lines.pop() || "";
      lines.forEach((line) => {
        if (line.trim()) {
          try {
            const columnData = JSON.parse(line);
            const year = Object.keys(columnData)[0];
            const yearData = columnData[year];

            if (!year || !yearData || typeof yearData !== "object") {
              console.warn("Unexpected JSON format:", columnData);
              return;
            }

            // Extract net worth data
            const netWorth = yearData.summary?.ntWrth || 0;
            const inflAdjNetWorth = yearData.summary?.inflAdjNtWrth || 0;

            // Update chart data
            chartDataRef.current.data.push({
              year: Number(year),
              ntWrth: netWorth,
              inflAdjNtWrth: inflAdjNetWorth
            });

            setTableData((prevData) =>
              prevData.map((row) => {
                const categoryKey = row.category;
                const typeKey = row.type;
                if (yearData[categoryKey] && yearData[categoryKey][typeKey] !== undefined) {
                  return {
                    ...row,
                    [year]: yearData[categoryKey][typeKey],
                  };
                }
                return row;
              })
            );

            setChartData({data: [...chartDataRef.current.data]}); // Update state once all data is processed
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      });
    }

    setLoading(false);
  };

  return (
    <div className="p-4">
      <SimulationButton fetchStream={fetchStream} loading={loading} />
      <YearlyLineChart  data={ chartData.data } />
      <BudgetTable tableData={tableData} setTableData={setTableData} editDataRef={editDataRef} />
    </div>
  );
}