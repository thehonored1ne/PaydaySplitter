import './App.css'
import { useState, useEffect } from 'react';
import Header from './components/Header';
import PaydayForm from './components/PaydayForm';
import ResultsDashboard from './components/ResultsDashboard';
import { calculateNetPay } from './utils/financeUtils';
import SplitControls from './components/SplitControls';
import DeductionSettings from './components/DeductionSettings';

function App() {
  const [salary, setSalary] = useState(0);
  const [isSemiMonthly, setIsSemiMonthly] = useState(false);
  
  const [splits, setSplits] = useState(() => {
    const saved = localStorage.getItem('payday_splits');
    return saved ? JSON.parse(saved) : [
      { id: 1, label: 'Needs', rate: 50, color: 'blue', subtext: 'Rent, Food, Transpo, Bills' },
      { id: 2, label: 'Wants', rate: 30, color: 'pink', subtext: 'Coffee, Gaming, Dining Out' },
      { id: 3, label: 'Emergency Fund', rate: 20, color: 'amber', subtext: 'High-interest savings (Gotyme)' }
    ];
  });

  const [deductionRates, setDeductionRates] = useState(() => {
    const saved = localStorage.getItem('payday_deductions');
    return saved ? JSON.parse(saved) : [
      { id: 1, label: 'SSS', rate: 0, isPercentage: false, isSmart: true },
      { id: 2, label: 'PhilHealth', rate: 0, isPercentage: false, isSmart: true },
      { id: 3, label: 'Pag-Ibig', rate: 0, isPercentage: false, isSmart: true }
    ];
  });

  const applyPreset = (type) => {
    let newRates = [];
    if (type === '40152520') {
      newRates = [40, 15, 25, 20];
    } else if (type === '50103010') {
      newRates = [50, 10, 30, 10];
    } else if (type === '35252020') {
      newRates = [35, 25, 20, 20];
    }
    
    setSplits(prev => prev.map((s, idx) => ({
      ...s,
      rate: newRates[idx] || 0
    })));
  };

  useEffect(() => {
    localStorage.setItem('payday_splits', JSON.stringify(splits));
    localStorage.setItem('payday_deductions', JSON.stringify(deductionRates));
  }, [splits, deductionRates]);

  const data = calculateNetPay(salary, splits, deductionRates);

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-12 overflow-x-hidden">
      <div className="max-w-6xl mx-auto space-y-12 md:space-y-16">
        <Header />
        
        {/* Global Controls Row */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white neo-card p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-[12px] font-black uppercase tracking-widest text-black/50 italic">View Mode</h4>
              <p className="text-[12px] font-bold text-black/60 uppercase tracking-tighter">Adjust numbers for your pay cycle</p>
            </div>
            <div className="flex p-1 bg-slate-100 neo-border gap-1 w-fit">
              <button 
                onClick={() => setIsSemiMonthly(false)}
                className={`px-4 py-2 text-[10px] font-black uppercase transition-all ${!isSemiMonthly ? 'bg-black text-white' : 'hover:bg-slate-200'}`}
              >Full Month</button>
              <button 
                onClick={() => setIsSemiMonthly(true)}
                className={`px-4 py-2 text-[10px] font-black uppercase transition-all ${isSemiMonthly ? 'bg-black text-white' : 'hover:bg-slate-200'}`}
              >Half Month</button>
            </div>
          </div>

          <div className="space-y-2 w-full md:w-auto">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-black/50 italic text-right">Budget Split Presets</h4>
            <div className="flex flex-wrap gap-2 justify-end">
              <button onClick={() => applyPreset('40152520')} className="neo-button bg-[#33a1fd] text-[11px] py-2 px-3">40/15/25/20</button>
              <button onClick={() => applyPreset('50103010')} className="neo-button bg-[#fbe334] text-[11px] py-2 px-3">50/10/30/10</button>
              <button onClick={() => applyPreset('35252020')} className="neo-button bg-[#ff90e8] text-[11px] py-2 px-3">35/25/20/20</button>
            </div>
          </div>
        </div>
        
        <div className="grid gap-10 lg:grid-cols-12 items-start">
          {/* Controls - Left side on desktop */}
          <div className="lg:col-span-5 space-y-10 min-w-0">
            <div className="neo-card p-6 md:p-8 bg-white mb-4">
              <PaydayForm 
                onSalaryChange={setSalary} 
                isSemiMonthly={isSemiMonthly} 
              />
            </div>
            
            <div className="grid gap-10 md:grid-cols-1">
              <SplitControls splits={splits} setSplits={setSplits} />
              <DeductionSettings rates={deductionRates} setRates={setDeductionRates} />
            </div>
          </div>
          
          {/* Dashboard - Right side on desktop */}
          <div className="lg:col-span-7 min-w-0">
            <ResultsDashboard data={data} isSemiMonthly={isSemiMonthly} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;