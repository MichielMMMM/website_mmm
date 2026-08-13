import { PageHeader, SiteFooter, SiteHeader } from "@/components/site-shell";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SiteHeader current="/contact" />
      <main className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Contact"
          title="Plan een vrijblijvende kennismaking."
          description="Wij luisteren eerst naar jouw situatie en geven uitleg over de manier waarop het volgsysteem werkt, zonder een persoonlijke aanbeveling te geven."
        />

        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
            <h2 className="text-2xl font-bold text-white">Neem contact op</h2>
            <div className="mt-6 space-y-5 text-slate-300">
              <p>Email: hello@makemoremoney.nl</p>
              <p>Telefoon: +31 (0)20 555 0148</p>
              <p>Amsterdam, Nederland</p>
            </div>
          </div>

          <form className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Naam</label>
                <input className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="Jouw naam" />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">E-mail</label>
                <input type="email" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="jij@email.nl" />
              </div>
            </div>
            <div className="mt-5">
              <label className="mb-2 block text-sm text-slate-300">Telefoonnummer (optioneel)</label>
              <input type="tel" className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="06 12345678" />
            </div>
            <div className="mt-5">
              <label className="mb-2 block text-sm text-slate-300">Vraag of toelichting</label>
              <textarea className="min-h-32 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500" placeholder="Vertel kort wat je wilt bespreken..." />
            </div>
            <label className="mt-5 flex items-start gap-3 text-sm text-slate-300">
              <input type="checkbox" className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-950" />
              <span>Ik ga akkoord met de privacyverklaring.</span>
            </label>
            <button type="submit" className="mt-6 inline-flex items-center justify-center rounded-full bg-emerald-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300">
              Verstuur bericht
            </button>
          </form>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
