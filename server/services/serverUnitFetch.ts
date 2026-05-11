import fs from "fs/promises";
import path from "path";
import { findMtfByChassisModel } from "./mtfIndex";

let installed = false;
let forcedMtfPath: string | null = null;

const UNITS_ROOT = path.resolve(process.cwd(), "src", "data", "units");

export function setForcedMtfPath(relativePath: string | null) {
  forcedMtfPath = relativePath;
}

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

    /*
      Best path: when /api/units/:id loads a selected catalog row,
      use that exact CSV relativePath. This avoids filename problems like:
      Daishi (Dire Wolf) Prime.mtf vs Daishi Prime.mtf.
    */
    if (forcedMtfPath) {
      const filePath = path.join(UNITS_ROOT, forcedMtfPath);
      const content = await fs.readFile(filePath, "utf-8");
      return textResponse(content, 200);
    }

    /*
      Fallback path: for test routes or direct chassis/model construction.
    */
    const decodedUrl = decodeURIComponent(url);
    const requestedFileName = path.basename(decodedUrl);
    const parsed = parseChassisModelFromRequestedFile(requestedFileName);

    if (!parsed) {
      return textResponse(
        `Could not parse requested MTF filename: ${requestedFileName}`,
        404
      );
    }

    const record = await findMtfByChassisModel(parsed.chassis, parsed.model);

    if (!record) {
      return textResponse(
        `MTF not found for ${parsed.chassis} ${parsed.model}`,
        404
      );
    }

    const content = await fs.readFile(record.filePath, "utf-8");
    return textResponse(content, 200);
  };
}

function parseChassisModelFromRequestedFile(
  fileName: string
): { chassis: string; model: string } | null {
  const baseName = fileName.replace(/\.mtf$/i, "").trim();

  /*
    Handles things like:
      Atlas AS7-D.mtf
      Daishi (Dire Wolf) Prime.mtf

    For fallback lookup only. Exact relativePath is preferred.
  */
  const withoutParentheses = baseName.replace(/\s*\([^)]*\)\s*/g, " ").trim();
  const parts = withoutParentheses.split(/\s+/);

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