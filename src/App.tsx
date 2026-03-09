/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  BookOpen, 
  HeartPulse, 
  Truck, 
  Users, 
  Coins, 
  TrendingUp, 
  UserMinus, 
  Zap, 
  DollarSign, 
  Smile,
  ChevronRight,
  Info,
  AlertCircle,
  Award
} from 'lucide-react';

// --- Types ---

type SpendingCategory = 'defense' | 'education' | 'healthcare' | 'infrastructure' | 'welfare' | 'debt';

interface Budget {
  defense: number;
  education: number;
  healthcare: number;
  infrastructure: number;
  welfare: number;
  debt: number;
}

type TaxPolicy = 'low' | 'moderate' | 'high';

type Philosophy = 'people' | 'foundation' | 'growth' | 'discipline';

interface Metrics {
  gdpGrowth: number;
  unemployment: number;
  inflation: number;
  debt: number;
  happiness: number;
  gdp: number;
}

interface Crisis {
  id: string;
  title: string;
  description: string;
  impact?: (metrics: Metrics) => Metrics;
}

// --- Constants ---

const INITIAL_METRICS: Metrics = {
  gdpGrowth: 1.4,
  unemployment: 5.2,
  inflation: 3.1,
  debt: 31.0, // Trillions
  happiness: 52,
  gdp: 25.0, // Trillions
};

const CRISES: Crisis[] = [
  { id: 'hurricane', title: 'Gulf Coast Hurricane', description: 'A hurricane devastated the Gulf Coast. Infrastructure is in ruins. Citizens demand action.' },
  { id: 'recession', title: 'Economic Recession', description: 'A recession is beginning. GDP growth is -0.8%. Unemployment rising fast.' },
  { id: 'inflation', title: 'Inflation Surge', description: 'Inflation has hit 7%. Consumers are squeaking. Pressure to cut spending.' },
  { id: 'border', title: 'Border Crisis', description: 'A border security crisis dominates the news. Defense hawks demand more funding.' },
  { id: 'teachers', title: 'Teacher Shortage', description: 'A teacher shortage is crippling public schools. Education spending is under spotlight.' },
  { id: 'opioid', title: 'Opioid Epidemic', description: 'Opioid epidemic surges. Healthcare system strained. Overdose deaths at record high.' },
  { id: 'infrastructure_d', title: 'Infrastructure D+', description: "Infrastructure report card: America's bridges and roads earn a D+." },
];

const PHILOSOPHIES = [
  { id: 'people', label: 'Invest in People', description: 'Education and Healthcare effects +15% this year' },
  { id: 'foundation', label: 'Build the Foundation', description: 'Infrastructure effects +20% this year' },
  { id: 'growth', label: 'Protect and Grow', description: 'GDP growth gets +0.3% bonus' },
  { id: 'discipline', label: 'Fiscal Discipline', description: 'Debt reduced by extra $100B, public trust +5' },
];

// --- Components ---

const MetricGauge = ({ label, value, unit = '', color, min = 0, max = 100, icon: Icon }: any) => {
  const percentage = Math.min(Math.max(((value - min) / (max - min)) * 100, 0), 100);
  
  return (
    <div className="bg-white p-4 border-2 border-presidential-navy shadow-[4px_4px_0px_0px_rgba(13,43,94,1)]">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Icon size={18} className="text-presidential-navy" />
          <span className="font-display font-bold uppercase tracking-tight text-sm">{label}</span>
        </div>
        <span className="font-mono font-bold text-lg">{value.toFixed(1)}{unit}</span>
      </div>
      <div className="h-4 bg-paper border border-presidential-navy overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${color}`}
        />
      </div>
    </div>
  );
};

