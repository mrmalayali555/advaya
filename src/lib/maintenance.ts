import "server-only";

import { NextResponse } from "next/server";
import { TEMPORARY_MAINTENANCE_MODE } from "@/lib/maintenance-config";

export async function isMaintenanceMode(): Promise<boolean> {
  return TEMPORARY_MAINTENANCE_MODE;
}

export function maintenanceResponse() {
  return NextResponse.json(
    { error: "The website is temporarily under maintenance." },
    {
      status: 503,
      headers: {
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    }
  );
}
