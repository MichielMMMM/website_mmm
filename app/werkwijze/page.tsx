import { PageHeader, SiteFooter, SiteHeader, StatCard } from "@/components/site-shell";

const steps = [
  {
    title: "1. Analyse en selectie",
    text: "We beoordelen markten, sectoren en kansen op basis van data, trends en risicoprofiel. Alleen investeringen die aansluiten bij onze criteria komen in beeld.",
  },
  {
    title: "2. Structuur en risicobeheer",
    text: "Elke positie krijgt een duidelijke plaats in de portefeuille. Risico wordt begrensd via diversificatie, stop-loss-logica en portefeuillecontrole.",
  },
  {
    title: "3. Actie en monitoring",
    text: "We volgen de portefeuille actief, reageren op signalen en houden de positie in balans op basis van bewezen parameters.",
  },
];

export default function WerkwijzePage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader current="/werkwijze" />
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Werkwijze"
          title="Een gecontroleerde, transparante aanpak voor duurzame groei."
          description="We combineren marktkennis, data-analyse en strakke risicobeheersing. Het resultaat: een consistente aanpak die goed uitlegbaar is aan iedere belegger."
        />

        <div className="grid gap-6 md:grid-cols-3">
          <StatCard value="01" label="Analyse" detail="Kansen worden niet op gevoel gekozen, maar op onderbouwde criteria." />
          <StatCard value="02" label="Selectie" detail="We kiezen gericht en beperken blootstelling aan overwaardering en te hoge volatiliteit." />
          <StatCard value="03" label="Monitoring" detail="We blijven kijken naar prestaties, risico en marktdynamiek." />
        </div>

        <div className="mt-16 space-y-6">
          {steps.map((step) => (
            <div key={step.title} className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
              <h2 className="text-2xl font-bold text-white">{step.title}</h2>
              <p className="mt-3 max-w-3xl text-lg leading-8 text-slate-300">{step.text}</p>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
