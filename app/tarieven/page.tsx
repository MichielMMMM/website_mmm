import Link from "next/link";
import { PricingCalculator } from "@/components/pricing-calculator";
import { PageHeader, SiteFooter, SiteHeader } from "@/components/site-shell";
import { pricingConfig } from "@/lib/pricing";

const faqItems = [
  {
    question: "Wat is een factor?",
    answer: "Een factor is een vaste eenheid binnen het volgsysteem. Een factor vertegenwoordigt een set van posities die logisch bij elkaar hoort en die samen het basisprincipe van de aanpak vormt.",
  },
  {
    question: "Hoeveel kapitaal is nodig voor één factor?",
    answer: "Eén factor vereist €8.500 beschikbaar beleggingskapitaal. Het benodigde kapitaal staat los van de abonnementskosten.",
  },
  {
    question: "Kan ik met één factor beginnen?",
    answer: "Ja. Deelname is mogelijk vanaf één factor. Deelnemers bepalen zelf of en wanneer ze later meer factoren toevoegen.",
  },
  {
    question: "Kan ik later uitbreiden?",
    answer: "Ja. Verdere uitbreiding is mogelijk, maar het bedrag dat beschikbaar moet zijn, groeit mee met het aantal factoren.",
  },
  {
    question: "Waar staat mijn geld?",
    answer: "Het geld staat op de eigen beleggingsrekening van de deelnemer. MakeMoreMoney heeft geen toegang tot het beleggingskapitaal dat u inzet.",
  },
  {
    question: "Heeft MakeMoreMoney toegang tot mijn geld?",
    answer: "Nee. Transacties vinden plaats via de eigen beleggingsrekening van de deelnemer. MakeMoreMoney heeft geen toegang tot het eigen vermogen van de deelnemer.",
  },
  {
    question: "Wat betaal ik per maand?",
    answer: "De reguliere abonnementsprijs hangt af van het aantal factoren. In de eerste maand geldt 50% korting op het reguliere maandtarief.",
  },
  {
    question: "Geldt er een opstartvergoeding?",
    answer: "Nee. Er geldt geen opstartvergoeding. De reguliere abonnementskosten zijn de vaste maandelijkse vergoeding voor de dienst.",
  },
  {
    question: "Welke aanvullende kosten kunnen bestaan?",
    answer: "Eventuele broker-, transactie-, financierings-, belasting- en overige kosten zijn niet in het abonnement inbegrepen, tenzij uitdrukkelijk anders vermeld.",
  },
  {
    question: "Is rendement gegarandeerd?",
    answer: "Nee. Beleggen brengt risico&apos;s met zich mee. Rendementen kunnen fluctueren en u kunt een deel of uw volledige inleg verliezen.",
  },
  {
    question: "Kan ik geld verliezen?",
    answer: "Ja. De waarde van beleggingen kan dalen. Een vaste werkwijze sluit verlies en marktrisico niet uit.",
  },
  {
    question: "Moet ik zelf transacties uitvoeren?",
    answer: "Nee. De deelnemer volgt het systeem en de transacties op de eigen rekening. U hoeft niet zelf dagelijks de markt te volgen.",
  },
  {
    question: "Hoe word ik over transacties geïnformeerd?",
    answer: "De deelnemer krijgt inzicht in transacties, kosten en resultaten via de communicatieroutes die in het aansluitproces worden toegelicht.",
  },
  {
    question: "Hoe kan ik het abonnement opzeggen?",
    answer: "[Nog definitief vast te stellen door MakeMoreMoney]",
  },
  {
    question: "Geeft MakeMoreMoney persoonlijk beleggingsadvies?",
    answer: "Nee. MakeMoreMoney geeft geen persoonlijk beleggingsadvies. Deelnemers blijven zelf verantwoordelijk voor hun beslissing om deel te nemen.",
  },
  {
    question: "Wat gebeurt er met mijn rekening als MakeMoreMoney stopt?",
    answer: "De deelnemer blijft eigenaar van de eigen beleggingsrekening. De wijze waarop toegang en informatie worden geregeld, wordt in de juiste contractuele documenten uitgelegd.",
  },
  {
    question: "Waarom werkt MakeMoreMoney met factoren?",
    answer: "Factoren helpen om de werkwijze helder te structureren en de matching tussen kapitaal, risico en abonnementsprijs begrijpelijk te houden.",
  },
  {
    question: "Is ervaring met opties vereist?",
    answer: "Nee. Deelnemers volgen de werkwijze en ontvangen uitleg over de praktische inrichting. Dit is geen vervanging van een eigen beoordeling van de risico&apos;s.",
  },
  {
    question: "Wat houdt de korting in de eerste maand in?",
    answer: "In de eerste maand geldt 50% korting op het reguliere maandtarief. Daarna geldt het reguliere maandtarief.",
  },
  {
    question: "Waar kan ik de actuele abonnementskosten zien?",
    answer: "De actuele abonnementskosten worden hier en in het aansluitproces weergegeven. De calculator geeft een actuele weergave op basis van het gekozen aantal factoren.",
  },
];

export default function TarievenPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader current="/tarieven" />
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Tarieven"
          title="Een duidelijk abonnement zonder performance fee"
          description="De reguliere abonnementsprijs hangt af van het aantal factoren. Deelnemers volgen een vaste en transparante werkwijze zonder verborgen kosten of complexe prijsstructuren."
        />

        <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/5 p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Prominente melding</div>
              <div className="mt-2 text-2xl font-black text-white">Eerste maand 50% korting</div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-sm text-slate-400">Start met één factor</div>
              <div className="mt-2 text-2xl font-black text-white">€15 in de eerste maand</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-sm text-slate-400">Daarna</div>
              <div className="mt-2 text-2xl font-black text-white">€30 per maand</div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="text-sm text-slate-400">Kapitaal per factor</div>
              <div className="mt-2 text-2xl font-black text-white">€8.500</div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="font-semibold text-white">Later uitbreiden is mogelijk</div>
              <p className="mt-2 text-sm text-slate-300">Meer factoren vragen meer beschikbaar beleggingskapitaal en leiden tot een grotere blootstelling.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="font-semibold text-white">Geen opstartkosten</div>
              <p className="mt-2 text-sm text-slate-300">Er is geen aparte opstartvergoeding. Alleen het abonnement is van toepassing.</p>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
              <div className="font-semibold text-white">Geen performance fee</div>
              <p className="mt-2 text-sm text-slate-300">De vergoeding is een vast abonnement en niet afhankelijk van het behaalde resultaat.</p>
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-300">
            De reguliere abonnementsprijs hangt af van het aantal factoren. Naarmate het aantal factoren toeneemt, dalen de abonnementskosten relatief ten opzichte van het benodigde kapitaal.
          </p>
        </div>

        <div className="mt-16">
          <PricingCalculator />
        </div>

        <div className="mt-16 rounded-3xl border border-slate-800 bg-slate-900/80 p-6 sm:p-8">
          <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Veelgestelde vragen</div>
          <div className="mt-6 space-y-5">
            {faqItems.map((item) => (
              <div key={item.question} className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                <div className="text-lg font-bold text-white">{item.question}</div>
                <p className="mt-2 text-sm leading-6 text-slate-300">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
            Bespreek de mogelijkheden
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
