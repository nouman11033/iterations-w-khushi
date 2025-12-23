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

      {/* Monthly Budget */}
      <div className="space-y-2.5">
        <label className="block text-[0.6375rem] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
          Monthly Budget (INR)
        </label>
        <input
          type="number"
          min="0"
          step="1000"
          value={formData.monthlyBudgetINR}
          onChange={(e) => updateField('monthlyBudgetINR', Number(e.target.value))}
          className="w-full px-5 py-3.5 border border-gray-300/50 dark:border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 text-[0.85rem]"
          required
        />
      </div>

      {/* Budget Allocation */}
      <div className="space-y-2.5">
        <label className="block text-[0.6375rem] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
          API Allocation: <span className="text-blue-600 dark:text-blue-400 font-extrabold">{formData.apiAllocationPercent}%</span> 
          <span className="text-gray-500 dark:text-gray-400 ml-2 font-normal">(₹{apiBudget.toLocaleString('en-IN')})</span>
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
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600"
          style={{
            background: `linear-gradient(to right, rgb(37, 99, 235) 0%, rgb(37, 99, 235) ${formData.apiAllocationPercent}%, rgb(229, 231, 235) ${formData.apiAllocationPercent}%, rgb(229, 231, 235) 100%)`
          }}
        />
        <div className="flex justify-between text-[0.6375rem] text-gray-500 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <label className="block text-[0.6375rem] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
          Hosting Allocation: <span className="text-purple-600 dark:text-purple-400 font-extrabold">{formData.hostingAllocationPercent}%</span>
          <span className="text-gray-500 dark:text-gray-400 ml-2 font-normal">(₹{hostingBudget.toLocaleString('en-IN')})</span>
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
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600"
          style={{
            background: `linear-gradient(to right, rgb(37, 99, 235) 0%, rgb(37, 99, 235) ${formData.hostingAllocationPercent}%, rgb(229, 231, 235) ${formData.hostingAllocationPercent}%, rgb(229, 231, 235) 100%)`
          }}
        />
        <div className="flex justify-between text-[0.6375rem] text-gray-500 mt-1">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>

      {totalAllocation !== 100 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-4">
          <p className="text-[0.74375rem] font-medium text-yellow-800 dark:text-yellow-200">
            ⚠️ Total allocation: {totalAllocation}% (should be 100%)
          </p>
        </div>
      )}

      {/* Users */}
      <div className="space-y-2.5">
        <label className="block text-[0.6375rem] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
          Number of Users
        </label>
        <input
          type="number"
          min="1"
          value={formData.users}
          onChange={(e) => updateField('users', Number(e.target.value))}
          className="w-full px-5 py-3.5 border border-gray-300/50 dark:border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 text-[0.85rem]"
          required
        />
      </div>

      {/* Concurrent Sessions */}
      <div className="space-y-2.5">
        <label className="block text-[0.6375rem] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
          Concurrent Sessions
        </label>
        <input
          type="number"
          min="1"
          value={formData.concurrentSessions}
          onChange={(e) => updateField('concurrentSessions', Number(e.target.value))}
          className="w-full px-5 py-3.5 border border-gray-300/50 dark:border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 text-[0.85rem]"
          required
        />
      </div>

      {/* Minutes per Month */}
      <div className="space-y-2.5">
        <label className="block text-[0.6375rem] font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400">
          Minutes per Month: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold">{formData.minutesPerMonth.toLocaleString()}</span>
        </label>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={formData.minutesPerMonth}
          onChange={(e) => updateField('minutesPerMonth', Number(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600"
          style={{
            background: `linear-gradient(to right, rgb(37, 99, 235) 0%, rgb(37, 99, 235) ${(formData.minutesPerMonth / 10000) * 100}%, rgb(229, 231, 235) ${(formData.minutesPerMonth / 10000) * 100}%, rgb(229, 231, 235) 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>0</span>
          <span>10,000</span>
        </div>
        <input
          type="number"
          min="0"
          step="100"
          value={formData.minutesPerMonth}
          onChange={(e) => updateField('minutesPerMonth', Number(e.target.value))}
          className="w-full px-5 py-3.5 border border-gray-300/50 dark:border-gray-700/50 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-white/80 dark:bg-gray-900/50 backdrop-blur-sm text-gray-900 dark:text-white font-semibold shadow-sm hover:shadow-md transition-all duration-200 text-[0.85rem]"
          required
        />
      </div>

      {/* Voice Minutes Breakdown (if using voice agent) */}
      {formData.useVoiceAgent && (
        <div className="bg-gradient-to-br from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-purple-950/40 border border-blue-200/50 dark:border-blue-800/30 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
          <h3 className="text-[0.74375rem] font-semibold text-gray-900 dark:text-white mb-3">
            Voice Agent Cost Preview (for {formData.minutesPerMonth.toLocaleString()} minutes)
          </h3>
          <div className="space-y-2 text-[0.6375rem]">
            {/* Gemini Live */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Gemini Live (2,500-3,500 tokens/min):</span>
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  ${((formData.minutesPerMonth * 3000 / 1_000_000) * 17.05).toFixed(2)}
                </div>
                <div className="text-gray-500">
                  ₹{((formData.minutesPerMonth * 3000 / 1_000_000) * 17.05 * 90).toFixed(0)}
                </div>
              </div>
            </div>
            {/* GPT Realtime */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">GPT Realtime (670-1,350 tokens/min):</span>
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  ${((formData.minutesPerMonth * 1010 / 1_000_000) * 116.00).toFixed(2)}
                </div>
                <div className="text-gray-500">
                  ₹{((formData.minutesPerMonth * 1010 / 1_000_000) * 116.00 * 90).toFixed(0)}
                </div>
              </div>
            </div>
            {/* Hume Pro */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Hume Pro (min $70):</span>
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  ${Math.max(70, formData.minutesPerMonth * 0.06).toFixed(2)}
                </div>
                <div className="text-gray-500">
                  ₹{(Math.max(70, formData.minutesPerMonth * 0.06) * 90).toFixed(0)}
                </div>
              </div>
            </div>
            {/* Hume Scale */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Hume Scale (min $200):</span>
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  ${Math.max(200, formData.minutesPerMonth * 0.05).toFixed(2)}
                </div>
                <div className="text-gray-500">
                  ₹{(Math.max(200, formData.minutesPerMonth * 0.05) * 90).toFixed(0)}
                </div>
              </div>
            </div>
            {/* Hume Business */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Hume Business (min $500):</span>
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  ${Math.max(500, formData.minutesPerMonth * 0.04).toFixed(2)}
                </div>
                <div className="text-gray-500">
                  ₹{(Math.max(500, formData.minutesPerMonth * 0.04) * 90).toFixed(0)}
                </div>
              </div>
            </div>
            {/* Grok */}
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">Grok (per min per concurrency):</span>
              <div className="text-right">
                <div className="font-medium text-gray-900 dark:text-white">
                  ${(formData.minutesPerMonth * 0.05 * formData.concurrentSessions).toFixed(2)}
                </div>
                <div className="text-gray-500">
                  ₹{(formData.minutesPerMonth * 0.05 * formData.concurrentSessions * 90).toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voice Option */}
      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.useVoiceAgent}
            onChange={(e) => updateField('useVoiceAgent', e.target.checked)}
            className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-[0.74375rem] font-medium text-gray-700 dark:text-gray-300">
            Use Voice Agent (instead of inbuilt avatar voice)
          </span>
        </label>
        <p className="text-[0.6375rem] text-gray-500 dark:text-gray-400 mt-1 ml-8">
          {formData.useVoiceAgent
            ? 'Will use Gemini Live or GPT Realtime for voice'
            : 'Will use avatar provider\'s inbuilt voice'}
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isCalculating || totalAllocation !== 100}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:transform-none text-[0.85rem]"
      >
        {isCalculating ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Calculating...
          </span>
        ) : (
          'Calculate Combinations'
        )}
      </button>
    </form>
  );
}

