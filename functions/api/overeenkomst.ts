import type { D1Database } from "@cloudflare/workers-types";
import nodemailer from "nodemailer";
import net from "node:net";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { agreement, formatSubscriptionAmount, subscriptionTerms, validateAgreement } from "../../lib/agreement";

type Environment = {
  AGREEMENTS_DB?: D1Database;
  ASSETS: { fetch: typeof fetch };
  SMTP_PASSWORD?: string;
};

const notificationRecipient = "michiel@mijs.nl";
const notificationSender = "michiel2@mijs.nl";

type StoredAgreement = {
  id: string;
  full_name: string;
  email: string;
  strategy_label: string;
  positions: number;
  indicative_capital: number;
  monthly_rate: number;
  quarterly_rate: number;
  document_name: string;
  document_version: string;
  document_date: string;
  consent_text: string;
  subscription_consent_text: string;
  accepted_at: string;
};

async function notifyCustomer(env: Environment, data: StoredAgreement) {
  if (!env.SMTP_PASSWORD) {
    console.error("agreement_email_not_configured");
    return "not_configured";
  }
  const transport = nodemailer.createTransport({
    host: "smtp.hostnet.nl",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user: notificationSender, pass: env.SMTP_PASSWORD },
    tls: { servername: "smtp.hostnet.nl", minVersion: "TLSv1.2", rejectUnauthorized: true },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    logger: false,
    debug: false,
    disableFileAccess: true,
    disableUrlAccess: true,
    // Preserve the hostname on Workers' socket for STARTTLS certificate checks.
    getSocket(_options: SMTPTransport.Options, callback: (error: Error | null, options?: { connection: net.Socket }) => void) {
      const socket = net.createConnection({ host: "smtp.hostnet.nl", port: 587 });
      const fail = (error: Error) => {
        socket.removeListener("connect", connected);
        socket.destroy();
        callback(error);
      };
      const timedOut = () => fail(new Error("SMTP connection timeout"));
      const connected = () => {
        socket.removeListener("error", fail);
        socket.removeListener("timeout", timedOut);
        socket.setTimeout(0);
        callback(null, { connection: socket });
      };
      socket.once("error", fail);
      socket.once("timeout", timedOut);
      socket.once("connect", connected);
      socket.setTimeout(10000);
    },
  });
  try {
    const result = await transport.sendMail({
          to: data.email,
          bcc: notificationRecipient,
          from: { name: "Make More Money", address: notificationSender },
          subject: "Bevestiging MakeMoreMoney-abonnement en overeenkomst",
          text: [
            `Beste ${data.full_name},`,
            "Bedankt voor uw bevestiging.",
            "Hierbij bevestigen wij uw abonnement op:",
            data.strategy_label,
            "Uw abonnementsgegevens:",
            [
              `Aantal posities: ${data.positions}`,
              `Indicatief benodigd kapitaal: ${formatSubscriptionAmount(data.indicative_capital)}`,
              `Abonnementskosten: ${formatSubscriptionAmount(data.monthly_rate)} per maand`,
              `Te betalen: ${formatSubscriptionAmount(data.quarterly_rate)} per drie maanden`,
            ].join("\n"),
            subscriptionTerms,
            "U heeft daarnaast akkoord gegeven op:",
            `${data.document_name}\nVersie ${data.document_version} van ${data.document_date}`,
            `Datum en tijd van akkoord:\n${new Intl.DateTimeFormat("nl-NL", {
              dateStyle: "long", timeStyle: "long", timeZone: "Europe/Amsterdam",
            }).format(new Date(data.accepted_at))}`,
            `Registratienummer:\n${data.id}`,
            `Uw bevestiging:\n“${data.subscription_consent_text}”`,
            `U heeft eveneens bevestigd:\n“${data.consent_text}”`,
            "Aan uw bestaande MEXEM/TradeConnector-koppeling verandert niets.",
            "Met vriendelijke groet,",
            "MakeMoreMoney",
          ].join("\n\n"),
    });
    if ([data.email, notificationRecipient].every((expected) =>
          result.accepted.some((recipient) => typeof recipient === "string" && recipient === expected)) &&
        result.rejected.length === 0) {
      return "queued";
    }
    console.error("agreement_email_send_failed");
    return "failed";
  } catch (error) {
    const code = error instanceof Error && "code" in error &&
      typeof error.code === "string" && /^[A-Z_0-9]{1,40}$/.test(error.code)
      ? error.code : "UNKNOWN";
    const responseCode = error instanceof Error && "responseCode" in error &&
      typeof error.responseCode === "number" ? error.responseCode : undefined;
    const command = error instanceof Error && "command" in error &&
      typeof error.command === "string" && /^(CONN|EHLO|HELO|STARTTLS|AUTH|DATA)$/.test(error.command)
      ? error.command : undefined;
    const reason = error instanceof Error
      ? ["not implemented", "not supported", "is not a function", "certificate", "ECONNREFUSED", "ECONNRESET", "timeout", "starttls", "TLS", "DNS", "socket"]
        .find((category) => error.message.toLowerCase().includes(category.toLowerCase()))
      : undefined;
    console.error("agreement_email_request_failed", { code, responseCode, command, reason });
    return "failed";
  } finally {
    transport.close();
  }
}

