import { PageHeader, SiteFooter, SiteHeader, StatCard } from "@/components/site-shell";

const systems = [
  {
    name: "MMM Premie Collector Plus",
    status: "Actief",
    description:
      "Een indexgebaseerd volgsysteem met vaste uitgangspunten, bandbreedtes en risicobeheer.",
  },
  {
    name: "S&P 500-variant",
    status: "Komt binnenkort",
    description:
      "Een aanvullende indexgebaseerde aanpak met dezelfde kernprincipes, aangepast aan een andere marktcontext.",
  },
];

const steps = [
  {
    title: "1. Vaste uitgangspunten en bandbreedte",
    text: "Het systeem werkt met vooraf bepaalde regels en een vaste bandbreedte. Het bevat geen constante voorspelling van de volgende marktbeweging en is niet afhankelijk van één specifieke marktrichting.",
  },
  {
    title: "2. Risicobeheer en veiligheidsmarges",
    text: "Risico staat centraal. Als de index in de buurt van een grens komt, wordt een positie in principe gesloten om verdere risico&apos;s te beperken. Een vaste aanpak sluit verlies en marktrisico niet uit.",
  },
  {
    title: "3. Transparante rapportage en volgen",
    text: "Deelnemers krijgen inzicht in transacties, kosten en resultaten. Er wordt gewerkt met duidelijke communicatie zonder de indruk te wekken dat rendement gegarandeerd of voorspelbaar is.",
  },
];

export default function WerkwijzePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader current="/werkwijze" />
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Werkwijze"
          title="Een consistent, transparant systeem met duidelijke risico-randvoorwaarden."
          description="MakeMoreMoney werkt met een vaste en systematische aanpak. Het systeem is niet gebaseerd op het voortdurend voorspellen van stijgende of dalende markten."
        />

        <div className="grid gap-6 md:grid-cols-3">
          <StatCard value="Vaste aanpak" label="Werkwijze" detail="Niet gebaseerd op het voortdurend voorspellen van de volgende marktbeweging." />
          <StatCard value="€8.500" label="Benodigd kapitaal" detail="Eén factor vereist €8.500 beschikbaar beleggingskapitaal." />
          <StatCard value="Eigen rekening" label="Uitvoering" detail="Transacties vinden plaats via de eigen beleggingsrekening van de deelnemer." />
        </div>

        <div className="mt-10 rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Onze systemen</div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {systems.map((system) => (
              <div key={system.name} className="rounded-3xl border border-slate-800 bg-slate-950/70 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-white">{system.name}</h2>
                    <p className="mt-2 text-slate-300">{system.description}</p>
                  </div>
                  <span className="rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-400">{system.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 space-y-6">
          {steps.map((step) => (
            <div key={step.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-bold text-white">{step.title}</h2>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-300">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-emerald-400/30 bg-emerald-500/5 p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Kernprincipes</div>
          <ul className="mt-6 grid gap-4 text-slate-200 md:grid-cols-2">
            <li>• Een vaste en systematische aanpak in plaats van continue marktvrees of marktvoorspellingen.</li>
            <li>• Deelnemers behouden inzicht in de eigen rekening, transacties en kosten.</li>
            <li>• Het systeem gebruikt opties; dat brengt specifieke en soms aanzienlijke risico&apos;s met zich mee.</li>
            <li>• De abonnementsvergoeding is niet afhankelijk van het behaalde resultaat.</li>
          </ul>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
