import fs from "fs/promises";
import path from "path";

type UnitIndexRow = Record<string, string>;

type MegaMekLabReference = {
  unitName: string;
  fileName: string;
  relativePath: string;
  rulesLevel: string;
  techBase: string;
  year: string;
  tonnage: string;
  expectedBV: string;
  expectedCostCBills: string;
  parseStatus: string;
};

type AuditRow = {
  status: string;
  unitName: string;
  reportFile: string;
  matchedUnitIndexName: string;
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
  parseStatus: string;
};

type CliOptions = {
  unitIndexPath: string;
  reportsDir: string;
  outputPath: string;
  parsedReferencePath: string;
  onlyFailures: boolean;
  failOnError: boolean;
};

const DEFAULT_UNIT_INDEX_PATH = path.resolve(process.cwd(), "server", "data", "generated", "unitIndex", "meks.csv");
const DEFAULT_REPORTS_DIR = path.resolve(process.cwd(), "server", "data", "reference", "megaMekLabReports");
const DEFAULT_OUTPUT_PATH = path.resolve(process.cwd(), "server", "data", "generated", "audit", "unitIndexAudit.csv");
const DEFAULT_PARSED_REFERENCE_PATH = path.resolve(process.cwd(), "server", "data", "reference", "megaMekLabVerifiedMeks.csv");

/**
 * Runs the unit index audit against pasted MegaMekLab report text files.
 * @returns Promise that resolves after audit and parsed-reference files are written.
 */
async function main(): Promise<void> {
  const options = getCliOptions();

  const [unitIndexCsv, references] = await Promise.all([
    fs.readFile(options.unitIndexPath, "utf-8"),
    parseMegaMekLabReportDirectory(options.reportsDir),
  ]);

  const unitIndexRows = parseCsv(unitIndexCsv) as UnitIndexRow[];
  const auditRows = auditUnitIndex(unitIndexRows, references);
  const outputRows = options.onlyFailures ? auditRows.filter((row) => row.status !== "PASS") : auditRows;

  await fs.mkdir(path.dirname(options.outputPath), { recursive: true });
  await fs.mkdir(path.dirname(options.parsedReferencePath), { recursive: true });

  await fs.writeFile(options.outputPath, toCsv(outputRows), "utf-8");
  await fs.writeFile(options.parsedReferencePath, toCsv(references), "utf-8");

  const summary = summarizeAuditRows(auditRows);

  console.log(`[auditUnitIndex] unit index:       ${options.unitIndexPath}`);
  console.log(`[auditUnitIndex] MML reports:      ${options.reportsDir}`);
  console.log(`[auditUnitIndex] parsed reference: ${options.parsedReferencePath}`);
  console.log(`[auditUnitIndex] audit output:     ${options.outputPath}`);
  console.log(`[auditUnitIndex] reports parsed:   ${references.length}`);
  console.log(`[auditUnitIndex] pass:             ${summary.pass}`);
  console.log(`[auditUnitIndex] fail:             ${summary.fail}`);
  console.log(`[auditUnitIndex] missing:          ${summary.missing}`);
  console.log(`[auditUnitIndex] skipped:          ${summary.skipped}`);

  if (options.failOnError && summary.fail + summary.missing > 0) {
    process.exitCode = 1;
  }
}

/**
 * Parses all MegaMekLab .txt report files from a directory.
 * @param reportsDir - Directory containing pasted MegaMekLab report .txt files.
 * @returns Parsed reference rows.
 */
async function parseMegaMekLabReportDirectory(reportsDir: string): Promise<MegaMekLabReference[]> {
  const files = await findFilesByExtension(reportsDir, ".txt");
  const references: MegaMekLabReference[] = [];

  for (const filePath of files) {
    const fileName = path.basename(filePath);
    if (fileName.toLowerCase() === "readme.txt") continue;

    const text = await fs.readFile(filePath, "utf-8");
    references.push(parseMegaMekLabReport(text, filePath, reportsDir));
  }

  references.sort((a, b) => a.unitName.localeCompare(b.unitName));
  return references;
}

/**
 * Parses one MegaMekLab pasted report file.
 * @param text - Report text.
 * @param filePath - Full path to the report file.
 * @param reportsDir - Root reports directory, used to produce relative paths.
 * @returns Parsed reference row.
 */
