// Pricing data from the PDF

export interface AvatarPlan {
  id: string;
  name: string;
  provider: 'heygen' | 'anam' | 'tevus';
  tier: string;
  monthlyPrice: number; // Annual payment divided by 12
  minutes: number;
  maxLength?: number; // in minutes
  concurrency: number;
  additionalPerMin: number;
  hasInbuiltVoice: boolean;
}

export interface VoiceAgent {
  id: string;
  name: string;
  pricingModel: 'tokens' | 'per-minute';
  // For token-based pricing
  pricePer1MTokens?: number;
  tokensPerMinute?: number; // 300 words/min * ~1 token/word = 300 tokens/min
  // For per-minute pricing
  pricePerMinute?: number;
  monthlyBaseCost?: number; // Monthly subscription cost (if any)
  concurrency?: number; // Max concurrent sessions
}

export interface HostingOption {
  id: string;
  name: string;
  baseMonthlyCostINR: number;
  costPerUserPerMonthINR: number;
  costPerCallINR: number;
  storageGB: number;
}

// Avatar Plans (Annual prices converted to monthly)
export const AVATAR_PLANS: AvatarPlan[] = [
  // HeyGen
  {
    id: 'heygen-essential',
    name: 'HeyGen Essential',
    provider: 'heygen',
    tier: 'Essential',
    monthlyPrice: 99 / 12, // $99 annual
    minutes: 1000,
    maxLength: 20,
    concurrency: 20,
    additionalPerMin: 0.10,
    hasInbuiltVoice: true,
  },
  {
    id: 'heygen-starter',
    name: 'HeyGen Starter',
    provider: 'heygen',
    tier: 'Starter',
    monthlyPrice: 12,
    minutes: 45,
    maxLength: 5,
    concurrency: 1,
    additionalPerMin: 0.18,
    hasInbuiltVoice: true,
  },
  {
    id: 'heygen-explorer',
    name: 'HeyGen Explorer',
    provider: 'heygen',
    tier: 'Explorer',
    monthlyPrice: 49,
    minutes: 90,
    maxLength: 10,
    concurrency: 3,
    additionalPerMin: 0.18,
    hasInbuiltVoice: true,
  },
  {
    id: 'heygen-growth',
    name: 'HeyGen Growth',
    provider: 'heygen',
    tier: 'Growth',
    monthlyPrice: 299,
    minutes: 300,
    maxLength: 30,
    concurrency: 5,
    additionalPerMin: 0.18,
    hasInbuiltVoice: true,
  },
  {
    id: 'heygen-pro',
    name: 'HeyGen Pro',
    provider: 'heygen',
    tier: 'Pro',
    monthlyPrice: 799,
    minutes: 1000,
    maxLength: undefined, // unlimited
    concurrency: 10,
    additionalPerMin: 0.18,
    hasInbuiltVoice: true,
  },
  // Anam
  {
    id: 'anam-starter',
    name: 'Anam Starter',
    provider: 'anam',
    tier: 'Starter',
    monthlyPrice: 12,
    minutes: 45,
    maxLength: 5,
    concurrency: 1,
    additionalPerMin: 0.27,
    hasInbuiltVoice: true,
  },
  {
    id: 'anam-growth',
    name: 'Anam Growth',
    provider: 'anam',
    tier: 'Growth',
    monthlyPrice: 49,
    minutes: 90,
    maxLength: 10,
    concurrency: 3,
    additionalPerMin: 0.54,
    hasInbuiltVoice: true,
  },
  {
    id: 'anam-enterprise',
    name: 'Anam Enterprise',
    provider: 'anam',
    tier: 'Enterprise',
    monthlyPrice: 299,
    minutes: 300,
    maxLength: 30,
    concurrency: 5,
    additionalPerMin: 1.00,
    hasInbuiltVoice: true,
  },
  // Tevus
  {
    id: 'tevus-starter',
    name: 'Tevus Starter',
    provider: 'tevus',
    tier: 'Starter',
    monthlyPrice: 59,
    minutes: 100,
    maxLength: undefined,
    concurrency: 3,
    additionalPerMin: 0.37,
    hasInbuiltVoice: true,
  },
  {
    id: 'tevus-growth',
    name: 'Tevus Growth',
    provider: 'tevus',
    tier: 'Growth',
    monthlyPrice: 397,
    minutes: 1250,
    maxLength: undefined,
    concurrency: 15,
    additionalPerMin: 0.32,
    hasInbuiltVoice: true,
  },
  {
    id: 'tevus-enterprise',
    name: 'Tevus Enterprise',
    provider: 'tevus',
    tier: 'Enterprise',
    monthlyPrice: 1666.67,
    minutes: 6667,
    maxLength: undefined,
    concurrency: 30,
    additionalPerMin: 0.25,
    hasInbuiltVoice: true,
  },
];

// Voice Agents
export const VOICE_AGENTS: VoiceAgent[] = [
  // Token-based pricing
  {
    id: 'gemini-live',
    name: 'Gemini Live',
    pricingModel: 'tokens',
    pricePer1MTokens: 17.05,
    tokensPerMinute: 300, // 300 words/min assumption
  },
  {
    id: 'gpt-realtime',
    name: 'GPT Realtime',
    pricingModel: 'tokens',
    pricePer1MTokens: 116.00,
    tokensPerMinute: 300,
  },
  // Per-minute pricing
  {
    id: 'hume-pro',
    name: 'Hume Pro',
    pricingModel: 'per-minute',
    pricePerMinute: 0.06,
    monthlyBaseCost: 70,
    concurrency: 10,
  },
  {
    id: 'hume-scale',
    name: 'Hume Scale',
    pricingModel: 'per-minute',
    pricePerMinute: 0.05,
    monthlyBaseCost: 200,
    concurrency: 20,
  },
  {
    id: 'hume-business',
    name: 'Hume Business',
    pricingModel: 'per-minute',
    pricePerMinute: 0.04,
    monthlyBaseCost: 500,
    concurrency: 30,
  },
  {
    id: 'grok',
    name: 'Grok',
    pricingModel: 'per-minute',
    pricePerMinute: 0.05,
    monthlyBaseCost: 0, // No base cost mentioned
    concurrency: undefined, // Not specified in PDF
  },
];

// Hosting Options
export const HOSTING_OPTIONS: HostingOption[] = [
  {
    id: 'azure',
    name: 'Azure',
    baseMonthlyCostINR: 50000,
    costPerUserPerMonthINR: 220,
    costPerCallINR: 3.10,
    storageGB: 50,
  },
  {
    id: 'vercel',
    name: 'Vercel',
    baseMonthlyCostINR: 40000,
    costPerUserPerMonthINR: 240,
    costPerCallINR: 3.40,
    storageGB: 10,
  },
  {
    id: 'railway',
    name: 'Railway',
    baseMonthlyCostINR: 30000,
    costPerUserPerMonthINR: 210,
    costPerCallINR: 3.00,
    storageGB: 10,
  },
  {
    id: 'vercel-railway',
    name: 'Vercel + Railway',
    baseMonthlyCostINR: 35000, // Average
    costPerUserPerMonthINR: 230, // Average
    costPerCallINR: 3.20, // Average
    storageGB: 15,
  },
];

// Exchange rate: 1 USD = 83 INR (approximate)
const USD_TO_INR = 83;

export function convertUSDToINR(usd: number): number {
  return usd * USD_TO_INR;
}

export function convertINRToUSD(inr: number): number {
  return inr / USD_TO_INR;
}

