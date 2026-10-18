import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { once } from "node:events";
import { setTimeout as delay } from "node:timers/promises";
import { test } from "node:test";
import ts from "typescript";
import nodemailer from "nodemailer";
import net from "node:net";
import { EventEmitter } from "node:events";
import { DatabaseSync } from "node:sqlite";

const root = process.cwd();
const wrangler = path.join(root, "node_modules", "wrangler", "bin", "wrangler.js");
const source = await readFile(path.join(root, "lib", "agreement.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const agreementModuleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;
const {
  agreement, generalTerms, subscriptions, subscriptionStrategy, subscriptionVersion,
  subscriptionConsent, subscriptionTerms, formatAgreementTime, normalizePostcode, formatSubscriptionAmount, validateAgreement,
} = await import(agreementModuleUrl);
const handlerSource = await readFile(path.join(root, "functions", "api", "overeenkomst.ts"), "utf8");
const handlerCompiled = ts.transpileModule(handlerSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  .replace('"../../lib/agreement"', JSON.stringify(agreementModuleUrl))
  .replace('"nodemailer"', JSON.stringify(import.meta.resolve("nodemailer")));
const { onRequest } = await import(`data:text/javascript;base64,${Buffer.from(handlerCompiled).toString("base64")}`);
const postcodeSource = await readFile(path.join(root, "functions", "api", "postcode.ts"), "utf8");
const postcodeCompiled = ts.transpileModule(postcodeSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  .replace('"../../lib/agreement"', JSON.stringify(agreementModuleUrl));
const { onRequest: lookupPostcode } = await import(`data:text/javascript;base64,${Buffer.from(postcodeCompiled).toString("base64")}`);
const validInput = {
  initials: "",
  firstName: "Testklant",
  lastName: "Voorbeeld",
  fullName: "Testklant Voorbeeld",
  companyName: "",
  email: "test@example.test",
  phone: "",
  postcode: "2511 BT",
  houseNumber: "68",
  houseNumberAddition: "",
  street: "Spui",
  city: "'s-Gravenhage",
  country: "Nederland",
  notes: "Testopmerking\nTweede regel",
  strategy: subscriptionStrategy,
  ...subscriptions[4],
  accepted: true,
  generalTermsAccepted: true,
  generalTermsId: generalTerms.id,
  subscriptionAccepted: true,
  subscriptionConsentText: subscriptionConsent(subscriptions[4]),
  subscriptionVersion,
  agreementId: agreement.id,
};

test("validation requires explicit consent, current document and valid fields", () => {
  assert.equal(agreement.version, "1.0");
  assert.equal(agreement.date, "01-09-2026");
  assert.equal(agreement.consentText, "Ik heb de Copy Trading Raamovereenkomst MakeMoreMoney gelezen en ga hiermee akkoord.");
  assert.equal(validateAgreement(validInput).valid, true);
  for (const accepted of [false, undefined, "true", "on", 1, null]) {
    assert.equal(validateAgreement({ ...validInput, accepted }).valid, false);
    assert.equal(validateAgreement({ ...validInput, subscriptionAccepted: accepted }).valid, false);
    assert.equal(validateAgreement({ ...validInput, generalTermsAccepted: accepted }).valid, false);
  }
  for (const fields of [
    { firstName: "  " }, { lastName: "" }, { firstName: "a".repeat(81) },
    { firstName: "Test\nKlant" },
    { postcode: "0000AB" }, { houseNumber: "12A" }, { street: "" }, { city: "" }, { country: "" },
    { initials: "\nA" }, { companyName: "x".repeat(201) }, { phone: "abc" },
    { notes: "x".repeat(2001) }, { notes: "\u0000" },
    { email: "" }, { email: "invalid" }, { email: "a@b" }, { email: "a\n@example.test" },
    { positions: 0 }, { positions: 21 }, { positions: 1.5 }, { positions: "5" },
    { capital: 1 }, { monthly: 1 }, { quarterly: 1 },
    { subscriptionConsentText: "edited" }, { subscriptionVersion: "old" },
    { strategy: "unknown" }, { agreementId: "old-version" },
    { agreementId: "copy-trading-v1-2026-10-18" },
    { agreementId: "copy-trading-v1.0-2026-09-01" },
    { generalTermsId: undefined }, { generalTermsId: "old" },
  ]) {
    assert.equal(validateAgreement({ ...validInput, ...fields }).valid, false);
  }
  assert.equal(validateAgreement(null).valid, false);
  const trimmed = validateAgreement({ ...validInput, initials: " J. ", firstName: " Jan ", lastName: " van  Dijk ", fullName: "untrusted", postcode: "2511bt", email: " test@example.test " });
  assert.equal(trimmed.data.accountNumber, undefined);
  assert.equal(trimmed.data.email, "test@example.test");
  assert.equal(trimmed.data.fullName, "J. Jan van Dijk");
  assert.equal(trimmed.data.postcode, "2511 BT");
  assert.equal(validateAgreement(validInput).data.fullName, "Testklant Voorbeeld");
  assert.equal(normalizePostcode("1234ab"), "1234 AB");
  assert.equal(normalizePostcode("1234 AB"), "1234 AB");
  assert.equal(validateAgreement({ ...validInput, country: "België", postcode: "1000" }).valid, true);
  assert.equal(formatAgreementTime("2026-10-18T11:59:59.123Z"), "18-10-2026 om 13:59");
  assert.equal(formatAgreementTime("2026-12-31T23:30:00.000Z"), "01-01-2027 om 00:30");
  for (const subscription of subscriptions) {
    assert.equal(validateAgreement({
      ...validInput, ...subscription, subscriptionConsentText: subscriptionConsent(subscription),
    }).valid, true);
  }
});

test("exact customer pricing, Dutch amounts and singular consent", () => {
  const monthly = [25, 40, 50, 65, 80, 95, 110, 125, 140, 155, 170, 185, 200, 215, 230, 245, 260, 275, 290, 305];
  assert.deepEqual(subscriptions, monthly.map((rate, index) => ({
    positions: index + 1, capital: (index + 1) * 8500, monthly: rate, quarterly: rate * 3,
  })));
  assert.equal(formatSubscriptionAmount(8500), "€ 8.500");
  assert.equal(formatSubscriptionAmount(42500), "€ 42.500");
  assert.equal(formatSubscriptionAmount(240), "€ 240");
  assert.equal(subscriptionConsent(subscriptions[2]), "Ik bevestig mijn keuze voor Premie Collector Plus – volgsysteem met 3 posities tegen € 50 per maand (€ 150 per drie maanden). Het abonnement wordt voor drie maanden aangegaan en vooraf betaald, wordt daarna telkens automatisch met drie maanden verlengd en kan worden opgezegd tot uiterlijk één maand vóór de eerstvolgende verlengingsdatum.");
  assert.match(subscriptionConsent(subscriptions[0]), /met 1 positie tegen € 25 per maand \(€ 75 per drie maanden\)/);
  assert.match(subscriptionConsent(subscriptions[19]), /met 20 posities tegen € 305 per maand \(€ 915 per drie maanden\)/);
});

test("account migration preserves historical evidence and confirmation sequence", async () => {
  const db = new DatabaseSync(":memory:");
  try {
    for (const name of ["0001_agreement_acceptances.sql", "0002_subscription_acceptance.sql",
      "0003_agreement_notifications.sql", "0004_customer_billing.sql"]) {
      db.exec(await readFile(path.join(root, "migrations", name), "utf8"));
    }
    db.exec(`INSERT INTO agreement_acceptances (
      id, full_name, mexem_account_number, strategy, strategy_label,
      document_name, document_version, document_date, consent_text, accepted, accepted_at,
      confirmation_year
    ) VALUES ('historical', 'Historical customer', 'U1234567', 'strategy', 'strategy',
      'document', '1.0', '01-09-2026', 'Historical exact consent', 1, '2026-10-18T12:00:00Z', 2026)`);
    const before = { ...db.prepare("SELECT * FROM agreement_acceptances").get() };
    db.exec("BEGIN");
    db.exec(await readFile(path.join(root, "migrations", "0005_optional_legacy_account.sql"), "utf8"));
    db.exec("COMMIT");
    assert.deepEqual({ ...db.prepare("SELECT * FROM agreement_acceptances").get() }, before);
    db.exec(`INSERT INTO agreement_acceptances (
      id, full_name, strategy, strategy_label, document_name, document_version,
      document_date, consent_text, accepted, accepted_at, confirmation_year
    ) SELECT 'new', full_name, strategy, strategy_label, document_name, document_version,
      document_date, consent_text, accepted, accepted_at, confirmation_year
      FROM agreement_acceptances WHERE id = 'historical'`);
    const current = db.prepare("SELECT mexem_account_number, confirmation_number FROM agreement_acceptances WHERE id = 'new'").get();
    assert.equal(current.mexem_account_number, null);
    assert.equal(current.confirmation_number, "RUITAB-2026-002");
    db.exec(await readFile(path.join(root, "migrations", "0006_general_terms_acceptance.sql"), "utf8"));
    const historical = db.prepare("SELECT general_terms_accepted, general_terms_consent_text FROM agreement_acceptances WHERE id = 'historical'").get();
    assert.equal(historical.general_terms_accepted, null);
    assert.equal(historical.general_terms_consent_text, null);
  } finally {
    db.close();
  }
});

test("independent PDOK lookup matches postcode, number and addition and permits manual fallback", async (context) => {
  context.mock.method(console, "error", () => {});
  const origin = "https://example.test";
  let calls = 0;
  let providerResult = { response: { docs: [
    { postcode: "2511BT", huisnummer: 68, straatnaam: "Spui", woonplaatsnaam: "'s-Gravenhage" },
    { postcode: "2511BT", huisnummer: 68, huisletter: "A", straatnaam: "Spui", woonplaatsnaam: "'s-Gravenhage" },
  ] } };
  let failed = false;
  context.mock.method(globalThis, "fetch", async (url) => {
    calls++;
    assert.equal(url.hostname, "api.pdok.nl");
    assert.equal(url.searchParams.get("rows"), "100");
    assert.ok(url.searchParams.getAll("fq").includes('postcode:"2511BT"'));
    assert.ok(url.searchParams.getAll("fq").includes("huisnummer:68"));
    assert.ok(!url.href.includes("U1234567"));
    if (failed) throw new Error("provider unavailable");
    return Response.json(providerResult);
  });
  const request = (input, headers = {}) => lookupPostcode({
    request: new Request(`${origin}/api/postcode`, {
      method: "POST", headers: { Origin: origin, "Content-Type": "application/json", ...headers },
      body: JSON.stringify(input),
    }),
  });
  const input = { postcode: "2511 bt", houseNumber: "68", addition: "" };
  assert.deepEqual(await (await request(input)).json(), { found: true, street: "Spui", city: "'s-Gravenhage" });
  assert.equal((await (await request({ ...input, addition: "a" })).json()).found, true);
  assert.equal((await (await request({ ...input, addition: "Z" })).json()).found, false);
  providerResult = { response: { docs: [
    { postcode: "2511BT", huisnummer: 68, huisletter: "A", straatnaam: "Spui", woonplaatsnaam: "'s-Gravenhage" },
    { postcode: "2511BT", huisnummer: 68, huisletter: "C", straatnaam: "Spui", woonplaatsnaam: "'s-Gravenhage" },
  ] } };
  assert.deepEqual(await (await request(input)).json(), { found: true, street: "Spui", city: "'s-Gravenhage" });
  providerResult.response.docs[1].straatnaam = "Andere straat";
  assert.equal((await (await request(input)).json()).found, false);
  assert.equal((await (await request({ ...input, addition: "A" })).json()).found, true);
  providerResult = { response: { numFound: 101, docs: [
    { postcode: "2511BT", huisnummer: 68, straatnaam: "Spui", woonplaatsnaam: "'s-Gravenhage" },
  ] } };
  assert.equal((await (await request(input)).json()).found, false);
  providerResult = { response: { docs: [] } };
  assert.equal((await (await request(input)).json()).found, false);
  providerResult = { unexpected: [] };
  assert.equal((await request(input)).status, 503);
  failed = true;
  assert.match((await (await request(input)).json()).message, /handmatig/);
  const prior = calls;
  assert.equal((await request({ ...input, houseNumber: "U1234567" })).status, 400);
  assert.equal((await request({ ...input, postcode: '2511BT" OR *:*' })).status, 400);
  assert.equal((await request(input, { Origin: "https://other.test" })).status, 403);
  assert.equal((await request(input, { "Content-Type": "text/plain" })).status, 415);
  assert.equal((await request({ ...input, postcode: "X".repeat(2000) })).status, 413);
  assert.equal(calls, prior);
});

test("built HTML has exact robots directive and no discoverable links or sitemap entry", async () => {
  const html = await readFile(path.join(root, "out", "klant", "overeenkomst.html"), "utf8");
  assert.match(html, /<meta name="robots" content="noindex, nofollow"\s*\/?>/);
  assert.match(html, /Bevestig uw MakeMoreMoney-abonnement/);
  assert.doesNotMatch(html, /Private investing|Plan een gesprek|hello@makemoremoney.nl|<nav\b|href="\/contact"/i);
  assert.match(html, /© MakeMoreMoney/);
  assert.doesNotMatch(html, /Het document opent in een nieuw tabblad/);
  assert.match(html, /U hoeft deze koppeling niet opnieuw uit te voeren/);
  assert.ok(html.includes(agreement.consentText));
  assert.match(html, /<input(?=[^>]*name="generalTermsAccepted")(?=[^>]*required)[^>]*>/);
  assert.match(html, /href="\/algemene-voorwaarden"[^>]*target="_blank"/);
  assert.equal(generalTerms.consentText, "Ik heb de Algemene Voorwaarden MakeMoreMoney gelezen en ga hiermee akkoord.");
  assert.doesNotMatch(html, /Beleggingsrekening|MEXEM-rekeningnummer|name="accountNumber"/);
  assert.doesNotMatch(html, /<p[^>]*>Versie /);
  assert.ok(!html.includes(subscriptionTerms));
  assert.doesNotMatch(html, /Wij bewaren uw naam/);
  assert.doesNotMatch(html, /Het abonnement wordt per drie maanden vooruitbetaald\./);
  for (const label of ["Voornaam", "Achternaam", "Factuuradres", "Huisnummer", "Woonplaats", "Land"]) {
    assert.ok(html.includes(label));
  }
  for (const route of ["index", "contact", "abonnement", "dashboard", "resultaten", "tarieven", "werkwijze", "werk-in-voortgang"]) {
    const otherHtml = await readFile(path.join(root, "out", `${route}.html`), "utf8");
    assert.doesNotMatch(otherHtml, /href=["']\/klant\/overeenkomst/);
    if (route === "contact") {
      assert.match(otherHtml, /Private investing/);
      assert.match(otherHtml, /Plan een gesprek/);
      assert.match(otherHtml, /hello@makemoremoney.nl/);
    }
  }
  for (const sitemap of ["sitemap.xml", "sitemap.txt", "sitemap-index.xml"]) {
    try {
      const contents = await readFile(path.join(root, "out", sitemap), "utf8");
      assert.ok(!contents.includes("/klant/overeenkomst"));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
});

test("missing PDF, HTML fallback or missing database cannot register an agreement", async (context) => {
  context.mock.method(console, "error", () => {});
  const origin = "https://example.test";
  for (const env of [
    { ASSETS: { fetch: async () => new Response("", { status: 404 }) }, AGREEMENTS_DB: {} },
    { ASSETS: { fetch: async () => new Response("<html>404</html>", { headers: { "Content-Type": "text/html" } }) }, AGREEMENTS_DB: {} },
    { ASSETS: { fetch: async () => new Response("", { headers: { "Content-Type": "application/pdf" } }) } },
  ]) {
    const status = await onRequest({ request: new Request(`${origin}/api/overeenkomst`), env });
    assert.equal((await status.json()).available, false);
    const response = await onRequest({
      request: new Request(`${origin}/api/overeenkomst`, {
        method: "POST", headers: { Origin: origin, "Content-Type": "application/json" },
        body: JSON.stringify(validInput),
      }),
      env,
    });
    assert.equal(response.status, 503);
  }
});

test("Hostnet notification requires TLS, follows storage and handles failures without losing consent", async (context) => {
  context.mock.method(console, "error", () => {});
  const origin = "https://example.test";
  for (const outcome of ["queued", "rejected", "owner-rejected", "auth-error", "timeout", "insert-failure", "read-failure", "missing-record", "status-failure"]) {
    const events = [];
    let stored = false;
    let status;
    const snapshot = {
      id: "stored-registration-id",
      full_name: "Opgeslagen Klant",
      first_name: "Opgeslagen",
      company_name: "Voorbeeld BV",
      street: "Spui",
      house_number: "68",
      house_number_addition: "A",
      postcode: "2511 BT",
      city: "'s-Gravenhage",
      country: "Nederland",
      confirmation_number: "RUITAB-2026-042",
      notes: "Opgeslagen opmerkingen",
      email: "stored@example.test",
      strategy_label: "Opgeslagen strategie",
      positions: 3,
      indicative_capital: 25500,
      monthly_rate: 51,
      quarterly_rate: 153,
      document_name: "Opgeslagen document",
      document_version: "stored-version",
      document_date: "17-10-2026",
      consent_text: "Exact opgeslagen eerste akkoord.",
      subscription_consent_text: "Exact opgeslagen tweede akkoord met voorwaarden.",
      general_terms_name: "Opgeslagen algemene voorwaarden",
      general_terms_version: "stored-terms-version",
      general_terms_date: "stored-terms-date",
      accepted_at: "2026-10-18T11:00:00.000Z",
    };
    context.mock.method(nodemailer, "createTransport", (options) => {
      assert.equal(options.host, "smtp.hostnet.nl");
      assert.equal(options.port, 587);
      assert.equal(options.requireTLS, true);
      assert.equal(options.tls.rejectUnauthorized, true);
      assert.equal(options.tls.servername, "smtp.hostnet.nl");
      assert.equal(options.auth.user, "michiel2@mijs.nl");
      assert.equal(options.auth.pass, "test-password");
      const socket = new EventEmitter();
      socket.setTimeout = () => socket;
      socket.destroy = () => {};
      context.mock.method(net, "createConnection", (connectionOptions) => {
        assert.deepEqual(connectionOptions, { host: "smtp.hostnet.nl", port: 587 });
        return socket;
      });
      let connectedSocket;
      options.getSocket({}, (error, result) => {
        assert.equal(error, null);
        connectedSocket = result.connection;
      });
      socket.emit("connect");
      assert.equal(connectedSocket, socket);
      assert.equal(socket.listenerCount("timeout"), 0);
      return { close() {}, async sendMail(message) {
      events.push("email");
      assert.equal(stored, true);
      assert.equal(message.to, snapshot.email);
      assert.equal(message.bcc, "michiel@mijs.nl");
      assert.deepEqual(message.from, { name: "Make More Money", address: "michiel2@mijs.nl" });
      assert.equal(message.subject, "Bevestiging MakeMoreMoney-abonnement en overeenkomst");
      for (const text of [
        `Beste ${snapshot.first_name},`, snapshot.strategy_label, snapshot.confirmation_number,
        snapshot.full_name, snapshot.company_name, "Spui 68A", "2511 BT 's-Gravenhage", snapshot.country,
        snapshot.document_name, snapshot.notes,
        `U heeft ook akkoord gegeven op de ${snapshot.general_terms_name}, versie ${snapshot.general_terms_version} van ${snapshot.general_terms_date}.`,
        "Aantal posities: 3", "€ 25.500", "€ 51 per maand", "€ 153 per drie maanden",
        "18-10-2026 om 13:00", subscriptionTerms, "Met vriendelijke groet,",
      ]) assert.ok(message.text.includes(text), `Missing stored mail content: ${text}`);
      assert.ok(!message.text.includes(validInput.subscriptionConsentText));
      assert.ok(!message.text.includes(agreement.consentText));
      assert.ok(!message.text.includes(snapshot.id));
      assert.ok(!message.text.includes(snapshot.consent_text));
      assert.ok(!message.text.includes(snapshot.subscription_consent_text));
      assert.equal(message.text.match(/Aantal posities:/g).length, 1);
      assert.ok(!message.text.includes("TradeConnector"));
      if (outcome === "timeout" || outcome === "auth-error") throw new Error("simulated SMTP failure");
      return {
        accepted: outcome === "queued" || outcome === "status-failure"
          ? [snapshot.email, "michiel@mijs.nl"] : outcome === "owner-rejected" ? [snapshot.email] : [],
        rejected: outcome === "rejected" ? [snapshot.email] : outcome === "owner-rejected" ? ["michiel@mijs.nl"] : [],
      };
      } };
    });
    const database = {
      prepare(sql) {
        return { bind(...values) {
          return { async first() {
            events.push("read");
            assert.equal(stored, true);
            assert.match(sql, /SELECT/);
            if (outcome === "read-failure") throw new Error("read unavailable");
            return outcome === "missing-record" ? null : snapshot;
          }, async run() {
            if (sql.includes("INSERT")) {
              events.push("insert");
              if (outcome === "insert-failure") throw new Error("storage unavailable");
              stored = true;
            } else {
              events.push("status");
              status = values[0];
              if (outcome === "status-failure") throw new Error("status unavailable");
            }
            return { success: true, meta: { changes: 1 } };
          } };
        } };
      },
    };
    const response = await onRequest({
      request: new Request(`${origin}/api/overeenkomst`, {
        method: "POST", headers: { Origin: origin, "Content-Type": "application/json" },
        body: JSON.stringify(validInput),
      }),
      env: {
        AGREEMENTS_DB: database,
        ASSETS: { fetch: async () => new Response("", { headers: { "Content-Type": "application/pdf" } }) },
        SMTP_PASSWORD: "test-password",
      },
    });
    const result = await response.json();
    if (outcome === "insert-failure") {
      assert.equal(response.status, 503);
      assert.deepEqual(events, ["insert"]);
    } else if (outcome === "read-failure" || outcome === "missing-record") {
      assert.equal(response.status, 503);
      assert.deepEqual(events, ["insert", "read"]);
      assert.match(result.message, /opgeslagen/);
      assert.match(result.message, /niet opnieuw/);
      assert.equal(result.id, undefined);
    } else {
      assert.equal(response.status, 201);
      assert.deepEqual(events, outcome === "read-failure" || outcome === "missing-record"
        ? ["insert", "read", "status"] : ["insert", "read", "email", "status"]);
      const expected = outcome === "queued" || outcome === "status-failure" ? "queued" : "failed";
      assert.equal(status, expected);
      assert.equal(result.notificationStatus, expected);
      assert.equal(result.confirmationNumber, snapshot.confirmation_number);
      assert.equal(result.id, undefined);
      if (expected === "failed" || outcome === "status-failure") {
        assert.match(result.notificationWarning, /niet opnieuw/);
      } else {
        assert.equal(result.notificationWarning, undefined);
      }
    }
    context.mock.restoreAll();
    context.mock.method(console, "error", () => {});
  }
});

test("Cloudflare Function stores real D1 records and rejects invalid or unavailable submissions", { timeout: 180000 }, async () => {
  const directory = await mkdtemp(path.join(tmpdir(), "mmm-agreement-test-"));
  const assets = path.join(directory, "assets");
  const persist = path.join(directory, "state");
  const config = path.join(root, "wrangler.jsonc");
  let server;
  let output = "";
  const run = (args) => execFileSync(process.execPath, [wrangler, ...args], {
    cwd: root, encoding: "utf8", timeout: 60000,
    env: { ...process.env, CI: "true", WRANGLER_SEND_METRICS: "false" },
    windowsHide: true,
  });
  try {
    await cp(path.join(root, "out"), assets, { recursive: true });
    await mkdir(path.join(assets, "documenten"), { recursive: true });
    await writeFile(path.join(assets, agreement.documentPath),
      "%PDF-1.4\n% Local automated test document only; not a customer agreement.\n%%EOF\n");
    run(["d1", "migrations", "apply", "AGREEMENTS_DB", "--local", "--config", config, "--persist-to", persist]);
    server = spawn(process.execPath, [
      wrangler, "pages", "dev", assets,
      "--port", "8793", "--ip", "127.0.0.1", "--persist-to", persist,
    ], { cwd: root, env: { ...process.env, CI: "true", WRANGLER_SEND_METRICS: "false" }, windowsHide: true });
    server.stdout.on("data", (data) => { output += data; });
    server.stderr.on("data", (data) => { output += data; });
    const origin = "http://127.0.0.1:8793";
    let ready = false;
    for (let attempt = 0; attempt < 120; attempt++) {
      if (server.exitCode !== null) throw new Error(`Cloudflare emulator exited: ${output}`);
      try {
        const response = await fetch(`${origin}/api/overeenkomst`);
        if (response.ok) { ready = true; break; }
      } catch {
        // The emulator is still starting.
      }
      await delay(500);
    }
    assert.ok(ready, `Cloudflare emulator failed to start: ${output}`);
    const post = (body, headers = {}) => fetch(`${origin}/api/overeenkomst`, {
      method: "POST", headers: { Origin: origin, "Content-Type": "application/json", ...headers },
      body: typeof body === "string" ? body : JSON.stringify(body),
    });
    assert.equal((await (await fetch(`${origin}/api/overeenkomst`)).json()).available, true);
    assert.equal((await post({ ...validInput, accepted: false })).status, 400);
    assert.equal((await post({ ...validInput, accepted: "true" })).status, 400);
    assert.equal((await post({ ...validInput, subscriptionAccepted: false })).status, 400);
    assert.equal((await post({ ...validInput, subscriptionAccepted: "true" })).status, 400);
    for (const generalTermsAccepted of [false, undefined, "true", "on", 1, null]) {
      assert.equal((await post({ ...validInput, generalTermsAccepted })).status, 400);
    }
    assert.equal((await post({ ...validInput, generalTermsId: "old" })).status, 400);
    assert.equal((await post({ ...validInput, email: "invalid" })).status, 400);
    assert.equal((await post({ ...validInput, positions: 21 })).status, 400);
    assert.equal((await post({ ...validInput, monthly: 1 })).status, 400);
    assert.equal((await post({ ...validInput, subscriptionConsentText: "altered" })).status, 400);
    assert.equal((await post({ ...validInput, strategy: "unknown" })).status, 400);
    assert.equal((await post({ ...validInput, agreementId: "old" })).status, 400);
    assert.equal((await post({ ...validInput, firstName: " " })).status, 400);
    assert.equal((await post("{")).status, 400);
    assert.equal((await post("x".repeat(17000))).status, 413);
    assert.equal((await post(validInput, { Origin: "https://example.org" })).status, 403);
    assert.equal((await post(validInput, { "Content-Type": "text/plain" })).status, 415);
    assert.equal((await fetch(`${origin}/api/overeenkomst`, { method: "DELETE" })).status, 405);

    const response = await post(validInput);
    assert.equal(response.status, 201);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    const receipt = await response.json();
    assert.equal(receipt.notificationStatus, "not_configured");
    assert.match(receipt.notificationWarning, /niet opnieuw/);
    assert.match(receipt.confirmationNumber, /^RUITAB-[0-9]{4}-001$/);
    assert.equal(receipt.id, undefined);
    assert.ok(Number.isFinite(Date.parse(receipt.acceptedAt)));
    const records = JSON.parse(run([
      "d1", "execute", "AGREEMENTS_DB", "--local", "--config", config, "--persist-to", persist,
      "--command", "SELECT * FROM agreement_acceptances", "--json",
    ]))[0].results;
    assert.equal(records.length, 1, "Rejected requests must not create records");
    assert.ok(Number.isFinite(Date.parse(records[0].notification_updated_at)));
    assert.deepEqual({ ...records[0], notification_updated_at: undefined }, {
      id: records[0].id,
      full_name: validInput.fullName,
      mexem_account_number: null,
      strategy: validInput.strategy,
      strategy_label: subscriptionStrategy,
      document_name: agreement.name,
      document_version: agreement.version,
      document_date: agreement.date,
      consent_text: agreement.consentText,
      accepted: 1,
      accepted_at: receipt.acceptedAt,
      email: validInput.email,
      positions: 5,
      indicative_capital: 42500,
      monthly_rate: 80,
      quarterly_rate: 240,
      subscription_consent_text: validInput.subscriptionConsentText,
      subscription_accepted: 1,
      subscription_version: subscriptionVersion,
      general_terms_name: generalTerms.name,
      general_terms_version: generalTerms.version,
      general_terms_date: generalTerms.date,
      general_terms_consent_text: generalTerms.consentText,
      general_terms_accepted: 1,
      notification_status: "not_configured",
      notification_updated_at: undefined,
      initials: validInput.initials,
      first_name: validInput.firstName,
      last_name: validInput.lastName,
      company_name: validInput.companyName,
      phone: validInput.phone,
      postcode: validInput.postcode,
      house_number: validInput.houseNumber,
      house_number_addition: validInput.houseNumberAddition,
      street: validInput.street,
      city: validInput.city,
      country: validInput.country,
      notes: validInput.notes,
      confirmation_year: Number(receipt.confirmationNumber.split("-")[1]),
      confirmation_number: receipt.confirmationNumber,
    });
    assert.match(records[0].id, /^[0-9a-f-]{36}$/);
    const concurrent = await Promise.all(Array.from({ length: 8 }, () => post(validInput).then(async (r) => {
      assert.equal(r.status, 201);
      return r.json();
    })));
    const numbers = concurrent.map((r) => r.confirmationNumber);
    assert.equal(new Set(numbers).size, 8, "Concurrent registrations must have unique confirmation numbers");
    assert.deepEqual(numbers.map((n) => Number(n.split("-")[2])).sort((a, b) => a - b), [2, 3, 4, 5, 6, 7, 8, 9]);
    const clonedInsert = (id, year) => `INSERT INTO agreement_acceptances (
      id, full_name, mexem_account_number, strategy, strategy_label,
      document_name, document_version, document_date, consent_text, accepted, accepted_at,
      confirmation_year
    ) SELECT '${id}', full_name, mexem_account_number, strategy, strategy_label,
      document_name, document_version, document_date, consent_text, accepted, accepted_at,
      ${year} FROM agreement_acceptances LIMIT 1`;
    run(["d1", "execute", "AGREEMENTS_DB", "--local", "--config", config, "--persist-to", persist,
      "--command", `${clonedInsert("legacy-test", "NULL")}; ${clonedInsert("next-year-test", 2099)}`]);
    const years = JSON.parse(run(["d1", "execute", "AGREEMENTS_DB", "--local", "--config", config, "--persist-to", persist,
      "--command", "SELECT id, confirmation_number, first_name FROM agreement_acceptances WHERE id IN ('legacy-test', 'next-year-test') ORDER BY id", "--json"]))[0].results;
    assert.deepEqual(years, [
      { id: "legacy-test", confirmation_number: null, first_name: null },
      { id: "next-year-test", confirmation_number: "RUITAB-2099-001", first_name: null },
    ]);
    run(["d1", "execute", "AGREEMENTS_DB", "--local", "--config", config, "--persist-to", persist,
      "--command", `UPDATE agreement_confirmation_sequences SET sequence = 999 WHERE year = ${Number(receipt.confirmationNumber.split("-")[1])}`]);
    assert.match((await (await post(validInput)).json()).confirmationNumber, /^RUITAB-[0-9]{4}-1000$/);
    run(["d1", "execute", "AGREEMENTS_DB", "--local", "--config", config, "--persist-to", persist,
      "--command", "DROP TABLE agreement_acceptances"]);
    assert.equal((await post(validInput)).status, 503, "Storage errors must not report success");
    const page = await fetch(`${origin}/klant/overeenkomst`);
    assert.equal(page.status, 200);
    assert.match(await page.text(), /<meta name="robots" content="noindex, nofollow"\s*\/?>/);
  } catch (error) {
    throw new Error(`Integration test failed. Emulator output:\n${output}`, { cause: error });
  } finally {
    if (server && server.exitCode === null) {
      server.kill();
      await Promise.race([once(server, "exit"), delay(5000)]);
    }
    await rm(directory, { recursive: true, force: true, maxRetries: 10, retryDelay: 500 });
  }
});
