import fs from "fs/promises";
import path from "path";

type KnownMekRow = Record<string, string>;

type SourceValue = {
  sourceName: "Mordel" | "MUL" | "Sarna";
  sourceUrl: string;
  bv: string;
  costCBills: string;
  status: string;
};

type VerifiedRow = KnownMekRow & {
  mordelBV: string;
  mordelCostCBills: string;
  mordelUrl: string;
  mulBV: string;
  mulCostCBills: string;
  mulUrl: string;
  sarnaBV: string;
  sarnaCostCBills: string;
  sarnaUrl: string;
  bvDecision: string;
  costDecision: string;
  sourceAgreement: string;
};

type CliOptions = {
  inputPath: string;
  outputPath: string;
  reportPath: string;
  delayMs: number;
};

const DEFAULT_INPUT_PATH = path.resolve(process.cwd(), "server", "data", "reference", "knownMekValues.csv");
const DEFAULT_OUTPUT_PATH = path.resolve(process.cwd(), "server", "data", "reference", "knownMekValues.verified.csv");
const DEFAULT_REPORT_PATH = path.resolve(process.cwd(), "server", "data", "generated", "audit", "knownMekValuesSourceAudit.csv");

/**
 * Main entry point for source-verifying known Mek values.
 *
 * @returns Promise that resolves after output files are written.
 */
async function main(): Promise<void> {
  const options = getCliOptions();
  const inputCsv = await fs.readFile(options.inputPath, "utf-8");
  const rows = parseCsv(inputCsv) as KnownMekRow[];

  const verifiedRows: VerifiedRow[] = [];

  for (const [index, row] of rows.entries()) {
    console.log(`[verifyKnownMekValues] ${index + 1}/${rows.length}: ${row.name}`);

    const sourceValues = await getSourceValues(row);

    const mordel = sourceValues.find((value) => value.sourceName === "Mordel");
    const mul = sourceValues.find((value) => value.sourceName === "MUL");
    const sarna = sourceValues.find((value) => value.sourceName === "Sarna");

    const bvDecision = chooseMajorityValue([
      mordel?.bv ?? "",
      mul?.bv ?? "",
      sarna?.bv ?? "",
    ]);

    const costDecision = chooseMajorityValue([
      mordel?.costCBills ?? "",
      mul?.costCBills ?? "",
      sarna?.costCBills ?? "",
    ]);

    verifiedRows.push({
      ...row,

      expectedBV: bvDecision.value || normalizeIntegerString(row.expectedBV ?? ""),
      expectedCostCBills: costDecision.value || normalizeIntegerString(row.expectedCostCBills ?? ""),

      mordelBV: mordel?.bv ?? "",
      mordelCostCBills: mordel?.costCBills ?? "",
      mordelUrl: mordel?.sourceUrl ?? "",

      mulBV: mul?.bv ?? "",
      mulCostCBills: mul?.costCBills ?? "",
      mulUrl: mul?.sourceUrl ?? "",

      sarnaBV: sarna?.bv ?? "",
      sarnaCostCBills: sarna?.costCBills ?? "",
      sarnaUrl: sarna?.sourceUrl ?? "",

      bvDecision: bvDecision.status,
      costDecision: costDecision.status,
      sourceAgreement: `BV=${bvDecision.status}; Cost=${costDecision.status}`,
    });

    if (options.delayMs > 0) {
      await sleep(options.delayMs);
    }
  }

  await fs.mkdir(path.dirname(options.outputPath), { recursive: true });
  await fs.mkdir(path.dirname(options.reportPath), { recursive: true });

  await fs.writeFile(options.outputPath, toCsv(verifiedRows), "utf-8");
  await fs.writeFile(options.reportPath, toCsv(verifiedRows), "utf-8");

  const reviewRows = verifiedRows.filter((row) =>
    row.bvDecision.includes("NO_MAJORITY") ||
    row.costDecision.includes("NO_MAJORITY") ||
    row.bvDecision.includes("INSUFFICIENT") ||
    row.costDecision.includes("INSUFFICIENT")
  );

  console.log(`[verifyKnownMekValues] wrote: ${options.outputPath}`);
  console.log(`[verifyKnownMekValues] wrote: ${options.reportPath}`);
  console.log(`[verifyKnownMekValues] rows needing review: ${reviewRows.length}`);
}

