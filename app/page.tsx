'use client';

import { useState } from 'react';
import { BudgetInput, calculateCombinations, Combination } from '@/lib/calculator';
import BudgetForm from '@/components/BudgetForm';
import ResultsDisplay from '@/components/ResultsDisplay';
import ThemeToggle from '@/components/ThemeToggle';
import { Menu, X } from 'lucide-react';

export default function Home() {
  const [results, setResults] = useState<Combination[]>([]);
  const [isCalculating, setIsCalculating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-black dark:via-black dark:to-black">
      <ThemeToggle />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
              aria-label="Toggle sidebar"
            >
              {sidebarOpen ? (
                <X className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              )}
            </button>
            <div>
              <h1 className="text-2xl font-extrabold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent">
                iterations w khushi
          </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Smart cost estimation for avatar & voice solutions
          </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-96' : 'w-0'
          } transition-all duration-300 ease-in-out overflow-hidden relative`}
        >
          <div className="h-full bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-950 dark:via-black dark:to-gray-950 border-r border-gray-200/50 dark:border-gray-800/50 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-50/30 to-transparent dark:via-blue-950/10 pointer-events-none"></div>
            <div className="h-full overflow-y-auto p-8 relative z-10">
              <div className="mb-8 pb-6 border-b border-gray-200/50 dark:border-gray-800/50">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                      Configuration
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 font-medium">
                      Budget & Usage Parameters
                    </p>
                  </div>
                </div>
              </div>
              <BudgetForm onSubmit={handleCalculate} isCalculating={isCalculating} />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full p-6">
            <div className="h-full bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl p-8 flex flex-col">
            <ResultsDisplay results={results} isCalculating={isCalculating} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