function parseMegaMekLabReport(text: string, filePath: string, reportsDir: string): MegaMekLabReference {
  const fileName = path.basename(filePath);

  const headerUnitName = matchFirstText(text, /^Unit:\s*(.+)$/im);
  const reportUnitName =
    matchFirstText(text, /^Battle Value Calculation for\s+(.+)$/im) ||
    matchFirstText(text, /^Cost Calculations For\s+(.+)$/im);

  const unitName = (headerUnitName || reportUnitName || fileName.replace(/\.txt$/i, "")).trim();
  const expectedBV = extractMegaMekLabBV(text);
  const expectedCostCBills = extractMegaMekLabCost(text);

  const parseProblems: string[] = [];
  if (!expectedBV) parseProblems.push("missing BV");
  if (!expectedCostCBills) parseProblems.push("missing Total Cost");

  return {
    unitName,
    fileName,
    relativePath: path.relative(reportsDir, filePath).replace(/\\/g, "/"),
    rulesLevel: matchFirstText(text, /^Rules Level:\s*(.+)$/im),
    techBase: matchFirstText(text, /^Tech Base:\s*(.+)$/im),
    year: normalizeIntegerString(matchFirstText(text, /^Year:\s*(.+)$/im)),
    tonnage: normalizeIntegerString(matchFirstText(text, /^Tonnage:\s*(.+)$/im)),
    expectedBV,
    expectedCostCBills,
    parseStatus: parseProblems.length ? `INCOMPLETE: ${parseProblems.join("; ")}` : "OK",
  };
}

/**
 * Extracts final Battle Value from a MegaMekLab report.
 * @param text - Report text.
 * @returns Final rounded BV string.
 */
function extractMegaMekLabBV(text: string): string {
  const baseUnitMatch = text.match(/Base\s+Unit\s+BV:[\s\S]*?=\s*([\d,]+)\b/i);
  if (baseUnitMatch?.[1]) return normalizeIntegerString(baseUnitMatch[1]);

  const battleValueSection = text.match(/Battle\s+Value:[\s\S]{0,400}?=\s*([\d,]+)\b/i);
  if (battleValueSection?.[1]) return normalizeIntegerString(battleValueSection[1]);

  return "";
}

/**
 * Extracts Total Cost from a MegaMekLab report.
 * @param text - Report text.
 * @returns Total C-bill cost string.
 */
function extractMegaMekLabCost(text: string): string {
  const match =
    text.match(/Total\s+Cost:\s*([\d,]+)\b/i) ||
    text.match(/Final\s+BattleMech\s+Cost\s+([\d,]+(?:\.\d+)?)/i);

  return match?.[1] ? normalizeIntegerString(match[1]) : "";
}

/**
 * Compares generated unit index rows against MegaMekLab reference rows.
 * @param unitIndexRows - Generated Unit Index rows.
 * @param references - Parsed MegaMekLab references.
 * @returns Audit rows.
 */
function auditUnitIndex(unitIndexRows: UnitIndexRow[], references: MegaMekLabReference[]): AuditRow[] {
  const unitIndex = buildUnitIndexLookup(unitIndexRows);

  return references.map((reference) => {
    const unitIndexRow = findUnitIndexRow(reference, unitIndex);

    if (!reference.expectedBV && !reference.expectedCostCBills) {
      return makeAuditRow("SKIPPED_NO_MML_VALUES", reference, unitIndexRow);
    }

    if (!unitIndexRow) {
      return makeAuditRow("MISSING_UNIT_INDEX_ROW", reference, null);
    }

    const actualBV = normalizeIntegerString(unitIndexRow.bv ?? "");
    const actualCost = normalizeIntegerString(unitIndexRow.costCBills ?? "");
    const expectedBV = normalizeIntegerString(reference.expectedBV);
    const expectedCost = normalizeIntegerString(reference.expectedCostCBills);

    const failures: string[] = [];
    if (expectedBV && actualBV !== expectedBV) failures.push("BV");
    if (expectedCost && actualCost !== expectedCost) failures.push("COST");

    return {
      status: failures.length ? `FAIL_${failures.join("_")}` : "PASS",
      unitName: reference.unitName,
      reportFile: reference.relativePath,
      matchedUnitIndexName: getUnitIndexDisplayName(unitIndexRow),
      rulesLevel: unitIndexRow.rulesLevel || reference.rulesLevel,
      techBase: unitIndexRow.techBase || reference.techBase,
      year: unitIndexRow.year || reference.year,
      expectedBV,
      actualBV,
      bvDelta: getNumericDelta(actualBV, expectedBV),
      expectedCostCBills: expectedCost,
      actualCostCBills: actualCost,
      costDelta: getNumericDelta(actualCost, expectedCost),
      costPctDelta: getPercentDelta(actualCost, expectedCost),
      parseStatus: reference.parseStatus,
    };
  });
}

