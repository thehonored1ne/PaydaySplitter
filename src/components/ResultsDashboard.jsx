import { Heart, ShoppingCart, TrendingUp, ShieldCheck, ShieldAlert, PieChart as PieIcon, Download, PlusCircle, AlertCircle } from 'lucide-react';
import BreakdownCard from './BreakdownCard';
import BudgetDonut from './BudgetDonut';
import { useRef, useCallback } from 'react';
import * as htmlToImage from 'html-to-image';
import { calculateBIRTax } from '../utils/financeUtils';

const ResultsDashboard = ({ data, isSemiMonthly }) => {
  const dashboardRef = useRef(null);

  const factor = isSemiMonthly ? 0.5 : 1;
  const viewLabel = isSemiMonthly ? "Half Month Breakdown" : "Full Month Breakdown";

  const downloadImage = useCallback(() => {
    if (dashboardRef.current === null) return;

    htmlToImage.toPng(dashboardRef.current, { 
        cacheBust: true, 
        backgroundColor: '#fafafa',
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
    })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = `payday-breakdown-${isSemiMonthly ? 'half' : 'full'}.png`;
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.error('Export failed:', err);
      });
  }, [dashboardRef, isSemiMonthly]);

  // Guard clause: Only render results if gross salary is greater than 0
  if (!data || !data.gross || data.gross <= 0) {
    return (
      <div className="text-center py-12 border-2 border-dashed border-black mt-6 neo-card bg-white">
        <p className="text-black font-black uppercase tracking-widest italic opacity-40">
          Waiting for those sahod digits... 💸
        </p>
      </div>
    );
  }

  // 13th Month Logic (Assuming Gross = Basic for this model)
  const thirteenthMonth = data.gross;
  const taxableThirteenth = Math.max(0, thirteenthMonth - 90000);
  
  // Calculate Marginal Tax Rate for 13th Month (Simplified to their bracket rate)
  const monthlyTax = calculateBIRTax(data.gross);
  const monthPlusOne = calculateBIRTax(data.gross + 1000);
  const marginalRate = (monthPlusOne - monthlyTax) / 1000;
  const thirteenthTax = taxableThirteenth * marginalRate;
  const netThirteenth = thirteenthMonth - thirteenthTax;

  return (
    <div className="space-y-10">
      {/* View Switcher Info */}
      <div className="flex justify-between items-center bg-white neo-card p-4">
        <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full animate-pulse ${isSemiMonthly ? 'bg-[#33a1fd]' : 'bg-[#00e699]'}`}></div>
            <span className="text-[10px] font-black uppercase tracking-widest">{viewLabel}</span>
        </div>
        <button 
          onClick={downloadImage}
          className="neo-button bg-white text-[10px] py-1 px-4"
        >
          <Download size={14} />
          Export Image
        </button>
      </div>

      <div ref={dashboardRef} className="space-y-6 md:space-y-8 bg-white neo-card p-3 sm:p-6 md:p-10 relative min-w-0">
        {/* 0. Visual Chart */}
        <div className="bg-[#fafafa] neo-border p-4 md:p-6 neo-shadow">
            <BudgetDonut data={{...data, net: data.net * factor}} />
        </div>
        
        {/* 1. Statutory Deductions Summary */}
        <div className="bg-[#ff4d4d] neo-border p-3 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 md:gap-4 neo-shadow">
          <div className="flex items-center gap-3">
            <ShieldAlert size={20} className="text-white shrink-0" />
            <div className="flex flex-col">
                <span className="text-xs md:text-lg font-black text-white uppercase tracking-tighter leading-none">
                    {isSemiMonthly ? 'Payday Cut Deductions' : 'Total Monthly Deductions'}
                </span>
                {isSemiMonthly && (
                    <span className="text-[7px] text-white/70 italic uppercase mt-1">
                        * Statutories assumed split 50/50 per payday
                    </span>
                )}
            </div>
          </div>
          <span className="text-xl md:text-3xl font-black text-white font-mono">
          - ₱{(data.totalDeductions * factor).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>

        {/* 2. Dynamic Split Grid */}
        <div className="grid gap-3 md:gap-6">
          {(data.splits || []).map((split, index) => {
            let icon = <PieIcon size={16} color="black" />;
            
            if (split.label.toLowerCase().includes('need')) icon = <Heart size={16} color="black" />;
            if (split.label.toLowerCase().includes('want')) icon = <ShoppingCart size={16} color="black" />;
            if (split.label.toLowerCase().includes('emergency')) icon = <ShieldCheck size={16} color="black" />;
            if (split.label.toLowerCase().includes('invest')) icon = <TrendingUp size={16} color="black" />;

            const colors = {
                blue: 'bg-[#33a1fd]',
                pink: 'bg-[#ff90e8]',
                amber: 'bg-[#fbe334]',
                emerald: 'bg-[#00e699]',
                slate: 'bg-slate-200'
            };

            return (
              <BreakdownCard 
                key={split.id || index}
                icon={icon}
                label={split.label}
                amount={split.amount * factor}
                color={colors[split.color] || colors.blue}
                subtext={split.subtext}
              />
            );
          })}
        </div>

        {/* Disclaimer for Estimated SSS */}
        <div className="flex items-center gap-2 p-2 bg-slate-50 border border-black/10">
            <AlertCircle size={10} className="text-black/40" />
            <p className="text-[9px] font-bold text-black/50 uppercase tracking-widest">
                Contribution math is based on 2025 SSS/PH/PI tables. 
                Exact monthly withholding may vary per employer schedule.
            </p>
        </div>

        {/* 3. Final Net Take Home Summary */}
        <div className="bg-[#fbe334] neo-border p-5 md:p-12 text-center neo-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-black opacity-5 translate-x-10 -translate-y-10 rotate-45"></div>
          
          <p className="text-[8px] md:text-xs font-black uppercase tracking-[0.2em] md:tracking-[0.4em] mb-3 md:mb-4 text-black italic">
            {isSemiMonthly ? 'Expected Half Month Pay' : 'Full Month Net Take Home'}
          </p>
          <h2 className="text-2xl sm:text-4xl md:text-7xl lg:text-8xl font-black text-black tracking-tighter mb-4 md:mb-8 italic leading-none break-all">
            ₱{(data.net * factor).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          
          {/* Divider Line */}
          <div className="border-t-2 md:border-t-4 border-black w-full mb-4"></div>
          
          {/* Breakdown Title */}
          <div className="flex justify-center mb-6">
            <span className="text-[8px] md:text-[10px] font-black uppercase bg-black text-[#fbe334] px-3 py-1 tracking-[0.2em]">
                {isSemiMonthly ? 'Payday Cut' : 'Full Month Cuts'}
            </span>
          </div>
          
          {/* Breakdown of Deductions */}
          <div className="grid grid-cols-2 sm:flex sm:flex-wrap justify-center gap-x-4 md:gap-x-12 gap-y-6 md:gap-y-8">
              {(data.breakdown || []).map((item, index) => {
                  const isTax = item.label.toLowerCase().includes('tax');
                  return (
                    <div key={index} className="text-center group">
                        <p className="text-[7px] md:text-[10px] text-black uppercase font-black tracking-widest mb-1 flex items-center justify-center gap-1">
                            {item.label}
                            {isSemiMonthly && isTax && (
                                <span className="text-[6px] md:text-[8px] px-1 bg-black text-white font-black">
                                    1/2
                                </span>
                            )}
                        </p>
                        <p className="text-[10px] md:text-lg text-black font-black font-mono">₱{(item.amount * factor).toFixed(0)}</p>
                    </div>
                  );
              })}
          </div>
        </div>
      </div>

      {/* 4. Bonus Insight Card */}
      <div className="bg-white neo-card p-6 md:p-8 border-l-[12px] border-l-[#00e699]">
        <div className="flex items-center gap-4 mb-4">
            <PlusCircle size={32} className="text-[#00e699]" />
            <h3 className="text-lg md:text-xl font-black uppercase tracking-tighter italic">13th Month Insight</h3>
        </div>
        <p className="text-xs md:text-sm font-bold text-black opacity-70 mb-6 leading-relaxed">
            Your estimated Christmas bonus is <span className="underline decoration-4 decoration-[#fbe334]">₱{thirteenthMonth.toLocaleString()}</span> (based on est. basic pay). 
            Under PH law, bonuses up to ₱90,000 are <span className="bg-[#00e699] px-1">tax-exempt</span>. 
            {taxableThirteenth > 0 ? ` ₱${taxableThirteenth.toLocaleString()} of your bonus will be taxable at your estimated marginal rate of ${(marginalRate * 100).toFixed(1)}%.` : " Your entire bonus should be tax-free!"}
        </p>
        <div className="flex items-center gap-3 bg-[#fafafa] p-4 neo-border">
            <div className="p-2 bg-black text-white text-[10px] font-black uppercase">Result</div>
            <p className="text-xs font-black uppercase tracking-tight">Est. Net Bonus: ₱{netThirteenth.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default ResultsDashboard;