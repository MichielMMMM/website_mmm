import Link from "next/link";
import { SiteHeader, SiteFooter, StatCard } from "@/components/site-shell";

const challengeCards = [
  {
    title: "Te veel keuze",
    text: (
      <>
        Op welke landen, sectoren, bedrijven en markten richt u zich? En kiest u bijvoorbeeld voor ETF&apos;s, aandelen, grondstoffen of crypto? <strong>Al die keuzes maken het lastig om met vertrouwen te beginnen én consequent te blijven beleggen.</strong>
      </>
    ),
  },
  {
    title: "Twijfel over het juiste moment",
    text: (
      <>
        Zijn de koersen niet al te hoog? Is het beter om te wachten? En wanneer koopt u, neemt u winst of accepteert u een verlies? <strong>Het zoeken naar het perfecte moment en het voortdurend nemen van deze beslissingen leidt vaak vooral tot twijfel en uitstel.</strong>
      </>
    ),
  },
  {
    title: "Gebrek aan tijd en kennis",
    text: (
      <>
        Zelfstandig beleggen vraagt om onderzoek. U moet bedrijven en markten analyseren, resultaten volgen, ontwikkelingen bijhouden en uw beleggingen blijven beoordelen. <strong>Dat alles vraagt tijd, kennis en discipline.</strong>
      </>
    ),
  },
  {
    title: "Beslissingen onder druk",
    text: "Koersschommelingen en nieuwsberichten kunnen leiden tot twijfel en emotionele beslissingen. Een vaste werkwijze helpt om gestructureerd te blijven handelen.",
  },
];

const solutionFeatures = [
  "Vaste en systematische werkwijze",
  "Automatisch gevolgd, met volledig inzicht in transacties en resultaten",
  "Uw geld blijft op uw eigen beleggingsrekening",
];

const steps = [
  {
    title: "Kennismaken",
    text: "Tijdens een kennismaking wordt uitgelegd wat het volgsysteem inhoudt, hoe de dienstverlening praktisch werkt en welke risico’s eraan verbonden zijn.",
  },
  {
    title: "Eigen beleggingsrekening",
    text: "De deelnemer gebruikt een eigen beleggingsrekening. Het geld blijft op naam en op de rekening van de deelnemer.",
  },
  {
    title: "Het systeem volgen",
    text: "De deelnemer volgt de transacties die binnen het systeem worden uitgevoerd. De technische inrichting wordt tijdens het aansluitproces toegelicht.",
  },
  {
    title: "Inzicht houden",
    text: "De deelnemer krijgt inzicht in transacties, kosten, ontwikkeling en resultaten.",
  },
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
                  Systematisch beleggen
                </div>
                <h1 className="max-w-xl text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Beleggen hoeft niet ingewikkeld te zijn.
                </h1>
                <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
                  Volg een vaste en transparante aanpak zonder zelf voortdurend de markt te hoeven analyseren of op het perfecte instapmoment te wachten.
                </p>
                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <Link href="/werkwijze" className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                    Bekijk hoe het werkt
                  </Link>
                  <Link href="/contact" className="inline-flex items-center justify-center rounded-full border border-slate-700 bg-slate-900/80 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-500 hover:bg-slate-800">
                    Plan een kennismaking
                  </Link>
                </div>
                <p className="mt-6 max-w-md text-sm leading-6 text-slate-300">
                  Beleggen brengt risico&apos;s met zich mee. U kunt een deel of uw volledige inleg verliezen.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/50">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.28em] text-slate-400">Systeemoverzicht</div>
                    <div className="mt-2 text-3xl font-black text-white">Premie Collector Plus</div>
                  </div>
                  <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">AEX-volgsysteem</div>
                </div>

                <div className="space-y-4 text-sm text-slate-300">
                  <p>Een vaste en systematische aanpak die niet gebaseerd is op het voortdurend voorspellen van de volgende marktbeweging.</p>
                  <p>Transacties vinden plaats via de eigen beleggingsrekening van de deelnemer, zodat inzicht en controle behouden blijven.</p>
                </div>

                <div className="mt-6 grid gap-4 text-sm text-slate-300">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="font-semibold text-white">Vaste spelregels</div>
                    <div>De aanpak volgt vooraf bepaalde uitgangspunten in plaats van dagelijks marktvoorspellingen.</div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                    <div className="font-semibold text-white">Risico blijft relevant</div>
                    <div>Een gestructureerde werkwijze sluit verlies en marktrisico niet uit.</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Waarom beginnen</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Waarom beginnen met beleggen vaak wordt uitgesteld</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {challengeCards.map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <div className="text-xl font-black text-white">{item.title}</div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900/60">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1fr_1.05fr] lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">De oplossing</p>
              <h2 className="mt-4 text-3xl font-black tracking-tight text-white">Niet voortdurend voorspellen, maar een vaste aanpak volgen</h2>
              <p className="mt-5 max-w-xl text-lg leading-8 text-slate-300">
                MakeMoreMoney werkt met een gestructureerd volgsysteem en vooraf bepaalde uitgangspunten. De werkwijze is niet gebaseerd op het voortdurend voorspellen van de volgende marktbeweging. Transacties vinden plaats via de eigen beleggingsrekening van de deelnemer, waardoor de deelnemer inzicht en controle houdt.
              </p>
            </div>
            <div className="space-y-4">
              {solutionFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/60 p-4">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-xs font-black text-slate-950">✓</div>
                  <p className="text-slate-200">{feature}</p>
                </div>
              ))}
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-500/5 p-4 text-sm text-slate-200">
                Een systematische aanpak sluit verlies en andere beleggingsrisico&apos;s niet uit.
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Hoe het werkt</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Een duidelijke vierstappenaanpak</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                <div className="text-xs uppercase tracking-[0.25em] text-emerald-300">Stap {index + 1}</div>
                <div className="mt-3 text-xl font-black text-white">{step.title}</div>
                <p className="mt-3 text-sm leading-6 text-slate-300">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-center">
            <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
              Plan een vrijblijvende kennismaking
            </Link>
          </div>
        </section>

        <section className="border-y border-slate-800 bg-slate-900/60">
          <div className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Starten en uitbreiden</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">Klein beginnen en later zelf uitbreiden</h2>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Deelname is mogelijk vanaf één factor. Eén factor vereist €8.500 beschikbaar beleggingskapitaal. Deelnemers bepalen zelf of en wanneer zij het aantal factoren uitbreiden.
            </p>
            <p className="mt-4 text-slate-300">
              Het benodigde kapitaal staat los van de abonnementskosten. Meer factoren vragen meer beschikbaar beleggingskapitaal en leiden tot een grotere financiële blootstelling. MakeMoreMoney geeft geen persoonlijk advies over het aantal factoren dat bij een deelnemer past.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 to-slate-950 p-8 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-300">Start vandaag</p>
                <h2 className="mt-3 text-3xl font-black tracking-tight text-white">Wil je weten hoe een vaste aanpak in jouw situatie kan werken?</h2>
              </div>
              <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
                Plan een kennismaking
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