/**
 * Gets source values from Mordel, MUL, and Sarna.
 *
 * @param row Known Mek reference row.
 * @returns Source values from each source, when found.
 */
async function getSourceValues(row: KnownMekRow): Promise<SourceValue[]> {
  const results: SourceValue[] = [];

  results.push(await getMordelValues(row));
  results.push(await getMulValues(row));
  results.push(await getSarnaValues(row));

  return results;
}

/**
 * Attempts to read BV/cost from Mordel.
 *
 * Mordel supports both direct unit pages and product/listing pages. The listing
 * pages are plain text after HTML stripping and usually contain rows in this shape:
 * Name Type Tech Era Year Rules Tons BV Cost.
 *
 * @param row Known Mek reference row.
 * @returns Mordel source values.
 */
async function getMordelValues(row: KnownMekRow): Promise<SourceValue> {
  const candidateUrls = getMordelCandidateUrls(row);

  for (const sourceUrl of candidateUrls) {
    try {
      const html = await fetchText(sourceUrl);
      const text = stripHtml(decodeHtml(html));

      const direct = parseMordelDirectPage(text);
      if (direct.bv || direct.costCBills) {
        return {
          sourceName: "Mordel",
          sourceUrl,
          bv: direct.bv,
          costCBills: direct.costCBills,
          status: "OK_DIRECT",
        };
      }

      const listing = parseMordelListingPage(text, row);
      if (listing.bv || listing.costCBills) {
        return {
          sourceName: "Mordel",
          sourceUrl,
          bv: listing.bv,
          costCBills: listing.costCBills,
          status: "OK_LISTING",
        };
      }
    } catch {
      // Try next candidate URL.
    }
  }

  return {
    sourceName: "Mordel",
    sourceUrl: candidateUrls[0] ?? "",
    bv: "",
    costCBills: "",
    status: "NOT_FOUND",
  };
}

/**
 * Returns Mordel URLs to try.
 *
 * @param row Known Mek row.
 * @returns Candidate Mordel URLs.
 */
function getMordelCandidateUrls(row: KnownMekRow): string[] {
  const urls = new Set<string>();

  if (String(row.sourceUrl ?? "").includes("mordel.net")) {
    urls.add(row.sourceUrl);
  }

  // Mordel search/list URL. It is useful in browser, but may not always be rendered
  // as directly as product pages. Keep it as a fallback.
  urls.add(`https://www.mordel.net/tro.php?a=v&fltr=qf.${encodeURIComponent(row.name ?? "")}`);

  return [...urls];
}

/**
 * Parses a direct Mordel unit page after HTML stripping.
 *
 * @param text Plain text page.
 * @returns BV and cost.
 */
function parseMordelDirectPage(text: string): { bv: string; costCBills: string } {
  return {
    costCBills:
      matchFirstInteger(text, /Total\s+Cost:\s*([\d,]+)\s*C-Bills/i) ||
      matchFirstInteger(text, /Final\s+BattleMech\s+Cost\s+([\d,]+(?:\.\d+)?)/i),
    bv:
      matchFirstInteger(text, /Battle\s+Value:\s*([\d,]+)/i) ||
      matchFirstInteger(text, /Final\s+BattleMech\s+Battle\s+Value:\s*([\d,]+)/i),
  };
}

/**
 * Parses a Mordel product/listing page row for one known unit.
 *
 * @param text Plain text product/listing page.
 * @param row Known Mek row.
 * @returns BV and cost.
 */
