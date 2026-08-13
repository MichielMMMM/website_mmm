export const pricingConfig = {
  kapitaalPerFactor: 8500,
  prijsFactor1: 30,
  prijsFactor2: 40,
  prijsFactor3: 50,
  toeslagVanafFactor4: 15,
  kennismakingskortingPercentage: 50,
  maximaalAantalFactorenCalculator: 20,
} as const;

export function formatCurrency(value: number): string {
  const rounded = Number(value.toFixed(2));
  const formatted = rounded.toLocaleString("nl-NL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });

  const [whole, fraction] = formatted.split(",");
  const wholeWithDots = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  if (fraction && fraction !== "00") {
    return `€${wholeWithDots},${fraction}`;
  }

  return `€${wholeWithDots}`;
};

export function getRegularMonthlyRate(factorCount: number): number {
  if (factorCount <= 1) return pricingConfig.prijsFactor1;
  if (factorCount === 2) return pricingConfig.prijsFactor2;
  if (factorCount === 3) return pricingConfig.prijsFactor3;

  return pricingConfig.prijsFactor3 + (factorCount - 3) * pricingConfig.toeslagVanafFactor4;
}

export function getRequiredCapital(factorCount: number): number {
  return factorCount * pricingConfig.kapitaalPerFactor;
}

export function getPricingForFactors(factorCount: number) {
  const safeFactorCount = Math.max(1, Math.min(factorCount, pricingConfig.maximaalAantalFactorenCalculator));
  const regularMonthlyRate = getRegularMonthlyRate(safeFactorCount);
  const firstMonthRate = regularMonthlyRate * (pricingConfig.kennismakingskortingPercentage / 100);
  const annualRate = regularMonthlyRate * 12;

  return {
    factorCount: safeFactorCount,
    requiredCapital: getRequiredCapital(safeFactorCount),
    regularMonthlyRate,
    firstMonthRate,
    annualRate,
  };
}
