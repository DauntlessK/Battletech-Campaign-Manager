import fs from "fs/promises";
import path from "path";
import { WEAPONS, type WeaponDefinition, type TechBase } from "../src/data/weapons";

type UnitTypeKey = "meks";

type RulesLevelName =
  | "Introductory"
  | "Standard"
  | "Advanced"
  | "Experimental"
  | "Unofficial"
  | "";

type ParsedWeaponEntry = {
  rawLine: string;
  weaponName: string;
  locationName: string;
  index: number;
};

type ParsedSlot = {
  unitKey: string;
  chassis: string;
  model: string;
  techBase: TechBase | "";
  rulesLevel: RulesLevelName;
  filePath: string;
  relativePath: string;
  locationKey: string;
  locationName: string;
  slotIndex: number;
  rawSlot: string;
  normalizedSlot: string;
};

type ParsedUnit = {
  unitKey: string;
  unitType: UnitTypeKey;
  chassis: string;
  model: string;
  techBase: TechBase | "";
  rulesLevel: RulesLevelName;
  filePath: string;
  relativePath: string;
  weapons: ParsedWeaponEntry[];
  slotsByLocation: Record<string, ParsedSlot[]>;
};

type WeaponCandidate = {
  key: string;
  weapon: WeaponDefinition;
  matchedBy: "id" | "name" | "altName";
  matchedText: string;
};

type WeaponResolution = {
  status: "matched" | "ambiguous" | "unmatched";
  candidates: WeaponCandidate[];
  chosen?: WeaponCandidate;
  reason: string;
};

type WeaponEntryAuditRow = {
  unitKey: string;
  chassis: string;
  model: string;
  techBase: string;
  rulesLevel: string;
  relativePath: string;
  weaponIndex: string;
  mtfWeaponName: string;
  mtfLocation: string;
  normalizedLocation: string;
  resolutionStatus: string;
  chosenWeaponId: string;
  chosenWeaponName: string;
  chosenTechBase: string;
  matchedBy: string;
  matchedText: string;
  slotMatchStatus: string;
  matchingSlotIndexes: string;
  matchingSlotValues: string;
  reason: string;
};

type SlotAuditRow = {
  unitKey: string;
  chassis: string;
  model: string;
  techBase: string;
  rulesLevel: string;
  relativePath: string;
  locationName: string;
  slotIndex: string;
  rawSlot: string;
  slotLooksLikeWeapon: string;
  declaredWeaponMatchStatus: string;
  declaredWeaponNames: string;
  resolvedWeaponId: string;
  resolvedWeaponName: string;
  resolvedTechBase: string;
  reason: string;
};

type UniqueWeaponNameRow = {
  rawName: string;
  normalizedName: string;
  occurrences: string;
  unitExamples: string;
  resolutionStatus: string;
  chosenWeaponId: string;
  chosenWeaponName: string;
  chosenTechBase: string;
  candidateWeaponIds: string;
  suggestion: string;
};

type CliOptions = {
  unitType: UnitTypeKey;
  rulesLevel: RulesLevelName;
  unitQuery: string;
  sampleSize: number | null;
  debug: boolean;
};

const UNITS_ROOT = path.resolve(process.cwd(), "src", "data", "units");
const OUTPUT_DIR = path.resolve(process.cwd(), "server", "data", "generated", "audit");

const UNIT_TYPE_FOLDERS: Record<UnitTypeKey, string> = {
  meks: "meks",
};

const LOCATION_HEADERS: Record<string, string> = {
  "head": "head",
  "center torso": "centerTorso",
  "left torso": "leftTorso",
  "right torso": "rightTorso",
  "left arm": "leftArm",
  "right arm": "rightArm",
  "left leg": "leftLeg",
  "right leg": "rightLeg",
  "front left leg": "frontLeftLeg",
  "front right leg": "frontRightLeg",
  "rear left leg": "rearLeftLeg",
  "rear right leg": "rearRightLeg",
};

const LOCATION_ALIASES: Record<string, string> = {
  "hd": "head",
  "head": "head",
  "ct": "centerTorso",
  "center torso": "centerTorso",
  "lt": "leftTorso",
  "left torso": "leftTorso",
  "rt": "rightTorso",
  "right torso": "rightTorso",
  "la": "leftArm",
  "left arm": "leftArm",
  "ra": "rightArm",
  "right arm": "rightArm",
  "ll": "leftLeg",
  "left leg": "leftLeg",
  "rl": "rightLeg",
  "right leg": "rightLeg",
  "fll": "frontLeftLeg",
  "front left leg": "frontLeftLeg",
  "frl": "frontRightLeg",
  "front right leg": "frontRightLeg",
  "rll": "rearLeftLeg",
  "rear left leg": "rearLeftLeg",
  "rrl": "rearRightLeg",
  "rear right leg": "rearRightLeg",
};

const SLOT_NON_WEAPON_PATTERNS = [
  "ammo",
  "ammunition",
  "case",
  "heat sink",
  "double heat sink",
  "single heat sink",
  "jump jet",
  "fusion engine",
  "engine",
  "gyro",
  "cockpit",
  "life support",
  "sensors",
  "shoulder",
  "upper arm actuator",
  "lower arm actuator",
  "hand actuator",
  "hip",
  "upper leg actuator",
  "lower leg actuator",
  "foot actuator",
  "endo steel",
  "ferro-fibrous",
  "ferro fibrous",
  "empty",
  "-empty-",
  "null",
  "none",
];

/**
 * Runs the weapon audit from the command line.
 *
 * @returns A promise that resolves when all audit files have been written.
 */
async function main(): Promise<void> {
  const options = getCliOptions();

  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const root = path.join(UNITS_ROOT, UNIT_TYPE_FOLDERS[options.unitType]);
  const allFiles = await findFilesByExtension(root, ".mtf");
  let files = allFiles;

  if (options.sampleSize != null && options.sampleSize > 0) {
    files = chooseRandomSample(files, options.sampleSize);
  }

  const weaponLookup = buildWeaponLookup();
  const parsedUnits: ParsedUnit[] = [];

  for (const filePath of files) {
    const content = await fs.readFile(filePath, "utf-8");
    const relativePath = path.relative(UNITS_ROOT, filePath).replace(/\\/g, "/");
    const unit = parseMtfUnit(content, filePath, relativePath);

    if (options.rulesLevel && unit.rulesLevel !== options.rulesLevel) {
      continue;
    }

    if (options.unitQuery && !unitMatchesQuery(unit, options.unitQuery)) {
      continue;
    }

    parsedUnits.push(unit);
  }

  const {
    weaponEntryRows,
    slotRows,
    uniqueNameRows,
    summary,
  } = auditUnits(parsedUnits, weaponLookup, options);

  const suffix = getOutputSuffix(options);

  await fs.writeFile(
    path.join(OUTPUT_DIR, `weapon-entry-audit${suffix}.csv`),
    toCsv(weaponEntryRows),
    "utf-8"
  );

  await fs.writeFile(
    path.join(OUTPUT_DIR, `weapon-slot-audit${suffix}.csv`),
    toCsv(slotRows),
    "utf-8"
  );

  await fs.writeFile(
    path.join(OUTPUT_DIR, `unique-weapon-names${suffix}.csv`),
    toCsv(uniqueNameRows),
    "utf-8"
  );

  await fs.writeFile(
    path.join(OUTPUT_DIR, `weapon-audit-summary${suffix}.json`),
    JSON.stringify(summary, null, 2),
    "utf-8"
  );

  console.log(`[auditMtfWeapons] Units audited: ${parsedUnits.length}`);
  console.log(`[auditMtfWeapons] Weapon entries audited: ${weaponEntryRows.length}`);
  console.log(`[auditMtfWeapons] Slot rows audited: ${slotRows.length}`);
  console.log(`[auditMtfWeapons] Unique MTF weapon names: ${uniqueNameRows.length}`);
  console.log(`[auditMtfWeapons] Output folder: ${OUTPUT_DIR}`);
}

/**
 * Builds a lookup table from normalized weapon ids, names, and altNames to weapon definitions.
 *
 * @returns A map from normalized text to one or more weapon candidates.
 */
function buildWeaponLookup(): Map<string, WeaponCandidate[]> {
  const lookup = new Map<string, WeaponCandidate[]>();

  for (const [key, weapon] of Object.entries(WEAPONS as Record<string, WeaponDefinition>)) {
    addWeaponLookupValue(lookup, key, {
      key,
      weapon,
      matchedBy: "id",
      matchedText: key,
    });

    addWeaponLookupValue(lookup, weapon.name, {
      key,
      weapon,
      matchedBy: "name",
      matchedText: weapon.name,
    });

    for (const altName of weapon.altNames ?? []) {
      addWeaponLookupValue(lookup, altName, {
        key,
        weapon,
        matchedBy: "altName",
        matchedText: altName,
      });
    }
  }

  return lookup;
}

/**
 * Adds a single normalized weapon lookup value to the lookup map.
 *
 * @param lookup The lookup map being built.
 * @param rawValue The raw id, name, or altName value.
 * @param candidate The weapon candidate associated with the value.
 * @returns Nothing.
 */
function addWeaponLookupValue(
  lookup: Map<string, WeaponCandidate[]>,
  rawValue: string,
  candidate: WeaponCandidate
): void {
  const normalized = normalizeWeaponText(rawValue);
  if (!normalized) return;

  const existing = lookup.get(normalized) ?? [];
  if (!existing.some((item) => item.key === candidate.key)) {
    existing.push(candidate);
  }
  lookup.set(normalized, existing);
}

/**
 * Audits parsed units for weapon-name resolution and declared-weapon-to-slot consistency.
 *
 * @param units Parsed MTF units to audit.
 * @param lookup Weapon lookup generated from weapons.ts.
 * @param options Command-line options controlling debug output.
 * @returns Audit rows and summary data.
 */
function auditUnits(
  units: ParsedUnit[],
  lookup: Map<string, WeaponCandidate[]>,
  options: CliOptions
): {
  weaponEntryRows: WeaponEntryAuditRow[];
  slotRows: SlotAuditRow[];
  uniqueNameRows: UniqueWeaponNameRow[];
  summary: Record<string, unknown>;
} {
  const weaponEntryRows: WeaponEntryAuditRow[] = [];
  const slotRows: SlotAuditRow[] = [];
  const uniqueNameMap = new Map<string, { rawName: string; occurrences: number; unitExamples: Set<string>; resolutions: WeaponResolution[] }>();

  let matchedWeaponEntries = 0;
  let unmatchedWeaponEntries = 0;
  let ambiguousWeaponEntries = 0;
  let slotMismatches = 0;
  let weaponLikeSlotsWithoutDeclaration = 0;

  for (const unit of units) {
    const declaredByLocation = groupDeclaredWeaponsByLocation(unit.weapons);

    for (const weaponEntry of unit.weapons) {
      const normalizedLocation = normalizeLocationName(weaponEntry.locationName);
      const resolution = resolveWeapon(weaponEntry.weaponName, unit.techBase, lookup);
      const slots = normalizedLocation ? unit.slotsByLocation[normalizedLocation] ?? [] : [];
      const slotMatches = resolution.chosen
        ? findMatchingSlotsForWeapon(slots, resolution.chosen.weapon, weaponEntry.weaponName)
        : [];

      if (resolution.status === "matched") matchedWeaponEntries++;
      if (resolution.status === "unmatched") unmatchedWeaponEntries++;
      if (resolution.status === "ambiguous") ambiguousWeaponEntries++;
      if (resolution.status === "matched" && slotMatches.length === 0) slotMismatches++;

      addUniqueNameOccurrence(uniqueNameMap, weaponEntry.weaponName, unit, resolution);

      weaponEntryRows.push({
        unitKey: unit.unitKey,
        chassis: unit.chassis,
        model: unit.model,
        techBase: unit.techBase,
        rulesLevel: unit.rulesLevel,
        relativePath: unit.relativePath,
        weaponIndex: String(weaponEntry.index),
        mtfWeaponName: weaponEntry.weaponName,
        mtfLocation: weaponEntry.locationName,
        normalizedLocation: normalizedLocation ?? "",
        resolutionStatus: resolution.status,
        chosenWeaponId: resolution.chosen?.key ?? "",
        chosenWeaponName: resolution.chosen?.weapon.name ?? "",
        chosenTechBase: resolution.chosen?.weapon.techBase ?? "",
        matchedBy: resolution.chosen?.matchedBy ?? "",
        matchedText: resolution.chosen?.matchedText ?? "",
        slotMatchStatus: slotMatches.length > 0 ? "matchedSlot" : "noMatchingSlotInDeclaredLocation",
        matchingSlotIndexes: slotMatches.map((slot) => String(slot.slotIndex)).join("; "),
        matchingSlotValues: slotMatches.map((slot) => slot.rawSlot).join("; "),
        reason: resolution.reason,
      });

      if (options.debug && (resolution.status !== "matched" || slotMatches.length === 0)) {
        console.warn(
          `[auditMtfWeapons] ${unit.chassis} ${unit.model}: ${weaponEntry.weaponName} @ ${weaponEntry.locationName} ` +
          `resolution=${resolution.status}, slotMatches=${slotMatches.length}, reason=${resolution.reason}`
        );
      }
    }

    for (const slots of Object.values(unit.slotsByLocation)) {
      for (const slot of slots) {
        const looksLikeWeapon = slotLooksLikeWeapon(slot.rawSlot);
        const declaredWeapons = declaredByLocation.get(slot.locationKey) ?? [];
        const matchingDeclared = declaredWeapons.filter((entry) =>
          slotMatchesDeclaredWeapon(slot.rawSlot, entry.weaponName, unit.techBase, lookup)
        );

        const slotResolution = looksLikeWeapon
          ? resolveWeapon(slot.rawSlot, unit.techBase, lookup)
          : { status: "unmatched", candidates: [], reason: "Slot does not look like a weapon." } satisfies WeaponResolution;

        if (looksLikeWeapon && matchingDeclared.length === 0) {
          weaponLikeSlotsWithoutDeclaration++;
        }

        slotRows.push({
          unitKey: unit.unitKey,
          chassis: unit.chassis,
          model: unit.model,
          techBase: unit.techBase,
          rulesLevel: unit.rulesLevel,
          relativePath: unit.relativePath,
          locationName: slot.locationName,
          slotIndex: String(slot.slotIndex),
          rawSlot: slot.rawSlot,
          slotLooksLikeWeapon: looksLikeWeapon ? "yes" : "no",
          declaredWeaponMatchStatus: !looksLikeWeapon
            ? "notWeaponLike"
            : matchingDeclared.length > 0
              ? "matchedDeclaredWeapon"
              : "weaponLikeSlotNotDeclared",
          declaredWeaponNames: matchingDeclared.map((entry) => entry.weaponName).join("; "),
          resolvedWeaponId: slotResolution.chosen?.key ?? "",
          resolvedWeaponName: slotResolution.chosen?.weapon.name ?? "",
          resolvedTechBase: slotResolution.chosen?.weapon.techBase ?? "",
          reason: slotResolution.reason,
        });
      }
    }
  }

  const uniqueNameRows = [...uniqueNameMap.values()]
    .map((entry): UniqueWeaponNameRow => {
      const mostRecentResolution = entry.resolutions[entry.resolutions.length - 1];
      const allCandidateIds = new Set<string>();

      for (const resolution of entry.resolutions) {
        for (const candidate of resolution.candidates) {
          allCandidateIds.add(candidate.key);
        }
      }

      return {
        rawName: entry.rawName,
        normalizedName: normalizeWeaponText(entry.rawName),
        occurrences: String(entry.occurrences),
        unitExamples: [...entry.unitExamples].slice(0, 8).join("; "),
        resolutionStatus: mostRecentResolution.status,
        chosenWeaponId: mostRecentResolution.chosen?.key ?? "",
        chosenWeaponName: mostRecentResolution.chosen?.weapon.name ?? "",
        chosenTechBase: mostRecentResolution.chosen?.weapon.techBase ?? "",
        candidateWeaponIds: [...allCandidateIds].join("; "),
        suggestion: mostRecentResolution.status === "unmatched"
          ? buildAltNameSuggestion(entry.rawName, lookup)
          : "",
      };
    })
    .sort((a, b) => Number(b.occurrences) - Number(a.occurrences));

  const summary = {
    generatedAt: new Date().toISOString(),
    unitsAudited: units.length,
    weaponEntriesAudited: weaponEntryRows.length,
    matchedWeaponEntries,
    unmatchedWeaponEntries,
    ambiguousWeaponEntries,
    slotMismatches,
    weaponLikeSlotsWithoutDeclaration,
    uniqueWeaponNames: uniqueNameRows.length,
    options,
  };

  return { weaponEntryRows, slotRows, uniqueNameRows, summary };
}

/**
 * Records an occurrence of a raw MTF weapon name for the unique-name report.
 *
 * @param map Unique name aggregation map.
 * @param rawName Raw weapon name from the MTF Weapons section.
 * @param unit Parsed unit where the name appeared.
 * @param resolution Resolution result for this occurrence.
 * @returns Nothing.
 */
function addUniqueNameOccurrence(
  map: Map<string, { rawName: string; occurrences: number; unitExamples: Set<string>; resolutions: WeaponResolution[] }>,
  rawName: string,
  unit: ParsedUnit,
  resolution: WeaponResolution
): void {
  const normalized = normalizeWeaponText(rawName);
  const existing = map.get(normalized) ?? {
    rawName,
    occurrences: 0,
    unitExamples: new Set<string>(),
    resolutions: [],
  };

  existing.occurrences++;
  existing.unitExamples.add(`${unit.chassis} ${unit.model}`);
  existing.resolutions.push(resolution);
  map.set(normalized, existing);
}

/**
 * Resolves a raw MTF weapon name against weapons.ts while respecting explicit CL/IS prefixes and unit tech base.
 *
 * @param rawName Raw weapon or slot text to resolve.
 * @param unitTechBase The parsed unit tech base from the MTF.
 * @param lookup Weapon lookup generated from weapons.ts.
 * @returns A resolution describing whether the weapon matched, was ambiguous, or was unmatched.
 */
function resolveWeapon(
  rawName: string,
  unitTechBase: TechBase | "",
  lookup: Map<string, WeaponCandidate[]>
): WeaponResolution {
  const cleaned = normalizeDeclaredWeaponName(cleanSlotWeaponText(rawName));
  const normalized = normalizeWeaponText(cleaned);
  const normalizedWithoutPrefix = stripTechPrefix(normalized);
  const explicitTechBase = getExplicitTechBase(rawName);
  const desiredTechBase = explicitTechBase || unitTechBase || "";

  const directCandidates = lookup.get(normalized) ?? [];
  const prefixStrippedCandidates = lookup.get(normalizedWithoutPrefix) ?? [];
  const candidates = dedupeCandidates([...directCandidates, ...prefixStrippedCandidates]);

  if (candidates.length === 0) {
    return {
      status: "unmatched",
      candidates: [],
      reason: `No weapon.ts name/altName/id matched "${rawName}" after normalizing to "${cleaned}".`,
    };
  }

  const techFiltered = desiredTechBase
    ? candidates.filter((candidate) => candidate.weapon.techBase === desiredTechBase || candidate.weapon.techBase === "Mixed")
    : candidates;

  const candidatesToRank = techFiltered.length > 0 ? techFiltered : candidates;
  const ranked = rankWeaponCandidates(candidatesToRank, normalized, normalizedWithoutPrefix, desiredTechBase);

  if (ranked.length === 1) {
    return {
      status: "matched",
      candidates,
      chosen: ranked[0].candidate,
      reason: ranked[0].reason,
    };
  }

  if (ranked.length > 1 && ranked[0].score > ranked[1].score) {
    return {
      status: "matched",
      candidates,
      chosen: ranked[0].candidate,
      reason: ranked[0].reason,
    };
  }

  if (techFiltered.length === 1) {
    return {
      status: "matched",
      candidates,
      chosen: techFiltered[0],
      reason: `Resolved by unit tech base ${desiredTechBase}.`,
    };
  }

  return {
    status: "ambiguous",
    candidates,
    reason: `Multiple candidates still matched "${rawName}" after count cleanup and tech-base filtering (${desiredTechBase || "none"}): ${candidatesToRank.map((c) => `${c.key} (${c.weapon.techBase})`).join(", ")}.`,
  };
}

/**
 * Ranks candidate weapons so exact name/altName matches and the unit tech base usually resolve without an ambiguous callout.
 *
 * @param candidates Candidate weapons to rank.
 * @param normalized Raw normalized weapon text.
 * @param normalizedWithoutPrefix Normalized text with IS/CL/Clan prefixes removed.
 * @param desiredTechBase Unit or explicit weapon tech base.
 * @returns Ranked candidates with scores and reasons.
 */
function rankWeaponCandidates(
  candidates: WeaponCandidate[],
  normalized: string,
  normalizedWithoutPrefix: string,
  desiredTechBase: TechBase | ""
): Array<{ candidate: WeaponCandidate; score: number; reason: string }> {
  return candidates
    .map((candidate) => {
      const weapon = candidate.weapon;
      const candidateTexts = [weapon.id, weapon.name, ...(weapon.altNames ?? [])].map(normalizeWeaponText);
      const candidateTextsWithoutPrefix = candidateTexts.map(stripTechPrefix);
      let score = 0;
      const reasons: string[] = [];

      if (desiredTechBase && (weapon.techBase === desiredTechBase || weapon.techBase === "Mixed")) {
        score += 1000;
        reasons.push(`tech base ${desiredTechBase}`);
      }

      if (candidateTexts.includes(normalized)) {
        score += 200;
        reasons.push("exact normalized id/name/altName match");
      }

      if (candidateTextsWithoutPrefix.includes(normalizedWithoutPrefix)) {
        score += 150;
        reasons.push("exact match after stripping IS/CL prefix");
      }

      if (normalizeWeaponText(weapon.name) === normalized || stripTechPrefix(normalizeWeaponText(weapon.name)) === normalizedWithoutPrefix) {
        score += 50;
        reasons.push("weapon.name preferred");
      }

      if (candidate.matchedBy === "id") score += 10;
      if (candidate.matchedBy === "name") score += 8;
      if (candidate.matchedBy === "altName") score += 5;

      return {
        candidate,
        score,
        reason: `Resolved by ${reasons.join(", ") || candidate.matchedBy}.`,
      };
    })
    .sort((a, b) => b.score - a.score || a.candidate.key.localeCompare(b.candidate.key));
}

/**
 * Finds critical slots in a declared location that match the resolved weapon or the raw declared weapon name.
 *
 * @param slots Parsed slots in the declared location.
 * @param weapon Resolved weapon definition.
 * @param declaredWeaponName Raw declared weapon name from the Weapons section.
 * @returns Slot rows that appear to correspond to the weapon.
 */
function findMatchingSlotsForWeapon(
  slots: ParsedSlot[],
  weapon: WeaponDefinition,
  declaredWeaponName: string
): ParsedSlot[] {
  return slots.filter((slot) => slotMatchesWeaponDefinition(slot.rawSlot, weapon, declaredWeaponName));
}

/**
 * Tests whether a raw slot value matches a resolved weapon definition.
 *
 * @param rawSlot Raw critical slot text.
 * @param weapon Weapon definition to test.
 * @param declaredWeaponName Raw declared weapon name as fallback.
 * @returns True when the slot appears to match the weapon.
 */
function slotMatchesWeaponDefinition(
  rawSlot: string,
  weapon: WeaponDefinition,
  declaredWeaponName: string
): boolean {
  const normalizedSlot = normalizeWeaponText(normalizeDeclaredWeaponName(cleanSlotWeaponText(rawSlot)));
  if (!normalizedSlot) return false;

  const possibleValues = [
    weapon.id,
    weapon.name,
    normalizeDeclaredWeaponName(declaredWeaponName),
    ...(weapon.altNames ?? []),
  ].map(normalizeWeaponText);

  return possibleValues.some((value) => value && (normalizedSlot === value || normalizedSlot.includes(value) || value.includes(normalizedSlot)));
}

/**
 * Tests whether a weapon-like slot matches a declared weapon entry.
 *
 * @param rawSlot Raw critical slot text.
 * @param declaredWeaponName Raw declared weapon name.
 * @param unitTechBase Parsed unit tech base.
 * @param lookup Weapon lookup generated from weapons.ts.
 * @returns True when the slot and declaration line up.
 */
function slotMatchesDeclaredWeapon(
  rawSlot: string,
  declaredWeaponName: string,
  unitTechBase: TechBase | "",
  lookup: Map<string, WeaponCandidate[]>
): boolean {
  const resolution = resolveWeapon(declaredWeaponName, unitTechBase, lookup);
  if (resolution.chosen) {
    return slotMatchesWeaponDefinition(rawSlot, resolution.chosen.weapon, declaredWeaponName);
  }

  const normalizedSlot = normalizeWeaponText(normalizeDeclaredWeaponName(cleanSlotWeaponText(rawSlot)));
  const normalizedDeclared = normalizeWeaponText(normalizeDeclaredWeaponName(declaredWeaponName));
  return normalizedSlot.includes(normalizedDeclared) || normalizedDeclared.includes(normalizedSlot);
}

/**
 * Groups declared MTF weapon entries by normalized location key.
 *
 * @param weapons Parsed weapon declarations.
 * @returns A map keyed by normalized location key.
 */
function groupDeclaredWeaponsByLocation(weapons: ParsedWeaponEntry[]): Map<string, ParsedWeaponEntry[]> {
  const map = new Map<string, ParsedWeaponEntry[]>();

  for (const weapon of weapons) {
    const location = normalizeLocationName(weapon.locationName);
    if (!location) continue;

    const existing = map.get(location) ?? [];
    existing.push(weapon);
    map.set(location, existing);
  }

  return map;
}

/**
 * Parses one MTF file into a lightweight unit record with weapon declarations and location slots.
 *
 * @param content Raw MTF file content.
 * @param filePath Absolute file path.
 * @param relativePath Path relative to src/data/units.
 * @returns Parsed unit metadata, weapons, and slots.
 */
function parseMtfUnit(content: string, filePath: string, relativePath: string): ParsedUnit {
  const lines = content.split(/\r?\n/);
  const fileName = path.basename(filePath);
  const fileNameParts = parseChassisModelFromFileName(fileName);

  const chassis = getMtfValue(lines, "chassis") || fileNameParts?.chassis || "";
  const model = getMtfValue(lines, "model") || fileNameParts?.model || "";
  const techBase = normalizeTechBase(getMtfValue(lines, "techbase", "tech base", "tech_base"));
  const rulesLevel = normalizeRulesLevel(getMtfValue(lines, "rules level", "rules_level", "rules", "ruleslevel"));

  return {
    unitKey: slug(relativePath),
    unitType: "meks",
    chassis,
    model,
    techBase,
    rulesLevel,
    filePath,
    relativePath,
    weapons: parseWeaponsSection(lines),
    slotsByLocation: parseLocationSlots(lines, {
      unitKey: slug(relativePath),
      chassis,
      model,
      techBase,
      rulesLevel,
      filePath,
      relativePath,
    }),
  };
}

/**
 * Parses the MTF Weapons section, usually formatted as Weapons:N followed by N "Weapon, Location" lines.
 *
 * @param lines MTF file lines.
 * @returns Parsed weapon entries.
 */
function parseWeaponsSection(lines: string[]): ParsedWeaponEntry[] {
  const weapons: ParsedWeaponEntry[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const match = line.match(/^weapons\s*:\s*(\d+)/i);
    if (!match) continue;

    const weaponCount = Number(match[1]);

    for (let j = 1; j <= weaponCount && i + j < lines.length; j++) {
      const rawLine = lines[i + j].trim();
      if (!rawLine) continue;

      const parts = rawLine.split(",").map((part) => part.trim());
      const weaponName = normalizeDeclaredWeaponName(parts[0] ?? "");
      const locationName = parts.slice(1).join(", ").trim();

      if (!weaponName) continue;

      weapons.push({
        rawLine,
        weaponName,
        locationName,
        index: weapons.length,
      });
    }

    break;
  }

  return weapons;
}

/**
 * Parses location critical slot blocks from an MTF file, including biped and quad Mek locations.
 *
 * @param lines MTF file lines.
 * @param base Base metadata copied into each slot row.
 * @returns Slots grouped by normalized location key.
 */
function parseLocationSlots(
  lines: string[],
  base: Omit<ParsedSlot, "locationKey" | "locationName" | "slotIndex" | "rawSlot" | "normalizedSlot">
): Record<string, ParsedSlot[]> {
  const slotsByLocation: Record<string, ParsedSlot[]> = {};

  for (let i = 0; i < lines.length; i++) {
    const header = lines[i].trim().replace(/:$/, "").toLowerCase();
    const locationKey = LOCATION_HEADERS[header];

    if (!locationKey) continue;

    const locationName = lines[i].trim().replace(/:$/, "");
    const slots: ParsedSlot[] = [];

    for (let slotOffset = 1; slotOffset <= 12 && i + slotOffset < lines.length; slotOffset++) {
      const rawSlot = lines[i + slotOffset].trim();

      if (isAnotherLocationHeader(rawSlot)) {
        break;
      }

      slots.push({
        ...base,
        locationKey,
        locationName,
        slotIndex: slotOffset,
        rawSlot,
        normalizedSlot: normalizeWeaponText(rawSlot),
      });
    }

    slotsByLocation[locationKey] = slots;
  }

  return slotsByLocation;
}

/**
 * Determines whether a raw line starts a new location block.
 *
 * @param rawLine Raw MTF line.
 * @returns True if the line is a known location header.
 */
function isAnotherLocationHeader(rawLine: string): boolean {
  const normalized = rawLine.trim().replace(/:$/, "").toLowerCase();
  return normalized in LOCATION_HEADERS;
}

/**
 * Determines whether a critical slot appears to contain a weapon rather than equipment, structure, ammo, or a system slot.
 *
 * @param rawSlot Raw critical slot value.
 * @returns True when the slot looks weapon-like.
 */
function slotLooksLikeWeapon(rawSlot: string): boolean {
  const lower = rawSlot.trim().toLowerCase();
  if (!lower) return false;

  if (SLOT_NON_WEAPON_PATTERNS.some((pattern) => lower.includes(pattern))) {
    return false;
  }

  return true;
}

/**
 * Builds an altName suggestion for an unmatched raw MTF weapon name.
 *
 * @param rawName Raw unmatched weapon name.
 * @param lookup Weapon lookup generated from weapons.ts.
 * @returns A suggested altName text or an empty string when no simple suggestion is available.
 */
function buildAltNameSuggestion(rawName: string, lookup: Map<string, WeaponCandidate[]>): string {
  const normalized = normalizeWeaponText(rawName);
  const likely = findLikelyWeaponCandidates(normalized, lookup).slice(0, 5);

  if (likely.length === 0) {
    return `Add "${rawName}" as an altName to the correct weapon definition.`;
  }

  return `Possible altName "${rawName}" for: ${likely.map((candidate) => candidate.key).join(", ")}`;
}

/**
 * Finds crude likely weapon candidates for an unmatched normalized name.
 *
 * @param normalizedName Normalized unmatched name.
 * @param lookup Weapon lookup generated from weapons.ts.
 * @returns Candidate weapons sorted by simple token containment.
 */
function findLikelyWeaponCandidates(
  normalizedName: string,
  lookup: Map<string, WeaponCandidate[]>
): WeaponCandidate[] {
  const scored = new Map<string, { candidate: WeaponCandidate; score: number }>();

  for (const [lookupName, candidates] of lookup.entries()) {
    let score = 0;

    if (lookupName.includes(normalizedName) || normalizedName.includes(lookupName)) {
      score += 10;
    }

    for (const token of splitNormalizedTokens(normalizedName)) {
      if (lookupName.includes(token)) score += 1;
    }

    if (score <= 0) continue;

    for (const candidate of candidates) {
      const existing = scored.get(candidate.key);
      if (!existing || score > existing.score) {
        scored.set(candidate.key, { candidate, score });
      }
    }
  }

  return [...scored.values()]
    .sort((a, b) => b.score - a.score)
    .map((item) => item.candidate);
}

/**
 * Splits a normalized compact string into crude tokens for fuzzy matching.
 *
 * @param normalizedName Normalized compact weapon text.
 * @returns Token list.
 */
function splitNormalizedTokens(normalizedName: string): string[] {
  const knownTokens = [
    "er", "ppc", "laser", "pulse", "large", "medium", "small", "micro", "heavy", "light",
    "gauss", "rifle", "autocannon", "ac", "ultra", "rotary", "lb", "lrm", "srm", "streak",
    "atm", "mrm", "narc", "tag", "flamer", "machine", "gun",
  ];

  return knownTokens.filter((token) => normalizedName.includes(token));
}

/**
 * Returns the explicit tech base from raw text prefixes like CL, Clan, IS, or Inner Sphere.
 *
 * @param rawText Raw weapon or slot text.
 * @returns Explicit tech base, or an empty string if none was found.
 */
function getExplicitTechBase(rawText: string): TechBase | "" {
  const normalized = normalizeWeaponText(rawText);

  if (normalized.startsWith("clan") || normalized.startsWith("cl")) return "Clan";
  if (normalized.startsWith("innersphere") || normalized.startsWith("is")) return "Inner Sphere";

  return "";
}

/**
 * Removes common tech prefixes from normalized weapon text.
 *
 * @param normalized Normalized weapon text.
 * @returns The text without CL/Clan/IS/InnerSphere prefix where possible.
 */
function stripTechPrefix(normalized: string): string {
  return normalized
    .replace(/^clan/, "")
    .replace(/^cl/, "")
    .replace(/^innersphere/, "")
    .replace(/^is/, "");
}

/**
 * Deduplicates weapon candidates by weapon key.
 *
 * @param candidates Candidate list.
 * @returns Deduplicated list.
 */
function dedupeCandidates(candidates: WeaponCandidate[]): WeaponCandidate[] {
  return [...new Map(candidates.map((candidate) => [candidate.key, candidate])).values()];
}

/**
 * Normalizes a declared MTF weapon name by removing a leading quantity such as "1 Small Laser" or "2 Medium Laser".
 *
 * MTF weapon lines sometimes prefix a weapon with a count. That count means quantity, not part of the weapon name,
 * so the audit and indexer should treat "1 Small Laser" and "Small Laser" as the same weapon.
 *
 * @param rawName Raw weapon name from the MTF Weapons section or a critical slot.
 * @returns Weapon name with leading quantity removed.
 */
function normalizeDeclaredWeaponName(rawName: string): string {
  return String(rawName ?? "")
    .trim()
    .replace(/^\d+(?:\.\d+)?\s*[xX]?\s+/, "")
    .replace(/^[xX]\s*\d+(?:\.\d+)?\s+/, "")
    .replace(/^\(\s*\d+(?:\.\d+)?\s*\)\s+/, "")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Cleans slot text by removing rear-facing and other parenthetical notes while preserving the weapon name.
 *
 * @param rawText Raw weapon or slot text.
 * @returns Cleaned text.
 */
function cleanSlotWeaponText(rawText: string): string {
  return normalizeDeclaredWeaponName(
    rawText
      .replace(/\([^)]*\)/g, " ")
      .replace(/\s+-\s+.*$/g, " ")
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Normalizes a weapon name for case-insensitive, punctuation-insensitive matching.
 *
 * @param value Raw value.
 * @returns Normalized compact value.
 */
function normalizeWeaponText(value: string): string {
  return String(value ?? "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

/**
 * Normalizes an MTF location name or abbreviation.
 *
 * @param value Raw location name.
 * @returns Normalized internal location key, or null if unknown.
 */
function normalizeLocationName(value: string): string | null {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/:$/, "")
    .replace(/\s+/g, " ");

  return LOCATION_ALIASES[normalized] ?? null;
}

/**
 * Reads a key-value value from MTF lines using normalized key comparison.
 *
 * @param lines MTF file lines.
 * @param keys Candidate keys to search.
 * @returns The first matching value, or an empty string.
 */
function getMtfValue(lines: string[], ...keys: string[]): string {
  for (const key of keys) {
    const normalizedKey = normalizeMtfKey(key);

    for (const line of lines) {
      const parsed = parseKeyValueLine(line);
      if (!parsed) continue;

      if (normalizeMtfKey(parsed.key) === normalizedKey) {
        return parsed.value;
      }
    }
  }

  return "";
}

/**
 * Parses a simple MTF key-value line.
 *
 * @param line Raw MTF line.
 * @returns Parsed key and value, or null if the line is not key-value.
 */
function parseKeyValueLine(line: string): { key: string; value: string } | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) return null;

  const match = trimmed.match(/^([^:=]+)\s*[:=]\s*(.*)$/);
  if (!match) return null;

  return {
    key: match[1].trim(),
    value: match[2].trim(),
  };
}

/**
 * Normalizes MTF keys for matching.
 *
 * @param value Raw key.
 * @returns Normalized key.
 */
function normalizeMtfKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

/**
 * Normalizes MTF tech base values.
 *
 * @param value Raw tech base.
 * @returns Normalized tech base.
 */
function normalizeTechBase(value: string): TechBase | "" {
  const lower = String(value ?? "").toLowerCase();

  if (lower.includes("clan")) return "Clan";
  if (lower.includes("mixed")) return "Mixed";
  if (lower.includes("inner") || lower === "is" || lower.includes("is ")) return "Inner Sphere";

  return "";
}

/**
 * Normalizes MTF rules level values to catalog labels.
 *
 * @param value Raw rules level.
 * @returns Normalized rules level name.
 */
function normalizeRulesLevel(value: string): RulesLevelName {
  const lower = String(value ?? "").trim().toLowerCase();

  if (["1", "intro", "introductory"].includes(lower)) return "Introductory";
  if (["2", "standard"].includes(lower)) return "Standard";
  if (["3", "advanced"].includes(lower)) return "Advanced";
  if (["4", "experimental"].includes(lower)) return "Experimental";
  if (["5", "unofficial"].includes(lower)) return "Unofficial";

  return "";
}

/**
 * Parses chassis and model from an MTF file name as a fallback.
 *
 * @param fileName File name.
 * @returns Parsed chassis/model or null if not enough parts exist.
 */
function parseChassisModelFromFileName(fileName: string): { chassis: string; model: string } | null {
  const baseName = fileName.replace(/\.mtf$/i, "").trim();
  const withoutParentheses = baseName.replace(/\s*\([^)]*\)\s*/g, " ").trim();
  const parts = withoutParentheses.split(/\s+/);

  if (parts.length < 2) return null;

  return {
    chassis: parts.slice(0, -1).join(" "),
    model: parts[parts.length - 1],
  };
}

/**
 * Recursively finds files by extension.
 *
 * @param root Root folder.
 * @param extension Extension to find.
 * @returns Absolute file paths.
 */
async function findFilesByExtension(root: string, extension: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(dir: string): Promise<void> {
    let entries: import("fs").Dirent[];

    try {
      entries = await fs.readdir(dir, { withFileTypes: true });
    } catch {
      console.warn(`[auditMtfWeapons] Could not read folder: ${dir}`);
      return;
    }

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        await walk(fullPath);
      } else if (entry.isFile() && entry.name.toLowerCase().endsWith(extension)) {
        results.push(fullPath);
      }
    }
  }

  await walk(root);
  return results;
}

/**
 * Chooses a random sample of file paths.
 *
 * @param files Candidate file paths.
 * @param sampleSize Number of files to choose.
 * @returns Sampled file paths.
 */
function chooseRandomSample(files: string[], sampleSize: number): string[] {
  const shuffled = [...files];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const swapIndex = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i]];
  }

  return shuffled.slice(0, sampleSize);
}

/**
 * Tests whether a parsed unit matches a user query.
 *
 * @param unit Parsed unit.
 * @param query Query text.
 * @returns True if the unit matches by chassis, model, full name, unit key, or path.
 */
function unitMatchesQuery(unit: ParsedUnit, query: string): boolean {
  const normalizedQuery = normalizeWeaponText(query);
  const haystack = normalizeWeaponText(`${unit.chassis} ${unit.model} ${unit.unitKey} ${unit.relativePath}`);

  return haystack.includes(normalizedQuery);
}

/**
 * Builds an output suffix from CLI options.
 *
 * @param options Parsed CLI options.
 * @returns File suffix.
 */
function getOutputSuffix(options: CliOptions): string {
  const parts: string[] = [];

  if (options.unitQuery) parts.push(`unit-${slug(options.unitQuery)}`);
  if (options.rulesLevel) parts.push(`rules-${slug(options.rulesLevel)}`);
  if (options.sampleSize) parts.push(`sample-${options.sampleSize}`);

  return parts.length > 0 ? `.${parts.join(".")}` : "";
}

/**
 * Converts rows to CSV text.
 *
 * @param rows Row objects.
 * @returns CSV string.
 */
function toCsv<T extends Record<string, unknown>>(rows: T[]): string {
  if (rows.length === 0) return "";

  const columns = Object.keys(rows[0]) as Array<keyof T>;
  const header = columns.join(",");
  const body = rows.map((row) => columns.map((column) => escapeCsv(row[column])).join(","));

  return [header, ...body].join("\n");
}

/**
 * Escapes a CSV value.
 *
 * @param value Raw value.
 * @returns CSV-safe value.
 */
function escapeCsv(value: unknown): string {
  if (value == null) return "";

  const stringValue = String(value);

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Creates a slug for ids and file suffixes.
 *
 * @param value Raw value.
 * @returns Slug value.
 */
function slug(value: string): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\.mtf$/i, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Parses command-line options.
 *
 * @returns CLI options.
 */
function getCliOptions(): CliOptions {
  const args = process.argv.slice(2);
  const typeArg = args.find((arg) => arg.startsWith("--type="));
  const rulesArg = args.find((arg) => arg.startsWith("--rules="));
  const unitArg = args.find((arg) => arg.startsWith("--unit=") || arg.startsWith("--model="));
  const sampleArg = args.find((arg) => arg.startsWith("--sample="));
  const positionalNumber = args.find((arg) => /^\d+$/.test(arg));

  const unitType = (typeArg?.split("=")[1] ?? "meks") as UnitTypeKey;

  if (unitType !== "meks") {
    throw new Error(`auditMtfWeapons currently supports --type=meks only.`);
  }

  return {
    unitType,
    rulesLevel: normalizeRulesLevel(rulesArg?.split("=")[1] ?? ""),
    unitQuery: unitArg ? unitArg.replace(/^--(unit|model)=/, "") : "",
    sampleSize: sampleArg
      ? Number(sampleArg.split("=")[1])
      : positionalNumber
        ? Number(positionalNumber)
        : null,
    debug: args.includes("--debug"),
  };
}

main().catch((error) => {
  console.error("[auditMtfWeapons] Failed:", error);
  process.exit(1);
});
