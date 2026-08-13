import { PageHeader, SiteFooter, SiteHeader, StatCard } from "@/components/site-shell";

const cards = [
  { value: "AEX", label: "Index", detail: "Het huidige systeem is gebaseerd op de AEX-index." },
  { value: "€8.500", label: "Margin per set", detail: "Indicatief benodigde margin voor één set posities." },
  { value: "12–18%", label: "Indicatief rendement", detail: "Jaarlijkse verwachting op basis van de bandbreedte-aanpak." },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader current="/dashboard" />
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Dashboard"
          title="Overzicht van het Premie Collector Plus volgsysteem."
          description="Het dashboard toont de kernbewegingen, bandbreedte-logica en risicosturing op indexniveau." 
        />

        <div className="grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <StatCard key={card.label} value={card.value} label={card.label} detail={card.detail} />
          ))}
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
            <h2 className="text-xl font-bold text-white">Systeemstatus</h2>
            <p className="mt-4 text-slate-300">Het systeem werkt met een vooraf gedefinieerde onder- en bovengrens op de AEX-index. Als de index binnen deze band blijft, wordt de ontvangen optiepremie behouden; nadert de index de grens, dan wordt actief naar risicobeperking gewerkt.</p>
            <div className="mt-8 space-y-4 text-sm text-slate-300">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="font-semibold text-white">Risicobeheer</div>
                <p>Posities worden in principe gesloten als de index een grens nadert om verdere risico’s te beperken.</p>
              </div>
              <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="font-semibold text-white">Opties als instrument</div>
                <p>Opties zijn complex. Het volgsysteem brengt structuur, discipline en transparantie in de uitvoering.</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
            <h2 className="text-xl font-bold text-white">Volgsysteem</h2>
            <p className="mt-4 text-slate-300">Premie Collector Plus is geen handmatige trade-setup, maar een gestructureerd volgsysteem. U volgt de ingenomen posities, gemaakte keuzes en behaalde resultaten zonder zelf dagelijks actief in opties te hoeven handelen.</p>
            <ul className="mt-8 space-y-3 text-sm text-slate-300">
              <li>• Het systeem is ontworpen om te functioneren in stijgende, dalende en zijwaartse markten.</li>
              <li>• Posities worden op indexniveau ingenomen, zodat risico breder wordt gespreid.</li>
              <li>• Behoud van vermogen en margin of safety staan centraal.</li>
            </ul>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