function json(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

async function documentAvailable(request: Request, env: Environment) {
  const response = await env.ASSETS.fetch(new Request(new URL(agreement.documentPath, request.url), { method: "HEAD" }));
  return response.ok && response.headers.get("Content-Type")?.split(";")[0].trim() === "application/pdf";
}

async function readPayload(request: Request): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new Error("empty_body");
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 8192) {
      await reader.cancel();
      throw new Error("body_too_large");
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return JSON.parse(new TextDecoder().decode(bytes));
}

export async function onRequest({ request, env }: { request: Request; env: Environment }) {
  if (request.method !== "GET" && request.method !== "POST") {
    const response = json({ message: "Deze methode is niet toegestaan." }, 405);
    response.headers.set("Allow", "GET, POST");
    return response;
  }

  if (request.method === "POST") {
    if (request.headers.get("Origin") !== new URL(request.url).origin) {
      return json({ message: "Verzend het formulier vanaf de MakeMoreMoney-website." }, 403);
    }
    if (request.headers.get("Content-Type")?.split(";")[0].trim() !== "application/json") {
      return json({ message: "Ongeldig formulierformaat." }, 415);
    }
    if (Number(request.headers.get("Content-Length")) > 8192) {
      return json({ message: "De inzending is te groot." }, 413);
    }
  }

  let available: boolean;
  try {
    available = Boolean(env.AGREEMENTS_DB) && await documentAvailable(request, env);
  } catch {
    console.error("agreement_document_check_failed");
    return json({ message: "Het document kan momenteel niet worden gecontroleerd. Probeer het later opnieuw." }, 503);
  }
  if (request.method === "GET") return json({ available });
  const database = env.AGREEMENTS_DB;
  if (!available || !database) {
    console.error("agreement_registration_unavailable");
    return json({ message: "De overeenkomst of registratie is nog niet beschikbaar. Uw akkoord is niet geregistreerd. Probeer het later opnieuw." }, 503);
  }

  let payload: unknown;
  try {
    payload = await readPayload(request);
  } catch (error) {
    if (error instanceof Error && error.message === "body_too_large") {
      return json({ message: "De inzending is te groot." }, 413);
    }
    return json({ message: "De formuliergegevens konden niet worden gelezen. Controleer uw invoer." }, 400);
  }
  const validation = validateAgreement(payload);
  if (!validation.valid) return json({ message: validation.message }, 400);

  const id = crypto.randomUUID();
  const acceptedAt = new Date().toISOString();
  try {
    const result = await database.prepare(`
      INSERT INTO agreement_acceptances (
        id, full_name, mexem_account_number, strategy, strategy_label,
        document_name, document_version, document_date, consent_text, accepted, accepted_at,
        email, positions, indicative_capital, monthly_rate, quarterly_rate,
        subscription_consent_text, subscription_accepted, subscription_version, notification_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `).bind(
      id,
      validation.data.fullName,
      validation.data.accountNumber,
      validation.data.strategy,
      validation.data.strategy,
      agreement.name,
      agreement.version,
      agreement.date,
      agreement.consentText,
      1,
      acceptedAt,
      validation.data.email,
      validation.data.positions,
      validation.data.capital,
      validation.data.monthly,
      validation.data.quarterly,
      validation.data.subscriptionConsentText,
      1,
      validation.data.subscriptionVersion,
    ).run();
    if (!result.success || result.meta.changes !== 1) {
      console.error("agreement_insert_not_confirmed");
      return json({ message: "De registratie is niet bevestigd. Neem contact op met MakeMoreMoney." }, 503);
    }
  } catch {
    console.error("agreement_storage_failed");
    return json({ message: "Uw akkoord kon niet worden geregistreerd. Probeer het later opnieuw." }, 503);
  }

  let notificationStatus = "failed";
  try {
    const stored = await database.prepare(`
      SELECT id, full_name, email, strategy_label, positions, indicative_capital,
        monthly_rate, quarterly_rate, document_name, document_version, document_date,
        consent_text, subscription_consent_text, accepted_at
      FROM agreement_acceptances WHERE id = ?
    `).bind(id).first<StoredAgreement>();
    if (!stored) {
      console.error("agreement_email_record_missing");
    } else {
      notificationStatus = await notifyCustomer(env, stored);
    }
  } catch {
    console.error("agreement_email_record_read_failed");
  }
  let notificationRecorded = false;
  try {
    const result = await database.prepare(`
      UPDATE agreement_acceptances SET notification_status = ?, notification_updated_at = ? WHERE id = ?
    `).bind(notificationStatus, new Date().toISOString(), id).run();
    notificationRecorded = result.success && result.meta.changes === 1;
    if (!notificationRecorded) console.error("agreement_email_status_not_confirmed");
  } catch {
    console.error("agreement_email_status_storage_failed");
  }
  const notificationWarning = !notificationRecorded ||
    notificationStatus !== "queued"
    ? "Uw registratie is opgeslagen, maar de verzending van uw bevestigingsmail of de kopie aan MakeMoreMoney is niet bevestigd. Verzend het formulier niet opnieuw."
    : undefined;
  return json({ id, acceptedAt, notificationStatus, notificationWarning }, 201);
}
