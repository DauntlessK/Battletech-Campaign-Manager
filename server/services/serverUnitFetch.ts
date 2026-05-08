import fs from "fs/promises";
import path from "path";
import { findMtfByChassisModel } from "./mtfIndex";

let installed = false;

export function installServerUnitFetch() {
  if (installed) return;
  installed = true;

  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (
    input: RequestInfo | URL,
    init?: RequestInit
  ): Promise<Response> => {
    const url = typeof input === "string" ? input : input.toString();

    if (!url.startsWith("/units/meks/")) {
      return originalFetch(input, init);
    }

    const decodedUrl = decodeURIComponent(url);
    const requestedFileName = path.basename(decodedUrl);
    const parsed = parseChassisModelFromRequestedFile(requestedFileName);

    if (!parsed) {
      return textResponse(`Could not parse requested MTF filename: ${requestedFileName}`, 404);
    }

    const record = await findMtfByChassisModel(parsed.chassis, parsed.model);

    if (!record) {
      return textResponse(`MTF not found for ${parsed.chassis} ${parsed.model}`, 404);
    }

    const content = await fs.readFile(record.filePath, "utf-8");

    return textResponse(content, 200);
  };
}

function parseChassisModelFromRequestedFile(
  fileName: string
): { chassis: string; model: string } | null {
  const baseName = fileName.replace(/\.mtf$/i, "").trim();
  const parts = baseName.split(/\s+/);

  if (parts.length < 2) return null;

  return {
    chassis: parts.slice(0, -1).join(" "),
    model: parts[parts.length - 1],
  };
}

function textResponse(content: string, status: number) {
  return new Response(content, {
    status,
    headers: {
      "Content-Type": "text/plain",
    },
  });
}