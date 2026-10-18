import { normalizePostcode } from "../../lib/agreement";

function json(body: object, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" },
  });
}

export async function onRequest({ request }: { request: Request }) {
  if (request.method !== "POST") return json({ message: "Gebruik POST voor adrescontrole." }, 405);
  if (request.headers.get("Origin") !== new URL(request.url).origin) {
    return json({ message: "Controleer het adres vanaf het formulier." }, 403);
  }
  if (request.headers.get("Content-Type")?.split(";")[0].trim() !== "application/json") {
    return json({ message: "Ongeldig verzoek." }, 415);
  }
  let input: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return json({ message: "Vul postcode en huisnummer in." }, 400);
    let body = "";
    let size = 0;
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 1024) {
        await reader.cancel();
        return json({ message: "Het verzoek is te groot." }, 413);
      }
      body += decoder.decode(value, { stream: true });
    }
    input = JSON.parse(body + decoder.decode());
  } catch {
    return json({ message: "De adresgegevens konden niet worden gelezen." }, 400);
  }
  if (typeof input !== "object" || input === null ||
      !("postcode" in input) || typeof input.postcode !== "string" ||
      !("houseNumber" in input) || typeof input.houseNumber !== "string" ||
      !("addition" in input) || typeof input.addition !== "string") {
    return json({ message: "Vul postcode en huisnummer in." }, 400);
  }
  const postcode = normalizePostcode(input.postcode).replace(" ", "");
  const houseNumber = input.houseNumber.trim();
  const addition = input.addition.trim().toUpperCase();
  if (!/^[1-9][0-9]{3}[A-Z]{2}$/.test(postcode) || !/^[1-9][0-9]{0,9}$/.test(houseNumber) ||
      !/^[A-Z0-9 -]{0,20}$/.test(addition)) {
    return json({ message: "Controleer postcode, huisnummer en toevoeging, of vul het adres handmatig in." }, 400);
  }
  const url = new URL("https://api.pdok.nl/bzk/locatieserver/search/v3_1/free");
  url.searchParams.append("fq", "type:adres");
  url.searchParams.append("fq", `postcode:"${postcode}"`);
  url.searchParams.append("fq", `huisnummer:${houseNumber}`);
  url.searchParams.set("rows", "100");
  url.searchParams.set("fl", "postcode,huisnummer,huisletter,huisnummertoevoeging,straatnaam,woonplaatsnaam");
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error("postcode_provider_unavailable");
    const data: unknown = await response.json();
    if (typeof data !== "object" || data === null || !("response" in data) ||
        typeof data.response !== "object" || data.response === null ||
        !("docs" in data.response) || !Array.isArray(data.response.docs)) {
      throw new Error("postcode_provider_invalid_response");
    }
    const matches = data.response.docs.filter((doc: unknown) => {
      if (typeof doc !== "object" || doc === null ||
          !("postcode" in doc) || doc.postcode !== postcode ||
          !("huisnummer" in doc) || String(doc.huisnummer) !== houseNumber) return false;
      const letter = "huisletter" in doc && doc.huisletter != null ? String(doc.huisletter) : "";
      const suffix = "huisnummertoevoeging" in doc && doc.huisnummertoevoeging != null ? String(doc.huisnummertoevoeging) : "";
      return `${letter}${suffix}`.toUpperCase().replace(/[ -]/g, "") === addition.replace(/[ -]/g, "");
    });
    const doc: unknown = matches.length === 1 ? matches[0] : null;
    if (typeof doc !== "object" || doc === null ||
        !("straatnaam" in doc) || typeof doc.straatnaam !== "string" ||
        !("woonplaatsnaam" in doc) || typeof doc.woonplaatsnaam !== "string") {
      return json({ found: false, message: "Geen eenduidig adres gevonden. Vul straat en woonplaats handmatig in." });
    }
    return json({ found: true, street: doc.straatnaam, city: doc.woonplaatsnaam });
  } catch {
    console.error("agreement_postcode_lookup_failed");
    return json({ message: "Adrescontrole is tijdelijk niet beschikbaar. Vul straat en woonplaats handmatig in." }, 503);
  }
}
