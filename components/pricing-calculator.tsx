"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  formatCurrency,
  getPricingForFactors,
  pricingConfig,
} from "@/lib/pricing";

export function PricingCalculator() {
  const [factorCount, setFactorCount] = useState(1);

  const pricing = useMemo(() => getPricingForFactors(factorCount), [factorCount]);

  const decrement = () => setFactorCount((current) => Math.max(1, current - 1));
  const increment = () =>
    setFactorCount((current) => Math.min(pricingConfig.maximaalAantalFactorenCalculator, current + 1));

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8">
      <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Prijscalculator</div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-slate-700 bg-slate-900/80 p-4">
        <span className="text-sm font-medium text-slate-300">Aantal factoren</span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={decrement}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-lg text-white transition hover:border-slate-500"
            aria-label="Verlaag aantal factoren"
          >
            −
          </button>
          <span className="min-w-10 text-center text-xl font-black text-white">{factorCount}</span>
          <button
            type="button"
            onClick={increment}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-slate-950 text-lg text-white transition hover:border-slate-500"
            aria-label="Verhoog aantal factoren"
          >
            +
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Geselecteerd aantal factoren</div>
          <div className="mt-2 text-2xl font-black text-white">{factorCount}</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Benodigd kapitaal</div>
          <div className="mt-2 text-2xl font-black text-white">{formatCurrency(pricing.requiredCapital)}</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Tarief eerste maand</div>
          <div className="mt-2 text-2xl font-black text-white">{formatCurrency(pricing.firstMonthRate)}</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Regulier maandtarief</div>
          <div className="mt-2 text-2xl font-black text-white">{formatCurrency(pricing.regularMonthlyRate)}</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 sm:col-span-2">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Reguliere abonnementskosten per jaar</div>
          <div className="mt-2 text-2xl font-black text-white">{formatCurrency(pricing.annualRate)}</div>
        </div>
      </div>

      <p className="mt-6 text-sm leading-6 text-slate-300">
        De calculator toont uitsluitend het benodigde kapitaal en de abonnementsprijs. De uitkomst vormt geen advies over het aantal factoren of het bedrag dat u zou moeten beleggen.
      </p>

      <p className="mt-4 text-sm leading-6 text-slate-300">
        Eventuele broker-, transactie-, financierings-, belasting- en overige kosten zijn niet in het abonnement inbegrepen, tenzij uitdrukkelijk anders vermeld.
      </p>

      <div className="mt-8">
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Bespreek de mogelijkheden
        </Link>
      </div>
    </div>
  );
}
