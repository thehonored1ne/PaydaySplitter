import { Trash2, PlusCircle } from 'lucide-react';

const SplitControls = ({ splits, setSplits }) => {
  const updateSplit = (id, field, value) => {
    setSplits(splits.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addSplit = () => {
    const newId = splits.length > 0 ? Math.max(...splits.map(s => s.id)) + 1 : 1;
    setSplits([...splits, { 
      id: newId, 
      label: 'New Split', 
      rate: 0, 
      subtext: 'Description here', 
      color: 'slate' 
    }]);
  };

  const removeSplit = (id) => {
    if (splits.length > 1) {
      setSplits(splits.filter(s => s.id !== id));
    }
  };

  const total = splits.reduce((acc, curr) => acc + curr.rate, 0);

  return (
    <section className="neo-card p-4 md:p-8 bg-white">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6 md:mb-10">
        <div>
          <h3 className="text-sm md:text-xl font-black uppercase tracking-tighter">Budget Splits</h3>
          <p className="text-[8px] md:text-[10px] font-bold text-black uppercase tracking-widest mt-1 opacity-70">Define your future</p>
        </div>
        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 shrink-0">
          <span className={`text-[9px] md:text-sm font-black px-2 md:px-3 py-1 neo-border ${total === 100 ? 'bg-[#00e699]' : 'bg-[#ff4d4d]'}`}>
             {total}% Total
          </span>
          {total !== 100 && <span className="text-[7px] font-black text-red-600 uppercase">100% req.</span>}
        </div>
      </div>

      <div className="space-y-6 md:space-y-8">
        {splits.map((split) => (
          <div key={split.id} className="space-y-3 md:space-y-4">
            <div className="flex gap-2 md:gap-4 items-center">
              <input 
                value={split.label}
                onChange={(e) => updateSplit(split.id, 'label', e.target.value)}
                className="bg-transparent text-xs md:text-lg font-black uppercase tracking-tighter outline-none focus:bg-[#fbe334] px-1 w-full"
                placeholder="Split Label"
              />
              <div className="flex items-center gap-2 md:gap-4 ml-auto shrink-0">
                <span className="font-black text-sm md:text-xl">{split.rate}%</span>
                <button 
                  onClick={() => removeSplit(split.id)}
                  className="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center neo-border bg-[#ff4d4d] hover:translate-y-[-1px] transition-all"
                >
                  <Trash2 size={12} md:size={16} color="white" />
                </button>
              </div>
            </div>
            
            <input 
              type="range"
              min="0"
              max="100"
              value={split.rate}
              onChange={(e) => updateSplit(split.id, 'rate', Number(e.target.value))}
              className="w-full h-6 md:h-8 cursor-pointer accent-black"
            />

            <input 
                value={split.subtext}
                onChange={(e) => updateSplit(split.id, 'subtext', e.target.value)}
                className="bg-[#fafafa] neo-border p-1 md:p-2 text-[8px] md:text-[10px] font-bold uppercase tracking-wider outline-none w-full"
                placeholder="Short description..."
              />
          </div>
        ))}

        <button 
          onClick={addSplit}
          className="neo-button w-full justify-center bg-[#33a1fd] text-xs py-2"
        >
          <PlusCircle size={14} />
          Add More Split
        </button>
      </div>
    </section>
  );
};

export default SplitControls;