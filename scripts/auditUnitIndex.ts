import fs from "fs/promises";
import path from "path";

type KnownMekRow = {
  name: string;
  chassis: string;
  model: string;
  techBase: string;
  rulesLevel: string;
  year: string;
  tonnage: string;
  expectedBV: string;
  expectedCostCBills: string;
  source: string;
  sourceUrl: string;
  notes: string;
};

type CatalogRow = Record<string, string>;

type AuditRow = {
  status: string;
  name: string;
  matchedCatalogName: string;
  rulesLevel: string;
  techBase: string;
  year: string;
  expectedBV: string;
  actualBV: string;
  bvDelta: string;
  expectedCostCBills: string;
  actualCostCBills: string;
  costDelta: string;
  costPctDelta: string;
  source: string;
  sourceUrl: string;
  notes: string;
};

type CliOptions = {
  unitIndexPath: string;
  referencePath: string;
  outputPath: string;
  onlyFailures: boolean;
  failOnError: boolean;
};

const DEFAULT_UNIT_INDEX_PATH = path.resolve(process.cwd(), "server", "data", "generated", "unitIndex", "meks.csv");
const DEFAULT_REFERENCE_PATH = path.resolve(process.cwd(), "server", "data", "reference", "knownMekValues.csv");
const DEFAULT_OUTPUT_PATH = path.resolve(process.cwd(), "server", "data", "generated", "audit", "unitIndexAudit.csv");

/**
 * Runs the unit index audit.
 *
 * @returns Promise that resolves after the audit report is written.
 */
async function main(): Promise<void> {
  const options = getCliOptions();

  const [unitIndexCsv, referenceCsv] = await Promise.all([
    fs.readFile(options.unitIndexPath, "utf-8"),
    fs.readFile(options.referencePath, "utf-8"),
  ]);

  const unitIndexRows = parseCsv(unitIndexCsv) as CatalogRow[];
  const referenceRows = parseCsv(referenceCsv) as KnownMekRow[];

  const auditRows = auditUnitIndex(unitIndexRows, referenceRows);
  const outputRows = options.onlyFailures
    ? auditRows.filter((row) => row.status !== "PASS")
    : auditRows;

  await fs.mkdir(path.dirname(options.outputPath), { recursive: true });
  await fs.writeFile(options.outputPath, toCsv(outputRows), "utf-8");

  const summary = summarizeAuditRows(auditRows);

  console.log(`[auditUnitIndex] unit index: ${options.unitIndexPath}`);
  console.log(`[auditUnitIndex] reference: ${options.referencePath}`);
  console.log(`[auditUnitIndex] output:    ${options.outputPath}`);
  console.log(`[auditUnitIndex] rows:      ${auditRows.length}`);
  console.log(`[auditUnitIndex] pass:      ${summary.pass}`);
  console.log(`[auditUnitIndex] fail:      ${summary.fail}`);
  console.log(`[auditUnitIndex] missing:   ${summary.missing}`);
  console.log(`[auditUnitIndex] skipped:   ${summary.skipped}`);

  if (options.failOnError && summary.fail + summary.missing > 0) {
    process.exitCode = 1;
  }
}

/**
 * Compares generated unit index rows against known reference rows.
 *
 * @param unitIndexRows Generated unit index rows from unitIndex/meks.csv.
 * @param referenceRows Known-good rows from known_mek_values.csv.
 * @returns Audit rows describing pass/fail/missing status.
 */
