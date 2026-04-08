import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const BudgetDonut = ({ data }) => {
  // Focus only on the splits (Net Pay breakdown)
  const chartData = data.splits.map(s => ({
    name: s.label,
    value: s.amount,
    color: getColor(s.color || 'blue'),
    percent: s.rate
  }));

  function getColor(colorName) {
    const colors = {
      blue: '#33a1fd',
      pink: '#ff90e8',
      amber: '#fbe334',
      emerald: '#00e699',
      slate: '#64748b'
    };
    return colors[colorName] || colors.blue;
  }

  return (
    <div className="h-72 md:h-96 w-full flex flex-col lg:flex-row items-center justify-center gap-8 relative">
      <div className="flex-1 w-full h-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius="60%"
              outerRadius="95%"
              paddingAngle={4}
              dataKey="value"
              stroke="#000"
              strokeWidth={3}
              animationDuration={800}
              label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
                const RADIAN = Math.PI / 180;
                const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                const x = cx + radius * Math.cos(-midAngle * RADIAN);
                const y = cy + radius * Math.sin(-midAngle * RADIAN);
                if (percent < 0.05) return null;
                return (
                  <text x={x} y={y} fill="black" textAnchor="middle" dominantBaseline="central" className="text-[12px] md:text-sm font-black italic font-mono">
                    {`${(percent).toFixed(0)}%`}
                  </text>
                );
              }}
              labelLine={false}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '3px solid #000', 
                  borderRadius: '0px',
                  fontSize: '14px',
                  fontWeight: '900',
                  boxShadow: '4px 4px 0px 0px #000'
              }}
              itemStyle={{ color: '#000' }}
              formatter={(value, name) => [`₱${Math.round(value).toLocaleString()}`, name]}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Text (Absolute Positioned) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none w-full">
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] text-black/50">Take Home</p>
            <p className="text-sm md:text-xl font-black text-black">₱{(data.net || 0).toLocaleString()}</p>
        </div>
      </div>
      
      {/* Legend */}
      <div className="flex lg:flex-col flex-wrap justify-center gap-x-6 gap-y-2 lg:gap-3 lg:pr-8 min-w-[120px]">
        {chartData.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 neo-border" style={{ backgroundColor: item.color }}></div>
                <span className="text-[9px] md:text-[11px] font-black text-black uppercase tracking-widest leading-none">{item.name}</span>
            </div>
        ))}
      </div>
    </div>
  );
};

export default BudgetDonut;
