import type { Metadata } from "next";
import { AgreementForm } from "@/components/agreement-form";
import { PageHeader } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Bevestig uw MakeMoreMoney-abonnement",
  description: "Overeenkomst bevestigen voor bestaande MakeMoreMoney-klanten. Uw bestaande koppeling blijft ongewijzigd.",
  robots: { index: false, follow: false },
};

export default function AgreementPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/80">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <div aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/30">M</div>
          <span className="text-lg font-bold tracking-tight text-white">MakeMoreMoney</span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl break-words px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <PageHeader
          eyebrow="Voor bestaande klanten"
          title="Bevestig uw MakeMoreMoney-abonnement"
          description="Uw MEXEM-rekening is al gekoppeld aan TradeConnector. U hoeft deze koppeling niet opnieuw uit te voeren."
        />
        <p className="-mt-4 mb-8 text-lg leading-8 text-slate-300">
          Om uw huidige abonnement en onze afspraken rond het automatisch volgen van Premie Collector Plus – volgsysteem duidelijk vast te leggen, vragen wij u onderstaande gegevens te controleren en te bevestigen.
        </p>
        <AgreementForm />
        <aside aria-label="Risicowaarschuwing" className="mt-8 rounded-2xl border border-slate-700 bg-slate-900/60 p-5 text-sm leading-6 text-slate-300">
          Beleggen brengt risico’s met zich mee. Transacties die via het automatisch volgen op uw beleggingsrekening plaatsvinden, komen voor uw eigen rekening en risico. Historische resultaten bieden geen garantie voor toekomstige resultaten.
        </aside>
      </main>
      <footer className="border-t border-slate-800 px-4 py-6 text-center text-sm text-slate-500">© MakeMoreMoney</footer>
    </div>
  );
}
