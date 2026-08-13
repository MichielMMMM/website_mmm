import Image from "next/image";
import { PageHeader, SiteFooter, SiteHeader } from "@/components/site-shell";

export default function ResultatenPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader current="/resultaten" />
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Resultaten"
          title="Premie Collector Plus in feiten en perspectief."
          description="Historische resultaten kunnen inzicht geven in het gedrag van het systeem, maar vormen geen garantie voor toekomstige resultaten. De waarde van beleggingen kan fluctueren en u kunt een deel of uw volledige inleg verliezen."
        />

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-bold text-white">Hoe het systeem werkt</h2>
              <p className="mt-4 text-slate-300">
                Het systeem werkt volgens vaste regels op indexniveau. Het is niet ontworpen om de markt voortdurend te voorspellen, maar om binnen vooraf vastgestelde uitgangspunten te handelen.
              </p>
              <p className="mt-4 text-slate-300">
                Opties zijn complexe financiële instrumenten met specifieke risico&apos;s. De opzet is gericht op structuur, transparantie en risicobeheer in plaats van een garantie op een bepaald rendement.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-bold text-white">Risicobeheer</h2>
              <ul className="mt-4 space-y-3 text-slate-300">
                <li>• Binnen de bandbreedte blijft de ontvangen optiepremie (na kosten) een relevante factor.</li>
                <li>• Buiten de bandbreedte ontstaat risico en kan verlies optreden.</li>
                <li>• Het systeem werkt met vaste onder- en bovengrenzen en veiligheidsmarges.</li>
                <li>• Posities kunnen voortijdig worden gesloten om verdere risico&apos;s te beperken.</li>
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-bold text-white">Benodigd kapitaal</h2>
              <p className="mt-4 text-slate-300">
                Eén factor vereist €8.500 beschikbaar beleggingskapitaal. Het benodigde kapitaal staat los van de abonnementskosten. Meer factoren vragen meer beschikbaar beleggingskapitaal en leiden tot een grotere financiële blootstelling.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-bold text-white">Historische resultaten</h2>
              <p className="mt-4 text-slate-300">
                Historische resultaten kunnen helpen om de werking van het systeem te begrijpen, maar geven geen garantie voor toekomstige resultaten. De uitkomst hangt af van marktomstandigheden, kosten, uitvoering en de gekozen blootstelling.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-bold text-white">Data & uitgangspunten</h2>
              <p className="mt-4 text-slate-300">
                De strategie is getoetst met historische koersgegevens. Dat geeft inzicht in het gedrag van het systeem, maar verklaart niet automatisch toekomstige prestaties of het ontstaan van verliezen.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-bold text-white">Cumulatief rendement 2025</h2>
              <div className="mt-8 overflow-hidden rounded-3xl border border-slate-800 bg-slate-950/70 p-4">
                <Image
                  src="/premie-collector-plus-versus-aex-2025.png"
                  alt="Cumulatief rendement van Premie Collector Plus en de AEX over 2025"
                  width={1280}
                  height={708}
                  className="h-auto w-full rounded-2xl"
                  priority
                />
              </div>
              <p className="mt-4 text-slate-300">
                De grafiek toont de cumulatieve ontwikkeling van Premie Collector Plus en de AEX over 2025. Historische resultaten bieden geen garantie voor toekomstige resultaten. De waarde van beleggingen kan fluctueren en verlies is mogelijk.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-bold text-white">Disclaimer</h2>
              <p className="mt-4 text-slate-300">
                Dit document is uitsluitend informatief en vormt geen beleggingsadvies of persoonlijke aanbeveling. Beleggen in opties brengt substantiële risico&apos;s met zich mee. U kunt (een deel van) uw inleg verliezen en verliezen kunnen in uitzonderlijke situaties groter uitvallen.
              </p>
              <p className="mt-4 text-slate-300">
                Resultaten uit het verleden bieden geen garantie voor de toekomst. Het genoemde rendement is indicatief en afhankelijk van marktcondities, kosten, uitvoering en de gekozen blootstelling.
              </p>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
