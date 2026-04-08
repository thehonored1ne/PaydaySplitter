// High-Precision Finance Engine for Philippine Payroll (2025 Standards)
export const calculateBIRTax = (taxableIncome) => {
    // BIR Revised Withholding Tax Table (TRAIN Law 2023-Present)
    // Values are Monthly thresholds
    if (taxableIncome <= 20833) return 0;
    if (taxableIncome <= 33332.99) return (taxableIncome - 20833) * 0.15;
    if (taxableIncome <= 66666.99) return 1875 + (taxableIncome - 33333) * 0.20;
    if (taxableIncome <= 166666.99) return 8541.67 + (taxableIncome - 66667) * 0.25;
    if (taxableIncome <= 666666.99) return 33541.67 + (taxableIncome - 166667) * 0.30;
    return 183541.67 + (taxableIncome - 666667) * 0.35;
};

export const getSmartDeduction = (label, gross) => {
    const cleanLabel = label.toLowerCase();
    
    if (cleanLabel.includes('sss')) {
        // Official 2025 SSS Table Logic
        // MSC floor (5,000) and ceiling (30,000). Brackets are 500 wide.
        let msc = 0;
        if (gross < 5250) {
            msc = 5000;
        } else if (gross >= 29750) {
            msc = 30000;
        } else {
            // Formula to find the center MSC of the current 500-peso bracket
            msc = (Math.floor((gross - 4750) / 500) * 500) + 5000;
        }
        // EE Share is 4.5% of MSC
        return msc * 0.045;
    }
    
    if (cleanLabel.includes('philhealth') || cleanLabel.includes('ph')) {
        // 2025: 5% Total Rate, 2.5% Employee Share (Min 10k, Max 100k)
        const basis = Math.min(100000, Math.max(10000, gross));
        return basis * 0.025;
    }
    
    if (cleanLabel.includes('pagibig') || cleanLabel.includes('pi') || cleanLabel.includes('pag-ibig')) {
        // 2024/2025 Table: 2% of Salary Basis (max 10,000 basis = ₱200 EE share)
        return Math.min(10000, gross) * 0.02;
    }
    
    return 0;
};

export const calculateNetPay = (gross, splits = [], deductions = []) => {
  // 1. Calculate Statutory Cuts First
  const breakdown = deductions.map(d => ({
    label: d.label,
    amount: d.isSmart ? getSmartDeduction(d.label, gross) : (d.isPercentage ? (gross * (d.rate / 100)) : d.rate),
    isSmart: d.isSmart
  }));

  const totalStatutory = breakdown.reduce((acc, curr) => acc + curr.amount, 0);
  
  // 2. Define Taxable Income (Standard PH Rule: Gross - Statutory Contributions)
  // Most companies subtract SSS/PH/PI from the gross BEFORE calculating BIR tax.
  const taxableIncome = Math.max(0, gross - totalStatutory);
  const incomeTax = calculateBIRTax(taxableIncome);

  // 3. Final Net
  const net = Math.max(0, gross - totalStatutory - incomeTax);

  const calculatedSplits = splits.map(s => ({
    ...s,
    amount: net * (s.rate / 100)
  }));

  const fullBreakdown = [
    ...breakdown,
    { label: 'Income Tax', amount: incomeTax, isSmart: true }
  ];

  return {
    gross,
    net,
    incomeTax,
    totalDeductions: totalStatutory + incomeTax,
    breakdown: fullBreakdown,
    splits: calculatedSplits
  };
};