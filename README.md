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

## Klantovereenkomst (Cloudflare Pages)

De huidige statische Next.js-export blijft behouden. De rechtstreekse klant-URL is
`https://www.makemoremoney.nl/klant/overeenkomst` (gebruik het hoofddomein als `www`
niet naar dit Pages-project verwijst). Deze route staat nergens in de navigatie
of een sitemap. De Next.js Metadata API genereert `noindex, nofollow`; Cloudflare
voegt ook een `X-Robots-Tag` toe. Er is bewust geen robots.txt-blokkade.
Deze klantpagina heeft alleen het logo en woordmerk in de header, zonder
ondertitel, navigatie of contactknop. De footer bevat uitsluitend
"© MakeMoreMoney". De gedeelde header en footer van andere pagina's wijzigen niet.
Noindex en een niet-gelinkte URL zijn geen toegangsbeveiliging: de pagina is openbaar.
Het formulier verifieert niet de identiteit of het bestaande klant-/rekeningbezit.

### Productie instellen

1. Plaats het definitieve PDF-document op
   `public/documenten/copy-trading-raamovereenkomst-makemoremoney-v1.pdf`.
   De knop en verzending worden pas actief als de Function dit document als PDF kan
   ophalen en de databasebinding aanwezig is. Er wordt geen tijdelijke overeenkomst
   als echt document aangeboden.
2. Maak in hetzelfde Cloudflare-account een D1-database, bijvoorbeeld
   `mmm-agreements`. Kies waar passend een EU-jurisdictie en beoordeel de
   verwerkersafspraken en eigen privacy-/bewaarverplichtingen.
3. Voer de migraties in volgorde eenmaal uit op die database,
   bijvoorbeeld via de D1-console of na `npx wrangler login`:
   `npx wrangler d1 execute mmm-agreements --remote --file migrations/0001_agreement_acceptances.sql`.
   Voer daarna ook
   `npx wrangler d1 execute mmm-agreements --remote --file migrations/0002_subscription_acceptance.sql`
   uit. Op een bestaande database met de eerste migratie voert u alleen de tweede uit,
   voor deployment van de gewijzigde Function. Bestaande akkoorden blijven behouden;
   nieuwe abonnementsvelden blijven voor die oude registraties bewust NULL.
   Voer vervolgens ook
   `npx wrangler d1 execute mmm-agreements --remote --file migrations/0003_agreement_notifications.sql`
   eenmaal uit voor de e-mailstatusvelden. Oude registraties worden niet achteraf gemaild.
4. Koppel bij **Workers & Pages > website-mmm > Settings > Bindings** een
   D1-database met bindingsnaam **AGREEMENTS_DB**. Koppel preview aan een aparte
   testdatabase als previews moeten kunnen registreren; gebruik daar niet de
   productiegegevens.
5. Deploy de repository via de bestaande Pages Git-integratie. De bestaande
   buildopdracht `npx next build` en outputmap `out` blijven gelijk.
   De map `functions` in de repositoryroot wordt door Pages afzonderlijk
   verwerkt; alleen `out` uploaden met drag-and-drop is niet voldoende.
   `public/_routes.json` beperkt Function-aanroepen tot `/api/overeenkomst`.
   Controleer na deployment de pagina en een geautoriseerde testinzending in D1.

Inzendingen worden in D1-tabel `agreement_acceptances` opgeslagen. Elke rij bevat
een UUID, naam, e-mailadres, MEXEM-rekeningnummer, vaste strategie
"Premie Collector Plus – volgsysteem", aantal posities, indicatief kapitaal,
maand- en driemaandstarief, documentnaam, versie, datum, beide exacte checkboxteksten,
twee expliciete akkoorden, abonnementsversie en het servertijdstip
in UTC. De browser toont dit tijdstip in Europe/Amsterdam. Succes verschijnt
uitsluitend na een bevestigde database-insert. Er wordt geen naam, rekeningnummer,
IP-adres of user-agent naar applicatielogs geschreven of via de URL verstuurd.
Er is geen publieke API voor het uitlezen van akkoorden.

### E-mailmelding aan de beheerder

Na een bevestigde insert stuurt de Function via Hostnet SMTP een
tekstmail naar **michiel@mijs.nl**, met registratie-ID, klantgegevens, opgeslagen
bedragen en beide exacte akkoordverklaringen. Er gaat geen mail naar de klant.
De mail bevat persoonsgegevens: beveilig ook de ontvangende mailbox en neem
deze verwerking mee in uw privacy- en bewaarbeleid.

De zichtbare afzender is **Make More Money <michiel2@mijs.nl>**; de SMTP-login blijft
**michiel2@mijs.nl** en de ontvanger is **michiel@mijs.nl**. De Function gebruikt
`smtp.hostnet.nl:587`, verplichte STARTTLS en certificaatcontrole voor `smtp.hostnet.nl`.
De verbinding wordt via Nodemailers `getSocket` met de hostnaam geopend. Zo blijft
de hostnaam beschikbaar voor certificaatcontrole in de Cloudflare-runtime, zonder
IP-adressen vast te zetten of TLS-controle uit te schakelen. Het adres
`mailout.hostnet.nl` voor Hostnet-webhosting wordt niet gebruikt voor deze extern
gehoste Cloudflare-app. Er is geen Cloudflare Email Sending-abonnement nodig.

