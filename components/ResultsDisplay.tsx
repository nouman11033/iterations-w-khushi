'use client';

import { useState, useMemo } from 'react';
import { Combination } from '@/lib/calculator';
import { convertUSDToINR } from '@/lib/pricing';
import { CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, Filter, X } from 'lucide-react';

interface ResultsDisplayProps {
  results: Combination[];
  isCalculating: boolean;
}

interface Filters {
  avatarProviders: string[];
  voiceAgents: string[];
  hostingOptions: string[];
  budgetFit: string[];
}

export default function ResultsDisplay({ results, isCalculating }: ResultsDisplayProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    avatarProviders: [],
    voiceAgents: [],
    hostingOptions: [],
    budgetFit: [],
  });

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const avatarProviders = Array.from(new Set(results.map(r => r.avatarPlan.provider)));
    const voiceAgents = Array.from(new Set(results.map(r => r.voiceAgent?.id || 'inbuilt')));
    const hostingOptions = Array.from(new Set(results.map(r => r.hostingOption.id)));
    return { avatarProviders, voiceAgents, hostingOptions };
  }, [results]);

  // Filter results
  const filteredResults = useMemo(() => {
    return results.filter(combination => {
      // Avatar provider filter
      if (filters.avatarProviders.length > 0 && !filters.avatarProviders.includes(combination.avatarPlan.provider)) {
        return false;
      }
      
      // Voice agent filter
      const voiceId = combination.voiceAgent?.id || 'inbuilt';
      if (filters.voiceAgents.length > 0 && !filters.voiceAgents.includes(voiceId)) {
        return false;
      }
      
      // Hosting filter
      if (filters.hostingOptions.length > 0 && !filters.hostingOptions.includes(combination.hostingOption.id)) {
        return false;
      }
      
      // Budget fit filter
      if (filters.budgetFit.length > 0) {
        if (filters.budgetFit.includes('fits-budget') && !combination.fitsBudget) {
          return false;
        }
        if (filters.budgetFit.includes('over-budget') && combination.fitsBudget) {
          return false;
        }
      }
      
      return true;
    });
  }, [results, filters]);

  const toggleFilter = (category: keyof Filters, value: string) => {
    setFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const clearFilters = () => {
    setFilters({
      avatarProviders: [],
      voiceAgents: [],
      hostingOptions: [],
      budgetFit: [],
    });
  };

  const activeFilterCount = filters.avatarProviders.length + filters.voiceAgents.length + 
                            filters.hostingOptions.length + filters.budgetFit.length;
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
    <div className="flex flex-col h-full min-h-0">
      <div className="mb-4 pb-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
    <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Best Combinations
      </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {filteredResults.length} of {results.length} {results.length === 1 ? 'combination' : 'combinations'}
              {activeFilterCount > 0 && ` (${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} active)`}
            </p>
          </div>
          {results.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                showFilters || activeFilterCount > 0
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="bg-white/20 px-2 py-0.5 rounded-full text-[0.6rem]">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && results.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[0.7rem] font-semibold text-gray-900 dark:text-white">Filter Options</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-[0.7rem] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Avatar Provider Filter */}
              <div>
                <label className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Avatar Provider
                </label>
                <select
                  multiple
                  value={filters.avatarProviders}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters(prev => ({ ...prev, avatarProviders: selected }));
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[0.7rem]"
                  size={Math.min(filterOptions.avatarProviders.length, 4)}
                >
                  {filterOptions.avatarProviders.map(provider => (
                    <option key={provider} value={provider}>
                      {provider.charAt(0).toUpperCase() + provider.slice(1)}
                    </option>
                  ))}
                </select>
                <p className="text-[0.6rem] text-gray-500 dark:text-gray-400 mt-1">
                  Hold Ctrl/Cmd to select multiple
                </p>
              </div>

              {/* Voice Agent Filter */}
              <div>
                <label className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Voice Agent
                </label>
                <select
                  multiple
                  value={filters.voiceAgents}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters(prev => ({ ...prev, voiceAgents: selected }));
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[0.7rem]"
                  size={Math.min(filterOptions.voiceAgents.length, 4)}
                >
                  {filterOptions.voiceAgents.map(agent => (
                    <option key={agent} value={agent}>
                      {agent === 'inbuilt' ? 'Inbuilt (Avatar)' : agent.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
                <p className="text-[0.6rem] text-gray-500 dark:text-gray-400 mt-1">
                  Hold Ctrl/Cmd to select multiple
                </p>
              </div>

              {/* Hosting Filter */}
              <div>
                <label className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Hosting
                </label>
                <select
                  multiple
                  value={filters.hostingOptions}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters(prev => ({ ...prev, hostingOptions: selected }));
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[0.7rem]"
                  size={Math.min(filterOptions.hostingOptions.length, 4)}
                >
                  {filterOptions.hostingOptions.map(hosting => (
                    <option key={hosting} value={hosting}>
                      {hosting.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
                <p className="text-[0.6rem] text-gray-500 dark:text-gray-400 mt-1">
                  Hold Ctrl/Cmd to select multiple
                </p>
              </div>

              {/* Budget Fit Filter */}
              <div>
                <label className="block text-[0.7rem] font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Budget Status
                </label>
                <select
                  multiple
                  value={filters.budgetFit}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setFilters(prev => ({ ...prev, budgetFit: selected }));
                  }}
                  className="w-full px-3 py-2 border-2 border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-black text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-[0.7rem]"
                  size={2}
                >
                  <option value="fits-budget">Fits Budget</option>
                  <option value="over-budget">Over Budget</option>
                </select>
                <p className="text-[0.6rem] text-gray-500 dark:text-gray-400 mt-1">
                  Hold Ctrl/Cmd to select multiple
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 min-h-0">
        {filteredResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredResults.map((combination, index) => (
          <CombinationCard key={combination.id} combination={combination} rank={index + 1} />
        ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 mb-2">No combinations match your filters</p>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-blue-600 dark:text-blue-400 hover:underline text-[0.7rem]"
                >
                  Clear filters to see all combinations
                </button>
              )}
            </div>
          </div>
        )}
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
    <div 
      onClick={() => setShowDetails(!showDetails)}
      className="group relative border border-gray-200/60 dark:border-gray-800/60 rounded-2xl p-6 bg-gradient-to-br from-white via-gray-50/50 to-white dark:from-gray-950 dark:via-black dark:to-gray-950 hover:shadow-2xl hover:border-blue-300/50 dark:hover:border-blue-600/50 transition-all duration-500 overflow-hidden cursor-pointer"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/0 via-indigo-50/0 to-purple-50/0 dark:from-blue-950/0 dark:via-indigo-950/0 dark:to-purple-950/0 group-hover:from-blue-50/30 group-hover:via-indigo-50/20 group-hover:to-purple-50/30 dark:group-hover:from-blue-950/20 dark:group-hover:via-indigo-950/10 dark:group-hover:to-purple-950/20 transition-all duration-500 pointer-events-none"></div>
      
      {/* Sticker Badge - Top Left Corner */}
      <div className="absolute -top-1 -left-1 z-20 transform -rotate-12 origin-center pointer-events-none">
        <div className={`px-4 py-1.5 rounded-md ${badgeColor} shadow-xl backdrop-blur-sm border-2 border-white/50 dark:border-gray-900/50`}>
            {combination.fitsBudget ? (
            <span className="flex items-center text-[0.6rem] font-bold">
              <CheckCircle className="w-2.5 h-2.5 mr-1" />
                Fits Budget
              </span>
            ) : (
            <span className="flex items-center text-[0.6rem] font-bold">
              <XCircle className="w-2.5 h-2.5 mr-1" />
                Over Budget
              </span>
            )}
        </div>
      </div>

      <div className="relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
            <span className="text-[0.9rem] font-extrabold text-white">#{rank}</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[1.5rem] font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
            {formatINR(combination.totalCostINR)}
          </div>
          <div className="text-[0.7rem] font-semibold text-gray-500 dark:text-gray-400 mt-1">
            {formatUSD(combination.breakdown.totalCostUSD)}
          </div>
          <div className="text-[0.6rem] text-gray-400 dark:text-gray-500 font-medium uppercase tracking-wider mt-0.5">per month</div>
        </div>
      </div>

      <div className="space-y-3 text-[0.7rem] mb-4">
        <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 backdrop-blur-sm">
          <span className="text-[0.6rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Avatar</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {combination.avatarPlan.name}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 backdrop-blur-sm">
          <span className="text-[0.6rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Voice</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {combination.voiceAgent
              ? `${combination.voiceAgent.name}${combination.voiceAgent.concurrency ? ` (${combination.voiceAgent.concurrency} conc.)` : ''}`
              : 'Inbuilt (Avatar)'}
          </span>
        </div>
        <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 backdrop-blur-sm">
          <span className="text-[0.6rem] font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Hosting</span>
          <span className="font-bold text-gray-900 dark:text-white">
            {combination.hostingOption.name}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-800/50">
        <div className="w-full flex items-center justify-between text-[0.7rem] font-bold text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/30 px-4 py-3 rounded-xl transition-all duration-200">
          <span className="uppercase tracking-wider text-[0.6rem]">
            {showDetails ? 'Hide' : 'View'} Detailed Breakdown
          </span>
          {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>

        {showDetails && (
          <div className="mt-4 space-y-4 text-[0.6rem]">
            {/* Avatar Cost Breakdown */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black rounded-xl p-4 border border-gray-200 dark:border-gray-800">
              <div className="text-[0.7rem] font-semibold text-gray-900 dark:text-white mb-2">Avatar Cost Breakdown</div>
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
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-xl p-4 border border-blue-200 dark:border-blue-900">
                <div className="text-[0.7rem] font-semibold text-gray-900 dark:text-white mb-2">Voice Agent Cost Breakdown</div>
                <div className="space-y-1 text-gray-700 dark:text-gray-300">
                  {combination.voiceAgent?.pricingModel === 'tokens' && combination.breakdown.voiceTotalTokens && (
                    <>
                      <div className="flex justify-between">
                        <span>Tokens per Minute:</span>
                        <span>
                          {combination.voiceAgent.tokensPerMinuteMin && combination.voiceAgent.tokensPerMinuteMax
                            ? `${combination.voiceAgent.tokensPerMinuteMin.toLocaleString()}-${combination.voiceAgent.tokensPerMinuteMax.toLocaleString()} (avg: ${combination.voiceAgent.tokensPerMinute?.toLocaleString()})`
                            : `${combination.voiceAgent.tokensPerMinute?.toLocaleString() || 'N/A'}`}
                        </span>
                      </div>
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
                          <span>Minimum Monthly Cost:</span>
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
                      {combination.breakdown.voiceBaseCostUSD !== undefined && combination.breakdown.voiceBaseCostUSD > 0 && (
                      <div className="text-[0.6rem] text-gray-500 italic mt-1">
                        * Cost is the higher of minimum or per-minute cost
                      </div>
                      )}
                    </>
                  )}
                  {combination.voiceAgent?.pricingModel === 'per-minute-per-concurrency' && (
                    <>
                      <div className="flex justify-between">
                        <span>Price per Minute per Concurrency:</span>
                        <span>{formatUSD(combination.voiceAgent?.pricePerMinute || 0)}</span>
                      </div>
                      {combination.breakdown.voicePerMinuteCostUSD !== undefined && (
                        <div className="flex justify-between">
                          <span>Total Cost (price × minutes × concurrency):</span>
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
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-xl p-4 border border-purple-200 dark:border-purple-900">
              <div className="text-[0.7rem] font-semibold text-gray-900 dark:text-white mb-2">Hosting Cost Breakdown</div>
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
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/30 dark:to-orange-900/30 rounded-xl p-4 border border-yellow-200 dark:border-yellow-900">
              <div className="text-[0.7rem] font-semibold text-gray-900 dark:text-white mb-2">Miscellaneous Expenses</div>
              <div className="flex justify-between text-gray-700 dark:text-gray-300">
                <span>Fixed Monthly Cost:</span>
                <span>{formatINR(combination.breakdown.miscExpensesINR)}</span>
              </div>
            </div>

            {/* Total Summary */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-5 border-2 border-blue-500 dark:border-blue-400 shadow-lg">
              <div className="font-bold text-white mb-3 text-[0.7rem]">Total Monthly Cost</div>
              <div className="flex justify-between text-[0.8rem] mb-2">
                <span className="text-blue-100">INR:</span>
                <span className="font-extrabold text-white">{formatINR(combination.breakdown.totalCostINR)}</span>
              </div>
              <div className="flex justify-between text-[0.8rem]">
                <span className="text-blue-100">USD:</span>
                <span className="font-extrabold text-white">{formatUSD(combination.breakdown.totalCostUSD)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {combination.warnings.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div className="text-[0.6rem] text-yellow-800 dark:text-yellow-200 space-y-1">
              {combination.warnings.map((warning, idx) => (
                <div key={idx}>• {warning}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 text-[0.6rem] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
        Score: <span className="text-gray-700 dark:text-gray-300">{combination.score.toFixed(0)}</span> (higher is better)
      </div>
      </div>
    </div>
  );
}

