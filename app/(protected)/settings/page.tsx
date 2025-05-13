/*  app/(protected)/settings/page.tsx
    ------------------------------------------------------------
    A single‑page Settings screen that lets the signed‑in user
    edit their personal profile and the company (business) name.
    – Assumes you already protect the “(protected)” segment with
      middleware or a layout that checks `supabase.auth.getSession`.
    – Relies on the tables / columns we discussed earlier:
      profiles(id, full_name, avatar_url, marketing_consent …)
      businesses(id, name …)
    – Uses the browser Supabase client from:  src/lib/supabaseClient.ts
*/

"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/lib/supabaseClient";

// --- local helper types ----------------------------------------------------
type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  marketing_consent: boolean | null;
};

type Business = {
  id: string;
  name: string | null;
};

// ---------------------------------------------------------------------------

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  /* ─────────────────────────────────────────────────────────────
     1. Load current profile + business once on mount
  ───────────────────────────────────────────────────────────────*/
  useEffect(() => {
    (async () => {
      const {
        data: { session },
        error: sessErr,
      } = await supabase.auth.getSession();
      if (sessErr || !session) return; // protected route already, but double‑check

      const { id: userId, user_metadata } = session.user;
      const businessId = user_metadata?.business_id as string | undefined;

      const [{ data: prof }, { data: biz }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", userId).single(),
        businessId
          ? supabase.from("businesses").select("*").eq("id", businessId).single()
          : Promise.resolve({ data: null }),
      ]);

      setProfile(prof as Profile);
      setBusiness(biz as Business);
      setLoading(false);
    })();
  }, []);

  /* ─────────────────────────────────────────────────────────────
     2. Mutations
  ───────────────────────────────────────────────────────────────*/
  const saveProfile = async () => {
    if (!profile) return;
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        marketing_consent: profile.marketing_consent,
      })
      .eq("id", profile.id);

    setToast(error ? error.message : "Profile saved ✔︎");
  };

  const saveBusiness = async () => {
    if (!business) return;
    const { error } = await supabase
      .from("businesses")
      .update({ name: business.name })
      .eq("id", business.id);

    setToast(error ? error.message : "Company name updated ✔︎");
  };

  /* ───────────────────────────────────────────────────────────── */

  if (loading) return <p className="p-6 text-sm">Loading…</p>;

  return (
    <div className="mx-auto max-w-xl p-6 space-y-10">
      <h1 className="text-2xl font-semibold">Settings</h1>

      {/* -------------------------- Profile card -------------------------- */}
      <section className="space-y-6">
        <h2 className="text-lg font-medium">Your profile</h2>

        <label className="block">
          <span className="text-sm text-gray-600">Full name</span>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={profile?.full_name ?? ""}
            onChange={(e) =>
              setProfile((p) => p && { ...p, full_name: e.target.value })
            }
          />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Avatar URL</span>
          <input
            className="mt-1 w-full border rounded px-3 py-2"
            value={profile?.avatar_url ?? ""}
            onChange={(e) =>
              setProfile((p) => p && { ...p, avatar_url: e.target.value })
            }
          />
        </label>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={!!profile?.marketing_consent}
            onChange={() =>
              setProfile(
                (p) => p && { ...p, marketing_consent: !p.marketing_consent }
              )
            }
          />
          <span className="text-sm">Send me product updates</span>
        </label>

        <button
          onClick={saveProfile}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save profile
        </button>
      </section>

      {/* -------------------------- Company card -------------------------- */}
      {business && (
        <section className="space-y-6">
          <h2 className="text-lg font-medium">Company</h2>

          <label className="block">
            <span className="text-sm text-gray-600">Company name</span>
            <input
              className="mt-1 w-full border rounded px-3 py-2"
              value={business.name ?? ""}
              onChange={(e) =>
                setBusiness((b) => b && { ...b, name: e.target.value })
              }
            />
          </label>

          <button
            onClick={saveBusiness}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Save company
          </button>
        </section>
      )}

      {/* -------------------------- tiny toast ---------------------------- */}
      {toast && (
        <p
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/90 text-white
                     rounded px-4 py-2 text-sm"
        >
          {toast}
        </p>
      )}
    </div>
  );
}
