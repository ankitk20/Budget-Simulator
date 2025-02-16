"use client";

import { useRef, useState } from "react";
import { initialData, SimulationInput, DataEntry } from "../app/utils/data";
import SimulationButton from "./SimulationButton";
import BudgetTable from "./BudgetTable";
import YearlyLineChart from "./YearlyLineChart";
import { LineChartData } from "./YearlyLineChart";
import YearlyRibbonChart from "./YearlyRibbonChart";
import { RibbonChartData } from "./YearlyRibbonChart";
import SimulationForm from "./SimulationForm";

export default function BudgetSimulation() {
  const [tableData, setTableData] = useState<DataEntry[]>(initialData);
  const editDataRef = useRef<DataEntry[]>([...initialData]);
  const [loading, setLoading] = useState(false);
  const lineChartDataRef = useRef<LineChartData>({data: []});
  const [lineChartData, setLineChartData] = useState<LineChartData>({data: []});
  const ribbonChartDataRef = useRef<RibbonChartData[]>([]);
  const [ribbonChartData, setRibbonChartData] = useState<RibbonChartData[]>([]);
    
  // Refs for user inputs (FIRE vs Fortune form)
  const priorityRef = useRef<HTMLSelectElement>(null);
  const yearsRef = useRef<HTMLInputElement>(null);
  const fortuneAmtRef = useRef<HTMLInputElement>(null);
  const currentAgeRef = useRef<HTMLInputElement>(null);
  const lifeExpectancyRef = useRef<HTMLInputElement>(null);
  const countryRef = useRef<HTMLSelectElement>(null);

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

    // if (!simulationInput[category]) {
    //   simulationInput[category] = {};
    // }

    // simulationInput[category][type] = entry;
  });

  const fetchStream = async () => {

    // Read user inputs only when Simulate button is clicked
    const priority = priorityRef.current?.value;
    const years = yearsRef.current?.value ? Number(yearsRef.current.value) : undefined;
    const fortuneAmt = fortuneAmtRef.current?.value ? Number(fortuneAmtRef.current.value) : undefined;
    const currentAge = currentAgeRef.current?.value ? Number(currentAgeRef.current.value) : undefined;
    const lifeExpectancy = lifeExpectancyRef.current?.value ? Number(lifeExpectancyRef.current.value) : undefined;
    const country = countryRef.current?.value;

    console.log(priority, years, fortuneAmt, currentAge, lifeExpectancy, country);

    setTableData([...editDataRef.current]);
    lineChartDataRef.current = {data: []};
    ribbonChartDataRef.current = [];
    const simulationInput: SimulationInput = {
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
            lineChartDataRef.current.data.push({
              year: Number(year),
              ntWrth: netWorth,
              inflAdjNtWrth: inflAdjNetWorth
            });

            // Process Ribbon Chart Data
            const ribbonEntry: { year: number; [key: string]: number } = { year: Number(year) };
            Object.keys(yearData).forEach((categoryKey) => {
              if (categoryKey !== "summary" && categoryKey !== "ratio") {
                ribbonEntry[categoryKey] = 0
                Object.keys(yearData[categoryKey]).forEach((typeKey) => {
                  const key = `${categoryKey}_${typeKey}`;
                  ribbonEntry[categoryKey] += yearData[categoryKey][typeKey] || 0;
                });
              }
            });

            ribbonChartDataRef.current.push(ribbonEntry);

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

            setLineChartData({data: [...lineChartDataRef.current.data]}); // Update state once all data is processed
            setRibbonChartData([...ribbonChartDataRef.current]); // Update state for Ribbon Chart
          } catch (error) {
            console.error("Error parsing JSON:", error);
          }
        }
      });
    }

    setLoading(false);
  };

  const handleUserInput = (data: any) => {
    console.log("User Input:", data);
    // Handle FIRE or Fortune logic here
  };

  return (
    <div className="p-4">
      {/* User Input Form */}
      <SimulationForm
        priorityRef={priorityRef}
        yearsRef={yearsRef}
        fortuneAmtRef={fortuneAmtRef}
        currentAgeRef={currentAgeRef}
        lifeExpectancyRef={lifeExpectancyRef}
        countryRef={countryRef}
      />
      <SimulationButton fetchStream={fetchStream} loading={loading} />
      <BudgetTable tableData={tableData} setTableData={setTableData} editDataRef={editDataRef} />
      <YearlyLineChart  data={ lineChartData.data } />
      <YearlyRibbonChart data={ribbonChartData} />
    </div>
  );
}