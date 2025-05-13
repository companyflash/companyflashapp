// app/api/company-info/route.ts
import { supabase } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  let q = req.nextUrl.searchParams.get("name")?.trim() || "";
  if (q.length < 3)
    return NextResponse.json({ error: "query_too_short" }, { status: 400 });

  // Strip parentheses so "(impact" → "impact"
  q = q.replace(/[()]/g, "");

  // 1) fast prefix search
  let { data: matches, error } = await supabase
    .from("company_profiles")
    .select(
      "company_number, company_name, company_status, date_of_creation"
    )
    .ilike("company_name", `${q}%`)
    .order("company_name")
    .limit(5);

  if (error) {
    console.error(error);
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }

  // 2) if nothing found, try slower contains search (no leading % → faster)
  if (!matches || matches.length === 0) {
    ({ data: matches, error } = await supabase
      .from("company_profiles")
      .select(
        "company_number, company_name, company_status, date_of_creation"
      )
      .ilike("company_name", `%${q}%`)
      .order("company_name")
      .limit(5));

    if (error) {
      console.error(error);
      return NextResponse.json({ error: "db_error" }, { status: 500 });
    }
  }

  return NextResponse.json({ matches: matches ?? [] });
}
