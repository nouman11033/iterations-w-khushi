'use client';

import { useState } from 'react';
import { BudgetInput, calculateCombinations, Combination } from '@/lib/calculator';
import BudgetForm from '@/components/BudgetForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const [results, setResults] = useState<Combination[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleCalculate = (input: BudgetInput) => {
    setIsCalculating(true);
    // Simulate calculation (in case it takes time)
    setTimeout(() => {
      const combinations = calculateCombinations(input);
      setResults(combinations);
      setIsCalculating(false);
    }, 100);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-black dark:to-black">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">
            iterations w khushi
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-black dark:border dark:border-gray-800 rounded-lg shadow-lg p-6">
            <BudgetForm onSubmit={handleCalculate} isCalculating={isCalculating} />
          </div>

          <div className="bg-white dark:bg-black dark:border dark:border-gray-800 rounded-lg shadow-lg p-6">
            <ResultsDisplay results={results} isCalculating={isCalculating} />
          </div>
        </div>
      </div>
    </main>
  );
}

