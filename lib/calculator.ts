import {
  AVATAR_PLANS,
  VOICE_AGENTS,
  HOSTING_OPTIONS,
  AvatarPlan,
  VoiceAgent,
  HostingOption,
  convertUSDToINR,
  MISC_EXPENSES_MONTHLY_INR,
} from './pricing';

export interface BudgetInput {
  monthlyBudgetINR: number;
  apiAllocationPercent: number; // Percentage for APIs (avatar + voice)
  hostingAllocationPercent: number; // Percentage for hosting
  users: number;
  concurrentSessions: number;
  minutesPerMonth: number;
  useVoiceAgent: boolean; // true = avatar + voice agent, false = avatar with inbuilt voice
}

export interface Combination {
  id: string;
  avatarPlan: AvatarPlan;
  voiceAgent?: VoiceAgent;
  hostingOption: HostingOption;
  totalCostINR: number;
  breakdown: {
    avatarCostINR: number;
    voiceCostINR: number;
    hostingCostINR: number;
    miscExpensesINR: number;
    totalCostINR: number;
  };
  fitsBudget: boolean;
  score: number; // Higher is better
  warnings: string[];
}

export function calculateCombinations(input: BudgetInput): Combination[] {
  const combinations: Combination[] = [];
  const apiBudgetINR = (input.monthlyBudgetINR * input.apiAllocationPercent) / 100;
  const hostingBudgetINR = (input.monthlyBudgetINR * input.hostingAllocationPercent) / 100;

  // Generate all combinations (skip custom plans with monthlyPrice = 0)
  for (const avatarPlan of AVATAR_PLANS) {
    // Skip custom/enterprise plans without fixed pricing
    if (avatarPlan.monthlyPrice === 0) {
      continue;
    }
    for (const hostingOption of HOSTING_OPTIONS) {
      // If using voice agent, try each voice agent
      if (input.useVoiceAgent) {
        for (const voiceAgent of VOICE_AGENTS) {
          const combination = calculateCombination(
            avatarPlan,
            voiceAgent,
            hostingOption,
            input,
            apiBudgetINR,
            hostingBudgetINR
          );
          combinations.push(combination);
        }
      } else {
        // Avatar with inbuilt voice (no separate voice agent)
        const combination = calculateCombination(
          avatarPlan,
          undefined,
          hostingOption,
          input,
          apiBudgetINR,
          hostingBudgetINR
        );
        combinations.push(combination);
      }
    }
  }

  // Filter out invalid combinations and rank
  return combinations
    .filter((c) => isValidCombination(c, input))
    .sort((a, b) => b.score - a.score);
}

