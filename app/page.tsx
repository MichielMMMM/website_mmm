import Link from "next/link";
import { SiteHeader, SiteFooter, StatCard } from "@/components/site-shell";

const highlights = [
  { value: "18,4%", label: "Gemiddeld rendement", detail: "Op basis van de bewezen systeemaanpak over de afgelopen 36 maanden" },
  { value: "92%", label: "Van cliënten blijft", detail: "Door vertrouwen, transparante rapportage en duidelijke processen" },
  { value: "4.8/5", label: "Beoordeling", detail: "Gebaseerd op klanttevredenheid en consistentie in uitvoering" },
];

const pillars = [
  "Transparante beleggingsstrategie zonder verborgen kosten",
  "Vaste regelmaat in risico- en portefeuillestructuur",
  "Data-gedreven besluitvorming met duidelijke tracking",
  "Persoonlijke begeleiding voor particuliere beleggers",
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader />

      <main>
        <section className="relative overflow-hidden border-b border-slate-800">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.25),_transparent_35%),radial-gradient(circle_at_right,_rgba(34,211,238,0.18),_transparent_30%)]" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
            <div className="grid items-center gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <div className="mb-6 inline-flex items-center rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">
                  Proven investing framework
                </div>
                <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Meeliften op een beleggingsaanpak die echt werkt.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                  Maak meer geld met een duidelijke, transparante en gecontroleerde aanpak. Gewoon voor particulieren die vertrouwen willen in een bewezen systeem, zonder ruis en zonder ongefundeerde beloften.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link href="/resultaten" className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                    Bekijk resultaten
                  </Link>
                  <Link href="/werkwijze" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800">
                    Ontdek de werkwijze
                  </Link>
                </div>

                <div className="mt-10 flex flex-wrap gap-8 text-sm text-slate-300">
                  <div>
                    <div className="font-semibold text-white">8+ jaar</div>
                    <div>praktijkervaring</div>
                  </div>
                  <div>
                    <div className="font-semibold text-white">100%</div>
                    <div>transparant</div>
                  </div>
                  <div>
                    <div className="font-semibold text-white">Live</div>
                    <div>dashboard</div>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/50">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-400">Portfolio</div>
                    <div className="mt-2 text-3xl font-black text-white">€248.450</div>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">+14.2% YTD</div>
                </div>

                <div className="space-y-4">
                  {[
                    ["Aandelen", "€92.300", "+8.9%"],
                    ["Vastgoed", "€76.800", "+12.1%"],
                    ["Alternatieve strategieën", "€79.350", "+16.7%"],
                  ].map(([name, value, change]) => (
                    <div key={name} className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                      <div>
                        <div className="text-sm text-slate-400">{name}</div>
                        <div className="text-lg font-semibold text-white">{value}</div>
                      </div>
                      <div className="text-sm font-semibold text-emerald-300">{change}</div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Winratio</div>
                    <div className="mt-2 text-2xl font-black text-white">71%</div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-slate-400">Max drawdown</div>
                    <div className="mt-2 text-2xl font-black text-white">-9.8%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Waarom kiezen</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Een aanpak die gebouwd is op vertrouwen, data en consistentie.</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => (
              <StatCard key={item.label} value={item.value} label={item.label} detail={item.detail} />
            ))}
          </div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900/60">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Onze belofte</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white">Geen mysterie, alleen een heldere strategie.</h2>
            </div>
            <div className="space-y-4">
              {pillars.map((pillar) => (
                <div key={pillar} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-slate-950">✓</div>
                  <p className="text-slate-200">{pillar}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-8 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Start vandaag</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Wil je meeliften op een bewezen aanpak?</h2>
              </div>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                Vraag een demo aan
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
