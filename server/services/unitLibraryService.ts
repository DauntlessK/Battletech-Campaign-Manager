import { Mek } from "../../src/files/Mek";
import { unitType } from "../../src/constants/enums";
import { installServerUnitFetch, setForcedMtfPath } from "./serverUnitFetch";
import { findCatalogItemById, getUnitCatalog } from "./unitCatalogService";
import { mekToUnitDto } from "./mekToUnitDto";
import type { Unit } from "../types/unit";

export async function getTestMekUnit(): Promise<Unit> {
  installServerUnitFetch();

  const mek = await new Mek(
    unitType.Mek,
    null,
    null,
    "Atlas",
    "AS7-D"
  ).ready();

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

  try {
    setForcedMtfPath(catalogItem.relativePath);

    const mek = await new Mek(
      unitType.Mek,
      null,
      null,
      catalogItem.chassis,
      catalogItem.model
    ).ready();

    return mekToUnitDto(mek, catalogItem.relativePath);
  } finally {
    setForcedMtfPath(null);
  }
}