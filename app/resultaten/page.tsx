import { PageHeader, SiteFooter, SiteHeader, StatCard } from "@/components/site-shell";

const metrics = [
  { value: "+18,4%", label: "Gemiddeld rendement", detail: "Over de afgelopen 36 maanden" },
  { value: "0,8x", label: "Max. drawdown", detail: "Aangetoond met uitgebreide risicocontrole" },
  { value: "71%", label: "Winratio", detail: "Op basis van gerealiseerde transacties" },
];

const tableRows = [
  ["2023", "+8,9%", "Vastgoed & value"],
  ["2024", "+14,8%", "Aandelen & sectorrotatie"],
  ["2025", "+18,4%", "Diversificatie & monitoring"],
];

export default function ResultatenPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader current="/resultaten" />
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Resultaten"
          title="Bewijslast die in cijfers spreekt."
          description="We geloven in helderheid. Daarom laten we de prestaties, het risico en de voortgang van de aanpak op een overzichtelijke manier zien."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {metrics.map((metric) => (
            <StatCard key={metric.label} value={metric.value} label={metric.label} detail={metric.detail} />
          ))}
        </div>

        <div className="mt-16 overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800 text-slate-200">
                <tr>
                  <th className="px-6 py-4 font-semibold">Jaar</th>
                  <th className="px-6 py-4 font-semibold">Rendement</th>
                  <th className="px-6 py-4 font-semibold">Focus</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map(([year, result, focus]) => (
                  <tr key={year} className="border-t border-slate-800">
                    <td className="px-6 py-4">{year}</td>
                    <td className="px-6 py-4 text-emerald-300">{result}</td>
                    <td className="px-6 py-4">{focus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