function auditUnitIndex(unitIndexRows: CatalogRow[], referenceRows: KnownMekRow[]): AuditRow[] {
  const unitIndex = buildUnitIndexLookup(unitIndexRows);

  return referenceRows.map((known) => {
    const catalogRow = findUnitIndexRow(known, unitIndex);
    if (!catalogRow) {
      return {
        status: "MISSING_UNIT_INDEX_ROW",
        name: known.name,
        matchedCatalogName: "",
        rulesLevel: known.rulesLevel,
        techBase: known.techBase,
        year: known.year,
        expectedBV: normalizeIntegerString(known.expectedBV),
        actualBV: "",
        bvDelta: "",
        expectedCostCBills: normalizeIntegerString(known.expectedCostCBills),
        actualCostCBills: "",
        costDelta: "",
        costPctDelta: "",
        source: known.source,
        sourceUrl: known.sourceUrl,
        notes: known.notes,
      };
    }

    const expectedBV = normalizeIntegerString(known.expectedBV);
    const actualBV = normalizeIntegerString(catalogRow.bv ?? "");
    const expectedCost = normalizeIntegerString(known.expectedCostCBills);
    const actualCost = normalizeIntegerString(catalogRow.costCBills ?? "");

    const bvDelta = getNumericDelta(actualBV, expectedBV);
    const costDelta = getNumericDelta(actualCost, expectedCost);
    const costPctDelta = getPercentDelta(actualCost, expectedCost);

    const failures: string[] = [];
    if (expectedBV && actualBV !== expectedBV) failures.push("BV");
    if (expectedCost && actualCost !== expectedCost) failures.push("COST");

    return {
      status: failures.length ? `FAIL_${failures.join("_")}` : "PASS",
      name: known.name,
      matchedCatalogName: catalogRow.name || `${catalogRow.chassis ?? ""} ${catalogRow.model ?? ""}`.trim(),
      rulesLevel: catalogRow.rulesLevel || known.rulesLevel,
      techBase: catalogRow.techBase || known.techBase,
      year: catalogRow.year || known.year,
      expectedBV,
      actualBV,
      bvDelta,
      expectedCostCBills: expectedCost,
      actualCostCBills: actualCost,
      costDelta,
      costPctDelta,
      source: known.source,
      sourceUrl: known.sourceUrl,
      notes: known.notes,
    };
  });
}

/**
 * Builds a lookup map for unit index rows using several normalized name keys.
 *
 * @param unitIndexRows Generated unit index rows.
 * @returns Lookup map keyed by normalized names.
 */
function buildUnitIndexLookup(unitIndexRows: CatalogRow[]): Map<string, CatalogRow[]> {
  const index = new Map<string, CatalogRow[]>();

  for (const row of unitIndexRows) {
    const keys = [
      row.name,
      `${row.chassis ?? ""} ${row.model ?? ""}`.trim(),
      row.id,
      row.fileName?.replace(/\.mtf$/i, ""),
    ]
      .filter(Boolean)
      .map(normalizeUnitKey);

    for (const key of new Set(keys)) {
      const existing = index.get(key) ?? [];
      existing.push(row);
      index.set(key, existing);
    }
  }

  return index;
}

/**
 * Finds the matching generated unit index row for a known reference row.
 *
 * @param known Known reference row.
 * @param unitIndex Catalog lookup map.
 * @returns Matching unit index row or null.
 */
function findUnitIndexRow(known: KnownMekRow, unitIndex: Map<string, CatalogRow[]>): CatalogRow | null {
  const candidates = [
    known.name,
    `${known.chassis} ${known.model}`.trim(),
  ]
    .filter(Boolean)
    .map(normalizeUnitKey);

  for (const key of candidates) {
    const rows = unitIndex.get(key);
    if (rows?.length) return rows[0];
  }

  // Fallback for Clan alternate names, e.g. "Masakari (Warhawk) I" vs "Warhawk I".
  const knownModel = normalizeUnitKey(known.model);
  const knownChassisTokens = normalizeUnitKey(known.chassis)
    .split("")
    .join("");

  for (const rows of unitIndex.values()) {
    for (const row of rows) {
      const rowName = normalizeUnitKey(row.name || `${row.chassis ?? ""} ${row.model ?? ""}`);
      if (knownModel && rowName.endsWith(knownModel) && rowName.includes(normalizeUnitKey(known.chassis).replace(/[()]/g, ""))) {
        return row;
      }
      if (knownChassisTokens && rowName.includes(normalizeUnitKey(known.name))) {
        return row;
      }
    }
  }

  return null;
}

