import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/db";

/**
 * GET /api/verification-status?invoiceId=<uuid>
 * Returns:
 *   {
 *     overallStatus: { label: "High Risk", variant: "danger" },
 *     bankAccount:   { label: "Not Verified", variant: "warning" },
 *     nameMatch:     { label: "Not Matched", variant: "danger" },
 *     addressMatch:  { label: "Not Verified", variant: "warning" },
 *     riskScore: 75
 *   }
 */
export async function GET(req: NextRequest) {
  const invoiceId = req.nextUrl.searchParams.get("invoiceId") || "";

  if (!invoiceId) {
    return NextResponse.json(
      { error: "missing_invoiceId_param" },
      { status: 400 }
    );
  }

  // Pull the most recent cached risk record for this invoice
  const { data: cache, error } = await supabase
    .from("risk_cache")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  if (!cache) {
    // fall back to naive defaults until verification logic runs
    return NextResponse.json({
      overallStatus: { label: "Pending", variant: "neutral" },
      bankAccount: { label: "Not Verified", variant: "warning" },
      nameMatch: { label: "Not Checked", variant: "neutral" },
      addressMatch: { label: "Not Checked", variant: "neutral" },
      riskScore: 0,
    });
  }

  // Map whatever columns you store (e.g. booleans, scores) into UI‑friendly labels
  const map = (pass: boolean | null, pending = "Not Verified") =>
    pass == null
      ? { label: pending, variant: "warning" }
      : pass
      ? { label: "Verified", variant: "success" }
      : { label: "Failed", variant: "danger" };

  return NextResponse.json({
    overallStatus:
      cache.risk_score >= 70
        ? { label: "High Risk", variant: "danger" }
        : cache.risk_score >= 40
        ? { label: "Medium Risk", variant: "warning" }
        : { label: "Low Risk", variant: "success" },
    bankAccount: map(cache.bank_verified),
    nameMatch: map(cache.name_match, "Not Matched"),
    addressMatch: map(cache.address_match),
    riskScore: cache.risk_score,
  });
}
