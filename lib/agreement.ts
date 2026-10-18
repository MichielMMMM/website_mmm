export const agreement = {
  id: "copy-trading-v1-2026-10-18",
  name: "Copy Trading Raamovereenkomst MakeMoreMoney",
  version: "1",
  date: "18-10-2026",
  documentPath: "/documenten/copy-trading-raamovereenkomst-makemoremoney-v1.pdf",
  consentText:
    "Ik heb de Copy Trading Raamovereenkomst MakeMoreMoney, versie 1 van 18-10-2026, gelezen en ga hiermee akkoord.",
} as const;

export const subscriptionStrategy = "Premie Collector Plus – volgsysteem";
export const subscriptionVersion = "existing-customers-2026-10-18-v1";
export const subscriptions = [
  { positions: 1, capital: 8500, monthly: 25, quarterly: 75 },
  { positions: 2, capital: 17000, monthly: 40, quarterly: 120 },
  { positions: 3, capital: 25500, monthly: 50, quarterly: 150 },
  { positions: 4, capital: 34000, monthly: 65, quarterly: 195 },
  { positions: 5, capital: 42500, monthly: 80, quarterly: 240 },
  { positions: 6, capital: 51000, monthly: 95, quarterly: 285 },
  { positions: 7, capital: 59500, monthly: 110, quarterly: 330 },
  { positions: 8, capital: 68000, monthly: 125, quarterly: 375 },
  { positions: 9, capital: 76500, monthly: 140, quarterly: 420 },
  { positions: 10, capital: 85000, monthly: 155, quarterly: 465 },
  { positions: 11, capital: 93500, monthly: 170, quarterly: 510 },
  { positions: 12, capital: 102000, monthly: 185, quarterly: 555 },
  { positions: 13, capital: 110500, monthly: 200, quarterly: 600 },
  { positions: 14, capital: 119000, monthly: 215, quarterly: 645 },
  { positions: 15, capital: 127500, monthly: 230, quarterly: 690 },
  { positions: 16, capital: 136000, monthly: 245, quarterly: 735 },
  { positions: 17, capital: 144500, monthly: 260, quarterly: 780 },
  { positions: 18, capital: 153000, monthly: 275, quarterly: 825 },
  { positions: 19, capital: 161500, monthly: 290, quarterly: 870 },
  { positions: 20, capital: 170000, monthly: 305, quarterly: 915 },
] as const;

export type Subscription = (typeof subscriptions)[number];

export function formatSubscriptionAmount(amount: number) {
  return `€ ${amount.toLocaleString("nl-NL", { maximumFractionDigits: 0 })}`;
}

export function positionLabel(positions: number) {
  return `${positions} ${positions === 1 ? "positie" : "posities"}`;
}

export function subscriptionConsent(subscription: Subscription) {
  return `Ik bevestig dat ${subscriptionStrategy} en het gekozen abonnement van ${positionLabel(subscription.positions)}, tegen ${formatSubscriptionAmount(subscription.monthly)} per maand en ${formatSubscriptionAmount(subscription.quarterly)} per drie maanden, overeenkomen met de dienstverlening waarvan ik gebruik wil maken.`;
}

export type AgreementInput = {
  fullName: string;
  email: string;
  accountNumber: string;
  strategy: string;
  positions: number;
  capital: number;
  monthly: number;
  quarterly: number;
  accepted: boolean;
  subscriptionAccepted: boolean;
  subscriptionConsentText: string;
  subscriptionVersion: string;
  agreementId: string;
};

export function validateAgreement(value: unknown):
  | { valid: true; data: AgreementInput }
  | { valid: false; message: string } {
  if (typeof value !== "object" || value === null) {
    return { valid: false, message: "Controleer uw gegevens en probeer opnieuw." };
  }

  if (!("accepted" in value) || value.accepted !== true) {
    return { valid: false, message: "U moet de overeenkomst expliciet accepteren." };
  }

  if (!("subscriptionAccepted" in value) || value.subscriptionAccepted !== true) {
    return { valid: false, message: "U moet uw abonnementskeuze expliciet bevestigen." };
  }

  if (!("agreementId" in value) || value.agreementId !== agreement.id) {
    return { valid: false, message: "De overeenkomst is gewijzigd. Vernieuw de pagina en lees de huidige versie." };
  }

  if (!("fullName" in value) || typeof value.fullName !== "string") {
    return { valid: false, message: "Vul uw volledige naam in." };
  }
  const fullName = value.fullName.trim();
  if (fullName.length < 2 || fullName.length > 200 || /[\u0000-\u001f\u007f]/.test(fullName)) {
    return { valid: false, message: "Vul een volledige naam van 2 tot en met 200 tekens in, zonder besturingstekens." };
  }

  if (!("accountNumber" in value) || typeof value.accountNumber !== "string" ||
      !/^U[0-9]{2,31}$/.test(value.accountNumber.trim())) {
    return { valid: false, message: "Vul een MEXEM-rekeningnummer in dat begint met een hoofdletter U, gevolgd door alleen cijfers (3 tot en met 32 tekens)." };
  }

  if (!("email" in value) || typeof value.email !== "string" ||
      value.email.trim().length > 254 ||
      !/^[^\s@<>\u0000-\u001f\u007f]+@[^\s@<>\u0000-\u001f\u007f]+\.[^\s@<>\u0000-\u001f\u007f]+$/.test(value.email.trim())) {
    return { valid: false, message: "Vul een geldig e-mailadres in." };
  }
  if (!("strategy" in value) || value.strategy !== subscriptionStrategy) {
    return { valid: false, message: "De strategie is niet geldig. Vernieuw de pagina." };
  }
  const subscription = "positions" in value
    ? subscriptions.find((item) => item.positions === value.positions)
    : undefined;
  if (!subscription) {
    return { valid: false, message: "Kies een aantal posities van 1 tot en met 20." };
  }
  if (!("capital" in value) || value.capital !== subscription.capital ||
      !("monthly" in value) || value.monthly !== subscription.monthly ||
      !("quarterly" in value) || value.quarterly !== subscription.quarterly ||
      !("subscriptionVersion" in value) || value.subscriptionVersion !== subscriptionVersion ||
      !("subscriptionConsentText" in value) || value.subscriptionConsentText !== subscriptionConsent(subscription)) {
    return { valid: false, message: "De abonnementsgegevens zijn gewijzigd of ongeldig. Vernieuw de pagina en bevestig uw keuze opnieuw." };
  }

  return {
    valid: true,
    data: {
      fullName,
      email: value.email.trim(),
      accountNumber: value.accountNumber.trim(),
      strategy: subscriptionStrategy,
      ...subscription,
      accepted: true,
      subscriptionAccepted: true,
      subscriptionConsentText: subscriptionConsent(subscription),
      subscriptionVersion,
      agreementId: agreement.id,
    },
  };
}
