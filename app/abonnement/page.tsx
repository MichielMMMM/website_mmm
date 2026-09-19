import { PageHeader, SiteFooter, SiteHeader } from "@/components/site-shell";

export default function SubscriptionPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader current="/abonnement" />
      <main className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Abonnement"
          title="Vraag Premie Collector Plus aan"
          description="Binnenkort kun je hier direct een aanvraag indienen."
        />

        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center text-slate-300">
          {/* hier komt het abonnement formulier */}
          Hier komt het aanvraagformulier.
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
