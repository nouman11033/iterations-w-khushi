'use client';

import { Combination } from '@/lib/calculator';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

interface ResultsDisplayProps {
  results: Combination[];
  isCalculating: boolean;
}

export default function ResultsDisplay({ results, isCalculating }: ResultsDisplayProps) {
  if (isCalculating) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Calculating combinations...</p>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Enter your budget and click "Calculate Combinations" to see results
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
        Best Combinations ({results.length} found)
      </h2>
      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {results.map((combination, index) => (
          <CombinationCard key={combination.id} combination={combination} rank={index + 1} />
        ))}
      </div>
    </div>
  );
}

function CombinationCard({ combination, rank }: { combination: Combination; rank: number }) {
  const badgeColor = combination.fitsBudget
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';

  return (
    <div className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-bold text-blue-600">#{rank}</span>
          <span className={`px-2 py-1 rounded text-xs font-semibold ${badgeColor}`}>
            {combination.fitsBudget ? (
              <span className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-1" />
                Fits Budget
              </span>
            ) : (
              <span className="flex items-center">
                <XCircle className="w-3 h-3 mr-1" />
                Over Budget
              </span>
            )}
          </span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            ₹{combination.totalCostINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
          <div className="text-xs text-gray-500">per month</div>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Avatar:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {combination.avatarPlan.name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Voice:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {combination.voiceAgent
              ? `${combination.voiceAgent.name}${combination.voiceAgent.concurrency ? ` (${combination.voiceAgent.concurrency} conc.)` : ''}`
              : 'Inbuilt (Avatar)'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Hosting:</span>
          <span className="font-medium text-gray-900 dark:text-white">
            {combination.hostingOption.name}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div className="flex justify-between">
            <span>Avatar Cost:</span>
            <span>₹{combination.breakdown.avatarCostINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
          {combination.breakdown.voiceCostINR > 0 && (
            <div className="flex justify-between">
              <span>Voice Cost:</span>
              <span>₹{combination.breakdown.voiceCostINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Hosting Cost:</span>
            <span>₹{combination.breakdown.hostingCostINR.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
          </div>
        </div>
      </div>

      {combination.warnings.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-yellow-800 dark:text-yellow-200 space-y-1">
              {combination.warnings.map((warning, idx) => (
                <div key={idx}>• {warning}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        Score: {combination.score.toFixed(0)} (higher is better)
      </div>
    </div>
  );
}

