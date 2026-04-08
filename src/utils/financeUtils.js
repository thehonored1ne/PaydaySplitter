// Revised Finance Engine for Philippine Payroll
export const calculateBIRTax = (taxableIncome) => {
    // BIR Revised Withholding Tax Table (TRAIN Law 2023-Present)
    if (taxableIncome <= 20833) return 0;
    if (taxableIncome <= 33333) return (taxableIncome - 20833) * 0.15;
    if (taxableIncome <= 66667) return 1875 + (taxableIncome - 33333) * 0.20;
    if (taxableIncome <= 166667) return 8542 + (taxableIncome - 66667) * 0.25;
    if (taxableIncome <= 666667) return 33542 + (taxableIncome - 166667) * 0.30;
    return 183542 + (taxableIncome - 666667) * 0.35;
};

export const getSmartDeduction = (label, gross) => {
    const cleanLabel = label.toLowerCase();
    if (cleanLabel.includes('sss')) {
        const msc = Math.min(30000, Math.max(5000, Math.ceil(gross / 500) * 500));
        return msc * 0.045;
    }
    if (cleanLabel.includes('philhealth') || cleanLabel.includes('ph')) {
        const basis = Math.min(100000, Math.max(10000, gross));
        return basis * 0.025;
    }
    if (cleanLabel.includes('pagibig') || cleanLabel.includes('pi') || cleanLabel.includes('pag-ibig')) {
        return Math.min(10000, gross) * 0.02;
    }
    return 0;
};

export const calculateNetPay = (gross, splits = [], deductions = []) => {
  const breakdown = deductions.map(d => ({
    label: d.label,
    amount: d.isSmart ? getSmartDeduction(d.label, gross) : (d.isPercentage ? (gross * (d.rate / 100)) : d.rate),
    isSmart: d.isSmart
  }));

  const incomeTax = calculateBIRTax(gross);
  const totalStatutory = breakdown.reduce((acc, curr) => acc + curr.amount, 0);
  const net = Math.max(0, gross - totalStatutory - incomeTax);

  // Calculate the actual Peso amounts for each budget split
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