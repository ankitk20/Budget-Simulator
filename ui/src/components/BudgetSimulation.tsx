"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { SimulationInput, TableData, EntryType, FlattenedData, SimulationSummary } from "@/utils/data";
import { summary, eatRatio, typeInflAdjNetWorth, typeNetWorth, inputColNum, initialFormData } from "@/utils/constant";
import { BudgetTable } from "./BudgetTable";
import YearlyLineChart from "./YearlyLineChart";
import { LineChartData } from "./YearlyLineChart";
import YearlyRibbonChart from "./YearlyRibbonChart";
import { RibbonChartData } from "./YearlyRibbonChart";
import SimulationForm from "./SimulationForm";
import Footer from "./Footer";
import StackedBarChart from "./Yearly100%StackedBarChart";
import NavBar from "./NavBar";
import Button from "./Button";
import FinancialAnalysis from "./FinancialAnalysis";
import Feedback from "./Feedback";
import Glossary from "./Glossary";
import flattenJSON from "@/utils/helper";
import { generateTableData } from "@/utils/generateTableData";
import { fetchCountryData } from "@/utils/fetchCountryData";

interface BudgetSimulationProps {
  demo?: boolean;
}

interface HideInputButtonRef {
  hideInput: () => void;
}

export default function BudgetSimulation({ demo = true }: BudgetSimulationProps) {  
  const { data: session } = useSession(); // Get user session data
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [inputInProgress, setInputInProgress] = useState(true);
  const [formData, setFormData] = useState(initialFormData);
  const [countryMap, setCountryMap] = useState({});

  const handleChange = (field: string, value: string | number) => {
    setInputInProgress(true);
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  const [glossaryOpen, setGlossaryOpen] = useState(false);
  const [lineChartData, setLineChartData] = useState<LineChartData>({data: []});
  const [ribbonChartData, setRibbonChartData] = useState<RibbonChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(true);
  const lineChartDataRef = useRef<LineChartData>({data: []});
  const ribbonChartDataRef = useRef<RibbonChartData[]>([]);
  const editDataRef = useRef<TableData[]>([]); // Initialize as empty array
  const insightsRef = useRef<HTMLDivElement>(null);
  const simTableRef = useRef<HTMLDivElement>(null);
  const hideInputBtnRef = useRef<HideInputButtonRef | null>(null);
  const financialDataRef = useRef<SimulationSummary>({
    Income: [],
    Expense: [],
    Debt: [],
    Investment: [],
    "Net Worth": [],
    country: "",
    simYr: 0,
    age: 0,
    targetAmt: 0,
  });

  const localeRef = useRef<{ locale: string; currency: string }>({
    locale: 'en-US',  // Default locale
    currency: 'USD'   // Default currency
  });

  const scrollToInsights = () => {
    insightsRef.current?.scrollIntoView();
  };

  const scrollToSimTable = () => {
    simTableRef.current?.scrollIntoView();
  };

  const categoriesRef = useRef<Set<string>>(new Set());
  const simulationDataRef = useRef<FlattenedData[]>([]);
  const previousCountryRef = useRef<string | null>(null);

  useEffect(() => {
    async function fetchUserInput() {
      if (!formData.country) return;
      let data = countryMap;

      try {
        if (formData.country && formData.country !== previousCountryRef.current) {
          data = await fetchCountryData(formData.country, session?.idToken);
          if (data) {
            setCountryMap(data);
          }
        }
          
        // Ensure the updated countryMap is used
        const updatedTableData = generateTableData(formData, data);
        editDataRef.current = updatedTableData;
        setTableData(updatedTableData);
        previousCountryRef.current = formData.country;
      } catch (error) {
        console.error("Error fetching country data:", error);
      }
    }
  
    fetchUserInput();
  }, [formData, session]); // Ensure dependencies are correctly listed
  

  const fetchStream = async () => {
    setInputInProgress(false);
    setShowInput(false);
    setTableData(editDataRef.current);

    // Read user inputs only when Simulate button is clicked
    const country = formData.country;
    const years = formData?.lifeExpectancy - formData?.currentAge;
    const fortuneAmt = formData.fortuneAmt;
    const currentAge = formData.currentAge
    const lifeExpectancy = formData.lifeExpectancy;

    lineChartDataRef.current = {data: []};
    ribbonChartDataRef.current = [];

    const simulationInput: SimulationInput = {
      simYr: years,
      country: country,
      currentAge: Number(currentAge),
      lifeExpectancy: Number(lifeExpectancy),
      fortuneAmt: fortuneAmt,
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

    financialDataRef.current = {
      Income: [],
      Expense: [],
      Debt: [],
      Investment: [],
      "Net Worth": [],
      country: "",
      simYr: 0,
      age: 0,
      targetAmt: 0,
    };

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
                let catTotal = 0;
                categoriesRef.current.add(categoryKey);
                ribbonEntry[categoryKey] = 0
                Object.keys(yearData[categoryKey]).forEach((typeKey) => {
                  catTotal += yearData[categoryKey][typeKey] || 0;
                  ribbonEntry[categoryKey] += yearData[categoryKey][typeKey] || 0;
                });
                (financialDataRef.current[categoryKey as keyof SimulationSummary] as number[])?.push(catTotal);
              }

              if (categoryKey === summary) {
                Object.keys(yearData[categoryKey]).forEach((typeKey) => {
                  if (typeKey === typeInflAdjNetWorth) {
                    financialDataRef?.current[typeNetWorth]?.push(yearData[categoryKey][typeKey] || 0);
                  }
                });
              }
            });

            Object.assign(financialDataRef.current, { simYr: formData?.lifeExpectancy - formData?.currentAge });
            Object.assign(financialDataRef.current, { age: formData.currentAge || 0 });
            Object.assign(financialDataRef.current, { targetAmt: formData.fortuneAmt });
            Object.assign(financialDataRef.current, { country: formData.country });

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
          <SimulationForm formData={formData} onChange={handleChange} />
        </>
      )}

      <div className="flex items-center my-2 relative w-full">
        {/* Always show "Run Simulation" button */}
        <div className="flex space-x-4">
          <Button 
            label={loading ? "Simulating..." : demo ? "Run Demo Simulation" : "Run Simulation"} 
            onClick={() => {
              fetchStream(); // Call the simulation function
              hideInputBtnRef.current?.hideInput(); // Hide inputs if the ref exists
            }} 
            loading={loading}
            className="text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-gray-700 text-gray-200"
          />        
            {/* Show "View Insights" button only if simulation is complete */}
            { !inputInProgress && (
              <Button
                label="View Simulation Table"
                onClick={scrollToSimTable}
                loading={loading}
                className="text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-gray-700 text-gray-200 " />
              )
            }
            <Button 
              label={"View Glossary"} 
              onClick={() => {
                setGlossaryOpen(true); // Call the simulation function
              }}
              className="text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-gray-700 text-gray-200 absolute right-0"
            />
        </div>
      </div>

        {/* Show Analysis only if simulation is complete */}
      { !inputInProgress && !loading && financialDataRef.current.simYr !== 0 && (
        <>
          <div ref={insightsRef} className="mb-8">
            <FinancialAnalysis simulationSummaryRef={financialDataRef} />
          </div>
          <div className="mb-8">
            <YearlyLineChart data={lineChartData.data} />
          </div>
          <div className="mb-8">
            <YearlyRibbonChart data={ribbonChartData} />
          </div>
          <div className="mb-8">
            <StackedBarChart data={ribbonChartDataRef.current} categories={[...categoriesRef.current]} />
          </div>

          <div ref={simTableRef} className="flex items-center my-2 relative w-full">
            {/* Always show "Run Simulation" button */}
            <div className="flex space-x-4">
              <Button 
                label={loading ? "Simulating..." : demo ? "Run Demo Simulation" : "Run Simulation"} 
                onClick={() => {
                  fetchStream(); // Call the simulation function
                  hideInputBtnRef.current?.hideInput(); // Hide inputs if the ref exists
                }} 
                loading={loading}
                className="text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-gray-700 text-gray-200"
              />        
              {/* Show "View Insights" button */}
                <Button
                  label="View Summary"
                  onClick={scrollToInsights}
                  loading={loading}
                  className="text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-gray-700 text-gray-200 " />
              <Button 
                label={"View Glossary"} 
                onClick={() => {
                  setGlossaryOpen(true); // Call the simulation function
                }}
                className="text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 bg-gray-700 text-gray-200 absolute right-0"
              />
            </div>
          </div>

          <div className="mb-8">
            <BudgetTable
              ref={hideInputBtnRef}
              tableData={tableData}
              setTableData={setTableData}
              editDataRef={editDataRef}
              simYr={formData?.lifeExpectancy - formData?.currentAge}
              locale={localeRef.current}
              showInput={showInput}
              demo={demo}
            />
          </div>
        </>
      )}

      <Feedback />

      {!demo && <Footer />}
      <Glossary countryMap={countryMap} open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </div>
  );
}