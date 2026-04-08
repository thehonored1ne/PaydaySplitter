import React from 'react';
import { Trash2, Plus, Zap } from 'lucide-react';

const DeductionSettings = ({ rates, setRates }) => {
    const addDeduction = () => {
        const newId = rates.length > 0 ? Math.max(...rates.map(r => r.id)) + 1 : 1;
        setRates([...rates, { id: newId, label: 'New Cut', rate: 0, isPercentage: false, isSmart: false }]);
    };

    const removeDeduction = (id) => {
        setRates(rates.filter(r => r.id !== id));
    };

    const updateDeduction = (id, field, value) => {
        setRates(rates.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    return (
        <div className="bg-white neo-card p-4 md:p-8 space-y-6 md:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-xl md:text-2xl font-black uppercase tracking-tighter italic">Gov't & Other Cuts</h3>
                <button
                    onClick={addDeduction}
                    className="neo-button !bg-[#fbe334] text-[10px] py-2 px-4 flex items-center gap-2"
                >
                    <Plus size={16} /> Add New
                </button>
            </div>

            <div className="space-y-8">
                {rates.map((deduction) => (
                    <div key={deduction.id} className="group border-b-2 border-black/5 pb-6 md:pb-8 last:border-0 last:pb-0">
                        <div className="flex flex-col md:flex-row items-end gap-6">

                            {/* Left Column: Label & Amount Inputs */}
                            <div className="flex-1 space-y-4 w-full">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-black/40 tracking-widest leading-none">Deduction Label</label>
                                    <input
                                        type="text"
                                        value={deduction.label}
                                        onChange={(e) => updateDeduction(deduction.id, 'label', e.target.value)}
                                        className="w-full bg-transparent border-b-2 border-black/20 focus:border-black text-sm md:text-base font-black uppercase transition-colors py-1 focus:outline-none"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-black/40 tracking-widest leading-none">Amount</label>
                                    <input
                                        type="number"
                                        value={deduction.rate}
                                        disabled={deduction.isSmart}
                                        onChange={(e) => updateDeduction(deduction.id, 'rate', parseFloat(e.target.value) || 0)}
                                        className={`w-full bg-transparent border-b-2 border-black/20 focus:border-black text-sm md:text-base font-black transition-colors py-1 focus:outline-none ${deduction.isSmart ? 'opacity-30 cursor-not-allowed' : ''}`}
                                    />
                                </div>
                            </div>

                            {/* Right Column: Balanced Rectangular Buttons Stacked */}
                            <div className="flex flex-col gap-2 justify-end w-full md:w-32">
                                {/* Type Toggle Button */}
                                <button
                                    onClick={() => updateDeduction(deduction.id, 'isPercentage', !deduction.isPercentage)}
                                    className={`h-11 md:h-12 text-xs md:text-sm font-black px-3 py-2 neo-border transition-all flex items-center justify-center leading-none ${deduction.isPercentage ? 'bg-black text-white' : 'bg-white text-black'}`}
                                >
                                    {deduction.isPercentage ? 'PERCENTAGE %' : 'PESO ₱'}
                                </button>

                                {/* Delete Button */}
                                <button
                                    onClick={() => removeDeduction(deduction.id)}
                                    className="neo-button !bg-[#ff4d4d] h-11 md:h-12 w-full flex items-center justify-center hover:bg-black group transition-colors !p-0"
                                    title="Remove"
                                >
                                    <Trash2 size={20} color="white" />
                                </button>
                            </div>
                        </div>

                        {/* Smart / Auto-Calc Toggle (Footer) */}
                        <div className="mt-4 flex flex-wrap items-center gap-3">
                            <button
                                onClick={() => updateDeduction(deduction.id, 'isSmart', !deduction.isSmart)}
                                className={`flex items-center gap-1.5 px-3 py-2 neo-border text-[10px] font-black uppercase transition-all ${deduction.isSmart
                                        ? 'bg-[#fbe334] text-black shadow-[2px_2px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5'
                                        : 'bg-white text-black/30 hover:text-black'
                                    }`}
                            >
                                <Zap size={14} fill={deduction.isSmart ? "black" : "none"} />
                                {deduction.isSmart ? 'Auto-Calc On' : 'Manual Mode'}
                            </button>
                            {deduction.isSmart && (
                                <span className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest italic animate-pulse ${['sss', 'philhealth', 'ph', 'pagibig', 'pi', 'pag-ibig'].some(kw => deduction.label.toLowerCase().includes(kw))
                                        ? 'text-black opacity-30'
                                        : 'text-[#ff4d4d] opacity-100'
                                    }`}>
                                    {['sss', 'philhealth', 'ph', 'pagibig', 'pi', 'pag-ibig'].some(kw => deduction.label.toLowerCase().includes(kw))
                                        ? '* Syncing with PH statutory tables'
                                        : '⚠️ Label not recognized. Switching to ₱0. Use Manual Mode.'
                                    }
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeductionSettings;