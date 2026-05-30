import fs from "fs/promises";
import path from "path";
import { WEAPONS } from "../src/data/weapons";
import { COMPONENTS } from "../src/data/components";

type CsvRow = Record<string, string>;
type DefinitionRecord = Record<string, any>;
type DefinitionSource = "weapon" | "component";

type CliOptions = {
  unitIndexPath: string;
  outPath: string;
  unitQuery: string | null;
  chassisQuery: string | null;
  unitIds: string[];
  includeMatched: boolean;
  maxExamples: number;
};

type MekLocationKey =
  | "head"
  | "centerTorso"
  | "leftTorso"
  | "rightTorso"
  | "leftArm"
  | "rightArm"
  | "leftLeg"
  | "rightLeg"
  | "frontLeftLeg"
  | "frontRightLeg"
  | "rearLeftLeg"
  | "rearRightLeg";

type SlotAuditItem = {
  raw: string;
  normalized: string;
  count: number;
  type: "unknown" | "weapon" | "component" | "system" | "ammo" | "empty";
  matchedId: string;
  matchedName: string;
  matchedSource: DefinitionSource | "";
  examples: SlotAuditExample[];
};

type SlotAuditExample = {
  unitId: string;
  name: string;
  chassis: string;
  model: string;
  location: string;
  slotIndex: number;
  relativePath: string;
};

type UnitAuditSummary = {
  id: string;
  name: string;
  chassis: string;
  model: string;
  relativePath: string;
  totalSlots: number;
  unmatchedSlots: number;
  unmatchedWeaponSlots: number;
};

type SlotAuditReport = {
  generatedAt: string;
  input: {
    unitIndexPath: string;
    unitsScanned: number;
    includeMatched: boolean;
  };
  summary: {
    totalSlots: number;
    unmatchedSlots: number;
    unmatchedUniqueSlots: number;
    unmatchedWeaponSlots: number;
    unmatchedUniqueWeaponSlots: number;
    matchedWeaponSlots: number;
    matchedComponentSlots: number;
    ammoSlots: number;
    emptySlots: number;
    knownSystemSlots: number;
  };
  unmatchedSlots: SlotAuditItem[];
  unmatchedWeaponLikeSlots: SlotAuditItem[];
  matchedSlots?: SlotAuditItem[];
  unitsWithUnmatchedSlots: UnitAuditSummary[];
};

const UNITS_ROOT = path.resolve(process.cwd(), "src", "data", "units");
const DEFAULT_UNIT_INDEX_PATH = path.resolve(process.cwd(), "server", "data", "generated", "unitIndex", "meks.csv");
const DEFAULT_OUT_PATH = path.resolve(process.cwd(), "server", "data", "generated", "unitDetails", "slotAudit.json");

const LOCATION_NAMES: Array<{ key: MekLocationKey; mtfName: string }> = [
  { key: "head", mtfName: "Head" },
  { key: "centerTorso", mtfName: "Center Torso" },
  { key: "leftTorso", mtfName: "Left Torso" },
  { key: "rightTorso", mtfName: "Right Torso" },
  { key: "leftArm", mtfName: "Left Arm" },
  { key: "rightArm", mtfName: "Right Arm" },
  { key: "leftLeg", mtfName: "Left Leg" },
  { key: "rightLeg", mtfName: "Right Leg" },
  { key: "frontLeftLeg", mtfName: "Front Left Leg" },
  { key: "frontRightLeg", mtfName: "Front Right Leg" },
  { key: "rearLeftLeg", mtfName: "Rear Left Leg" },
  { key: "rearRightLeg", mtfName: "Rear Right Leg" },
];

async function main(): Promise<void> {
  const options = getCliOptions();
  const csvText = await fs.readFile(options.unitIndexPath, "utf-8");
  const rows = parseCsv(csvText).filter((row) => row.unitType === "meks" && matchesUnitSelection(row, options));

  const report = await auditRows(rows, options);
  await fs.mkdir(path.dirname(options.outPath), { recursive: true });
  await fs.writeFile(options.outPath, `${JSON.stringify(report, null, 2)}\n`, "utf-8");

  printConsoleSummary(report, options);
}

