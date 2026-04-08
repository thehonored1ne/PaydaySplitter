import React from 'react';

const BreakdownCard = ({ icon, label, amount, color, subtext }) => {
  return (
    <div className={`p-4 md:p-6 neo-card ${color}`}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          {/* Icon Container */}
          <div className="p-2 md:p-3 bg-white neo-border neo-shadow shrink-0">
            {icon}
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-xs md:text-lg font-black text-black tracking-tighter uppercase leading-tight break-all">
              {label}
            </h3>
            <p className="text-[7px] md:text-[10px] text-black font-black uppercase tracking-widest mt-1 opacity-60 break-all leading-tight">
              {subtext}
            </p>
          </div>
        </div>

        {/* Amount */}
        <div className="text-right shrink-0">
          <span className="text-sm md:text-2xl font-black text-black tracking-tighter italic">
            ₱{(amount || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BreakdownCard;