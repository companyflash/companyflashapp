"use client";

import { useEffect, useState } from 'react';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Initialize Supabase
const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type RiskEntry = {
  company_number: string;
  risk: string;
  reason: string;
  updated_at: string;
};

type RiskCount = { risk: string };

export default function DashboardPage() {
  const [entries, setEntries] = useState<RiskEntry[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Fetch all risk categories for count
      const { data: allCounts, error: errCounts } = await supabase
        .from('risk_cache')
        .select('risk');
      if (!errCounts && allCounts) {
        const tally: Record<string, number> = {};
        (allCounts as RiskCount[]).forEach((item) => {
          tally[item.risk] = (tally[item.risk] || 0) + 1;
        });
        setCounts(tally);
      }
      // Fetch top RED entries
      const { data: redEntries, error: errRed } = await supabase
        .from('risk_cache')
        .select('company_number, risk, reason, updated_at')
        .eq('risk', 'RED')
        .order('updated_at', { ascending: false })
        .limit(20);
      if (!errRed && redEntries) {
        setEntries(redEntries as RiskEntry[]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">CompanyFlash Dashboard</h1>
      {loading ? (
        <p>Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-4 gap-4 mb-6">
            {['RED', 'AMBER', 'GREEN', 'NEW'].map((cat) => (
              <div
                key={cat}
                className="p-4 rounded-2xl shadow-md text-center"
              >
                <div className="text-xl font-semibold">{cat}</div>
                <div className="text-3xl">{counts[cat] || 0}</div>
              </div>
            ))}
          </div>
          <div className="space-y-2">
            {entries.map((e) => (
              <div
                key={e.company_number}
                className="p-4 rounded-2xl shadow-sm border"
              >
                <div className="flex justify-between">
                  <div>
                    <strong>{e.company_number}</strong> —{' '}
                    <em>{e.reason}</em>
                  </div>
                  <div>{new Date(e.updated_at).toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