/**
 * Creates an audit row for skipped or missing cases.
 * @param status - Audit status.
 * @param reference - Parsed MegaMekLab reference.
 * @param unitIndexRow - Optional matching Unit Index row.
 * @returns Audit row.
 */
function makeAuditRow(status: string, reference: MegaMekLabReference, unitIndexRow: UnitIndexRow | null): AuditRow {
  return {
    status,
    unitName: reference.unitName,
    reportFile: reference.relativePath,
    matchedUnitIndexName: unitIndexRow ? getUnitIndexDisplayName(unitIndexRow) : "",
    rulesLevel: unitIndexRow?.rulesLevel || reference.rulesLevel,
    techBase: unitIndexRow?.techBase || reference.techBase,
    year: unitIndexRow?.year || reference.year,
    expectedBV: reference.expectedBV,
    actualBV: unitIndexRow?.bv ?? "",
    bvDelta: "",
    expectedCostCBills: reference.expectedCostCBills,
    actualCostCBills: unitIndexRow?.costCBills ?? "",
    costDelta: "",
    costPctDelta: "",
    parseStatus: reference.parseStatus,
  };
}

/**
 * Builds lookup keys for generated Unit Index rows.
 * @param unitIndexRows - Generated Unit Index rows.
 * @returns Lookup map.
 */
function buildUnitIndexLookup(unitIndexRows: UnitIndexRow[]): Map<string, UnitIndexRow[]> {
  const index = new Map<string, UnitIndexRow[]>();

  for (const row of unitIndexRows) {
    const keys = [
      row.name,
      `${row.chassis ?? ""} ${row.model ?? ""}`.trim(),
      row.id,
      row.fileName?.replace(/\.mtf$/i, ""),
    ].filter(Boolean).map(normalizeUnitKey);

    for (const key of new Set(keys)) {
      const existing = index.get(key) ?? [];
      existing.push(row);
      index.set(key, existing);
    }
  }

  return index;
}

/**
 * Finds the generated Unit Index row for a parsed MegaMekLab reference.
 * @param reference - Parsed MegaMekLab reference.
 * @param unitIndex - Unit Index lookup map.
 * @returns Matching row or null.
 */
function findUnitIndexRow(reference: MegaMekLabReference, unitIndex: Map<string, UnitIndexRow[]>): UnitIndexRow | null {
  const candidateKeys = [
    reference.unitName,
    reference.fileName.replace(/\.txt$/i, ""),
  ].map(normalizeUnitKey);

  for (const key of candidateKeys) {
    const rows = unitIndex.get(key);
    if (rows?.length) return rows[0];
  }

  return null;
}

/**
 * Finds files recursively by extension.
 * @param root - Root directory.
 * @param extension - File extension, such as ".txt".
 * @returns Matching file paths.
 */
async function findFilesByExtension(root: string, extension: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(dir: string): Promise<void> {
    let entries;
    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) await walk(fullPath);
      else if (entry.isFile() && entry.name.toLowerCase().endsWith(extension)) results.push(fullPath);
    }
  }

  await walk(root);
  return results;
}

/**
 * Parses CSV into object rows.
 * @param csvText - CSV text.
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
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      current.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i++;
      current.push(field);
      field = "";
      if (current.some((value) => value.length > 0)) rows.push(current);
      current = [];
    } else {
      field += char;
    }
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
 * @param rows - Rows.
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
 * @param value - Raw value.
 * @returns CSV-safe string.
 */