function parseMordelListingPage(text: string, row: KnownMekRow): { bv: string; costCBills: string } {
  const segment = findSegmentNearUnitName(text, row, 80, 260);
  if (!segment) return { bv: "", costCBills: "" };

  const normalizedRules = normalizeRulesLevel(row.rulesLevel);
  const tonnage = normalizeIntegerString(row.tonnage ?? "");
  const year = normalizeIntegerString(row.year ?? "");

  const numberMatches = [...segment.matchAll(/[\d][\d,]*/g)].map((match) => normalizeIntegerString(match[0]));

  // Product listing rows generally end with: year rules tonnage BV cost.
  // Use anchors if available to avoid grabbing model numbers.
  const rulesIndex = normalizedRules
    ? segment.toLowerCase().indexOf(normalizedRules.toLowerCase())
    : -1;

  const tail = rulesIndex >= 0 ? segment.slice(rulesIndex) : segment;
  const tailNumbers = [...tail.matchAll(/[\d][\d,]*/g)].map((match) => normalizeIntegerString(match[0]));

  if (tailNumbers.length >= 3) {
    const cost = tailNumbers[tailNumbers.length - 1];
    const bv = tailNumbers[tailNumbers.length - 2];
    const tons = tailNumbers[tailNumbers.length - 3];

    if (!tonnage || tons === tonnage) {
      return { bv, costCBills: cost };
    }
  }

  // Fallback: find a sequence ending in BV/cost where tonnage also appears.
  for (let i = 0; i <= numberMatches.length - 3; i++) {
    const maybeTons = numberMatches[i];
    const maybeBV = numberMatches[i + 1];
    const maybeCost = numberMatches[i + 2];

    if ((tonnage && maybeTons !== tonnage) || (year && maybeTons === year)) {
      continue;
    }

    if (Number(maybeBV) > 0 && Number(maybeCost) > 100_000) {
      return { bv: maybeBV, costCBills: maybeCost };
    }
  }

  return { bv: "", costCBills: "" };
}

/**
 * Attempts to read BV/cost from Master Unit List.
 *
 * MUL sometimes serves details pages reliably and sometimes not. This function
 * tries filter/search pages first, then details links when available, then parses
 * alternate-model rows if the exact row is visible.
 *
 * @param row Known Mek reference row.
 * @returns MUL source values.
 */
async function getMulValues(row: KnownMekRow): Promise<SourceValue> {
  const candidateUrls = getMulCandidateUrls(row);

  for (const searchUrl of candidateUrls) {
    try {
      const searchHtml = await fetchText(searchUrl);
      const searchText = stripHtml(decodeHtml(searchHtml));

      const listingValues = parseMulListingOrAlternateRows(searchText, row);
      if (listingValues.bv || listingValues.costCBills) {
        return {
          sourceName: "MUL",
          sourceUrl: searchUrl,
          bv: listingValues.bv,
          costCBills: listingValues.costCBills,
          status: "OK_LISTING",
        };
      }

      const detailsPaths = findMulDetailsPaths(searchHtml);
      for (const detailsPath of detailsPaths) {
        const detailsUrl = new URL(detailsPath, "https://masterunitlist.info").toString();
        try {
          const detailsHtml = await fetchText(detailsUrl);
          const detailsText = stripHtml(decodeHtml(detailsHtml));
          const detailValues = parseMulDetailPage(detailsText);
          if (detailValues.bv || detailValues.costCBills) {
            return {
              sourceName: "MUL",
              sourceUrl: detailsUrl,
              bv: detailValues.bv,
              costCBills: detailValues.costCBills,
              status: "OK_DETAIL",
            };
          }
        } catch {
          // Try next details link.
        }
      }
    } catch {
      // Try next search URL.
    }
  }

  return {
    sourceName: "MUL",
    sourceUrl: candidateUrls[0] ?? "",
    bv: "",
    costCBills: "",
    status: "NOT_FOUND",
  };
}