async function auditRows(rows: CsvRow[], options: CliOptions): Promise<SlotAuditReport> {
  const unmatched = new Map<string, SlotAuditItem>();
  const unmatchedWeaponLike = new Map<string, SlotAuditItem>();
  const matched = new Map<string, SlotAuditItem>();
  const unitSummaries: UnitAuditSummary[] = [];

  const summary = {
    totalSlots: 0,
    unmatchedSlots: 0,
    unmatchedUniqueSlots: 0,
    unmatchedWeaponSlots: 0,
    unmatchedUniqueWeaponSlots: 0,
    matchedWeaponSlots: 0,
    matchedComponentSlots: 0,
    ammoSlots: 0,
    emptySlots: 0,
    knownSystemSlots: 0,
  };

  for (const row of rows) {
    const mtfPath = path.resolve(UNITS_ROOT, row.relativePath);
    const content = await fs.readFile(mtfPath, "utf-8");
    const lines = content.split(/\r?\n/);
    const locationSections = parseLocationSlotSections(lines);

    let unitTotalSlots = 0;
    let unitUnmatchedSlots = 0;
    let unitUnmatchedWeaponSlots = 0;

    for (const [locationKey, rawSlots] of locationSections.entries()) {
      const locationName = getLocationName(locationKey);

      for (const [index, rawSlot] of rawSlots.entries()) {
        const trimmedSlot = rawSlot.trim();
        const normalized = normalizeLookupText(trimmedSlot);
        if (!normalized) continue;

        unitTotalSlots++;
        summary.totalSlots++;

        const auditType = classifyRawSlot(trimmedSlot);
        const resolved = resolveDefinition(trimmedSlot, row.techBase);

        const example: SlotAuditExample = {
          unitId: row.id,
          name: row.name,
          chassis: row.chassis,
          model: row.model,
          location: locationName,
          slotIndex: index + 1,
          relativePath: row.relativePath,
        };

        if (auditType === "empty") {
          summary.emptySlots++;
          if (options.includeMatched) addAuditItem(matched, trimmedSlot, auditType, null, example, options.maxExamples);
          continue;
        }

        if (auditType === "ammo") {
          summary.ammoSlots++;
          if (options.includeMatched) addAuditItem(matched, trimmedSlot, auditType, null, example, options.maxExamples);
          continue;
        }

        if (resolved?.source === "weapon") {
          summary.matchedWeaponSlots++;
          if (options.includeMatched) addAuditItem(matched, trimmedSlot, "weapon", resolved, example, options.maxExamples);
          continue;
        }

        if (resolved?.source === "component") {
          summary.matchedComponentSlots++;
          if (options.includeMatched) addAuditItem(matched, trimmedSlot, "component", resolved, example, options.maxExamples);
          continue;
        }

        if (auditType === "system") {
          summary.knownSystemSlots++;
          if (options.includeMatched) addAuditItem(matched, trimmedSlot, auditType, null, example, options.maxExamples);
          continue;
        }

        unitUnmatchedSlots++;
        summary.unmatchedSlots++;
        addAuditItem(unmatched, trimmedSlot, "unknown", null, example, options.maxExamples);

        if (looksWeaponLike(trimmedSlot)) {
          unitUnmatchedWeaponSlots++;
          summary.unmatchedWeaponSlots++;
          addAuditItem(unmatchedWeaponLike, trimmedSlot, "unknown", null, example, options.maxExamples);
        }
      }
    }

    if (unitUnmatchedSlots > 0) {
      unitSummaries.push({
        id: row.id,
        name: row.name,
        chassis: row.chassis,
        model: row.model,
        relativePath: row.relativePath,
        totalSlots: unitTotalSlots,
        unmatchedSlots: unitUnmatchedSlots,
        unmatchedWeaponSlots: unitUnmatchedWeaponSlots,
      });
    }
  }

  const unmatchedSlots = sortAuditItems([...unmatched.values()]);
  const unmatchedWeaponLikeSlots = sortAuditItems([...unmatchedWeaponLike.values()]);
  summary.unmatchedUniqueSlots = unmatchedSlots.length;
  summary.unmatchedUniqueWeaponSlots = unmatchedWeaponLikeSlots.length;

  const report: SlotAuditReport = {
    generatedAt: new Date().toISOString(),
    input: {
      unitIndexPath: options.unitIndexPath,
      unitsScanned: rows.length,
      includeMatched: options.includeMatched,
    },
    summary,
    unmatchedSlots,
    unmatchedWeaponLikeSlots,
    unitsWithUnmatchedSlots: unitSummaries.sort((a, b) => b.unmatchedSlots - a.unmatchedSlots || a.name.localeCompare(b.name)),
  };

  if (options.includeMatched) {
    report.matchedSlots = sortAuditItems([...matched.values()]);
  }

  return report;
}

