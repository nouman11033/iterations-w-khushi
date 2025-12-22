'use client';

import { useState } from 'react';
import { BudgetInput } from '@/lib/calculator';

interface BudgetFormProps {
  onSubmit: (input: BudgetInput) => void;
  isCalculating: boolean;
}

export default function BudgetForm({ onSubmit, isCalculating }: BudgetFormProps) {
  const [formData, setFormData] = useState<BudgetInput>({
    monthlyBudgetINR: 100000,
    apiAllocationPercent: 60,
    hostingAllocationPercent: 40,
    users: 50,
    concurrentSessions: 10,
    minutesPerMonth: 3500,
    useVoiceAgent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof BudgetInput, value: number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const apiBudget = (formData.monthlyBudgetINR * formData.apiAllocationPercent) / 100;
  const hostingBudget = (formData.monthlyBudgetINR * formData.hostingAllocationPercent) / 100;
  const totalAllocation = formData.apiAllocationPercent + formData.hostingAllocationPercent;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Budget Configuration
      </h2>

      {/* Monthly Budget */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Monthly Budget (INR)
        </label>
        <input
          type="number"
          min="0"
          step="1000"
          value={formData.monthlyBudgetINR}
          onChange={(e) => updateField('monthlyBudgetINR', Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:bg-black dark:border-gray-700 dark:text-white"
          required
        />
      </div>

      {/* Budget Allocation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          API Allocation: {formData.apiAllocationPercent}% (₹{apiBudget.toLocaleString('en-IN')})
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={formData.apiAllocationPercent}
          onChange={(e) => {
            const apiPercent = Number(e.target.value);
            const hostingPercent = 100 - apiPercent;
            setFormData((prev) => ({
              ...prev,
              apiAllocationPercent: apiPercent,
              hostingAllocationPercent: hostingPercent,
            }));
          }}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Hosting Allocation: {formData.hostingAllocationPercent}% (₹{hostingBudget.toLocaleString('en-IN')})
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={formData.hostingAllocationPercent}
          onChange={(e) => {
            const hostingPercent = Number(e.target.value);
            const apiPercent = 100 - hostingPercent;
            setFormData((prev) => ({
              ...prev,
              apiAllocationPercent: apiPercent,
              hostingAllocationPercent: hostingPercent,
            }));
          }}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {totalAllocation !== 100 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            Total allocation: {totalAllocation}% (should be 100%)
          </p>
        </div>
      )}

      {/* Users */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Number of Users
        </label>
        <input
          type="number"
          min="1"
          value={formData.users}
          onChange={(e) => updateField('users', Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:bg-black dark:border-gray-700 dark:text-white"
          required
        />
      </div>

      {/* Concurrent Sessions */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Concurrent Sessions
        </label>
        <input
          type="number"
          min="1"
          value={formData.concurrentSessions}
          onChange={(e) => updateField('concurrentSessions', Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:bg-black dark:border-gray-700 dark:text-white"
          required
        />
      </div>

      {/* Minutes per Month */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Minutes per Month
        </label>
        <input
          type="number"
          min="0"
          step="100"
          value={formData.minutesPerMonth}
          onChange={(e) => updateField('minutesPerMonth', Number(e.target.value))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:bg-black dark:border-gray-700 dark:text-white"
          required
        />
      </div>

      {/* Voice Option */}
      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.useVoiceAgent}
            onChange={(e) => updateField('useVoiceAgent', e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Use Voice Agent (instead of inbuilt avatar voice)
          </span>
        </label>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 ml-8">
          {formData.useVoiceAgent
            ? 'Will use Gemini Live or GPT Realtime for voice'
            : 'Will use avatar provider\'s inbuilt voice'}
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isCalculating || totalAllocation !== 100}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
      >
        {isCalculating ? 'Calculating...' : 'Calculate Combinations'}
      </button>
    </form>
  );
}