/**
 * Builds MUL URLs to try.
 *
 * @param row Known Mek row.
 * @returns Candidate MUL URLs.
 */
function getMulCandidateUrls(row: KnownMekRow): string[] {
  const urls = new Set<string>();
  const names = [
    row.name,
    `${row.chassis ?? ""} ${row.model ?? ""}`.trim(),
  ].filter(Boolean);

  for (const name of names) {
    urls.add(`https://masterunitlist.info/Unit/Filter?Name=${encodeURIComponent(name)}`);
    urls.add(`https://www.masterunitlist.info/Unit/Filter?Name=${encodeURIComponent(name)}`);
  }

  return [...urls];
}

/**
 * Parses MUL detail page text.
 *
 * @param text Plain text.
 * @returns BV and cost.
 */
function parseMulDetailPage(text: string): { bv: string; costCBills: string } {
  return {
    bv: matchFirstInteger(text, /Battle\s+Value:\s*([\d,.]+)/i),
    costCBills: matchFirstInteger(text, /Cost:\s*([\d,.]+)/i),
  };
}

/**
 * Parses MUL filter/alternate rows for exact name/model matches.
 *
 * @param text Plain text.
 * @param row Known Mek row.
 * @returns BV and cost.
 */
function parseMulListingOrAlternateRows(text: string, row: KnownMekRow): { bv: string; costCBills: string } {
  const segment = findSegmentNearUnitName(text, row, 40, 220);
  if (!segment) return { bv: "", costCBills: "" };

  const unitName = escapeRegex(row.name ?? "");
  const chassisModel = escapeRegex(`${row.chassis ?? ""} ${row.model ?? ""}`.trim());
  const namePattern = unitName || chassisModel;

  if (!namePattern) return { bv: "", costCBills: "" };

  const patterns = [
    new RegExp(`${namePattern}\\s*[,;]?\\s*([\\d,.]+)\\s*[,;]\\s*([\\d,.]+)`, "i"),
    new RegExp(`${namePattern}[\\s\\S]{0,120}?Battle\\s+Value:\\s*([\\d,.]+)[\\s\\S]{0,120}?Cost:\\s*([\\d,.]+)`, "i"),
    new RegExp(`${namePattern}[\\s\\S]{0,120}?\\bBV\\b\\s*[:]?\\s*([\\d,.]+)[\\s\\S]{0,120}?\\bCost\\b\\s*[:]?\\s*([\\d,.]+)`, "i"),
  ];

  for (const pattern of patterns) {
    const match = segment.match(pattern);
    if (match?.[1] && match?.[2]) {
      return {
        bv: normalizeIntegerString(match[1]),
        costCBills: normalizeIntegerString(match[2]),
      };
    }
  }

  return { bv: "", costCBills: "" };
}

/**
 * Finds MUL detail links from search/filter HTML.
 *
 * @param html HTML.
 * @returns Detail paths.
 */
