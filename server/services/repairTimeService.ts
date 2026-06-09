import fs from "fs";
import path from "path";

type RepairTimeRow = {
  category: string;
  item: string;
  severityKey?: string;
  severityLabel?: string;
  skillModifier: number;
  timeMinutes: number;
};

let cachedRows: RepairTimeRow[] | null = null;

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = "";
  let quoted = false;
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (char === "," && !quoted) {
      values.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current.trim());
  return values;
}

function loadRows(): RepairTimeRow[] {
  if (cachedRows) return cachedRows;
  const csvPath = path.resolve(process.cwd(), "src", "data", "repair_time.csv");
  const text = fs.readFileSync(csvPath, "utf8").replace(/^\uFEFF/, "");
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines.shift() ?? "");
  cachedRows = lines.map((line) => {
    const values = parseCsvLine(line);
    const record = Object.fromEntries(headers.map((header, index) => [header, values[index] ?? ""]));
    return {
      category: String(record.Category ?? ""),
      item: String(record.Item ?? ""),
      severityKey: String(record.SeverityKey ?? "") || undefined,
      severityLabel: String(record.SeverityLabel ?? "") || undefined,
      skillModifier: Number(record.SkillModifier ?? 0),
      timeMinutes: Number(record.TimeMinutes ?? 0),
    };
  });
  return cachedRows;
}

function normalize(value: unknown): string {
  return String(value ?? "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function findRow(category: string, item: string, severityKey?: string | number): RepairTimeRow | undefined {
  const rows = loadRows();
  const categoryKey = normalize(category);
  const itemKey = normalize(item);
  const severity = severityKey == null ? undefined : String(severityKey);
  return rows.find((row) =>
    normalize(row.category) === categoryKey &&
    normalize(row.item) === itemKey &&
    (severity === undefined || String(row.severityKey ?? "") === severity),
  );
}

function genericEquipmentName(itemName: string): string {
  const name = normalize(itemName);
  if (name.includes("engine")) return "Engine";
  if (name.includes("gyro")) return "Gyro";
  if (name.includes("sensor")) return "Sensors";
  if (name.includes("life support")) return "Life Support";
  if (name.includes("jump jet")) return "Jump Jet";
  if (name.includes("heat sink")) return "Heat Sink";
  if (name.includes("actuator") || name.includes("shoulder") || name.includes("hip")) return "Actuator";
  if (name.includes("case")) return "CASE/CASE II";
  if (name.includes("turret")) return "Turret";
  return "Weapons and Other Equipment";
}

export function resolveRepairTimeMinutes(order: any): number {
  const action = String(order.action ?? "Repair");
  const category = String(order.category ?? "");
  const quantity = Math.max(1, Number(order.quantity ?? 1));

  if (action === "Rearm" || category === "Ammunition") {
    return (findRow("Reload", "Ammo Reload", "perSlotBin")?.timeMinutes ?? 10) * Math.max(1, Number(order.binCount ?? 1));
  }

  if (category === "Armor") {
    return (findRow("Replacement", "Armor", "perArmorPoint")?.timeMinutes ?? 5) * quantity;
  }

  if (category === "Internal Structure") {
    const percent = Math.max(1, Number(order.damagePercent ?? 100));
    const severity = percent <= 25 ? 25 : percent <= 50 ? 50 : percent <= 75 ? 75 : 100;
    return findRow("Repair", "Internal Structure", severity)?.timeMinutes ?? 270;
  }

  if (category === "Location Assembly") {
    const location = normalize(order.itemName);
    if (location.includes("head")) return findRow("Replacement", "Replace Blown-Off Head")?.timeMinutes ?? 200;
    if (location.includes("arm") || location.includes("leg")) return findRow("Replacement", "Reattach/Replace Blown-Off Limb")?.timeMinutes ?? 180;
    return findRow("Replacement", "Destroyed Location")?.timeMinutes ?? 240;
  }

  const equipmentName = genericEquipmentName(String(order.itemName ?? ""));
  if (action === "Replace") {
    return findRow("Replacement", equipmentName)?.timeMinutes
      ?? findRow("Replacement", "Weapons and Other Equipment")?.timeMinutes
      ?? 120;
  }

  const criticalHits = Math.max(1, Number(order.criticalHits ?? 1));
  const severity = criticalHits >= 4 ? 4 : criticalHits;
  return findRow("Repair", equipmentName, severity)?.timeMinutes
    ?? findRow("Repair", equipmentName)?.timeMinutes
    ?? findRow("Repair", "Weapons and Other Equipment", severity)?.timeMinutes
    ?? 100;
}
