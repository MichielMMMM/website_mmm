import Link from "next/link";

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/werkwijze", label: "Werkwijze" },
  { href: "/resultaten", label: "Resultaten" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/tarieven", label: "Tarieven" },
  { href: "/abonnement", label: "Abonnement" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader({ current }: { current?: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-sm font-black text-slate-950 shadow-lg shadow-emerald-500/30">
            M
          </div>
          <div>
            <div className="text-lg font-bold tracking-tight text-white">MakeMoreMoney</div>
            <div className="text-[10px] uppercase tracking-[0.22em] text-slate-400">Private investing</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => {
            const active = current === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  active
                    ? "text-sm font-medium text-emerald-300"
                    : "text-sm text-slate-300 transition hover:text-white"
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-full bg-emerald-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-emerald-300"
        >
          Plan een gesprek
        </Link>
      </div>
    </header>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-10">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.26em] text-emerald-300">{eyebrow}</p>
      <h1 className="max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">{title}</h1>
      <p className="mt-4 max-w-2xl text-lg text-slate-300">{description}</p>
    </div>
  );
}

export function StatCard({
  value,
  label,
  detail,
}: {
  value: string;
  label: string;
  detail: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-[0_0_0_1px_rgba(148,163,184,0.08)]">
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="mt-2 text-sm font-semibold text-emerald-300">{label}</div>
      <div className="mt-2 text-sm text-slate-400">{detail}</div>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-sm font-black text-slate-950">
              M
            </div>
            <div>
              <div className="text-lg font-bold text-white">MakeMoreMoney</div>
            </div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
            Transparant meeliften op een bewezen beleggingsaanpak voor particuliere beleggers die duurzame rendementen willen opbouwen.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Navigatie</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-white">{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">Contact</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li>hello@makemoremoney.nl</li>
            <li>+31 (0)20 555 0148</li>
            <li>Amsterdam, Nederland</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 text-sm text-slate-500 sm:px-6 lg:px-8">
          <span>© 2026 MakeMoreMoney</span>
          <span>Vastgoed, aandelen &amp; duurzame groei</span>
        </div>
      </div>
    </footer>
  );
}
