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

const root = process.cwd();
const wrangler = path.join(root, "node_modules", "wrangler", "bin", "wrangler.js");
const source = await readFile(path.join(root, "lib", "agreement.ts"), "utf8");
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const agreementModuleUrl = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;
const {
  agreement, subscriptions, subscriptionStrategy, subscriptionVersion,
  subscriptionConsent, formatSubscriptionAmount, validateAgreement,
} = await import(agreementModuleUrl);
const handlerSource = await readFile(path.join(root, "functions", "api", "overeenkomst.ts"), "utf8");
const handlerCompiled = ts.transpileModule(handlerSource, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText
  .replace('"../../lib/agreement"', JSON.stringify(agreementModuleUrl))
  .replace('"nodemailer"', JSON.stringify(import.meta.resolve("nodemailer")));
const { onRequest } = await import(`data:text/javascript;base64,${Buffer.from(handlerCompiled).toString("base64")}`);
const validInput = {
  fullName: "Testklant Voorbeeld",
  email: "test@example.test",
  accountNumber: "U1234567",
  strategy: subscriptionStrategy,
  ...subscriptions[4],
  accepted: true,
  subscriptionAccepted: true,
  subscriptionConsentText: subscriptionConsent(subscriptions[4]),
  subscriptionVersion,
  agreementId: agreement.id,
};

test("validation requires explicit consent, current document and valid fields", () => {
  assert.equal(validateAgreement(validInput).valid, true);
  for (const accepted of [false, undefined, "true", "on", 1, null]) {
    assert.equal(validateAgreement({ ...validInput, accepted }).valid, false);
    assert.equal(validateAgreement({ ...validInput, subscriptionAccepted: accepted }).valid, false);
  }
  for (const fields of [
    { fullName: "  " }, { fullName: "A" }, { fullName: "a".repeat(201) },
    { fullName: "Test\nKlant" }, { accountNumber: "" },
    { accountNumber: "<script>" }, { accountNumber: "a".repeat(33) },
    { accountNumber: "u1234567" }, { accountNumber: "U123x" }, { accountNumber: "U12 34" },
    { email: "" }, { email: "invalid" }, { email: "a@b" }, { email: "a\n@example.test" },
    { positions: 0 }, { positions: 21 }, { positions: 1.5 }, { positions: "5" },
    { capital: 1 }, { monthly: 1 }, { quarterly: 1 },
    { subscriptionConsentText: "edited" }, { subscriptionVersion: "old" },
    { strategy: "unknown" }, { agreementId: "old-version" },
  ]) {
    assert.equal(validateAgreement({ ...validInput, ...fields }).valid, false);
  }
  assert.equal(validateAgreement(null).valid, false);
  const trimmed = validateAgreement({ ...validInput, fullName: "  Test Klant  ", accountNumber: " U123 ", email: " test@example.test " });
  assert.equal(trimmed.data.accountNumber, "U123");
  assert.equal(trimmed.data.email, "test@example.test");
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
  assert.equal(subscriptionConsent(subscriptions[4]), "Ik bevestig dat Premie Collector Plus – volgsysteem en het gekozen abonnement van 5 posities, tegen € 80 per maand en € 240 per drie maanden, overeenkomen met de dienstverlening waarvan ik gebruik wil maken.");
  assert.match(subscriptionConsent(subscriptions[0]), /van 1 positie, tegen € 25 per maand en € 75 per drie maanden/);
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
  for (const outcome of ["queued", "rejected", "auth-error", "timeout", "insert-failure", "status-failure"]) {
    const events = [];
    let stored = false;
    let status;
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
      assert.equal(message.to, "michiel@mijs.nl");
      assert.deepEqual(message.from, { name: "Make More Money", address: "michiel2@mijs.nl" });
      assert.ok(message.text.includes(validInput.subscriptionConsentText));
      assert.ok(message.text.includes(agreement.consentText));
      assert.ok(message.text.includes("€ 240"));
      if (outcome === "timeout" || outcome === "auth-error") throw new Error("simulated SMTP failure");
      return {
        accepted: outcome === "queued" || outcome === "status-failure" ? ["michiel@mijs.nl"] : [],
        rejected: outcome === "rejected" ? ["michiel@mijs.nl"] : [],
      };
      } };
    });
    const database = {
      prepare(sql) {
        return { bind(...values) {
          return { async run() {
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
    } else {
      assert.equal(response.status, 201);
      assert.deepEqual(events, ["insert", "email", "status"]);
      const expected = outcome === "queued" || outcome === "status-failure" ? "queued" : "failed";
      assert.equal(status, expected);
      assert.equal(result.notificationStatus, expected);
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
    assert.equal((await post({ ...validInput, email: "invalid" })).status, 400);
    assert.equal((await post({ ...validInput, positions: 21 })).status, 400);
    assert.equal((await post({ ...validInput, monthly: 1 })).status, 400);
    assert.equal((await post({ ...validInput, subscriptionConsentText: "altered" })).status, 400);
    assert.equal((await post({ ...validInput, strategy: "unknown" })).status, 400);
    assert.equal((await post({ ...validInput, agreementId: "old" })).status, 400);
    assert.equal((await post({ ...validInput, fullName: " " })).status, 400);
    assert.equal((await post({ ...validInput, accountNumber: "<script>" })).status, 400);
    assert.equal((await post("{")).status, 400);
    assert.equal((await post("x".repeat(9000))).status, 413);
    assert.equal((await post(validInput, { Origin: "https://example.org" })).status, 403);
    assert.equal((await post(validInput, { "Content-Type": "text/plain" })).status, 415);
    assert.equal((await fetch(`${origin}/api/overeenkomst`, { method: "DELETE" })).status, 405);

    const response = await post(validInput);
    assert.equal(response.status, 201);
    assert.equal(response.headers.get("Cache-Control"), "no-store");
    const receipt = await response.json();
    assert.equal(receipt.notificationStatus, "not_configured");
    assert.match(receipt.notificationWarning, /niet opnieuw/);
    assert.match(receipt.id, /^[0-9a-f-]{36}$/);
    assert.ok(Number.isFinite(Date.parse(receipt.acceptedAt)));
    const records = JSON.parse(run([
      "d1", "execute", "AGREEMENTS_DB", "--local", "--config", config, "--persist-to", persist,
      "--command", "SELECT * FROM agreement_acceptances", "--json",
    ]))[0].results;
    assert.equal(records.length, 1, "Rejected requests must not create records");
    assert.ok(Number.isFinite(Date.parse(records[0].notification_updated_at)));
    assert.deepEqual({ ...records[0], notification_updated_at: undefined }, {
      id: receipt.id,
      full_name: validInput.fullName,
      mexem_account_number: validInput.accountNumber,
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
      notification_status: "not_configured",
      notification_updated_at: undefined,
    });
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
