import { Mek } from "../../src/files/Mek";
import { unitType } from "../../src/constants/enums";
import { installServerUnitFetch } from "./serverUnitFetch";
import { findCatalogItemById, getUnitCatalog } from "./unitCatalogService";
import { mekToUnitDto } from "./mekToUnitDto";
import type { Unit } from "../types/unit";

type StarterMek = {
  chassis: string;
  model: string;
};

const STARTER_MEKS: StarterMek[] = [
  { chassis: "Atlas", model: "AS7-D" },
  { chassis: "Phoenix Hawk", model: "PXH-1" },
  { chassis: "Hunchback", model: "HBK-4G" },
  { chassis: "Wolverine", model: "WVR-6R" },
];

export async function getTestMekUnit(): Promise<Unit> {
  installServerUnitFetch();

  const mek = await new Mek(unitType.Mek, null, null, "Atlas", "AS7-D").ready();

  return mekToUnitDto(mek, "Atlas AS7-D.mtf");
}


export async function getAllUnitDefinitions() {
  return getUnitCatalog("meks");
}

export async function getUnitDefinitionById(id: string): Promise<Unit | null> {
  installServerUnitFetch();

  const catalogItem = await findCatalogItemById(id);

  if (!catalogItem) {
    return null;
  }

  const mek = await new Mek(
    unitType.Mek,
    null,
    null,
    catalogItem.chassis,
    catalogItem.model
  ).ready();

  return mekToUnitDto(mek, catalogItem.relativePath);
}

async function createUnitFromChassisModel(
  chassis: string,
  model: string
): Promise<Unit | null> {
  const record = await findMtfByChassisModel(chassis, model);

  if (!record) {
    console.warn("[unitLibraryService] MTF not found:", { chassis, model });
    return null;
  }

  try {
    const mek = await new Mek(
      unitType.Mek,
      null,
      null,
      chassis,
      model
    ).ready();

    return mekToUnitDto(mek, record.relativePath);
  } catch (error) {
    console.error("[unitLibraryService] Failed to create Mek:", {
      chassis,
      model,
      error,
    });

    return null;
  }
}