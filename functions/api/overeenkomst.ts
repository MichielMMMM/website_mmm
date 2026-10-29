import type { D1Database } from "@cloudflare/workers-types";
import nodemailer from "nodemailer";
import net from "node:net";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { agreement, generalTerms, formatAgreementTime, formatSubscriptionAmount, subscriptionTerms, validateAgreement, confirmationPrefix, isConfirmationNumber } from "../../lib/agreement";
import type { AgreementInput } from "../../lib/agreement";

type Environment = {
  AGREEMENTS_DB?: D1Database;
  ASSETS: { fetch: typeof fetch };
  SMTP_INFO_PASSWORD?: string;
};

const notificationRecipient = "info@makemoremoney.nl";
const notificationSender = "info@makemoremoney.nl";

type StoredAgreement = {
  id: string;
  full_name: string;
  first_name: string;
  last_name: string;
  salutation: AgreementInput["salutation"];
  company_name: string;
  street: string;
  house_number: string;
  house_number_addition: string;
  postcode: string;
  city: string;
  country: string;
  notes: string;
  confirmation_number: string;
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
  general_terms_name: string;
  general_terms_version: string;
  general_terms_date: string;
  accepted_at: string;
};

function escapeHtml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

async function notifyCustomer(env: Environment, data: StoredAgreement) {
  if (!env.SMTP_INFO_PASSWORD) {
    console.error("agreement_email_not_configured");
    return "not_configured";
  }
  const transport = nodemailer.createTransport({
    host: "smtp.hostnet.nl",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: { user: notificationSender, pass: env.SMTP_INFO_PASSWORD },
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
    const greeting = data.salutation === "heer" ? `Geachte heer ${data.last_name},`
      : data.salutation === "mevrouw" ? `Geachte mevrouw ${data.last_name},`
      : `Geachte heer/mevrouw ${data.last_name},`;
    const documents = [
      { label: `De ${data.document_name}`, url: `https://makemoremoney.nl${agreement.documentPath}` },
      { label: "De algemene voorwaarden van MakeMoreMoney", url: `https://makemoremoney.nl${generalTerms.path}` },
    ];
    const documentList = documents.map(({ label, url }) => `- ${label}: ${url}`).join("\n");
    const paragraphs = [
            greeting,
            "Bedankt voor uw bevestiging. Hieronder vindt u de gegevens van uw abonnement en overeenkomst.",
            "UW ABONNEMENT",
            [
              `Strategie: ${data.strategy_label}`,
              `Aantal posities: ${data.positions}`,
              `Indicatief benodigd kapitaal: ${formatSubscriptionAmount(data.indicative_capital)}`,
              `Abonnementskosten: ${formatSubscriptionAmount(data.monthly_rate)} per maand`,
              `Te betalen: ${formatSubscriptionAmount(data.quarterly_rate)} per drie maanden`,
            ].join("\n"),
            subscriptionTerms,
            "FACTUURGEGEVENS",
            [
              ...(data.company_name ? [data.company_name] : []),
              data.full_name,
              `${data.street} ${data.house_number}${data.house_number_addition}`,
              `${data.postcode} ${data.city}`,
              data.country,
            ].join("\n"),
            ...(data.notes ? ["AANVULLENDE INFORMATIE", data.notes] : []),
            "UW OVEREENKOMST",
            "U heeft akkoord gegeven op:",
            documentList,
            [
              `Datum akkoord: ${formatAgreementTime(data.accepted_at)}`,
              `Bevestigingsnummer: ${data.confirmation_number}`,
            ].join("\n"),
            "Met vriendelijke groet,",
            "MakeMoreMoney",
          ];
    const result = await transport.sendMail({
          to: data.email,
          bcc: notificationRecipient,
          from: { name: "MakeMoreMoney", address: notificationSender },
          subject: "Bevestiging MakeMoreMoney-abonnement en overeenkomst",
          text: paragraphs.join("\n\n"),
          html: paragraphs.map((paragraph) => paragraph === documentList
            ? `<ul>${documents.map(({ label, url }) => `<li><a href="${escapeHtml(url)}">${escapeHtml(label)}</a></li>`).join("")}</ul>`
            : `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`).join("\n"),
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
    if (size > 16384) {
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
    if (Number(request.headers.get("Content-Length")) > 16384) {
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
  const confirmationYear = Number(new Intl.DateTimeFormat("en", {
    year: "numeric", timeZone: "Europe/Amsterdam",
  }).format(new Date(acceptedAt)));
  try {
    const result = await database.prepare(`
      INSERT INTO agreement_acceptances (
        id, full_name, strategy, strategy_label,
        document_name, document_version, document_date, consent_text, accepted, accepted_at,
        email, positions, indicative_capital, monthly_rate, quarterly_rate,
        subscription_consent_text, subscription_accepted, subscription_version, notification_status,
        initials, first_name, last_name, company_name, phone, postcode,
        house_number, house_number_addition, street, city, country, confirmation_year, notes,
        general_terms_name, general_terms_version, general_terms_date, general_terms_consent_text, general_terms_accepted,
        salutation, confirmation_prefix_base
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending',
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      validation.data.fullName,
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
      validation.data.initials,
      validation.data.firstName,
      validation.data.lastName,
      validation.data.companyName,
      validation.data.phone,
      validation.data.postcode,
      validation.data.houseNumber,
      validation.data.houseNumberAddition,
      validation.data.street,
      validation.data.city,
      validation.data.country,
      confirmationYear,
      validation.data.notes,
      generalTerms.name,
      generalTerms.version,
      generalTerms.date,
      generalTerms.consentText,
      1,
      validation.data.salutation,
      confirmationPrefix(validation.data.lastName),
    ).run();
    if (!result.success || result.meta.changes < 1) {
      console.error("agreement_insert_not_confirmed");
      return json({ message: "De registratie is niet bevestigd. Neem contact op met MakeMoreMoney." }, 503);
    }
  } catch {
    console.error("agreement_storage_failed");
    return json({ message: "Uw akkoord kon niet worden geregistreerd. Probeer het later opnieuw." }, 503);
  }

  let notificationStatus = "failed";
  let stored: StoredAgreement | null;
  try {
    stored = await database.prepare(`
      SELECT id, full_name, email, strategy_label, positions, indicative_capital,
        monthly_rate, quarterly_rate, document_name, document_version, document_date,
        consent_text, subscription_consent_text, accepted_at, first_name, company_name,
        street, house_number, house_number_addition, postcode, city, country, confirmation_number, notes,
        general_terms_name, general_terms_version, general_terms_date, last_name, salutation
      FROM agreement_acceptances WHERE id = ?
    `).bind(id).first<StoredAgreement>();
  } catch {
    console.error("agreement_email_record_read_failed");
    return json({ message: "Uw registratie is opgeslagen, maar het bevestigingsnummer kon niet worden opgehaald. Neem contact op met MakeMoreMoney en verzend niet opnieuw." }, 503);
  }
  if (!stored || !isConfirmationNumber(stored.confirmation_number)) {
    console.error("agreement_confirmation_number_missing");
    return json({ message: "Uw registratie is opgeslagen, maar het bevestigingsnummer is niet bevestigd. Neem contact op met MakeMoreMoney en verzend niet opnieuw." }, 503);
  }
  notificationStatus = await notifyCustomer(env, stored);
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
  return json({ confirmationNumber: stored.confirmation_number, acceptedAt, notificationStatus, notificationWarning }, 201);
}
