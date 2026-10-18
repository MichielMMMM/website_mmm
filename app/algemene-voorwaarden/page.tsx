import type { Metadata } from "next";
import { agreement } from "@/lib/agreement";

export const metadata: Metadata = {
  title: "Algemene Voorwaarden | MakeMoreMoney",
  description: "Algemene voorwaarden van MakeMoreMoney voor de website, abonnementen en dienstverlening. Versie 1.0 van 1-9-2026.",
  robots: { index: true, follow: true },
};

const articles = [
  {
    title: "Artikel 1. Definities",
    paragraphs: [
      "In deze algemene voorwaarden wordt verstaan onder:",
      "MakeMoreMoney:\nde aanbieder van de diensten en abonnementen van MakeMoreMoney.",
      "Abonnee:\nde natuurlijke persoon of rechtspersoon die een abonnement bij MakeMoreMoney afsluit.",
      "Abonnement:\nde overeenkomst waarbij de Abonnee tegen betaling gebruik kan maken van een door MakeMoreMoney aangeboden dienst of handelsstrategie.",
      "Strategie:\neen door MakeMoreMoney ontwikkelde en aangeboden handelsstrategie.",
      "Website:\nde website van MakeMoreMoney en eventueel daaraan gekoppelde digitale dienstverlening.",
      "Voor het automatisch volgen van een Strategie kan daarnaast de Copy Trading Raamovereenkomst MakeMoreMoney van toepassing zijn.",
    ],
  },
  {
    title: "Artikel 2. Toepasselijkheid",
    paragraphs: [
      "Deze algemene voorwaarden zijn van toepassing op de website, aanbiedingen, abonnementen en overige dienstverlening van MakeMoreMoney.",
      "Indien voor een bepaalde dienst aanvullende voorwaarden of overeenkomsten gelden, zoals de Copy Trading Raamovereenkomst MakeMoreMoney, zijn deze eveneens van toepassing.",
      "Bij tegenstrijdigheid over onderwerpen die specifiek betrekking hebben op automatisch volgen en copy trading, prevaleert de Copy Trading Raamovereenkomst.",
    ],
  },
  {
    title: "Artikel 3. Aanbod en prijzen",
    paragraphs: [
      "Het actuele aanbod en de bijbehorende abonnementsprijzen worden via de website van MakeMoreMoney bekendgemaakt.",
      "De bij het afsluiten van het abonnement getoonde prijs geldt voor de betreffende abonnementsperiode.",
      "MakeMoreMoney kan prijzen wijzigen. Een prijswijziging geldt vanaf een volgende abonnementsperiode en wordt vooraf aan de Abonnee bekendgemaakt.",
    ],
  },
  {
    title: "Artikel 4. Totstandkoming en duur abonnement",
    paragraphs: [
      "Het abonnement komt tot stand nadat de Abonnee het gekozen abonnement en de toepasselijke voorwaarden heeft geaccepteerd en MakeMoreMoney hiervan een bevestiging heeft verstuurd.",
      "Het abonnement wordt aangegaan voor een periode van drie maanden en vooraf betaald.",
      "Na afloop van iedere periode wordt het abonnement automatisch met drie maanden verlengd.",
      "Opzegging dient uiterlijk één maand vóór de eerstvolgende verlengingsdatum door MakeMoreMoney te zijn ontvangen.",
      "Het tussentijds beëindigen van het automatisch volgen van een Strategie geldt niet automatisch als opzegging van het abonnement en geeft geen recht op restitutie van reeds betaalde abonnementskosten.",
    ],
  },
  {
    title: "Artikel 5. Betaling",
    paragraphs: [
      "De Abonnee is verantwoordelijk voor tijdige betaling van de verschuldigde abonnementsprijs.",
      "Betaling vindt plaats op de wijze en binnen de termijn die op de factuur of bij het afsluiten van het abonnement wordt vermeld.",
      "Indien een verschuldigd bedrag niet tijdig wordt betaald, kan MakeMoreMoney de dienstverlening opschorten en de wettelijk toegestane rente en incassokosten in rekening brengen.",
    ],
  },
  {
    title: "Artikel 6. Klant- en factuurgegevens",
    paragraphs: [
      "De Abonnee verstrekt de gegevens die noodzakelijk zijn voor de uitvoering van het abonnement, communicatie en facturatie.",
      "De Abonnee is verantwoordelijk voor de juistheid en volledigheid van de verstrekte gegevens en geeft wijzigingen tijdig aan MakeMoreMoney door.",
    ],
  },
  {
    title: "Artikel 7. Dienstverlening",
    paragraphs: [
      "MakeMoreMoney spant zich in om de dienstverlening zorgvuldig en betrouwbaar uit te voeren.",
      "MakeMoreMoney kan aangeboden Strategieën ontwikkelen, aanpassen, optimaliseren, vervangen of beëindigen en nieuwe Strategieën toevoegen.",
      "Voor de regels rond wijzigingen van automatisch gevolgde Strategieën gelden tevens de bepalingen uit de Copy Trading Raamovereenkomst.",
      "MakeMoreMoney kan voor de uitvoering van onderdelen van de dienstverlening gebruikmaken van externe dienstverleners.",
    ],
  },
  {
    title: "Artikel 8. Website en beschikbaarheid",
    paragraphs: [
      "MakeMoreMoney streeft naar een goede bereikbaarheid en werking van de website en digitale dienstverlening, maar garandeert niet dat deze permanent, zonder onderbreking of foutloos beschikbaar zijn.",
      "Onderhoud, technische storingen, internetproblemen en storingen bij externe dienstverleners kunnen tot tijdelijke beperkingen leiden.",
    ],
  },
  {
    title: "Artikel 9. Gebruik en intellectueel eigendom",
    paragraphs: [
      "De door MakeMoreMoney beschikbaar gestelde website, handelsstrategieën, teksten, rapportages, dashboards, modellen, handelsinformatie en overige inhoud zijn bestemd voor het gebruik door de Abonnee.",
      "Zonder voorafgaande toestemming van MakeMoreMoney mogen deze niet commercieel worden verspreid, verkocht, gepubliceerd of op andere wijze aan derden ter beschikking worden gesteld.",
      "De intellectuele eigendomsrechten blijven bij MakeMoreMoney of de betreffende rechthebbende.",
    ],
  },
  {
    title: "Artikel 10. Beleggen en risico",
    paragraphs: [
      "Beleggen brengt financiële risico’s met zich mee. Bij het gebruik van opties en andere derivaten kunnen aanzienlijke verliezen ontstaan en kan onder bepaalde omstandigheden meer worden verloren dan het oorspronkelijk aan een positie toegewezen bedrag.",
      "Historische resultaten en genoemde rendementsdoelstellingen vormen geen garantie voor toekomstige resultaten.",
      "De algemene informatie van MakeMoreMoney is niet afgestemd op de persoonlijke financiële situatie of doelstellingen van de individuele Abonnee.",
      "De Abonnee bepaalt zelfstandig of en met welk bedrag gebruik wordt gemaakt van een aangeboden Strategie.",
      "Voor het automatisch volgen van een Strategie gelden daarnaast de specifieke bepalingen over risico en eigen verantwoordelijkheid uit de Copy Trading Raamovereenkomst MakeMoreMoney.",
    ],
  },
  {
    title: "Artikel 11. Aansprakelijkheid",
    paragraphs: [
      "MakeMoreMoney aanvaardt geen aansprakelijkheid voor verliezen, schade of kosten die voortvloeien uit of verband houden met het gebruik van de dienstverlening.",
      "Voor copy trading en het automatisch volgen van Strategieën gelden daarnaast de aansprakelijkheids- en vrijwaringsbepalingen in de Copy Trading Raamovereenkomst MakeMoreMoney.",
    ],
  },
  {
    title: "Artikel 12. Persoonsgegevens",
    paragraphs: [
      "MakeMoreMoney verwerkt persoonsgegevens die noodzakelijk zijn voor onder andere klantregistratie, dienstverlening, communicatie, administratie en facturatie.",
      "Persoonsgegevens worden behandeld overeenkomstig de toepasselijke privacywetgeving en de privacyverklaring van MakeMoreMoney.",
    ],
  },
  {
    title: "Artikel 13. Wijzigingen",
    paragraphs: [
      "MakeMoreMoney kan deze algemene voorwaarden wijzigen.",
      "De actuele versie wordt via de website beschikbaar gesteld.",
      "Wanneer een wijziging relevant is voor een lopend abonnement, wordt de Abonnee hierover geïnformeerd voordat de wijziging van toepassing wordt.",
    ],
  },
  {
    title: "Artikel 14. Toepasselijk recht en geschillen",
    paragraphs: [
      "Op de dienstverlening, abonnementen en deze algemene voorwaarden is Nederlands recht van toepassing.",
      "Partijen proberen een eventuele klacht of een geschil in eerste instantie in onderling overleg op te lossen.",
    ],
  },
  {
    title: "Artikel 15. Contactgegevens",
    paragraphs: [
      "MakeMoreMoney\nStatensingel 36a\n3039 LN Rotterdam\nNederland",
      "KvK-nummer: 89985273\nBTW-nummer: NL004778508B03\nIBAN: NL45RABO0386009872",
    ],
  },
];

export default function AlgemeneVoorwaardenPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/80">
        <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-5 sm:px-6 lg:px-8">
          <div aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/30">M</div>
          <span className="text-lg font-bold tracking-tight text-white">MakeMoreMoney</span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl break-words px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
        <header className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-emerald-300">MakeMoreMoney</p>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">Algemene Voorwaarden</h1>
          <p className="mt-4 text-sm text-slate-400">Versie 1.0 | 1-9-2026</p>
        </header>

        <div className="max-w-3xl space-y-12">
          {articles.map((article, index) => (
            <section key={article.title} aria-labelledby={`artikel-${index + 1}`}>
              <h2 id={`artikel-${index + 1}`} className="text-2xl font-bold text-white">{article.title}</h2>
              <div className="mt-4 space-y-4 leading-8 text-slate-300">
                {article.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="whitespace-pre-line">
                    {paragraph.split(/(Copy Trading Raamovereenkomst(?: MakeMoreMoney)?)/).map((part, partIndex) =>
                      part.startsWith("Copy Trading Raamovereenkomst") ? (
                        <a key={partIndex} href={agreement.documentPath} className="text-emerald-300 underline underline-offset-4 hover:text-emerald-200">{part}</a>
                      ) : part
                    )}
                  </p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