function escapeCsv(value: unknown): string {
  const stringValue = value == null ? "" : String(value);
  if (/[",\n\r]/.test(stringValue)) return `"${stringValue.replace(/"/g, '""')}"`;
  return stringValue;
}

/**
 * Gets a display name for a Unit Index row.
 * @param row - Unit Index row.
 * @returns Display name.
 */
function getUnitIndexDisplayName(row: UnitIndexRow): string {
  return row.name || `${row.chassis ?? ""} ${row.model ?? ""}`.trim();
}

/**
 * Matches first text capture from a regex.
 * @param text - Input text.
 * @param pattern - Regex with capture group.
 * @returns Captured text or empty string.
 */
function matchFirstText(text: string, pattern: RegExp): string {
  return text.match(pattern)?.[1]?.trim() ?? "";
}

/**
 * Normalizes integer-like text.
 * @param value - Raw value.
 * @returns Integer string.
 */
function normalizeIntegerString(value: string): string {
  const cleaned = String(value ?? "").replace(/,/g, "").replace(/\.0\b/g, "").trim();
  if (!cleaned) return "";

  const number = Number(cleaned);
  if (Number.isFinite(number)) return String(Math.round(number));

  return cleaned.match(/\d+/g)?.join("") ?? "";
}

/**
 * Calculates actual minus expected.
 * @param actual - Actual integer string.
 * @param expected - Expected integer string.
 * @returns Signed delta string.
 */
function getNumericDelta(actual: string, expected: string): string {
  if (!actual || !expected) return "";
  const delta = Number(actual) - Number(expected);
  return Number.isFinite(delta) ? String(delta) : "";
}

/**
 * Calculates percent delta relative to expected.
 * @param actual - Actual integer string.
 * @param expected - Expected integer string.
 * @returns Percent delta rounded to four decimal places.
 */
function getPercentDelta(actual: string, expected: string): string {
  if (!actual || !expected) return "";
  const expectedNumber = Number(expected);
  if (!expectedNumber) return "";
  const percent = ((Number(actual) - expectedNumber) / expectedNumber) * 100;
  return Number.isFinite(percent) ? percent.toFixed(4) : "";
}

/**
 * Normalizes a unit name for matching.
 * @param value - Raw unit name.
 * @returns Normalized key.
 */
function normalizeUnitKey(value: string | undefined): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/\.mtf$/i, "")
    .replace(/\.txt$/i, "")
    .replace(/\bprime\b/g, "prime")
    .replace(/[^a-z0-9]+/g, "");
}

/**
 * Summarizes audit statuses.
 * @param rows - Audit rows.
 * @returns Summary counts.
 */
function summarizeAuditRows(rows: AuditRow[]): { pass: number; fail: number; missing: number; skipped: number } {
  return rows.reduce(
    (summary, row) => {
      if (row.status === "PASS") summary.pass++;
      else if (row.status === "MISSING_UNIT_INDEX_ROW") summary.missing++;
      else if (row.status.startsWith("FAIL")) summary.fail++;
      else if (row.status.startsWith("SKIPPED")) summary.skipped++;
      return summary;
    },
    { pass: 0, fail: 0, missing: 0, skipped: 0 }
  );
}

/**
 * Reads command-line options.
 * @returns Parsed CLI options.
 */
function getCliOptions(): CliOptions {
  const args = process.argv.slice(2);
  const getArg = (name: string, fallback: string) => {
    const prefix = `--${name}=`;
    return args.find((arg: string) => arg.startsWith(prefix))?.slice(prefix.length) ?? fallback;
  };

  const unitIndexPath = getArg("unit-index", "") || getArg("index", "") || getArg("catalog", DEFAULT_UNIT_INDEX_PATH);

  return {
    unitIndexPath: path.resolve(process.cwd(), unitIndexPath),
    reportsDir: path.resolve(process.cwd(), getArg("reports", DEFAULT_REPORTS_DIR)),
    outputPath: path.resolve(process.cwd(), getArg("out", DEFAULT_OUTPUT_PATH)),
    parsedReferencePath: path.resolve(process.cwd(), getArg("parsed-reference", DEFAULT_PARSED_REFERENCE_PATH)),
    onlyFailures: args.includes("--only-failures"),
    failOnError: args.includes("--fail-on-error"),
  };
}

main().catch((error) => {
  console.error("[auditUnitIndex] Failed:", error);
  process.exit(1);
});
