# iterations w khushi

A Next.js application to calculate optimal combinations of avatar and voice solutions based on your budget constraints.

## Features

- **Budget Allocation**: Set monthly budget and allocate percentages for APIs and hosting
- **Configuration Options**: 
  - Number of users
  - Concurrent sessions
  - Minutes per month
  - Voice option (inbuilt vs voice agent)
- **Smart Combinations**: Generates all valid combinations and ranks them by best fit
- **Detailed Breakdown**: Shows cost breakdown for each combination with warnings
- **Dark Mode**: Toggle between light and dark themes
- **Modern UI**: Built with Tailwind CSS and Geist font

## Installation

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Steps

1. **Clone the repository** (or navigate to the project directory):
```bash
cd khushi/cost-calculator
```

2. **Install dependencies**:
```bash
npm install
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Pricing Data

The calculator uses pricing data from the cost estimation PDF:

### Avatar Providers
- **HeyGen**: Essential, Starter, Explorer, Growth, Pro (various tiers)
- **Anam**: Starter, Growth, Enterprise
- **Tevus**: Starter, Growth, Enterprise

### Voice Agents
- **Token-based**: Gemini Live ($17.05/1M tokens), GPT Realtime ($116/1M tokens)
- **Per-minute**: Hume Pro/Scale/Business, Grok

### Hosting Options
- Azure, Vercel, Railway, Vercel+Railway

## How It Works

1. Enter your monthly budget in INR
2. Allocate percentages for APIs and hosting (must total 100%)
3. Configure your usage: users, concurrent sessions, minutes per month
4. Choose voice option (inbuilt avatar voice or separate voice agent)
5. Click "Calculate Combinations" to see ranked results

The calculator will:
- Generate all valid combinations
- Calculate costs for each combination
- Rank by best fit (considers budget fit, cost efficiency, feature match)
- Display warnings for any constraints that aren't met

## Tech Stack

- **Framework**: Next.js 14.2.3
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Font**: Geist Sans
- **Theme**: next-themes for dark mode support
- **Icons**: Lucide React

## Project Structure

```
cost-calculator/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── BudgetForm.tsx
│   ├── ResultsDisplay.tsx
│   ├── ThemeProvider.tsx
│   └── ThemeToggle.tsx
├── lib/
│   ├── calculator.ts
│   ├── pricing.ts
│   └── utils.ts
└── package.json
```

## License

Private project

