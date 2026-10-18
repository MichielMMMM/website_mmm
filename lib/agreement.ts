export const agreement = {
  id: "copy-trading-v1.0-2026-09-01-consent-v2",
  name: "Copy Trading Raamovereenkomst MakeMoreMoney",
  version: "1.0",
  date: "01-09-2026",
  documentPath: "/documenten/copy-trading-raamovereenkomst-makemoremoney-v1.0.pdf",
  consentText:
    "Ik heb de Copy Trading Raamovereenkomst MakeMoreMoney gelezen en ga hiermee akkoord.",
} as const;

export const generalTerms = {
  id: "general-terms-v1.0-2026-09-01",
  name: "Algemene Voorwaarden MakeMoreMoney",
  version: "1.0",
  date: "1-9-2026",
  path: "/algemene-voorwaarden",
  consentText: "Ik heb de Algemene Voorwaarden MakeMoreMoney gelezen en ga hiermee akkoord.",
} as const;

export const subscriptionStrategy = "Premie Collector Plus – volgsysteem";
export const subscriptionVersion = "existing-customers-2026-10-18-v2";
export const subscriptionTerms = "Het abonnement wordt per drie maanden vooruitbetaald en daarna telkens automatisch met drie maanden verlengd. Opzeggen kan tot uiterlijk één maand vóór de eerstvolgende verlengingsdatum.";
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
  return `Ik bevestig mijn keuze voor ${subscriptionStrategy} met ${positionLabel(subscription.positions)} tegen ${formatSubscriptionAmount(subscription.monthly)} per maand (${formatSubscriptionAmount(subscription.quarterly)} per drie maanden). Het abonnement wordt voor drie maanden aangegaan en vooraf betaald, wordt daarna telkens automatisch met drie maanden verlengd en kan worden opgezegd tot uiterlijk één maand vóór de eerstvolgende verlengingsdatum.`;
}

export function normalizePostcode(value: string) {
  const compact = value.replace(/\s/g, "").toUpperCase();
  return /^[1-9][0-9]{3}[A-Z]{2}$/.test(compact)
    ? `${compact.slice(0, 4)} ${compact.slice(4)}` : value.trim().toUpperCase();
}

export function confirmationPrefix(lastName: string) {
  return Array.from(lastName.normalize("NFKD").replace(/\p{M}/gu, "")
    .toUpperCase().replace(/[^\p{L}]/gu, "")).slice(0, 4).join("");
}

export function isConfirmationNumber(value: string) {
  return /^(?:\p{L}{1,4}[0-9]*|RUITAB)-[0-9]{4}-[0-9]{3,}$/u.test(value);
}

export function formatAgreementTime(timestamp: string) {
  const parts = new Intl.DateTimeFormat("nl-NL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23", timeZone: "Europe/Amsterdam",
  }).formatToParts(new Date(timestamp));
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value;
  return `${get("day")}-${get("month")}-${get("year")} om ${get("hour")}:${get("minute")}`;
}