Configureer onder Pages > Settings > Variables and secrets:

- `SMTP_PASSWORD`: als **secret**, het mailboxwachtwoord voor michiel2@mijs.nl.
  Gebruik een apart app-wachtwoord als Hostnet dit ondersteunt. Nooit in Git,
  chat, logs of een `NEXT_PUBLIC_`-variabele plaatsen.
- Runtime: schakel `nodejs_compat` in en gebruik compatibility date
  `2026-09-19` of later, overeenkomstig de lokale Wrangler-configuratie.
  Bestaande overige compatibility flags blijven behouden.

Deploy opnieuw na configuratie. Controleer met een echte testinzending dat
Hostnet verbindingen vanuit Cloudflare accepteert (ook spamfolder controleren).
Deze verbinding en bezorging zijn zonder het secret nog niet geverifieerd.
Lokale tests versturen geen echte e-mail: het wachtwoord ontbreekt lokaal.
Voeg het alleen bewust aan een genegeerd
`.dev.vars`-bestand toe als u echte mailverzending lokaal wilt testen.

`notification_status` begint als `pending` en wordt `delivered`, `queued`,
`failed` of `not_configured`; het update-tijdstip staat in
`notification_updated_at`. `queued` betekent door Hostnet geaccepteerd voor
bezorging, niet bewezen ontvangst in de inbox. `delivered` blijft voor
compatibiliteit met eerdere configuratie behouden, maar wordt door de
SMTP-implementatie niet geschreven. Er is geen bezorgwebhook.
Een mailfout verwijdert het akkoord niet en leidt niet tot opnieuw verzenden
van het formulier. De klant ziet expliciet dat de registratie wel is opgeslagen
maar de melding niet bevestigd is. Controleer in D1 niet-bevestigde meldingen:

```sql
SELECT id, notification_status, notification_updated_at
FROM agreement_acceptances
WHERE notification_status IN ('pending', 'failed', 'not_configured');
```

Er is geen automatische retry: na een timeout kan de provider de mail toch hebben
ontvangen. Controleer de mailbox en zo nodig Hostnet voordat u een melding handmatig
opnieuw verstuurt. Het akkoord in D1 blijft de bronregistratie.

Regel beperkte beheerderstoegang, een passende bewaartermijn en back-ups/export
van D1 (naast Cloudflare Time Travel). Bescherm bij misbruik het API-pad met
Cloudflare-rate-limitingregels. De Function accepteert alleen same-origin
JSON-POST-verzoeken, begrenst de body en valideert alle velden en expliciet akkoord.
Dit bewijst een formulierinzending, niet een geverifieerde digitale handtekening.
Voor nieuwe versies: bewaar de oude PDF ongewijzigd en pas de documentconfiguratie
en exacte checkboxtekst in `lib/agreement.ts` aan. De klantpagina gebruikt de
expliciete prijstabel `subscriptions` in dat bestand, niet de openbare calculator:
de klantprijs voor een positie is EUR 25 per maand. Bedragen en abonnementstekst
worden als momentopname opgeslagen, niet als verwijzing naar de prijstabel.
Client en server controleren de keuze, bedragen en abonnementsversie; een
afwijkende of verouderde bevestiging wordt geweigerd. Bij wijziging van de
abonnementstekst/voorwaarden moet ook `subscriptionVersion` wijzigen.
Na een wijziging van het aantal posities moet de klant de tweede checkbox
opnieuw aanvinken. Rekeningnummers worden getrimd en moeten een hoofdletter U
gevolgd door cijfers bevatten (de bestaande grens van 3-32 tekens blijft gelden).

### Lokaal ontwikkelen en controleren

Node.js 22 of nieuwer wordt aanbevolen voor de Cloudflare-ontwikkeltools.

```bash
npm run build
npm run db:migrate:local
npm run dev:cloudflare
```

Open de door Wrangler getoonde lokale URL met `/klant/overeenkomst`.
`npm run dev` blijft bruikbaar voor de bestaande website, maar voert geen Pages
Functions uit. `wrangler.jsonc` is uitsluitend een lokale configuratie
met een fictief lokaal database-ID. De sleutel `pages_build_output_dir` ontbreekt
bewust: daarmee blijft deze configuratie volgens Cloudflare lokaal en worden
productiebindings in het Cloudflare-dashboard beheerd. Voeg die sleutel niet toe
zonder de configuratie eerst naar echte productiebindings te migreren.

```bash
npm run test:agreement
```

Deze tests vereisen een recente build en controleren validatie, robots in de
gebouwde HTML, afwezigheid van interne links en daadwerkelijke opslag in een
tijdelijke lokale D1-database via de echte Pages Function. Een uitsluitend
lokaal testdocument wordt buiten de repository aangemaakt en weer verwijderd.
Er worden geen testgegevens naar productie verzonden.