/**
 * Parses a CSV string into object rows.
 *
 * @param csvText CSV text with a header row.
 * @returns Array of object rows.
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
 * @param rows Rows to serialize.
 * @returns CSV text.
 */
function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
  if (!rows.length) return "";

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header])).join(",")),
  ];

  return lines.join("\n");
}

/**
 * Escapes a single CSV value.
 *
 * @param value Raw value.
 * @returns CSV-safe string.
 */
function escapeCsv(value: unknown): string {
  const stringValue = value == null ? "" : String(value);
  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Normalizes a unit name for matching.
 *
 * @param value Raw unit name or id.
 * @returns Normalized key.
 */
function normalizeUnitKey(value: string | undefined): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\.mtf$/i, "")
    .replace(/\bprime\b/g, "prime")
    .replace(/[^a-z0-9]+/g, "");
}

/**
 * Normalizes integer text by removing commas, decimals, and spaces.
 *
 * @param value Raw numeric text.
 * @returns Integer string.
 */
function normalizeIntegerString(value: string): string {
  const cleaned = String(value ?? "")
    .replace(/,/g, "")
    .trim();

  if (!cleaned) return "";

  const number = Number(cleaned);
  if (Number.isFinite(number)) return String(Math.round(number));

  const digits = cleaned.match(/\d+/g)?.join("") ?? "";
  return digits;
}

/**
 * Calculates actual minus expected.
 *
 * @param actual Actual integer string.
 * @param expected Expected integer string.
 * @returns Signed delta string.
 */
function getNumericDelta(actual: string, expected: string): string {
  if (!actual || !expected) return "";
  const delta = Number(actual) - Number(expected);
  return Number.isFinite(delta) ? String(delta) : "";
}

/**
 * Calculates percentage delta relative to expected.
 *
 * @param actual Actual integer string.
 * @param expected Expected integer string.
 * @returns Percent delta rounded to four decimals, or empty string.
 */
function getPercentDelta(actual: string, expected: string): string {
  if (!actual || !expected) return "";
  const expectedNumber = Number(expected);
  if (!expectedNumber) return "";
  const percent = ((Number(actual) - expectedNumber) / expectedNumber) * 100;
  return Number.isFinite(percent) ? percent.toFixed(4) : "";
}

/**
 * Summarizes audit result counts.
 *
 * @param rows Audit rows.
 * @returns Summary counts.
 */
function summarizeAuditRows(rows: AuditRow[]): { pass: number; fail: number; missing: number; skipped: number } {
  return rows.reduce(
    (summary, row) => {
      if (row.status === "PASS") summary.pass++;
      else if (row.status === "MISSING_UNIT_INDEX_ROW") summary.missing++;
      else if (row.status.startsWith("FAIL")) summary.fail++;
      else summary.skipped++;
      return summary;
    },
    { pass: 0, fail: 0, missing: 0, skipped: 0 }
  );
}

/**
 * Reads command-line options.
 *
 * @returns Parsed CLI options.
 */
function getCliOptions(): CliOptions {
  const args = process.argv.slice(2);
  const getArg = (name: string, fallback: string) => {
    const prefix = `--${name}=`;
    return args.find((arg: string) => arg.startsWith(prefix))?.slice(prefix.length) ?? fallback;
  };

  const unitIndexPath =
    getArg("unit-index", "") ||
    getArg("index", "") ||
    getArg("catalog", DEFAULT_UNIT_INDEX_PATH);

  return {
    unitIndexPath: path.resolve(process.cwd(), unitIndexPath),
    referencePath: path.resolve(process.cwd(), getArg("reference", DEFAULT_REFERENCE_PATH)),
    outputPath: path.resolve(process.cwd(), getArg("out", DEFAULT_OUTPUT_PATH)),
    onlyFailures: args.includes("--only-failures"),
    failOnError: args.includes("--fail-on-error"),
  };
}

main().catch((error) => {
  console.error("[auditUnitIndex] Failed:", error);
  process.exit(1);
});