const GlossaryItem = ({ title, definition }: { title: string, definition: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-presidential-navy/20 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-3 flex justify-between items-center text-left hover:bg-presidential-navy/5 transition-colors px-2"
      >
        <span className="font-bold text-sm uppercase tracking-wider">{title}</span>
        <ChevronRight size={16} className={`transition-transform ${isOpen ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-4 px-2 text-sm italic text-presidential-navy/80">{definition}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function App() {
  const [year, setYear] = useState(1);
  const [phase, setPhase] = useState<'briefing' | 'budget' | 'results' | 'election'>('briefing');
  const [metrics, setMetrics] = useState<Metrics>(INITIAL_METRICS);
  const [history, setHistory] = useState<Metrics[]>([]);
  const [currentCrisis, setCurrentCrisis] = useState<Crisis | null>(null);
  const [usedCrises, setUsedCrises] = useState<string[]>([]);
  
  // Budget State
  const [budget, setBudget] = useState<Budget>({
    defense: 16,
    education: 16,
    healthcare: 17,
    infrastructure: 17,
    welfare: 17,
    debt: 17,
  });
  const [taxPolicy, setTaxPolicy] = useState<TaxPolicy>('moderate');
  const [philosophy, setPhilosophy] = useState<Philosophy>('growth');
  const [analysis, setAnalysis] = useState<string>("");

  const totalBudgetPercent = (Object.values(budget) as number[]).reduce((a, b) => a + b, 0);
  const remainingPercent = 100 - totalBudgetPercent;

  // Initialize Year 1
  useEffect(() => {
    if (year === 1 && !currentCrisis) {
      setCurrentCrisis({
        id: 'initial',
        title: 'Inauguration Day',
        description: 'You inherit a recovering economy. Unemployment is 5.2%. Growth is sluggish at 1.4%.'
      });
    }
  }, []);

  const handleSliderChange = (category: SpendingCategory, value: number) => {
    setBudget(prev => ({ ...prev, [category]: value }));
  };

  const startYear = () => {
    if (year === 1) {
      setPhase('budget');
      return;
    }
    
    // Pick a random crisis not used before
    const available = CRISES.filter(c => !usedCrises.includes(c.id));
    const picked = available[Math.floor(Math.random() * available.length)];
    setCurrentCrisis(picked);
    setUsedCrises(prev => [...prev, picked.id]);
    setPhase('briefing');
  };

  const calculateResults = () => {
    let nextMetrics = { ...metrics };
    let yearAnalysis = [];

    // 1. GDP Growth
    let gdpDelta = 0;
    if (budget.infrastructure > 15) {
      gdpDelta += 0.4 * (philosophy === 'foundation' ? 1.2 : 1);
      yearAnalysis.push("Infrastructure investment boosted long-term growth.");
    }
    
    // Education effect is delayed (applied from previous year's budget)
    // For simplicity in this logic, we'll check current year but note it's "delayed"
    if (budget.education > 15) {
      gdpDelta += 0.3 * (philosophy === 'people' ? 1.15 : 1);
    }

    if (taxPolicy === 'low') gdpDelta += 0.4;
    if (taxPolicy === 'high') gdpDelta -= 0.2;
    if (budget.debt > 15) gdpDelta -= 0.2;
    if (philosophy === 'growth') gdpDelta += 0.3;
    
    gdpDelta += (Math.random() * 0.4 - 0.2); // Random drift
    
    if (currentCrisis?.id === 'recession') gdpDelta -= 1.5;

    nextMetrics.gdpGrowth = Math.max(-5, metrics.gdpGrowth + gdpDelta);
    nextMetrics.gdp = metrics.gdp * (1 + nextMetrics.gdpGrowth / 100);

    // 2. Unemployment
    let unempDelta = 0;
    if (budget.infrastructure > 15) unempDelta -= 0.5;
    if (budget.welfare > 10) unempDelta -= 0.2;
    if (taxPolicy === 'low' && nextMetrics.gdpGrowth > 2.5) unempDelta -= 0.3;
    if (currentCrisis?.id === 'recession') unempDelta += 0.8;
    
    nextMetrics.unemployment = Math.max(2, metrics.unemployment + unempDelta);

    // 3. Inflation
    let inflDelta = 0;
    const nonDebtSpending = 100 - budget.debt;
    if (nonDebtSpending > 80) inflDelta += 0.4;
    if (taxPolicy === 'high') inflDelta -= 0.2;
    if (taxPolicy === 'low' && nonDebtSpending > 80) inflDelta += 0.5;
    if (budget.debt > 15) inflDelta -= 0.1;
    if (currentCrisis?.id === 'inflation') inflDelta += 2.0;

    nextMetrics.inflation = Math.max(0, metrics.inflation + inflDelta);

    // 4. National Debt
    const taxRates = { low: 0.18, moderate: 0.24, high: 0.30 };
    const revenue = nextMetrics.gdp * taxRates[taxPolicy];
    const spending = 4.8; // Trillions fixed
    let deficit = spending - revenue;
    
    // Debt repayment category reduces deficit
    const debtRepaymentAmount = (budget.debt / 100) * spending;
    deficit -= debtRepaymentAmount;
    
    if (philosophy === 'discipline') deficit -= 0.1;

    nextMetrics.debt += deficit;

    // 5. Happiness
    let hapDelta = 0;
    if (budget.healthcare > 18) hapDelta += 6 * (philosophy === 'people' ? 1.15 : 1);
    if (budget.education > 15) hapDelta += 5;
    if (budget.welfare > 12) hapDelta += 4;
    if (budget.infrastructure > 15) hapDelta += 3;
    
    const unempDrop = metrics.unemployment - nextMetrics.unemployment;
    if (unempDrop > 0) hapDelta += unempDrop * 4;
    
    if (nextMetrics.inflation > 5) {
      hapDelta -= 8;
      yearAnalysis.push("High inflation is hurting household budgets.");
    }
    if (deficit > 2.0) hapDelta -= 5;
    if (budget.defense > 30) hapDelta -= 3;
    if (philosophy === 'discipline') hapDelta += 5;

    if (currentCrisis?.id === 'hurricane' && budget.infrastructure < 20) {
      hapDelta -= 10;
      yearAnalysis.push("Slow disaster response angered the public.");
    }
    if (currentCrisis?.id === 'opioid' && budget.healthcare < 20) {
      hapDelta -= 7;
    }

    nextMetrics.happiness = Math.min(100, Math.max(0, metrics.happiness + hapDelta));

    if (yearAnalysis.length === 0) {
      yearAnalysis.push("A steady year for the administration.");
    }

    setAnalysis(yearAnalysis.join(" "));
    setHistory([...history, metrics]);
    setMetrics(nextMetrics);
    setPhase('results');
  };

  const nextYear = () => {
    if (year === 4) {
      setPhase('election');
    } else {
      setYear(year + 1);
      startYear();
    }
  };

  const getLegacy = () => {
    if (metrics.happiness >= 75) return { title: "FDR-Level Legend", desc: "You rebuilt America and secured a golden age." };
    if (taxPolicy === 'low' && metrics.gdpGrowth > 3) return { title: "Reagan-esque Growth Hawk", desc: "Low taxes, high growth, and a mountain of debt." };
    if (metrics.happiness >= 55) return { title: "Compassionate Centrist", desc: "Solid but uninspiring leadership kept the ship steady." };
    if (metrics.happiness >= 45) return { title: "One-Term Wonder", desc: "The economy won this round. Better luck in the private sector." };
    return { title: "Herbert Hoover Award", desc: "You caused a depression. History will not be kind." };
  };

  // --- Render Helpers ---

  const renderBriefing = () => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto mt-12"
    >
      <div className="bg-white border-4 border-presidential-navy p-8 shadow-[12px_12px_0px_0px_rgba(13,43,94,1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-american-red" />
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-display text-4xl font-black uppercase italic leading-none mb-1">Presidential</h2>
            <h3 className="font-display text-2xl font-bold uppercase tracking-widest text-presidential-navy/60">Daily Briefing</h3>
          </div>
          <div className="text-right">
            <p className="font-mono text-sm font-bold">YEAR {year}</p>
            <p className="font-mono text-xs opacity-50 uppercase">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="border-y-2 border-presidential-navy py-8 my-6">
          <h4 className="font-display text-2xl font-bold mb-4 text-american-red">{currentCrisis?.title}</h4>
          <p className="text-xl leading-relaxed font-medium italic">"{currentCrisis?.description}"</p>
        </div>

        <button 
          onClick={() => setPhase('budget')}
          className="w-full bg-presidential-navy text-white py-4 font-display text-xl font-bold uppercase tracking-widest hover:bg-american-red transition-colors flex items-center justify-center gap-2"
        >
          Enter Budget Chamber <ChevronRight />
        </button>
      </div>
    </motion.div>
  );

  const renderBudget = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8"
    >
      {/* Left Column: Sliders */}
      <div className="lg:col-span-2 space-y-6">
        <div className="bg-white border-2 border-presidential-navy p-6 lined-paper shadow-[8px_8px_0px_0px_rgba(13,43,94,1)]">
          <div className="flex justify-between items-end mb-8 border-b-2 border-presidential-navy pb-4">
            <h2 className="font-display text-3xl font-black uppercase">Fiscal Allocation</h2>
            <div className="text-right">
              <p className="text-xs font-bold uppercase opacity-50">Remaining Funds</p>
              <p className={`text-3xl font-mono font-bold ${remainingPercent === 0 ? 'text-green-600' : 'text-american-red'}`}>
                {remainingPercent}%
              </p>
            </div>
          </div>

          <div className="space-y-8">
            {[
              { id: 'defense', label: 'Defense & Security', icon: Shield },
              { id: 'education', label: 'Education & Research', icon: BookOpen },
              { id: 'healthcare', label: 'Healthcare & Social Services', icon: HeartPulse },
              { id: 'infrastructure', label: 'Infrastructure & Transport', icon: Truck },
              { id: 'welfare', label: 'Welfare & Safety Net', icon: Users },
              { id: 'debt', label: 'Debt Repayment', icon: Coins },
            ].map((cat) => (
              <div key={cat.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="flex items-center gap-2 font-bold uppercase text-sm tracking-tighter">
                    <cat.icon size={16} /> {cat.label}
                  </label>
                  <span className="font-mono font-bold bg-presidential-navy text-white px-2 py-0.5 text-sm">
                    {budget[cat.id as SpendingCategory]}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="40" 
                  value={budget[cat.id as SpendingCategory]}
                  onChange={(e) => handleSliderChange(cat.id as SpendingCategory, parseInt(e.target.value))}
                  className="w-full h-2 bg-presidential-navy/10 rounded-lg appearance-none cursor-pointer accent-presidential-navy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Policy & Philosophy */}
      <div className="space-y-6">
        {/* Tax Policy */}
        <div className="bg-white border-2 border-presidential-navy p-6 shadow-[8px_8px_0px_0px_rgba(13,43,94,1)]">
          <h3 className="font-display text-xl font-bold uppercase mb-4 border-b border-presidential-navy pb-2">Tax Policy</h3>
          <div className="space-y-4">
            {[
              { id: 'low', label: 'Low Tax (18%)', desc: 'Stimulate growth, reduce revenue' },
              { id: 'moderate', label: 'Moderate Tax (24%)', desc: 'Balanced approach' },
              { id: 'high', label: 'High Tax (30%)', desc: 'Fund programs, slow private growth' },
            ].map((p) => (
              <label key={p.id} className={`block p-3 border cursor-pointer transition-all ${taxPolicy === p.id ? 'bg-presidential-navy text-white border-presidential-navy' : 'bg-paper border-presidential-navy/20 hover:border-presidential-navy'}`}>
                <div className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="tax" 
                    checked={taxPolicy === p.id} 
                    onChange={() => setTaxPolicy(p.id as TaxPolicy)}
                    className="hidden"
                  />
                  <span className="font-bold uppercase text-sm">{p.label}</span>
                </div>
                <p className={`text-xs mt-1 ${taxPolicy === p.id ? 'text-white/70' : 'text-presidential-navy/60'}`}>{p.desc}</p>
              </label>
            ))}
          </div>
        </div>

        {/* Philosophy */}
        <div className="bg-white border-2 border-presidential-navy p-6 shadow-[8px_8px_0px_0px_rgba(13,43,94,1)]">
          <h3 className="font-display text-xl font-bold uppercase mb-4 border-b border-presidential-navy pb-2">Economic Philosophy</h3>
          <div className="space-y-3">
            {PHILOSOPHIES.map((p) => (
              <label key={p.id} className={`block p-3 border cursor-pointer transition-all ${philosophy === p.id ? 'bg-presidential-gold text-white border-presidential-gold' : 'bg-paper border-presidential-navy/20 hover:border-presidential-navy'}`}>
                <div className="flex items-center gap-2">
                  <input 
                    type="radio" 
                    name="philosophy" 
                    checked={philosophy === p.id} 
                    onChange={() => setPhilosophy(p.id as Philosophy)}
                    className="hidden"
                  />
                  <span className="font-bold uppercase text-xs">{p.label}</span>
                </div>
                <p className={`text-[10px] mt-1 leading-tight ${philosophy === p.id ? 'text-white/80' : 'text-presidential-navy/60'}`}>{p.description}</p>
              </label>
            ))}
          </div>
        </div>

        <button 
          disabled={remainingPercent !== 0}
          onClick={calculateResults}
          className={`w-full py-6 font-display text-2xl font-black uppercase tracking-widest transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] ${remainingPercent === 0 ? 'bg-american-red text-white hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          {remainingPercent === 0 ? 'Submit Budget' : `Allocate ${remainingPercent}% More`}
        </button>
      </div>
    </motion.div>
  );

  const renderResults = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-4xl mx-auto mt-8"
    >
      <div className="bg-white border-4 border-presidential-navy p-8 shadow-[12px_12px_0px_0px_rgba(13,43,94,1)]">
        <div className="flex justify-between items-center mb-8 border-b-4 border-presidential-navy pb-4">
          <div>
            <h2 className="font-display text-5xl font-black uppercase italic leading-none">Year {year}</h2>
            <h3 className="font-display text-xl font-bold uppercase tracking-widest text-presidential-navy/60">Economic Report Card</h3>
          </div>
          <div className="w-20 h-20 border-4 border-presidential-navy rounded-full flex items-center justify-center p-2">
            <div className="w-full h-full border-2 border-presidential-navy rounded-full flex items-center justify-center">
              <span className="font-display font-black text-2xl italic">US</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <MetricGauge 
            label="GDP Growth" 
            value={metrics.gdpGrowth} 
            unit="%" 
            color={metrics.gdpGrowth > 2 ? 'bg-green-500' : metrics.gdpGrowth > 0 ? 'bg-yellow-500' : 'bg-red-500'} 
            min={-5} max={5}
            icon={TrendingUp}
          />
          <MetricGauge 
            label="Unemployment" 
            value={metrics.unemployment} 
            unit="%" 
            color={metrics.unemployment < 5 ? 'bg-green-500' : metrics.unemployment < 8 ? 'bg-yellow-500' : 'bg-red-500'} 
            min={0} max={15}
            icon={UserMinus}
          />
          <MetricGauge 
            label="Inflation" 
            value={metrics.inflation} 
            unit="%" 
            color={metrics.inflation < 3 ? 'bg-green-500' : metrics.inflation < 6 ? 'bg-yellow-500' : 'bg-red-500'} 
            min={0} max={10}
            icon={Zap}
          />
          <MetricGauge 
            label="Public Approval" 
            value={metrics.happiness} 
            unit="/100" 
            color={metrics.happiness > 60 ? 'bg-green-500' : metrics.happiness > 45 ? 'bg-yellow-500' : 'bg-red-500'} 
            min={0} max={100}
            icon={Smile}
          />
        </div>

        <div className="bg-presidential-navy text-white p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <DollarSign size={40} className="text-presidential-gold" />
            <div>
              <p className="text-xs uppercase font-bold tracking-widest opacity-70">Total National Debt</p>
              <p className="text-4xl font-mono font-bold odometer tracking-tighter">
                ${metrics.debt.toFixed(2)} TRILLION
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase font-bold tracking-widest opacity-70">Annual GDP</p>
            <p className="text-2xl font-mono font-bold">${metrics.gdp.toFixed(2)}T</p>
          </div>
        </div>

        <div className="border-l-4 border-presidential-gold pl-6 py-2 mb-8">
          <h4 className="font-display font-bold uppercase text-sm mb-1">Economic Analysis</h4>
          <p className="text-lg italic font-medium leading-relaxed">"{analysis}"</p>
        </div>

        <button 
          onClick={nextYear}
          className="w-full bg-presidential-navy text-white py-4 font-display text-xl font-bold uppercase tracking-widest hover:bg-american-red transition-colors flex items-center justify-center gap-2"
        >
          {year === 4 ? 'Go to Election Night' : `Continue to Year ${year + 1}`} <ChevronRight />
        </button>
      </div>
    </motion.div>
  );

  const renderElection = () => {
    const legacy = getLegacy();
    const win = metrics.happiness >= 50; // Simplified win logic for dramatic effect
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-[#111] z-50 overflow-y-auto p-4 md:p-12"
      >
        {win && Array.from({ length: 50 }).map((_, i) => (
          <div 
            key={i} 
            className="confetti" 
            style={{ 
              left: `${Math.random() * 100}%`, 
              backgroundColor: i % 2 === 0 ? '#c8102e' : '#0d2b5e',
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }} 
          />
        ))}

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-7xl font-black text-white uppercase italic tracking-tighter mb-2">Election Night</h2>
            <p className="text-presidential-gold font-mono text-xl uppercase tracking-widest">Decision 2026</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Map Graphic */}
            <div className="space-y-4">
              <div className="aspect-video bg-white/5 border-2 border-white/20 p-4 grid grid-cols-10 grid-rows-6 gap-1">
                {Array.from({ length: 60 }).map((_, i) => {
                  const isRed = Math.random() * 100 > metrics.happiness;
                  return (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.02 }}
                      className={`w-full h-full ${isRed ? 'bg-american-red' : 'bg-presidential-navy'}`}
                    />
                  );
                })}
              </div>
              <div className="flex justify-between text-white font-bold uppercase text-sm">
                <span className="text-presidential-navy">Incumbent (You)</span>
                <span className="text-american-red">Challenger</span>
              </div>
              <div className="h-4 bg-white/10 rounded-full overflow-hidden flex">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${metrics.happiness}%` }}
                  transition={{ duration: 2, ease: "easeOut" }}
                  className="h-full bg-presidential-navy"
                />
                <div className="flex-1 bg-american-red" />
              </div>
            </div>

            {/* Results Card */}
            <div className="bg-white p-8 border-4 border-presidential-gold shadow-[0_0_50px_rgba(201,168,76,0.3)]">
              <div className="text-center mb-6">
                <h3 className={`font-display text-5xl font-black uppercase mb-2 ${win ? 'text-presidential-navy' : 'text-american-red'}`}>
                  {win ? 'RE-ELECTED' : 'DEFEATED'}
                </h3>
                <p className="font-medium italic text-gray-600">The people have spoken.</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-bold uppercase text-xs text-gray-400">Final Approval</span>
                  <span className="font-mono font-bold">{metrics.happiness.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-bold uppercase text-xs text-gray-400">Avg GDP Growth</span>
                  <span className="font-mono font-bold">{metrics.gdpGrowth.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="font-bold uppercase text-xs text-gray-400">Final Debt</span>
                  <span className="font-mono font-bold">${metrics.debt.toFixed(2)}T</span>
                </div>
              </div>

              <div className="bg-paper p-4 border-2 border-presidential-navy text-center">
                <Award className="mx-auto mb-2 text-presidential-gold" size={32} />
                <h4 className="font-display text-xl font-bold uppercase">{legacy.title}</h4>
                <p className="text-sm italic mt-1">"{legacy.desc}"</p>
              </div>

              <button 
                onClick={() => window.location.reload()}
                className="w-full mt-8 bg-presidential-navy text-white py-4 font-display text-xl font-bold uppercase tracking-widest hover:bg-american-red transition-colors"
              >
                Serve Another Term?
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen pb-20 px-4">
      {/* Header */}
      <header className="max-w-6xl mx-auto pt-8 pb-4 border-b-4 border-presidential-navy flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="font-display text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.8]">
            Nation <br /> Builder
          </h1>
          <p className="font-mono text-sm font-bold uppercase tracking-widest mt-2 text-american-red">
            Presidential Fiscal Simulator
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-4 justify-end mb-1">
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold opacity-50">Current Year</p>
              <p className="text-2xl font-display font-black italic">{year} / 4</p>
            </div>
            <div className="h-10 w-[2px] bg-presidential-navy/20" />
            <div className="text-right">
              <p className="text-[10px] uppercase font-bold opacity-50">Approval Rating</p>
              <p className={`text-2xl font-mono font-bold ${metrics.happiness > 50 ? 'text-green-600' : 'text-american-red'}`}>
                {metrics.happiness.toFixed(0)}%
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {phase === 'briefing' && renderBriefing()}
        {phase === 'budget' && renderBudget()}
        {phase === 'results' && renderResults()}
        {phase === 'election' && renderElection()}
      </main>

      {/* Glossary Footer */}
      <footer className="max-w-4xl mx-auto mt-20 bg-white border-2 border-presidential-navy p-6 shadow-[4px_4px_0px_0px_rgba(13,43,94,1)]">
        <div className="flex items-center gap-2 mb-4 text-presidential-navy">
          <Info size={20} />
          <h3 className="font-display text-xl font-bold uppercase">Economic Glossary</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <GlossaryItem 
            title="Fiscal Policy" 
            definition="The use of government spending and taxation to influence the economy. It's one of the two main tools of macroeconomic policy (the other being monetary policy)." 
          />
          <GlossaryItem 
            title="GDP (Gross Domestic Product)" 
            definition="The total value of all final goods and services produced within a country's borders in a specific time period. It's the primary measure of economic health." 
          />
          <GlossaryItem 
            title="National Debt" 
            definition="The total amount of money that a country's government has borrowed, by various means. It accumulates when a government runs a deficit." 
          />
          <GlossaryItem 
            title="Budget Deficit" 
            definition="Occurs when a government's spending exceeds its revenue (primarily from taxes) in a given year." 
          />
          <GlossaryItem 
            title="Inflation" 
            definition="A general increase in prices and fall in the purchasing value of money. High inflation can erode consumer spending power." 
          />
          <GlossaryItem 
            title="Unemployment Rate" 
            definition="The percentage of the total labor force that is jobless and actively seeking employment." 
          />
        </div>
      </footer>
    </div>
  );
}
