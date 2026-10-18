"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import {
  agreement, formatSubscriptionAmount, positionLabel, subscriptions,
  subscriptionConsent, subscriptionStrategy, subscriptionVersion, validateAgreement,
} from "@/lib/agreement";

const inputClass =
  "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus-visible:ring-2 focus-visible:ring-emerald-300";
const buttonClass =
  "inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300 disabled:cursor-not-allowed disabled:opacity-50";

export function AgreementForm() {
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [subscriptionAccepted, setSubscriptionAccepted] = useState(false);
  const [positions, setPositions] = useState("");
  const subscription = subscriptions.find((item) => String(item.positions) === positions);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<{ id: string; acceptedAt: string; notificationWarning?: string } | null>(null);
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

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (sending.current || !available) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const payload = {
      fullName: fields.get("fullName"),
      email: fields.get("email"),
      accountNumber: fields.get("accountNumber"),
      strategy: subscriptionStrategy,
      positions: subscription?.positions,
      capital: subscription?.capital,
      monthly: subscription?.monthly,
      quarterly: subscription?.quarterly,
      accepted: fields.get("accepted") === "on",
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
          !("id" in result) || typeof result.id !== "string" ||
          !("acceptedAt" in result) || typeof result.acceptedAt !== "string") {
        setError("Er is geen geldige ontvangstbevestiging ontvangen. Neem contact op met MakeMoreMoney voordat u opnieuw verzendt.");
        return;
      }
      setReceipt({
        id: result.id, acceptedAt: result.acceptedAt,
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
        <p className="mt-4 break-all text-sm text-slate-400">Registratienummer: {receipt.id}</p>
        <p className="mt-2 text-sm text-slate-400">
          Geregistreerd op: {new Intl.DateTimeFormat("nl-NL", {
            dateStyle: "long", timeStyle: "long", timeZone: "Europe/Amsterdam",
          }).format(new Date(receipt.acceptedAt))}
        </p>
      </div>
    );
  }

  return (
    <section aria-label="Overeenkomst lezen en accepteren">
      {available ? (
        <a href={agreement.documentPath} target="_blank" rel="noopener noreferrer" className={buttonClass}>
          Copy Trading Raamovereenkomst bekijken
        </a>
      ) : (
        <span aria-disabled="true" className={`${buttonClass} cursor-not-allowed opacity-50`}>
          Copy Trading Raamovereenkomst bekijken
        </span>
      )}
      <p className="mb-8 mt-3 text-sm text-slate-400">Versie {agreement.version} van {agreement.date}.</p>

      <form onSubmit={submit} method="post" action="/api/overeenkomst" aria-busy={loading || pending} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
        <h2 className="mb-6 text-2xl font-bold text-white">Uw gegevens en abonnement</h2>
        {loading && <p role="status" className="mb-5 text-slate-300">Beschikbaarheid controleren...</p>}
        {error && (
          <div ref={feedback} tabIndex={-1} role="alert" className="mb-6 rounded-xl border border-amber-400/50 p-4 text-sm text-amber-200 focus:outline-none">
            {error}
          </div>
        )}
        <fieldset disabled={!available || pending} className="space-y-5 disabled:opacity-60">
          <legend className="sr-only">Alle velden zijn verplicht</legend>
          <div>
            <label htmlFor="agreement-name" className="mb-2 block text-sm text-slate-300">Volledige naam</label>
            <input id="agreement-name" name="fullName" autoComplete="name" required minLength={2} maxLength={200} onBlur={(event) => { event.currentTarget.value = event.currentTarget.value.trim(); }} className={inputClass} placeholder="Uw volledige naam" />
          </div>
          <div>
            <label htmlFor="agreement-email" className="mb-2 block text-sm text-slate-300">E-mailadres</label>
            <input id="agreement-email" name="email" type="email" autoComplete="email" required maxLength={254} onBlur={(event) => { event.currentTarget.value = event.currentTarget.value.trim(); }} className={inputClass} placeholder="naam@voorbeeld.nl" />
          </div>
          <div>
            <label htmlFor="agreement-account" className="mb-2 block text-sm text-slate-300">MEXEM-rekeningnummer</label>
            <input id="agreement-account" name="accountNumber" autoComplete="off" autoCapitalize="characters" spellCheck={false} required minLength={3} maxLength={32} pattern="U[0-9]{2,31}" onBlur={(event) => { event.currentTarget.value = event.currentTarget.value.trim(); }} aria-describedby="account-help" className={inputClass} placeholder="Bijvoorbeeld U1234567" />
            <p id="account-help" className="mt-2 text-sm text-slate-400">Uw MEXEM-rekeningnummer begint doorgaans met een U.</p>
          </div>
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
              <p className="mt-4 text-sm text-slate-400">Het abonnement wordt per drie maanden vooruitbetaald.</p>
            </section>
          )}
          <div className="space-y-3 text-sm leading-6 text-slate-300">
            <p>Het abonnement wordt aangegaan voor perioden van drie maanden en wordt vooraf betaald. Na iedere periode wordt het abonnement automatisch met drie maanden verlengd.</p>
            <p>Opzegging dient uiterlijk één maand vóór de eerstvolgende verlengingsdatum door MakeMoreMoney te zijn ontvangen.</p>
          </div>
          <label className="flex items-start gap-3 text-sm leading-6 text-slate-300">
            <input name="accepted" type="checkbox" required checked={accepted} onChange={(event) => setAccepted(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300" />
            <span>{agreement.consentText}</span>
          </label>
          <label className="flex items-start gap-3 text-sm leading-6 text-slate-300">
            <input name="subscriptionAccepted" type="checkbox" required disabled={!subscription} checked={subscriptionAccepted} onChange={(event) => setSubscriptionAccepted(event.target.checked)} className="mt-1 h-5 w-5 shrink-0 accent-emerald-400 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald-300" />
            <span>{subscription ? subscriptionConsent(subscription) : "Kies eerst het aantal posities om uw abonnementskeuze te bevestigen."}</span>
          </label>
          <p className="text-sm leading-6 text-slate-400">
            Door op ‘Abonnement en overeenkomst bevestigen’ te klikken, bevestigt u uw gegevens, uw abonnementskeuze en uw akkoord met de Copy Trading Raamovereenkomst MakeMoreMoney.
          </p>
          <p className="text-sm leading-6 text-slate-400">
            Wij bewaren uw naam, e-mailadres, rekeningnummer, abonnementskeuze, getoonde bedragen en beide akkoordverklaringen met documentversie en tijdstip als bewijs van deze overeenkomst.
          </p>
          <button type="submit" disabled={!accepted || !subscriptionAccepted || !subscription || !available || pending} className={`${buttonClass} w-full sm:w-auto`}>
            {pending ? "Akkoord registreren..." : "Abonnement en overeenkomst bevestigen"}
          </button>
        </fieldset>
        <noscript><p className="mt-5 text-amber-200">Schakel JavaScript in om de overeenkomst te bekijken en uw akkoord veilig te registreren.</p></noscript>
      </form>
    </section>
  );
}
