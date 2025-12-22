'use client';

import { useState } from 'react';
import { Combination } from '@/lib/calculator';
import { convertUSDToINR } from '@/lib/pricing';
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

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
  const [showDetails, setShowDetails] = useState(false);
  const badgeColor = combination.fitsBudget
    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';

  const formatINR = (amount: number) => `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
  const formatUSD = (amount: number) => `$${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;

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
            {formatINR(combination.totalCostINR)}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {formatUSD(combination.breakdown.totalCostUSD)}
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
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          <span>View Detailed Cost Breakdown</span>
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetails && (
          <div className="mt-4 space-y-4 text-xs">
            {/* Avatar Cost Breakdown */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="font-semibold text-gray-900 dark:text-white mb-2">Avatar Cost Breakdown</div>
              <div className="space-y-1 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Base Plan Cost:</span>
                  <div className="text-right">
                    <div>{formatUSD(combination.breakdown.avatarBaseCostUSD)}</div>
                    <div className="text-gray-500">{formatINR(convertUSDToINR(combination.breakdown.avatarBaseCostUSD))}</div>
                  </div>
                </div>
                {combination.breakdown.avatarAdditionalMinutes > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>Included Minutes:</span>
                      <span>{combination.avatarPlan.minutes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Additional Minutes:</span>
                      <span>{combination.breakdown.avatarAdditionalMinutes.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Additional Cost ({formatUSD(combination.avatarPlan.additionalPerMin)}/min):</span>
                      <div className="text-right">
                        <div>{formatUSD(combination.breakdown.avatarAdditionalCostUSD)}</div>
                        <div className="text-gray-500">{formatINR(convertUSDToINR(combination.breakdown.avatarAdditionalCostUSD))}</div>
                      </div>
                    </div>
                  </>
                )}
                <div className="flex justify-between pt-1 border-t border-gray-300 dark:border-gray-700 font-semibold">
                  <span>Total Avatar Cost:</span>
                  <div className="text-right">
                    <div>{formatUSD(combination.breakdown.avatarCostUSD)}</div>
                    <div className="text-gray-500">{formatINR(combination.breakdown.avatarCostINR)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Voice Cost Breakdown */}
            {combination.breakdown.voiceCostINR > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="font-semibold text-gray-900 dark:text-white mb-2">Voice Agent Cost Breakdown</div>
                <div className="space-y-1 text-gray-700 dark:text-gray-300">
                  {combination.voiceAgent?.pricingModel === 'tokens' && combination.breakdown.voiceTotalTokens && (
                    <>
                      <div className="flex justify-between">
                        <span>Total Tokens:</span>
                        <span>{combination.breakdown.voiceTotalTokens.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tokens (Millions):</span>
                        <span>{(combination.breakdown.voiceTotalTokens / 1_000_000).toFixed(2)}M</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price per 1M Tokens:</span>
                        <span>{formatUSD(combination.voiceAgent.pricePer1MTokens || 0)}</span>
                      </div>
                    </>
                  )}
                  {combination.voiceAgent?.pricingModel === 'per-minute' && (
                    <>
                      {combination.breakdown.voiceBaseCostUSD !== undefined && combination.breakdown.voiceBaseCostUSD > 0 && (
                        <div className="flex justify-between">
                          <span>Monthly Base Cost:</span>
                          <div className="text-right">
                            <div>{formatUSD(combination.breakdown.voiceBaseCostUSD)}</div>
                            <div className="text-gray-500">{formatINR(convertUSDToINR(combination.breakdown.voiceBaseCostUSD))}</div>
                          </div>
                        </div>
                      )}
                      {combination.breakdown.voicePerMinuteCostUSD !== undefined && (
                        <div className="flex justify-between">
                          <span>Per-Minute Cost ({formatUSD(combination.voiceAgent?.pricePerMinute || 0)}/min):</span>
                          <div className="text-right">
                            <div>{formatUSD(combination.breakdown.voicePerMinuteCostUSD)}</div>
                            <div className="text-gray-500">{formatINR(convertUSDToINR(combination.breakdown.voicePerMinuteCostUSD))}</div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                  <div className="flex justify-between pt-1 border-t border-gray-300 dark:border-gray-700 font-semibold">
                    <span>Total Voice Cost:</span>
                    <div className="text-right">
                      <div>{formatUSD(combination.breakdown.voiceCostUSD)}</div>
                      <div className="text-gray-500">{formatINR(combination.breakdown.voiceCostINR)}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Hosting Cost Breakdown */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="font-semibold text-gray-900 dark:text-white mb-2">Hosting Cost Breakdown</div>
              <div className="space-y-1 text-gray-700 dark:text-gray-300">
                <div className="flex justify-between">
                  <span>Base Monthly Cost:</span>
                  <span>{formatINR(combination.breakdown.hostingBaseCostINR)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Users Cost ({combination.hostingOption.costPerUserPerMonthINR}/user):</span>
                  <span>{formatINR(combination.breakdown.hostingUsersCostINR)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Calls Cost ({combination.hostingOption.costPerCallINR}/call):</span>
                  <span>{formatINR(combination.breakdown.hostingCallsCostINR)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-gray-300 dark:border-gray-700 font-semibold">
                  <span>Total Hosting Cost:</span>
                  <span>{formatINR(combination.breakdown.hostingCostINR)}</span>
                </div>
              </div>
            </div>

            {/* Misc Expenses */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
              <div className="font-semibold text-gray-900 dark:text-white mb-2">Miscellaneous Expenses</div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Fixed Monthly Cost:</span>
                <span>{formatINR(combination.breakdown.miscExpensesINR)}</span>
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-3 border-2 border-blue-200 dark:border-blue-800">
              <div className="font-bold text-gray-900 dark:text-white mb-2">Total Monthly Cost</div>
              <div className="flex justify-between text-lg">
                <span className="text-gray-700 dark:text-gray-300">INR:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{formatINR(combination.breakdown.totalCostINR)}</span>
              </div>
              <div className="flex justify-between text-lg mt-1">
                <span className="text-gray-700 dark:text-gray-300">USD:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{formatUSD(combination.breakdown.totalCostUSD)}</span>
              </div>
            </div>
          </div>
        )}
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

