"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  agreement, generalTerms, formatAgreementTime, formatSubscriptionAmount, normalizePostcode, positionLabel, subscriptions,
  subscriptionConsent, subscriptionStrategy, subscriptionVersion, validateAgreement, isConfirmationNumber,
} from "@/lib/agreement";

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-emerald-300";
const buttonClass =
  "inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300 disabled:cursor-not-allowed disabled:opacity-50";

export function AgreementForm() {
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [generalTermsAccepted, setGeneralTermsAccepted] = useState(false);
  const [subscriptionAccepted, setSubscriptionAccepted] = useState(false);
  const [positions, setPositions] = useState("");
  const subscription = subscriptions.find((item) => String(item.positions) === positions);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ confirmationNumber: string; acceptedAt: string; notificationWarning?: string } | null>(null);
  const [postcode, setPostcode] = useState("");
  const [houseNumber, setHouseNumber] = useState("");
  const [addition, setAddition] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Nederland");
  const [addressMessage, setAddressMessage] = useState("");
  const [addressPending, setAddressPending] = useState(false);
  const addressRequest = useRef<AbortController | null>(null);
  const sending = useRef(false);
  const feedback = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const controller = new AbortController();
    async function checkAvailability() {
      try {
        const response = await fetch("/api/overeenkomst", {
          cache: "no-store",
          signal: controller.signal,
        });
        const result: unknown = await response.json();
        if (!response.ok || typeof result !== "object" || result === null ||
            !("available" in result) || result.available !== true) {
          setError("De overeenkomst kan nog niet worden bevestigd. Het document of de registratie is nog niet beschikbaar. Probeer het later opnieuw.");
          return;
        }
        setAvailable(true);
      } catch {
        if (!controller.signal.aborted) {
          setError("De beschikbaarheid kon niet worden gecontroleerd. Vernieuw de pagina of probeer het later opnieuw.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void checkAvailability();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (receipt || (error && !loading)) feedback.current?.focus();
  }, [receipt, error, loading]);

  function resetAddressLookup() {
    addressRequest.current?.abort();
    setAddressMessage("");
    setAddressPending(false);
  }

  useEffect(() => () => addressRequest.current?.abort(), []);

  async function lookupAddress() {
    if (country.trim().toLowerCase() !== "nederland" ||
        !/^[1-9][0-9]{3} [A-Z]{2}$/.test(normalizePostcode(postcode)) ||
        !/^[1-9][0-9]{0,9}$/.test(houseNumber.trim())) return;
    addressRequest.current?.abort();
    const controller = new AbortController();
    addressRequest.current = controller;
    setAddressPending(true);
    setAddressMessage("");
    try {
      const response = await fetch("/api/postcode", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postcode, houseNumber, addition }),
        signal: controller.signal,
      });
      const data: unknown = await response.json();
      if (controller.signal.aborted) return;
      if (response.ok && typeof data === "object" && data !== null &&
          "found" in data && data.found === true &&
          "street" in data && typeof data.street === "string" &&
          "city" in data && typeof data.city === "string") {
        setStreet(data.street);
        setCity(data.city);
        setAddressMessage("Adres gevonden. Controleer straat en woonplaats en pas ze zo nodig aan.");
      } else {
        setAddressMessage(typeof data === "object" && data !== null &&
          "message" in data && typeof data.message === "string"
          ? data.message : "Geen adres gevonden. Vul straat en woonplaats handmatig in.");
      }
    } catch {
      if (!controller.signal.aborted) {
        setAddressMessage("Adrescontrole is tijdelijk niet beschikbaar. Vul straat en woonplaats handmatig in.");
      }
    } finally {
      if (!controller.signal.aborted) setAddressPending(false);
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || !available) return;
    addressRequest.current?.abort();
    setAddressPending(false);
    const form = event.currentTarget;
    const fields = new FormData(form);
    const payload = {
      salutation: fields.get("salutation"),
      initials: fields.get("initials"),
      firstName: fields.get("firstName"),
      lastName: fields.get("lastName"),
      companyName: fields.get("companyName"),
      email: fields.get("email"),
      phone: fields.get("phone"),
      postcode,
      houseNumber,
      houseNumberAddition: addition,
      street,
      city,
      country,
      notes: fields.get("notes"),
      strategy: subscriptionStrategy,
      positions: subscription?.positions,
      capital: subscription?.capital,
      monthly: subscription?.monthly,
      quarterly: subscription?.quarterly,
      accepted: fields.get("accepted") === "on",
      generalTermsAccepted: fields.get("generalTermsAccepted") === "on",
      generalTermsId: generalTerms.id,
      subscriptionAccepted: fields.get("subscriptionAccepted") === "on",
      subscriptionConsentText: subscription ? subscriptionConsent(subscription) : "",
      subscriptionVersion,
      agreementId: agreement.id,
    };
    const validation = validateAgreement(payload);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    sending.current = true;
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/overeenkomst", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const result: unknown = await response.json();
      if (!response.ok) {
        const message = typeof result === "object" && result !== null &&
          "message" in result && typeof result.message === "string"
          ? result.message
          : "Uw akkoord kon niet worden geregistreerd. Probeer het opnieuw.";
        setError(message);
        return;
      }
      if (typeof result !== "object" || result === null ||
          !("confirmationNumber" in result) || typeof result.confirmationNumber !== "string" ||
          !isConfirmationNumber(result.confirmationNumber) ||
          !("acceptedAt" in result) || typeof result.acceptedAt !== "string") {
        setError("Er is geen geldige ontvangstbevestiging ontvangen. Neem contact op met MakeMoreMoney voordat u opnieuw verzendt.");
        return;
      }
      setReceipt({
        confirmationNumber: result.confirmationNumber, acceptedAt: result.acceptedAt,
        notificationWarning: "notificationWarning" in result && typeof result.notificationWarning === "string"
          ? result.notificationWarning : undefined,
      });
      form.reset();
      setAccepted(false);
      setSubscriptionAccepted(false);
    } catch {
      setError("Er is geen ontvangstbevestiging ontvangen. Controleer uw verbinding. Bij twijfel of uw akkoord is geregistreerd, neem contact op met MakeMoreMoney.");
    } finally {
      sending.current = false;
      setPending(false);
    }
  }

  if (receipt) {
    return (
      <div ref={feedback} tabIndex={-1} role="status" className="rounded-3xl border border-emerald-400/40 bg-slate-900/80 p-6 focus:outline-none sm:p-8">
        <h2 className="text-2xl font-bold text-white">Bedankt. Uw abonnement en akkoord zijn ontvangen en geregistreerd.</h2>
        <p className="mt-4 text-slate-300">Aan uw bestaande MEXEM/TradeConnector-koppeling verandert niets.</p>
        {receipt.notificationWarning && <p className="mt-4 text-sm text-amber-200">{receipt.notificationWarning}</p>}
        <p className="mt-4 break-all text-sm text-slate-400">Bevestigingsnummer: {receipt.confirmationNumber}</p>
        <p className="mt-2 text-sm text-slate-400">
          Geregistreerd op: {formatAgreementTime(receipt.acceptedAt)}
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Overeenkomst lezen en accepteren">
      <form onSubmit={submit} method="post" action="/api/overeenkomst" aria-busy={loading || pending} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">Uw gegevens en abonnement</h2>
        {loading && <p role="status" className="mb-5 text-slate-300">Beschikbaarheid controleren...</p>}
        {error && (
          <div ref={feedback} tabIndex={-1} role="alert" className="mb-6 rounded-xl border border-amber-400/50 p-4 text-sm text-amber-200 focus:outline-none">
            {error}
          </div>
        )}
        <fieldset disabled={!available || pending} className="space-y-5 disabled:opacity-60">
          <legend className="sr-only">Velden met optioneel in het label zijn niet verplicht</legend>
          <h3 className="text-lg font-bold text-white">Persoonlijke gegevens</h3>
          <div>
            <label htmlFor="agreement-salutation" className="mb-2 block text-sm text-slate-300">Aanhef (optioneel)</label>
            <select id="agreement-salutation" name="salutation" defaultValue="neutraal" className={inputClass}>
              <option value="heer">De heer</option>
              <option value="mevrouw">Mevrouw</option>
              <option value="neutraal">Neutrale aanhef</option>
            </select>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="agreement-initials" className="mb-2 block text-sm text-slate-300">Voorletters (optioneel)</label>
              <input id="agreement-initials" name="initials" maxLength={30} className={inputClass} />
            </div>
            <div>
              <label htmlFor="agreement-first-name" className="mb-2 block text-sm text-slate-300">Voornaam</label>
              <input id="agreement-first-name" name="firstName" autoComplete="given-name" required maxLength={80} className={inputClass} />
            </div>
            <div>
              <label htmlFor="agreement-last-name" className="mb-2 block text-sm text-slate-300">Achternaam</label>
              <input id="agreement-last-name" name="lastName" autoComplete="family-name" required maxLength={80} className={inputClass} />
            </div>
          </div>
          <div>
            <label htmlFor="agreement-company" className="mb-2 block text-sm text-slate-300">Bedrijfsnaam (optioneel)</label>
            <input id="agreement-company" name="companyName" autoComplete="organization" maxLength={200} className={inputClass} />
          </div>
          <div>
            <label htmlFor="agreement-email" className="mb-2 block text-sm text-slate-300">E-mailadres</label>
            <input id="agreement-email" name="email" type="email" autoComplete="email" required maxLength={254} onBlur={(event) => { event.currentTarget.value = event.currentTarget.value.trim(); }} className={inputClass} placeholder="naam@voorbeeld.nl" />
          </div>
          <div>
            <label htmlFor="agreement-phone" className="mb-2 block text-sm text-slate-300">Telefoonnummer (optioneel)</label>
            <input id="agreement-phone" name="phone" type="tel" autoComplete="tel" maxLength={40} className={inputClass} />
          </div>
          <h3 className="text-lg font-bold text-white">Factuuradres</h3>
          <div className="grid items-end gap-5 sm:grid-cols-3">
            <div>
              <label htmlFor="agreement-postcode" className="mb-2 block text-sm text-slate-300">Postcode</label>
              <input id="agreement-postcode" name="postcode" autoComplete="postal-code" required maxLength={20} value={postcode} onChange={(event) => { resetAddressLookup(); setPostcode(event.target.value); }} onBlur={() => { if (country.trim().toLowerCase() === "nederland") setPostcode(normalizePostcode(postcode)); void lookupAddress(); }} className={inputClass} />
            </div>
            <div>
              <label htmlFor="agreement-house-number" className="mb-2 block text-sm text-slate-300">Huisnummer</label>
              <input id="agreement-house-number" name="houseNumber" required inputMode="numeric" pattern="[1-9][0-9]{0,9}" maxLength={10} value={houseNumber} onChange={(event) => { resetAddressLookup(); setHouseNumber(event.target.value); }} onBlur={() => void lookupAddress()} className={inputClass} />
            </div>
            <div>
              <label htmlFor="agreement-addition" className="mb-2 block text-sm text-slate-300">Huisnummertoevoeging (optioneel)</label>
              <input id="agreement-addition" name="houseNumberAddition" maxLength={20} value={addition} onChange={(event) => { resetAddressLookup(); setAddition(event.target.value); }} onBlur={() => void lookupAddress()} className={inputClass} />
            </div>
          </div>
          {country.trim().toLowerCase() === "nederland" && (
            <p className="text-sm text-slate-400">Via PDOK, op basis van postcode en huisnummer. U kunt het adres ook handmatig invullen.</p>
          )}
          {(addressPending || addressMessage) && <p role="status" className="text-sm text-slate-300">{addressPending ? "Adres wordt automatisch gecontroleerd..." : addressMessage}</p>}
          <div>
            <label htmlFor="agreement-street" className="mb-2 block text-sm text-slate-300">Straat</label>
            <input id="agreement-street" name="street" autoComplete="address-line1" required maxLength={150} value={street} onChange={(event) => { addressRequest.current?.abort(); setAddressPending(false); setStreet(event.target.value); }} className={inputClass} />
          </div>
          <div>
            <label htmlFor="agreement-city" className="mb-2 block text-sm text-slate-300">Woonplaats</label>
            <input id="agreement-city" name="city" autoComplete="address-level2" required maxLength={100} value={city} onChange={(event) => { addressRequest.current?.abort(); setAddressPending(false); setCity(event.target.value); }} className={inputClass} />
          </div>
          <div>
            <label htmlFor="agreement-country" className="mb-2 block text-sm text-slate-300">Land</label>
            <input id="agreement-country" name="country" autoComplete="country-name" required maxLength={80} value={country} onChange={(event) => { resetAddressLookup(); setCountry(event.target.value); }} className={inputClass} />
          </div>
          <h3 className="text-lg font-bold text-white">Abonnement</h3>
          <div>
            <p id="strategy-label" className="mb-2 text-sm text-slate-300">Strategie</p>
            <p aria-labelledby="strategy-label" className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 font-semibold text-emerald-300">{subscriptionStrategy}</p>
          </div>
          <div>
            <label htmlFor="agreement-positions" className="mb-2 block text-sm text-slate-300">Aantal posities</label>
            <select id="agreement-positions" name="positions" required value={positions} onChange={(event) => {
              setPositions(event.target.value);
              setSubscriptionAccepted(false);
            }} className={inputClass}>
              <option value="" disabled>Kies het aantal posities</option>
              {subscriptions.map((item) => <option key={item.positions} value={item.positions}>{positionLabel(item.positions)}</option>)}
            </select>
          </div>
          {subscription && (
            <section aria-labelledby="subscription-heading" aria-live="polite" className="rounded-2xl border border-emerald-400/30 bg-slate-950/80 p-5">
              <h3 id="subscription-heading" className="text-lg font-bold text-white">Uw gekozen abonnement</h3>
              <dl className="mt-4 space-y-3 text-sm text-slate-300">
                {[
                  ["Strategie", subscriptionStrategy],
                  ["Aantal posities", String(subscription.positions)],
                  ["Indicatief benodigd kapitaal", formatSubscriptionAmount(subscription.capital)],
                  ["Abonnementskosten per maand", `${formatSubscriptionAmount(subscription.monthly)} per maand`],
                  ["Te betalen bedrag per drie maanden", `${formatSubscriptionAmount(subscription.quarterly)} per drie maanden`],
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-1 sm:grid-cols-2 sm:gap-4">
                    <dt>{label}</dt><dd className="font-semibold text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          <div>
            <h3 className="mb-4 text-lg font-bold text-white">Aanvullende informatie</h3>
            <label htmlFor="agreement-notes" className="mb-2 block text-sm text-slate-300">Opmerkingen (optioneel)</label>
            <textarea id="agreement-notes" name="notes" rows={3} maxLength={2000} className={inputClass} placeholder="Heeft u nog vragen of opmerkingen over uw abonnement? Laat het ons hier weten." />
          </div>
          <label className="flex items-start gap-3 text-sm leading-6 text-slate-300">
            <input name="accepted" type="checkbox" required checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300" />
            <span>Ik heb de <a href={agreement.documentPath} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-300 underline! underline-offset-4 hover:text-emerald-200">{agreement.name}</a> gelezen en ga hiermee akkoord.</span>
          </label>
          <label className="flex items-start gap-3 text-sm leading-6 text-slate-300">
            <input name="subscriptionAccepted" type="checkbox" required disabled={!subscription} checked={subscriptionAccepted} onChange={(event) => setSubscriptionAccepted(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300" />
            <span>{subscription ? subscriptionConsent(subscription) : "Kies eerst het aantal posities om uw abonnementskeuze te bevestigen."}</span>
          </label>
          <label className="flex items-start gap-3 text-sm leading-6 text-slate-300">
            <input name="generalTermsAccepted" type="checkbox" required checked={generalTermsAccepted} onChange={(event) => setGeneralTermsAccepted(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300" />
            <span>Ik heb de <a href={generalTerms.path} target="_blank" rel="noopener noreferrer" className="font-bold text-emerald-300 underline! underline-offset-4 hover:text-emerald-200">Algemene Voorwaarden MakeMoreMoney</a> gelezen en ga hiermee akkoord.</span>
          </label>
          <button type="submit" disabled={!accepted || !generalTermsAccepted || !subscriptionAccepted || !subscription || !available || pending} className={`${buttonClass} w-full sm:w-auto`}>
            {pending ? "Akkoord registreren..." : subscription
              ? `Abonnement bevestigen voor ${formatSubscriptionAmount(subscription.quarterly)} per drie maanden`
              : "Kies eerst het aantal posities"}
          </button>
        </fieldset>
        <noscript><p className="mt-5 text-amber-200">Schakel JavaScript in om de overeenkomst te bekijken en uw akkoord veilig te registreren.</p></noscript>
      </form>
    </section>
  );
}