function findMulDetailsPaths(html: string): string[] {
  const links = [...html.matchAll(/href=["']([^"']*\/Unit\/Details\/\d+[^"']*)["']/gis)]
    .map((match) => decodeHtml(match[1]));

  return [...new Set(links)];
}

/**
 * Attempts to read BV/cost from Sarna.
 *
 * Sarna is chassis-page based, and variant costs are not always present. This is
 * best-effort.
 *
 * @param row Known Mek reference row.
 * @returns Sarna source values.
 */
async function getSarnaValues(row: KnownMekRow): Promise<SourceValue> {
  const pageName = getSarnaPageName(row);
  const sourceUrl = `https://www.sarna.net/wiki/${encodeURIComponent(pageName).replace(/%20/g, "_")}`;

  try {
    const html = await fetchText(sourceUrl);
    const text = stripHtml(decodeHtml(html));
    const segment = findSegmentNearUnitName(text, row, 300, 1800) || text;

    const bv =
      matchFirstInteger(segment, /BV\s*\(2\.0\)\s*=?\s*([\d,]+)/i) ||
      matchFirstInteger(segment, /B\.V\.\s*\(2\.0\)\s*([\d,]+)/i) ||
      matchFirstInteger(segment, /Battle\s+Value\D{0,30}([\d,]+)/i);

    const cost =
      matchFirstInteger(segment, /Cost\s*([\d,]+)\s*C-bills/i) ||
      matchFirstInteger(text, /Cost\s*([\d,]+)\s*C-bills/i);

    return { sourceName: "Sarna", sourceUrl, bv, costCBills: cost, status: bv || cost ? "OK_BEST_EFFORT" : "NOT_FOUND" };
  } catch (error) {
    return { sourceName: "Sarna", sourceUrl, bv: "", costCBills: "", status: `ERROR: ${getErrorMessage(error)}` };
  }
}

/**
 * Chooses a value by majority. If exactly two sources agree, that value wins.
 * If all available values agree, that value wins. If all available values differ,
 * returns an empty value with NO_MAJORITY.
 *
 * @param values Source numeric values.
 * @returns Majority decision.
 */
function chooseMajorityValue(values: string[]): { value: string; status: string } {
  const cleaned = values.map(normalizeIntegerString).filter(Boolean);
  const counts = new Map<string, number>();

  for (const value of cleaned) {
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);

  if (!sorted.length) return { value: "", status: "INSUFFICIENT_SOURCE_VALUES" };
  if (sorted[0][1] >= 2) return { value: sorted[0][0], status: `MAJORITY_${sorted[0][1]}_OF_${cleaned.length}` };
  if (cleaned.length === 1) return { value: cleaned[0], status: "ONLY_ONE_SOURCE_VALUE" };

  return { value: "", status: `NO_MAJORITY_VALUES=${cleaned.join("|")}` };
}

/**
 * Finds a text segment near a unit name.
 *
 * @param text Plain text or stripped HTML.
 * @param row Known Mek row.
 * @param before Characters before match.
 * @param after Characters after match.
 * @returns Nearby segment or empty string.
 */
function findSegmentNearUnitName(text: string, row: KnownMekRow, before = 500, after = 1500): string {
  const candidates = [
    row.name,
    `${row.chassis ?? ""} ${row.model ?? ""}`.trim(),
    row.model,
  ].filter(Boolean);

  for (const candidate of candidates) {
    const plainIndex = text.toLowerCase().indexOf(String(candidate).toLowerCase());
    if (plainIndex >= 0) {
      return text.slice(Math.max(0, plainIndex - before), plainIndex + String(candidate).length + after);
    }
  }

  const normalizedText = normalizeUnitKey(text);
  for (const candidate of candidates) {
    const normalizedCandidate = normalizeUnitKey(candidate);
    const normalizedIndex = normalizedText.indexOf(normalizedCandidate);
    if (normalizedIndex >= 0) {
      // Offset is not reliable after normalization, but a broad source fallback is better than nothing.
      return text;
    }
  }

  return "";
}

/**
 * Gets likely Sarna chassis page from a known row.
 *
 * @param row Known Mek row.
 * @returns Sarna page title.
 */
function getSarnaPageName(row: KnownMekRow): string {
  return String(row.chassis || row.name || "")
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .trim();
}

/**
 * Fetches a URL as text.
 *
 * @param url URL to fetch.
 * @returns Response text.
 */
async function fetchText(url: string): Promise<string> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "BattletechCampaignManagerUnitIndexAuditor/1.0",
      "Accept": "text/html,text/plain,*/*",
    },
  });

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }

  return response.text();
}

/**
 * Parses CSV into rows.
 *
 * @param csvText CSV text.
 * @returns Object rows.
 */
