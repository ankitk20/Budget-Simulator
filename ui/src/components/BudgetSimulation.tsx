"use client";

import { useRef, useState } from "react";
import { initialData, SimulationInput, TableData, EntryType } from "../app/utils/data";
import SimulationButton from "./SimulationButton";
import BudgetTable from "./BudgetTable";
import YearlyLineChart from "./YearlyLineChart";
import { LineChartData } from "./YearlyLineChart";
import YearlyRibbonChart from "./YearlyRibbonChart";
import { RibbonChartData } from "./YearlyRibbonChart";
import SimulationForm from "./SimulationForm";
import Footer from "./Footer";

export default function BudgetSimulation() {
  const [tableData, setTableData] = useState<TableData[]>(initialData);
  const [lineChartData, setLineChartData] = useState<LineChartData>({data: []});
  const [ribbonChartData, setRibbonChartData] = useState<RibbonChartData[]>([]);
  const [loading, setLoading] = useState(false);
  
  const lineChartDataRef = useRef<LineChartData>({data: []});
  const ribbonChartDataRef = useRef<RibbonChartData[]>([]);
  const editDataRef = useRef<TableData[]>([...initialData]);
  const countryRef = useRef<HTMLSelectElement>(null);
  const yearsRef = useRef<HTMLInputElement>(null);
  const fortuneAmtRef = useRef<HTMLInputElement>(null);
  const currentAgeRef = useRef<HTMLInputElement>(null);
  const lifeExpectancyRef = useRef<HTMLInputElement>(null);

  const fetchStream = async () => {

    // Read user inputs only when Simulate button is clicked
    const country = countryRef.current?.value ? countryRef.current.value : "us";
    const years = yearsRef.current?.value ? Number(yearsRef.current.value): 1;
    const fortuneAmt = fortuneAmtRef.current?.value ? Number(fortuneAmtRef.current.value) : 1;
    const currentAge = currentAgeRef.current?.value ? Number(currentAgeRef.current.value) : 1;
    const lifeExpectancy = lifeExpectancyRef.current?.value ? Number(lifeExpectancyRef.current.value) : 1;

    lineChartDataRef.current = {data: []};
    ribbonChartDataRef.current = [];

    const simulationInput: SimulationInput = {
      simYr: years,
      country: country,
      currentAge: currentAge,
      lifeExpectancy: lifeExpectancy,
      fortuneAmt: fortuneAmt,
      inflRate: 7,
      ltcgTaxRate: 12.5,
      stcgTaxRate: 20.0,
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
        stYr: row.stYr || 2025,
        numOfYr: row.numOfYears || 0,
        rateOfInt: row.rateOfInterest || 0,
        rateOfInc: row.rateOfIncrement || 0
      };
    
      if (!simulationInput[category]) {
        simulationInput[category] = {} as Record<string, EntryType>;
      }
      (simulationInput[category] as Record<string, EntryType>)[type] = entry;
    });

    setLoading(true);
    console.log(JSON.stringify(simulationInput));
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

  return (
    <div className="p-4">
      {/* User Input Form */}
      <SimulationForm
        countryRef={countryRef}
        yearsRef={yearsRef}
        fortuneAmtRef={fortuneAmtRef}
        currentAgeRef={currentAgeRef}
        lifeExpectancyRef={lifeExpectancyRef}
      />
      <SimulationButton fetchStream={fetchStream} loading={loading} />
      <div className="mb-8">
        <BudgetTable tableData={tableData} setTableData={setTableData} editDataRef={editDataRef} simYr={Number(yearsRef.current?.value)} />
      </div>
      <div className="mb-8">
        <YearlyLineChart  data={ lineChartData.data } />
      </div>
      <div className="mb-8">
        <YearlyRibbonChart data={ribbonChartData} />
      </div>

      {/* Footer Component */}
      <Footer />
    </div>
  );
}