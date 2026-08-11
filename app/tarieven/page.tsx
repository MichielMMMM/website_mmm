import Link from "next/link";
import { PageHeader, SiteFooter, SiteHeader } from "@/components/site-shell";

const plans = [
  {
    name: "Starter",
    price: "€49",
    description: "Voor beleggers die de aanpak willen volgen met basisinzicht en toegang tot de belangrijkste rapportages.",
    features: ["Dashboard toegang", "Maandelijkse update", "Basisanalyse"]
  },
  {
    name: "Growth",
    price: "€149",
    description: "Voor actieve particulieren die een sterker overzicht en directere begeleiding willen.",
    features: ["Alles uit Starter", "Wekelijkse rapportage", "Persoonlijk overleg"],
    featured: true,
  },
  {
    name: "Private",
    price: "€299",
    description: "Voor beleggers die premium begeleiding en intensieve portfolio monitoring wensen.",
    features: ["Alles uit Growth", "Priority support", "Uitgebreide strategie review"],
  },
];

export default function TarievenPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader current="/tarieven" />
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Tarieven"
          title="Transparante prijzen voor een duidelijke investering in kennis en vertrouwen."
          description="Geen verborgen kosten. Geen ingewikkelde structurele vergoedingen. Alleen duidelijke pakketten afgestemd op jouw niveau van betrokkenheid."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.name} className={plan.featured ? "rounded-3xl border border-emerald-400/40 bg-emerald-500/10 p-8 shadow-lg shadow-emerald-500/10" : "rounded-3xl border border-slate-800 bg-slate-900/80 p-8"}>
              <div className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">{plan.name}</div>
              <div className="mt-5 flex items-end gap-2">
                <span className="text-4xl font-black text-white">{plan.price}</span>
                <span className="pb-1 text-slate-400">/ maand</span>
              </div>
              <p className="mt-5 text-slate-300">{plan.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3"><span className="text-emerald-300">✓</span>{feature}</li>
                ))}
              </ul>
              <Link href="/contact" className={plan.featured ? "mt-8 inline-flex w-full items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300" : "mt-8 inline-flex w-full items-center justify-center rounded-full border border-slate-700 bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:border-slate-500"}>
                Neem contact op
              </Link>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
