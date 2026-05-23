import {
  COMPONENTS,
  ComponentCostContext,
  ComponentId,
  calculateComponentCost,
  getEngineRating,
  resolveArmorComponentId,
  resolveCockpitComponentId,
  resolveEngineComponentId,
  resolveGyroComponentId,
  resolveHeatSinkComponentId,
  resolveInternalStructureComponentId,
} from "../src/data/components.ts";

export type MekCostInput = {
  unitTonnage: number;
  walkMP: number;
  cockpitType?: string;
  engineType?: string;
  gyroType?: string;
  gyroTonnage: number;
  internalStructureType?: string;
  musculatureType?: "Standard" | "Triple-Strength Myomer" | "Industrial Triple-Strength Myomer";
  armorType?: string;
  armorTonnage: number;
  heatSinkType?: string;
  heatSinkCount: number;
  jumpJetType?: "Standard" | "Improved";
  jumpJetCount?: number;
  mascTonnage?: number;
  amplifierTonnage?: number;
  includeActuators?: boolean;
  actuatorCounts?: Partial<Record<"upperArm" | "lowerArm" | "hand" | "upperLeg" | "lowerLeg" | "foot", number>>;
};

export type MekCostLineItem = {
  componentId: ComponentId;
  name: string;
  cost: number;
};

export type MekStructuralCostResult = {
  total: number;
  roundedTotal: number;
  engineRating: number;
  lineItems: MekCostLineItem[];
};

function addLineItem(
  lineItems: MekCostLineItem[],
  componentId: ComponentId,
  context: ComponentCostContext,
): void {
  const component = COMPONENTS[componentId];
  const cost = calculateComponentCost(component, context);
  lineItems.push({ componentId, name: component.name, cost });
}

function resolveMusculatureComponentId(type?: MekCostInput["musculatureType"]): ComponentId {
  switch (type) {
    case "Triple-Strength Myomer":
      return "tripleStrengthMyomer";
    case "Industrial Triple-Strength Myomer":
      return "industrialTripleStrengthMyomer";
    case "Standard":
    case undefined:
      return "standardMusculature";
    default:
      return "standardMusculature";
  }
}

function resolveJumpJetComponentId(type?: MekCostInput["jumpJetType"]): ComponentId {
  return type === "Improved" ? "improvedJumpJet" : "standardJumpJet";
}

export function calculateMekStructuralCost(input: MekCostInput): MekStructuralCostResult {
  const engineType = input.engineType ?? "Standard Fusion";
  const cockpitType = input.cockpitType ?? "Standard";
  const gyroType = input.gyroType ?? "Standard";
  const internalStructureType = input.internalStructureType ?? "Standard";
  const armorType = input.armorType ?? "Standard";
  const heatSinkType = input.heatSinkType ?? "Single";
  const engineRating = getEngineRating(input.unitTonnage, input.walkMP);

  const context: ComponentCostContext = {
    unitTonnage: input.unitTonnage,
    engineRating,
    gyroTonnage: input.gyroTonnage,
    jumpJetCount: input.jumpJetCount ?? 0,
    heatSinkCount: input.heatSinkCount,
    armorTonnage: input.armorTonnage,
    amplifierTonnage: input.amplifierTonnage ?? 0,
    mascTonnage: input.mascTonnage ?? 0,
  };

  const lineItems: MekCostLineItem[] = [];

  addLineItem(lineItems, resolveCockpitComponentId(cockpitType), context);
  addLineItem(lineItems, "lifeSupport", context);
  addLineItem(lineItems, "sensors", context);
  addLineItem(lineItems, resolveMusculatureComponentId(input.musculatureType), context);
  addLineItem(lineItems, resolveInternalStructureComponentId(internalStructureType), context);
  addLineItem(lineItems, resolveEngineComponentId(engineType), context);
  addLineItem(lineItems, resolveGyroComponentId(gyroType), context);
  addLineItem(lineItems, resolveHeatSinkComponentId(heatSinkType, engineType), context);
  addLineItem(lineItems, resolveArmorComponentId(armorType), context);

  if ((input.jumpJetCount ?? 0) > 0) {
    addLineItem(lineItems, resolveJumpJetComponentId(input.jumpJetType), context);
  }

  if ((input.mascTonnage ?? 0) > 0) {
    addLineItem(lineItems, "masc", context);
  }

  if ((input.amplifierTonnage ?? 0) > 0) {
    addLineItem(lineItems, "powerAmplifier", context);
  }

  if (input.includeActuators) {
    const counts = input.actuatorCounts ?? {};
    const actuatorMap: Array<[keyof NonNullable<MekCostInput["actuatorCounts"]>, ComponentId]> = [
      ["upperArm", "upperArmActuator"],
      ["lowerArm", "lowerArmActuator"],
      ["hand", "handActuator"],
      ["upperLeg", "upperLegActuator"],
      ["lowerLeg", "lowerLegActuator"],
      ["foot", "footActuator"],
    ];

    for (const [countKey, componentId] of actuatorMap) {
      const count = counts[countKey] ?? 0;
      for (let i = 0; i < count; i += 1) {
        addLineItem(lineItems, componentId, context);
      }
    }
  }

  const total = lineItems.reduce((sum, item) => sum + item.cost, 0);

  return {
    total,
    roundedTotal: Math.round(total),
    engineRating,
    lineItems,
  };
}
