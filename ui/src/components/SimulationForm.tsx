import React, { RefObject } from "react";

interface SimulationFormProps {
  priorityRef: RefObject<HTMLSelectElement | null>;
  yearsRef: RefObject<HTMLInputElement | null>;
  fortuneAmtRef: RefObject<HTMLInputElement | null>;
  currentAgeRef: RefObject<HTMLInputElement | null>;
  lifeExpectancyRef: RefObject<HTMLInputElement | null>;
  countryRef: RefObject<HTMLSelectElement | null>;
}

const SimulationForm: React.FC<SimulationFormProps> = ({ 
  priorityRef, 
  yearsRef, 
  fortuneAmtRef, 
  currentAgeRef, 
  lifeExpectancyRef,
  countryRef
}) => {
  return (
    <div className="mb-4 p-4 bg-gray-800 rounded-lg shadow">
      <h2 className="text-lg font-semibold text-gray-200 mb-2">Choose Your Goal</h2>
      <div className="grid grid-cols-3 gap-4">

         {/* Country */}
         <div>
          <label className="block text-gray-300 text-sm mb-1">Country</label>
          <select ref={countryRef} className="w-full p-2 rounded bg-gray-700 text-white" defaultValue="us">
            <option value="au">Australia</option>
            <option value="br">Brazil</option>
            <option value="ca">Canada</option>
            <option value="cn">China</option>
            <option value="fr">France</option>
            <option value="de">Germany</option>
            <option value="in">India</option>
            <option value="id">Indonesia</option>
            <option value="it">Italy</option>
            <option value="jp">Japan</option>
            <option value="mx">Mexico</option>
            <option value="ru">Russia</option>
            <option value="sa">Saudi Arabia</option>
            <option value="sa">Singapore</option>
            <option value="za">South Africa</option>
            <option value="kr">South Korea</option>
            <option value="es">Spain</option>
            <option value="tr">Turkey</option>
            <option value="ae">United Arab Emirates</option>
            <option value="gb">United Kingdom</option>
            <option value="us">United States of America</option>
          </select>
        </div>

        {/* Number of Years Input */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Simulation Years</label>
          <input
            ref={yearsRef}
            type="number"
            className="w-full p-2 rounded bg-gray-700 text-white"
            placeholder="30"
            defaultValue={20}
            onChange={(e) => {
              let value = Number(e.target.value);
              if (value < 1) value = 1;
              if (value > 100) value = 100;
              e.target.value = value.toString(); 
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>

        {/* Target Fortune Amount */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Target Amount</label>
          <input
            ref={fortuneAmtRef}
            type="number"
            className="w-full p-2 rounded bg-gray-700 text-white"
            defaultValue={1000000}
            min={1}
            onChange={(e) => {
              let value = Number(e.target.value);
              if (value < 1) value = 1;
              e.target.value = value.toString();
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>

        {/* Current Age */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Current Age</label>
          <input
            ref={currentAgeRef}
            type="number"
            className="w-full p-2 rounded bg-gray-700 text-white"
            defaultValue={25}
            min={1}
            max={120}
            onChange={(e) => {
              let value = Number(e.target.value);
              if (value < 1) value = 1;
              if (value > 120) value = 120;
              e.target.value = value.toString();
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>

        {/* Life Expectancy */}
        <div>
          <label className="block text-gray-300 text-sm mb-1">Expected Life Age</label>
          <input
            ref={lifeExpectancyRef}
            type="number"
            className="w-full p-2 rounded bg-gray-700 text-white"
            defaultValue={85}
            min={1}
            max={120}
            onChange={(e) => {
              let value = Number(e.target.value);
              if (value < 1) value = 1;
              if (value > 120) value = 120;
              e.target.value = value.toString();
            }}
            onFocus={(e) => e.target.select()}
          />
        </div>
      </div>
    </div>
  );
};

export default SimulationForm;
