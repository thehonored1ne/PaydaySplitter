import React, { useState, useEffect } from 'react';

const PaydayForm = ({ onSalaryChange, isSemiMonthly }) => {
    const [inputValue, setInputValue] = useState('');

    // Handle value internally and report monthly equivalent to parent
    const handleInputChange = (e) => {
        const value = e.target.value.replace(/[^0-9.]/g, '');
        setInputValue(value);

        const numValue = parseFloat(value) || 0;
        // If we're in semi-monthly mode, the monthly total is value * 2
        const totalMonthly = isSemiMonthly ? numValue * 2 : numValue;
        onSalaryChange(totalMonthly);
    };

    // Re-calculate monthly total if mode switches but input stays the same
    useEffect(() => {
        const numValue = parseFloat(inputValue) || 0;
        const totalMonthly = isSemiMonthly ? numValue * 2 : numValue;
        onSalaryChange(totalMonthly);
    }, [isSemiMonthly, onSalaryChange]);

    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <label className="text-[10px] md:text-sm font-black text-black uppercase tracking-widest block">
                    {isSemiMonthly ? 'Half Month Gross Pay' : 'Full Month Gross Pay'}
                </label>

                <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl md:text-4xl font-black text-black pointer-events-none">
                        ₱
                    </div>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="0.00"
                        className="w-full bg-white border-[3px] border-black p-6 pl-16 text-2xl md:text-5xl font-black focus:outline-none focus:bg-slate-50 transition-colors placeholder:text-black/10"
                    />
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-[9px] font-bold text-black opacity-40 uppercase tracking-tighter italic">
                        {isSemiMonthly
                            ? "* We will double this to calculate your monthly taxes correctly."
                            : "* Enter your total basic pay before any deductions."}
                    </p>
                    {isSemiMonthly && inputValue > 0 && (
                        <span className="text-[9px] font-black bg-black text-[#fbe334] px-2 py-1 uppercase">
                            Monthly Total: ₱{(parseFloat(inputValue) * 2).toLocaleString()}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaydayForm;