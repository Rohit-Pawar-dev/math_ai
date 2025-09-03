import React from "react";
import { Link } from "react-router-dom";
import { Calculator as CalculatorIcon } from "lucide-react";

function Calculator() {
  const calculators = [
    { name: "Binary", path: "/calculator/binary" },
    { name: "Fraction", path: "/calculator/fraction" },
    { name: "Hex", path: "/calculator/hex" },
    { name: "Percentage", path: "/calculator/percentage" },
    { name: "Scientific", path: "/calculator/scientific" },
    { name: "BMI", path: "/calculator/bmi" },
  ];

  return (
       <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-10">
      <div className="w-full max-w-6xl text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 mb-12">
          Calculator Hub
        </h1>
        <div className="d-flex flex-column gap-5 mt-5 ">
          {calculators.map((calc, idx) => (
            <Link
              key={idx}
              to={calc.path}
              className=" d-flex gap-3"
            >
              <CalculatorIcon className="w-8 h-8" />
              {calc.name}
            </Link>
          ))}
        </div>
        {calculators.length === 0 && (
          <p className="mt-6 text-gray-500">No calculators available.</p>
        )}
      </div>
    </div>
  );
}

export default Calculator;