function parseCsv(csvText: string): Record<string, string>[] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const next = csvText[i + 1];

    if (char === '"' && inQuotes && next === '"') {
      field += '"';
      i++;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      current.push(field);
      field = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++;
      current.push(field);
      field = "";
      if (current.some((value) => value.length > 0)) rows.push(current);
      current = [];
      continue;
    }

    field += char;
  }

  current.push(field);
  if (current.some((value) => value.length > 0)) rows.push(current);

  const [headers, ...body] = rows;
  if (!headers) return [];

  return body.map((row) => {
    const object: Record<string, string> = {};
    headers.forEach((header, index) => {
      object[header] = row[index] ?? "";
    });
    return object;
  });
}

/**
 * Converts object rows to CSV.
 *
 * @param rows Rows.
 * @returns CSV text.
 */
function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(",")),
  ].join("\n");
}

/**
 * Escapes one CSV value.
 *
 * @param value Value to escape.
 * @returns CSV-safe value.
 */
function escapeCsv(value: unknown): string {
  const stringValue = value == null ? "" : String(value);
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Matches first integer from text.
 *
 * @param text Text.
 * @param pattern Regex with first capture group.
 * @returns Normalized integer string.
 */
function matchFirstInteger(text: string, pattern: RegExp): string {
  const match = text.match(pattern);
  return match?.[1] ? normalizeIntegerString(match[1]) : "";
}

/**
 * Normalizes integer-like text.
 *
 * @param value Raw value.
 * @returns Integer string.
 */
function normalizeIntegerString(value: string): string {
  const cleaned = String(value ?? "")
    .replace(/,/g, "")
    .replace(/\.0\b/g, "")
    .trim();

  if (!cleaned) return "";
  const number = Number(cleaned);
  if (Number.isFinite(number)) return String(Math.round(number));
  return cleaned.match(/\d+/g)?.join("") ?? "";
}

/**
 * Normalizes unit names.
 *
 * @param value Raw unit name.
 * @returns Normalized key.
 */
function normalizeUnitKey(value: string | undefined): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\bprime\b/g, "prime")
    .replace(/[^a-z0-9]+/g, "");
}

/**
 * Normalizes rule labels.
 *
 * @param value Raw rules level.
 * @returns Normalized rule label.
 */
function normalizeRulesLevel(value: string): string {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized.includes("intro")) return "Introductory";
  if (normalized.includes("standard")) return "Standard";
  if (normalized.includes("advanced")) return "Advanced";
  if (normalized.includes("experimental")) return "Experimental";
  return String(value ?? "").trim();
}

/**
 * Escapes a string for RegExp use.
 *
 * @param value Raw value.
 * @returns Escaped value.
 */
function escapeRegex(value: string): string {
  return String(value ?? "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Strips HTML tags.
 *
 * @param html HTML.
 * @returns Plain text.
 */
function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Decodes common HTML entities.
 *
 * @param value Raw HTML text.
 * @returns Decoded text.
 */
function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/g, " ")
    .replace(/&#160;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * Reads CLI options.
 *
 * @returns CLI options.
 */
function getCliOptions(): CliOptions {
  const args = process.argv.slice(2);
  const getArg = (name: string, fallback: string) => {
    const prefix = `--${name}=`;
    return args.find((arg: string) => arg.startsWith(prefix))?.slice(prefix.length) ?? fallback;
  };

  return {
    inputPath: path.resolve(process.cwd(), getArg("input", DEFAULT_INPUT_PATH)),
    outputPath: path.resolve(process.cwd(), getArg("out", DEFAULT_OUTPUT_PATH)),
    reportPath: path.resolve(process.cwd(), getArg("report", DEFAULT_REPORT_PATH)),
    delayMs: Number(getArg("delay-ms", "500")),
  };
}

/**
 * Sleeps for a requested duration.
 *
 * @param ms Milliseconds.
 * @returns Promise that resolves after timeout.
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gets an error message.
 *
 * @param error Unknown error.
 * @returns Message string.
 */
function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

main().catch((error) => {
  console.error("[verifyKnownMekValues] failed:", error);
  process.exit(1);
});