function calculateCombination(
  avatarPlan: AvatarPlan,
  voiceAgent: VoiceAgent | undefined,
  hostingOption: HostingOption,
  input: BudgetInput,
  apiBudgetINR: number,
  hostingBudgetINR: number
): Combination {
  // Calculate avatar cost
  const avatarCostUSD = avatarPlan.monthlyPrice;
  const includedMinutes = avatarPlan.minutes;
  const additionalMinutes = Math.max(0, input.minutesPerMonth - includedMinutes);
  const additionalCostUSD = additionalMinutes * avatarPlan.additionalPerMin;
  const totalAvatarCostUSD = avatarCostUSD + additionalCostUSD;
  const avatarCostINR = convertUSDToINR(totalAvatarCostUSD);

  // Calculate voice cost (if using voice agent)
  let voiceCostINR = 0;
  if (voiceAgent) {
    if (voiceAgent.pricingModel === 'tokens') {
      // Token-based pricing
      const totalTokens = input.minutesPerMonth * (voiceAgent.tokensPerMinute || 300);
      const tokensInMillions = totalTokens / 1_000_000;
      const voiceCostUSD = tokensInMillions * (voiceAgent.pricePer1MTokens || 0);
      voiceCostINR = convertUSDToINR(voiceCostUSD);
    } else if (voiceAgent.pricingModel === 'per-minute') {
      // Per-minute pricing
      const baseCostUSD = voiceAgent.monthlyBaseCost || 0;
      const perMinuteCostUSD = (voiceAgent.pricePerMinute || 0) * input.minutesPerMonth;
      const voiceCostUSD = baseCostUSD + perMinuteCostUSD;
      voiceCostINR = convertUSDToINR(voiceCostUSD);
    }
  }

  // Calculate hosting cost
  const hostingCostINR =
    hostingOption.baseMonthlyCostINR +
    input.users * hostingOption.costPerUserPerMonthINR +
    (input.minutesPerMonth / 10) * hostingOption.costPerCallINR; // Assuming ~10 min per call

  // Total cost (including miscellaneous expenses)
  const totalCostINR = avatarCostINR + voiceCostINR + hostingCostINR + MISC_EXPENSES_MONTHLY_INR;

  // Check if fits budget
  const apiCostINR = avatarCostINR + voiceCostINR;
  const fitsBudget = apiCostINR <= apiBudgetINR && hostingCostINR <= hostingBudgetINR;

  // Generate warnings
  const warnings: string[] = [];
  if (avatarPlan.concurrency !== undefined && input.concurrentSessions > avatarPlan.concurrency) {
    warnings.push(
      `Concurrent sessions (${input.concurrentSessions}) exceed avatar plan limit (${avatarPlan.concurrency})`
    );
  }
  if (voiceAgent && voiceAgent.concurrency && input.concurrentSessions > voiceAgent.concurrency) {
    warnings.push(
      `Concurrent sessions (${input.concurrentSessions}) exceed voice agent limit (${voiceAgent.concurrency})`
    );
  }
  if (avatarPlan.maxLength && input.minutesPerMonth / input.users > avatarPlan.maxLength) {
    warnings.push(
      `Average session length may exceed plan limit (${avatarPlan.maxLength} min)`
    );
  }
  if (apiCostINR > apiBudgetINR) {
    warnings.push(`API cost (₹${apiCostINR.toFixed(2)}) exceeds allocated budget (₹${apiBudgetINR.toFixed(2)})`);
  }
  if (hostingCostINR > hostingBudgetINR) {
    warnings.push(
      `Hosting cost (₹${hostingCostINR.toFixed(2)}) exceeds allocated budget (₹${hostingBudgetINR.toFixed(2)})`
    );
  }

  // Calculate score (higher is better)
  // Factors: fits budget, cost efficiency, feature match
  let score = 0;
  if (fitsBudget) score += 1000;
  score -= totalCostINR / 100; // Lower cost = higher score
  if (avatarPlan.concurrency !== undefined && input.concurrentSessions <= avatarPlan.concurrency) {
    score += 100;
  } else if (avatarPlan.concurrency === undefined) {
    score += 100; // Unlimited concurrency is a plus
  }
  if (voiceAgent && voiceAgent.concurrency && input.concurrentSessions <= voiceAgent.concurrency) {
    score += 100;
  }
  if (voiceAgent || avatarPlan.hasInbuiltVoice) score += 50;

  const id = `${avatarPlan.id}-${voiceAgent?.id || 'inbuilt'}-${hostingOption.id}`;

  return {
    id,
    avatarPlan,
    voiceAgent,
    hostingOption,
    totalCostINR,
    breakdown: {
      avatarCostINR,
      voiceCostINR,
      hostingCostINR,
      miscExpensesINR: MISC_EXPENSES_MONTHLY_INR,
      totalCostINR,
    },
    fitsBudget,
    score,
    warnings,
  };
}

function isValidCombination(combination: Combination, input: BudgetInput): boolean {
  // Check avatar concurrency (skip if undefined, as it means custom/unlimited)
  if (combination.avatarPlan.concurrency !== undefined && input.concurrentSessions > combination.avatarPlan.concurrency) {
    return false; // Can't handle required concurrency
  }

  // Check voice agent concurrency (if using voice agent with concurrency limit)
  if (combination.voiceAgent && combination.voiceAgent.concurrency) {
    if (input.concurrentSessions > combination.voiceAgent.concurrency) {
      return false; // Voice agent can't handle required concurrency
    }
  }

  // Check if plan has inbuilt voice when not using voice agent
  if (!input.useVoiceAgent && !combination.avatarPlan.hasInbuiltVoice) {
    return false;
  }

  return true;
}