function addAuditItem(
  map: Map<string, SlotAuditItem>,
  rawSlot: string,
  type: SlotAuditItem["type"],
  resolved: { source: DefinitionSource; definition: DefinitionRecord } | null,
  example: SlotAuditExample,
  maxExamples: number
): void {
  const key = normalizeLookupText(rawSlot);
  const existing = map.get(key);

  if (existing) {
    existing.count++;
    if (existing.examples.length < maxExamples) existing.examples.push(example);
    return;
  }

  map.set(key, {
    raw: rawSlot,
    normalized: key,
    count: 1,
    type,
    matchedId: resolved?.definition?.id ?? "",
    matchedName: resolved?.definition?.name ?? "",
    matchedSource: resolved?.source ?? "",
    examples: [example],
  });
}

function sortAuditItems(items: SlotAuditItem[]): SlotAuditItem[] {
  return items.sort((a, b) => b.count - a.count || a.raw.localeCompare(b.raw));
}

function printConsoleSummary(report: SlotAuditReport, options: CliOptions): void {
  console.log("[slotAuditor] Slot audit complete");
  console.log(`[slotAuditor] Units scanned: ${report.input.unitsScanned}`);
  console.log(`[slotAuditor] Total slots: ${report.summary.totalSlots}`);
  console.log(`[slotAuditor] Unmatched slots: ${report.summary.unmatchedSlots} unique ${report.summary.unmatchedUniqueSlots}`);
  console.log(`[slotAuditor] Unmatched weapon-like slots: ${report.summary.unmatchedWeaponSlots} unique ${report.summary.unmatchedUniqueWeaponSlots}`);
  console.log(`[slotAuditor] Matched weapon slots: ${report.summary.matchedWeaponSlots}`);
  console.log(`[slotAuditor] Matched component slots: ${report.summary.matchedComponentSlots}`);
  console.log(`[slotAuditor] Ammo slots: ${report.summary.ammoSlots}`);
  console.log(`[slotAuditor] Empty slots: ${report.summary.emptySlots}`);
  console.log(`[slotAuditor] Known system slots: ${report.summary.knownSystemSlots}`);
  console.log(`[slotAuditor] Output: ${options.outPath}`);

  if (report.unmatchedSlots.length > 0) {
    console.log("\n[slotAuditor] Top unmatched slots:");
    for (const item of report.unmatchedSlots.slice(0, 25)) {
      const example = item.examples[0];
      console.log(`  ${item.count.toString().padStart(5)}  ${item.raw}  e.g. ${example.name} ${example.location} slot ${example.slotIndex}`);
    }
  }

  if (report.unmatchedWeaponLikeSlots.length > 0) {
    console.log("\n[slotAuditor] Top unmatched weapon-like slots:");
    for (const item of report.unmatchedWeaponLikeSlots.slice(0, 25)) {
      const example = item.examples[0];
      console.log(`  ${item.count.toString().padStart(5)}  ${item.raw}  e.g. ${example.name} ${example.location} slot ${example.slotIndex}`);
    }
  }
}

