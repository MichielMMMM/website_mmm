# MakeMoreMoney

Professionele website voor particulieren die transparant willen meeliften op een bewezen beleggingsaanpak.

## Over de site

Deze landing page is gebouwd met Next.js en Tailwind CSS en bevat de belangrijkste pagina's:

- Home
- Werkwijze
- Resultaten
- Dashboard
- Tarieven
- Abonnement
- Contact

## Tech stack

- Next.js
- Tailwind CSS
- Vercel-ready setup

## Environment variables

Maak een .env.local bestand op basis van .env.example:

```bash
cp .env.example .env.local
```

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Lokale ontwikkeling

```bash
npm install
npm run dev -- --port 3000
```

Open http://localhost:3000 om de site te bekijken.

## Abonnement

De pagina /abonnement toont voorlopig een placeholder. Het aanvraagformulier (incl. e-mailafhandeling) volgt later.

## Installatiestappenplan

1. Installeer de dependencies:

```bash
npm install
```

2. Maak een .env.local-bestand op basis van .env.example.

3. Start de app lokaal:

```bash
npm run dev -- --port 3000
```

7. Voor productie: configureer de juiste redirect- en webhook-URL in het Mollie dashboard en in de Vercel production environment variables.

## Deploy

De app is geschikt voor deploy op Vercel.
