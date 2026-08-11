import { PageHeader, SiteFooter, SiteHeader, StatCard } from "@/components/site-shell";

const cards = [
  { value: "€248.450", label: "Huidige waarde", detail: "Inclusief winsten en herinvestering" },
  { value: "€16.740", label: "Netto cashflow", detail: "Op basis van actieve inkomsten en uitgaven" },
  { value: "9,9%", label: "Risico variatie", detail: "Bij een gecontroleerde portefeuillemix" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader current="/dashboard" />
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Dashboard"
          title="Een helder overzicht van uw portefeuille en prestaties."
          description="Het dashboard geeft inzicht in de actuele status, koersontwikkeling, rendement en risico-indicatoren. Eenvoudig, consistent en transparant."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <StatCard key={card.label} value={card.value} label={card.label} detail={card.detail} />
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
            <h2 className="text-xl font-bold text-white">Rendementsoverzicht</h2>
            <div className="mt-8 h-48 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-slate-900 to-slate-950 p-4">
              <div className="flex h-full items-end gap-3">
                {[35, 65, 52, 82, 72, 95, 110].map((height, index) => (
                  <div key={index} className="flex-1 rounded-t-xl bg-gradient-to-t from-emerald-400 to-cyan-400" style={{ height: `${height}%` }} />
                ))}
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
            <h2 className="text-xl font-bold text-white">Portefeuillesamenstelling</h2>
            <div className="mt-8 space-y-5 text-sm text-slate-300">
              <div className="flex items-center justify-between"><span>Vastgoed</span><span className="font-semibold text-white">38%</span></div>
              <div className="flex items-center justify-between"><span>Aandelen</span><span className="font-semibold text-white">31%</span></div>
              <div className="flex items-center justify-between"><span>Alternatieve strategieën</span><span className="font-semibold text-white">21%</span></div>
              <div className="flex items-center justify-between"><span>Liquiditeit</span><span className="font-semibold text-white">10%</span></div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