function parseLocationSlotSections(lines: string[]): Map<MekLocationKey, string[]> {
  const sections = new Map<MekLocationKey, string[]>();
  let currentLocation: MekLocationKey | null = null;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const locationKey = normalizeLocationHeader(line);
    if (locationKey) {
      currentLocation = locationKey;
      if (!sections.has(currentLocation)) sections.set(currentLocation, []);
      continue;
    }

    if (isNonLocationSectionHeader(line) || isTopLevelMtfFieldBoundary(line)) {
      currentLocation = null;
      continue;
    }

    if (currentLocation) {
      sections.get(currentLocation)?.push(line);
    }
  }

  return sections;
}

function normalizeLocationHeader(line: string): MekLocationKey | null {
  const normalized = line.toLowerCase().replace(/:$/, "").replace(/\s+/g, " ").trim();
  const map: Record<string, MekLocationKey> = {
    head: "head",
    hd: "head",
    "center torso": "centerTorso",
    ct: "centerTorso",
    "left torso": "leftTorso",
    lt: "leftTorso",
    "right torso": "rightTorso",
    rt: "rightTorso",
    "left arm": "leftArm",
    la: "leftArm",
    "right arm": "rightArm",
    ra: "rightArm",
    "left leg": "leftLeg",
    ll: "leftLeg",
    "right leg": "rightLeg",
    rl: "rightLeg",
    "front left leg": "frontLeftLeg",
    fll: "frontLeftLeg",
    "front right leg": "frontRightLeg",
    frl: "frontRightLeg",
    "rear left leg": "rearLeftLeg",
    rll: "rearLeftLeg",
    "rear right leg": "rearRightLeg",
    rrl: "rearRightLeg",
  };

  return map[normalized] ?? null;
}

function getLocationName(locationKey: MekLocationKey): string {
  return LOCATION_NAMES.find((location) => location.key === locationKey)?.mtfName ?? locationKey;
}

function isNonLocationSectionHeader(line: string): boolean {
  return /^(weapons|quirks|fluff|overview|deployment|history|capabilities|variants|notables|battle history)\s*:?\s*\d*$/i.test(line);
}

function isTopLevelMtfFieldBoundary(line: string): boolean {
  const parsed = parseKeyValueLine(line);
  if (!parsed) return false;

  const key = normalizeMtfKey(parsed.key);
  return new Set([
    "overview",
    "capabilities",
    "deployment",
    "history",
    "variants",
    "variant",
    "notables",
    "notable",
    "battlehistory",
    "fluff",
    "manufacturer",
    "primaryfactory",
    "systemmanufacturer",
    "masterunitlistid",
    "mulid",
    "notes",
    "fluffimage",
    "imagefile",
    "source",
    "sourcebook",
    "ruleslevel",
    "rules",
    "role",
    "quirks",
  ]).has(key);
}