export type AgreementInput = {
  salutation: "heer" | "mevrouw" | "neutraal";
  initials: string;
  firstName: string;
  lastName: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  postcode: string;
  houseNumber: string;
  houseNumberAddition: string;
  street: string;
  city: string;
  country: string;
  notes: string;
  strategy: string;
  positions: number;
  capital: number;
  monthly: number;
  quarterly: number;
  accepted: boolean;
  generalTermsAccepted: boolean;
  generalTermsId: string;
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

  const salutation = "salutation" in value ? value.salutation : "neutraal";
  if (salutation !== "heer" && salutation !== "mevrouw" && salutation !== "neutraal") {
    return { valid: false, message: "Kies een geldige aanhef." };
  }

  if (!("accepted" in value) || value.accepted !== true) {
    return { valid: false, message: "U moet de overeenkomst expliciet accepteren." };
  }

  if (!("subscriptionAccepted" in value) || value.subscriptionAccepted !== true) {
    return { valid: false, message: "U moet uw abonnementskeuze expliciet bevestigen." };
  }

  if (!("generalTermsAccepted" in value) || value.generalTermsAccepted !== true) {
    return { valid: false, message: "U moet de algemene voorwaarden expliciet accepteren." };
  }
  if (!("generalTermsId" in value) || value.generalTermsId !== generalTerms.id) {
    return { valid: false, message: "De algemene voorwaarden zijn gewijzigd. Vernieuw de pagina en lees de huidige versie." };
  }

  if (!("agreementId" in value) || value.agreementId !== agreement.id) {
    return { valid: false, message: "De overeenkomst is gewijzigd. Vernieuw de pagina en lees de huidige versie." };
  }

  const billingFields = [
    ["initials", "voorletters", false, 30],
    ["firstName", "voornaam", true, 80],
    ["lastName", "achternaam", true, 80],
    ["companyName", "bedrijfsnaam", false, 200],
    ["phone", "telefoonnummer", false, 40],
    ["postcode", "postcode", true, 20],
    ["houseNumber", "huisnummer", true, 10],
    ["houseNumberAddition", "huisnummertoevoeging", false, 20],
    ["street", "straat", true, 150],
    ["city", "woonplaats", true, 100],
    ["country", "land", true, 80],
  ] as const;
  for (const [key, label, required, max] of billingFields) {
    const field = key in value ? value[key as keyof typeof value] : undefined;
    if (typeof field !== "string" || (required && !field.trim()) ||
        field.trim().length > max || /[\u0000-\u001f\u007f]/.test(field)) {
      return { valid: false, message: `Controleer het veld ${label} (maximaal ${max} tekens).` };
    }
  }
  // The field loop validates unknown input; explicit guards retain narrowed types.
  if (!("initials" in value) || typeof value.initials !== "string" ||
      !("firstName" in value) || typeof value.firstName !== "string" ||
      !("lastName" in value) || typeof value.lastName !== "string" ||
      !("companyName" in value) || typeof value.companyName !== "string" ||
      !("phone" in value) || typeof value.phone !== "string" ||
      !("postcode" in value) || typeof value.postcode !== "string" ||
      !("houseNumber" in value) || typeof value.houseNumber !== "string" ||
      !("houseNumberAddition" in value) || typeof value.houseNumberAddition !== "string" ||
      !("street" in value) || typeof value.street !== "string" ||
      !("city" in value) || typeof value.city !== "string" ||
      !("country" in value) || typeof value.country !== "string") {
    return { valid: false, message: "Controleer uw persoonlijke gegevens en factuuradres." };
  }
  const initials = value.initials.trim().replace(/\s+/g, " ");
  const firstName = value.firstName.trim().replace(/\s+/g, " ");
  const lastName = value.lastName.trim().replace(/\s+/g, " ");
  if (!confirmationPrefix(lastName)) {
    return { valid: false, message: "Vul een achternaam met letters in." };
  }
  const fullName = [initials, firstName, lastName].filter(Boolean).join(" ");
  const country = value.country.trim();
  const dutch = country.toLowerCase() === "nederland";
  const postcode = dutch ? normalizePostcode(value.postcode) : value.postcode.trim();
  if (dutch && !/^[1-9][0-9]{3} [A-Z]{2}$/.test(postcode)) {
    return { valid: false, message: "Vul een Nederlandse postcode in, bijvoorbeeld 1234 AB." };
  }
  if (!/^[1-9][0-9]{0,9}$/.test(value.houseNumber.trim())) {
    return { valid: false, message: "Vul een huisnummer in met alleen cijfers. Gebruik het aparte veld voor een toevoeging." };
  }
  if (value.phone.trim() && (!/^\+?[0-9 ()\-.]{5,40}$/.test(value.phone.trim()) ||
      value.phone.replace(/[^0-9]/g, "").length < 5)) {
    return { valid: false, message: "Vul een geldig telefoonnummer in of laat dit veld leeg." };
  }
  if (!("notes" in value) || typeof value.notes !== "string" || value.notes.length > 2000 ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value.notes)) {
    return { valid: false, message: "Gebruik maximaal 2000 tekens voor uw opmerkingen, zonder besturingstekens." };
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
      salutation,
      fullName,
      initials,
      firstName,
      lastName,
      companyName: value.companyName.trim(),
      phone: value.phone.trim(),
      postcode,
      houseNumber: value.houseNumber.trim(),
      houseNumberAddition: value.houseNumberAddition.trim(),
      street: value.street.trim(),
      city: value.city.trim(),
      country,
      notes: value.notes.trim(),
      email: value.email.trim(),
      strategy: subscriptionStrategy,
      ...subscription,
      accepted: true,
      generalTermsAccepted: true,
      generalTermsId: generalTerms.id,
      subscriptionAccepted: true,
      subscriptionConsentText: value.subscriptionConsentText,
      subscriptionVersion,
      agreementId: agreement.id,
    },
  };
}
