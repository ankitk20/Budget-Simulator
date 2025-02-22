"use client";

import { useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { initialData, SimulationInput, TableData, EntryType, FlattenedData, summary, eatRatio, typeInflAdjNetWorth, typeNetWorth, demoData } from "../app/utils/data";
import BudgetTable from "./BudgetTable";
import YearlyLineChart from "./YearlyLineChart";
import { LineChartData } from "./YearlyLineChart";
import YearlyRibbonChart from "./YearlyRibbonChart";
import { RibbonChartData } from "./YearlyRibbonChart";
import SimulationForm from "./SimulationForm";
import Footer from "./Footer";
import StackedBarChart from "./Yearly100%StackedBarChart";
import NavBar from "./NavBar";
import Button from "./Button";

interface BudgetSimulationProps {
  demo?: boolean;
}

export default function BudgetSimulation({ demo = true }: BudgetSimulationProps) {  
  const { data: session } = useSession(); // Get user session data
  const [tableData, setTableData] = useState<TableData[]>(demo ? demoData : initialData);
  const [lineChartData, setLineChartData] = useState<LineChartData>({data: []});
  const [ribbonChartData, setRibbonChartData] = useState<RibbonChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [simYr, setSimYr] = useState(0);
  const [showInput, setShowInput] = useState(true);
  const lineChartDataRef = useRef<LineChartData>({data: []});
  const ribbonChartDataRef = useRef<RibbonChartData[]>([]);
  const editDataRef = useRef<TableData[]>([...tableData]);
  const countryRef = useRef<HTMLSelectElement>(null!);
  const yearsRef = useRef<HTMLInputElement>(null!);
  const fortuneAmtRef = useRef<HTMLInputElement>(null!);
  const currentAgeRef = useRef<HTMLInputElement>(null!);
  const lifeExpectancyRef = useRef<HTMLInputElement>(null!);
  const insightsRef = useRef<HTMLDivElement>(null);

  const localeRef = useRef<{ locale: string; currency: string }>({
    locale: 'en-US',  // Default locale
    currency: 'USD'   // Default currency
  });

  const scrollToInsights = () => {
    insightsRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const categoriesRef = useRef<Set<string>>(new Set());
  const simulationDataRef = useRef<FlattenedData[]>([]);

  const flattenJSON = (year: string, data: any) => {
    const flatData: any = { year: Number(year) };

    Object.entries(data).forEach(([category, categoryData]: [string, any]) => {
      if (typeof categoryData === "object") {
        Object.entries(categoryData).forEach(([type, value]) => {
          flatData[`${category}_${type}`] = value;
        });
      } else {
        flatData[category] = categoryData;
      }
    });

    return flatData;
  };

  const fetchStream = async () => {
    
    setShowInput(false);
    setSimYr(Number(yearsRef.current?.value) || 0);
    setTableData(editDataRef.current);

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
      stcgTaxRate: 20.0
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

    const token = session?.idToken; // Extract token
    const response = await fetch("/api/simulation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
        "Accept": "application/json",
        "X-Demo-Mode": String(demo),
      },
      body: JSON.stringify(simulationInput),
    });

    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let accumulated = "";

    while (true) {
      const { done, value } = await reader.read();
      console.log(done, value);
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
            const netWorth = yearData[summary]?.[typeNetWorth] || 0;
            const inflAdjNetWorth = yearData[summary]?.[typeInflAdjNetWorth] || 0;
            localeRef.current = {"locale": columnData["locale"], "currency": columnData["currency"]};

            // Update chart data
            lineChartDataRef.current.data.push({
              "year": Number(year),
              [typeNetWorth]: netWorth,
              [typeInflAdjNetWorth]: inflAdjNetWorth
            });

            // Process Ribbon Chart Data
            const ribbonEntry: { year: number; [key: string]: number } = { year: Number(year) };
            Object.keys(yearData).forEach((categoryKey) => {
              if (categoryKey !== summary && categoryKey !== eatRatio) {
                categoriesRef.current.add(categoryKey);
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

            // Flatten and store the simulation data
            simulationDataRef.current.push(flattenJSON(year, yearData));
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
      {!demo && <NavBar />}

      {!demo && (
        <>
          <SimulationForm
            countryRef={countryRef}
            yearsRef={yearsRef}
            fortuneAmtRef={fortuneAmtRef}
            currentAgeRef={currentAgeRef}
            lifeExpectancyRef={lifeExpectancyRef}
          />
        </>
      )}

      {/* Always show "Run Simulation" button */}
      <div className="flex justify-between items-center my-2">
        <Button label={loading ? "Simulating..." : "Run Simulation"} onClick={fetchStream} loading={loading} />
        
        {/* Show "View Insights" button only if not in demo mode */}
        {!demo && <Button label="View Insights" onClick={scrollToInsights} loading={loading} />}
      </div>

      <div className="mb-8">
        <BudgetTable
          tableData={tableData}
          setTableData={setTableData}
          editDataRef={editDataRef}
          simYr={simYr}
          locale={localeRef.current}
          showInput={showInput}
        />
      </div>

      {!demo && (
        <>
          <div ref={insightsRef} className="mb-8">
            <YearlyLineChart data={lineChartData.data} />
          </div>
          <div className="mb-8">
            <YearlyRibbonChart data={ribbonChartData} />
          </div>
          <div className="mb-8">
            <StackedBarChart data={ribbonChartDataRef.current} categories={[...categoriesRef.current]} />
          </div>
        </>
      )}

      {!demo && <Footer />}
    </div>
  );
}