function parseKeyValueLine(line: string): { key: string; value: string } | null {
  const match = line.match(/^\s*([^:#][^:=]*?)\s*[:=]\s*(.*?)\s*$/);
  if (!match) return null;
  return { key: match[1].trim(), value: match[2].trim() };
}

function classifyRawSlot(rawSlot: string): SlotAuditItem["type"] {
  const normalized = normalizeLookupText(rawSlot);

  if (!normalized || normalized === "empty" || normalized === "none") return "empty";
  if (normalized.includes("ammo")) return "ammo";
  if (isKnownSystemSlot(rawSlot)) return "system";

  return "unknown";
}

function isKnownSystemSlot(rawSlot: string): boolean {
  const normalized = normalizeLookupText(rawSlot);

  return [
    "engine",
    "gyro",
    "cockpit",
    "lifesupport",
    "sensors",
    "shoulder",
    "upperarmactuator",
    "lowerarmactuator",
    "handactuator",
    "hip",
    "upperlegactuator",
    "lowerlegactuator",
    "footactuator",
    "upperarm",
    "lowerarm",
    "upperleg",
    "lowerleg",
    "foot",
    "endosteel",
    "avionics",
    "landinggear",
    "arrestinghoist",
    "lifthoist",
    "artemisiv",
    "aes",
    "partialwing",
    "impactresistant",
    "ballisticreinforced",
    "endocomposite",
    "ferrofibrous",
    "ferrolamellor",
    "reflective",
    "reactive",
    "stealth",
    "case",
    "caseii",
  ].some((fragment) => normalized.includes(fragment));
}

function looksWeaponLike(rawSlot: string): boolean {
  const normalized = normalizeLookupText(rawSlot);

  return [
    "laser",
    "ppc",
    "autocannon",
    "ac",
    "gauss",
    "hag",
    "rifle",
    "lrm",
    "srm",
    "mrm",
    "atm",
    "streak",
    "narc",
    "tag",
    "flamer",
    "machinegun",
    "mg",
    "plasma",
    "taser",
    "launcher",
    "missile",
    "mortar",
    "ams",
    "arrow",
    "thumper",
    "sniper",
    "longtom",
  ].some((fragment) => normalized.includes(fragment));
}

function resolveDefinition(rawValue: string, unitTechBase: string): { source: DefinitionSource; definition: DefinitionRecord } | null {
  const weapon = resolveWeaponDefinition(rawValue, unitTechBase);
  if (weapon) return { source: "weapon", definition: weapon };

  const component = resolveComponentDefinition(rawValue);
  if (component) return { source: "component", definition: component };

  return null;
}

function resolveWeaponDefinition(rawValue: string, unitTechBase: string): DefinitionRecord | null {
  return findBestDefinitionMatch(rawValue, WEAPONS as Record<string, DefinitionRecord>, unitTechBase);
}

function resolveComponentDefinition(rawValue: string): DefinitionRecord | null {
  return findBestDefinitionMatch(rawValue, COMPONENTS as Record<string, DefinitionRecord>, "");
}

function findBestDefinitionMatch<T extends Record<string, any>>(
  rawValue: string,
  definitions: Record<string, T>,
  unitTechBase: string
): T | null {
  const cleaned = stripSlotAnnotations(rawValue);
  const normalizedRaw = normalizeLookupText(rawValue);
  const normalizedCleaned = normalizeLookupText(cleaned);
  const strippedCleaned = stripTechPrefixFromNormalizedText(normalizedCleaned);
  const desiredTechBase = inferTechBaseFromRawText(rawValue) || normalizeTechBase(unitTechBase);
  const candidates: Array<{ definition: T; score: number }> = [];

  for (const [key, definition] of Object.entries(definitions)) {
    const values = [
      key,
      definition.id,
      definition.name,
      definition.family,
      ...(Array.isArray(definition.altNames) ? definition.altNames : []),
    ].filter(Boolean).map((value) => normalizeLookupText(String(value)));

    let score = 0;

    if (values.some((value) => value === normalizedRaw || value === normalizedCleaned || value === strippedCleaned)) {
      score = 240;
    } else if (values.some((value) => normalizedCleaned.includes(value) || value.includes(normalizedCleaned))) {
      score = 140;
    } else if (values.some((value) => strippedCleaned && (strippedCleaned.includes(value) || value.includes(strippedCleaned)))) {
      score = 120;
    }

    if (score <= 0) continue;

    score += getTechBaseScore(definition, desiredTechBase);
    candidates.push({ definition, score });
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0]?.definition ?? null;
}

function getTechBaseScore(definition: DefinitionRecord, desiredTechBase: string): number {
  const definitionTechBase = normalizeTechBase(String(definition.techBase || definition.variant || ""));
  if (!desiredTechBase || !definitionTechBase) return 0;
  return definitionTechBase === desiredTechBase ? 20 : -20;
}

function parseCsv(csvText: string): CsvRow[] {
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
    const object: CsvRow = {};
    headers.forEach((header, index) => {
      object[header] = row[index] ?? "";
    });
    return object;
  });
}

function matchesUnitSelection(row: CsvRow, options: CliOptions): boolean {
  if (options.unitIds.length > 0) {
    const normalizedIdSet = new Set(options.unitIds.map(normalizeLookupText));
    const candidateIds = [
      row.id,
      row.name,
      `${row.chassis} ${row.model}`.trim(),
      row.model,
      row.fileName,
      row.mulId,
    ].map(normalizeLookupText);

    return candidateIds.some((candidate) => normalizedIdSet.has(candidate));
  }

  if (options.chassisQuery) return normalizeLookupText(row.chassis) === normalizeLookupText(options.chassisQuery);
  return matchesUnitQuery(row, options.unitQuery);
}

function matchesUnitQuery(row: CsvRow, query: string | null): boolean {
  if (!query) return true;

  const normalizedQuery = normalizeLookupText(query);
  const exactCandidates = [
    row.id,
    row.name,
    `${row.chassis} ${row.model}`.trim(),
    row.model,
    row.fileName.replace(/\.mtf$/i, ""),
    row.mulId,
  ].map(normalizeLookupText);

  return exactCandidates.some((candidate) => candidate === normalizedQuery);
}

function getCliOptions(): CliOptions {
  const args = process.argv.slice(2);

  const getArg = (name: string, fallback = ""): string => {
    const equalsPrefix = `--${name}=`;
    const equalsMatch = args.find((arg) => arg.startsWith(equalsPrefix));
    if (equalsMatch) return equalsMatch.slice(equalsPrefix.length);

    const flagIndex = args.indexOf(`--${name}`);
    if (flagIndex >= 0) {
      const next = args[flagIndex + 1];
      if (next && !next.startsWith("--")) return next;
      return "true";
    }

    return fallback;
  };

  const getCsvArg = (name: string): string[] => {
    const value = getArg(name, "");
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  };

  const unitQuery = getArg("model") || getArg("unit") || getArg("name") || "";
  const chassisQuery = getArg("chassis") || "";
  const unitIds = [...getCsvArg("id"), ...getCsvArg("ids")];

  return {
    unitIndexPath: path.resolve(process.cwd(), getArg("unit-index", getArg("index", DEFAULT_UNIT_INDEX_PATH))),
    outPath: path.resolve(process.cwd(), getArg("out", DEFAULT_OUT_PATH)),
    unitQuery: unitQuery || null,
    chassisQuery: chassisQuery || null,
    unitIds,
    includeMatched: args.includes("--include-matched"),
    maxExamples: Number(getArg("max-examples", "10")) || 10,
  };
}

function normalizeMtfKey(value: string): string {
  return normalizeLookupText(value);
}

function normalizeLookupText(value: string | undefined): string {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function stripSlotAnnotations(value: string): string {
  return String(value ?? "")
    .replace(/\(R\)/gi, "")
    .replace(/\(OMNIPOD\)/gi, "")
    .replace(/\(T\)/gi, "")
    .replace(/^-Empty-$/i, "Empty")
    .replace(/\s+/g, " ")
    .trim();
}

function stripTechPrefixFromNormalizedText(normalized: string): string {
  return normalized.replace(/^clan/, "").replace(/^cl/, "").replace(/^is/, "");
}

function inferTechBaseFromRawText(rawValue: string): string {
  const normalized = normalizeLookupText(rawValue);
  if (normalized.startsWith("cl") || normalized.includes("clan")) return "Clan";
  if (normalized.startsWith("is") || normalized.includes("innersphere")) return "Inner Sphere";
  return "";
}

function normalizeTechBase(value: string | undefined): string {
  const normalized = normalizeLookupText(value);
  if (normalized.includes("clan")) return "Clan";
  if (normalized.includes("inner") || normalized === "is") return "Inner Sphere";
  return String(value ?? "").trim();
}

main().catch((error) => {
  console.error("[slotAuditor] failed:", error);
  process.exit(1);
});
