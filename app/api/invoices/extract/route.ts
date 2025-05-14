import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { fileTypeFromBuffer } from 'file-type';
import { GoogleAuth } from 'google-auth-library';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

interface Entity {
  type: string;
  mentionText?: string;
  normalizedValue?: { text: string };
}

interface AIResponse {
  document?: {
    entities?: Entity[];
  };
}

const projectId   = process.env.GOOGLE_CLOUD_PROJECT_ID!;
const location    = process.env.GOOGLE_CLOUD_PROCESSOR_LOCATION!;
const processorId = process.env.GOOGLE_CLOUD_PROCESSOR_ID!;
const endpoint    = `https://${location}-documentai.googleapis.com/v1/projects/${projectId}/locations/${location}/processors/${processorId}:process`;

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPA_SERVICE_ROLE_KEY!
);

function pickEntity(entities: Entity[], type: string): Entity | undefined {
  return entities.find(e => e.type === type);
}

export async function POST(request: Request) {
  // ─── VERIFY & LOAD KEY ──────────────────────
  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS!;
  const abs      = path.resolve(credPath);
  await fs.promises.access(abs, fs.constants.R_OK);
  const keyJson = JSON.parse(await fs.promises.readFile(abs, 'utf8'));

  // ─── AUTH & TOKEN ──────────────────────────
  const auth   = new GoogleAuth({ credentials: keyJson, scopes: ['https://www.googleapis.com/auth/cloud-platform'] });
  const client = await auth.getClient();
  const tokenRes = await client.getAccessToken();
  const token = tokenRes.token;
  if (!token) {
    console.error('❌ No token returned');
    return NextResponse.json({ error: 'Auth token error' }, { status: 500 });
  }

  // ─── RECEIVE & VALIDATE FILE ───────────────
  const formData = await request.formData();
  const file     = formData.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  if (!buffer.length) return NextResponse.json({ error: 'Empty file' }, { status: 400 });

  const { mime } = (await fileTypeFromBuffer(buffer)) || { mime: file.type || 'application/pdf' };
  if (!['application/pdf','image/png','image/jpeg'].includes(mime)) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
  }

  // ─── CALL DOCUMENT AI ───────────────────────
  let aiResult: AIResponse;
  try {
    const payload = { rawDocument: { content: buffer.toString('base64'), mimeType: mime }, skipHumanReview: true };
    const aiRes = await fetch(endpoint, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await aiRes.text();
    if (!aiRes.ok) {
      return NextResponse.json({ error: `Document AI error ${aiRes.status}`, detail: text }, { status: 500 });
    }
    aiResult = JSON.parse(text) as AIResponse;
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Unknown error');
    console.error('❌ Document AI network error:', error);
    return NextResponse.json({ error: 'Document AI call failed', detail: error.message }, { status: 500 });
  }

  // ─── EXTRACT ENTITIES & FALLBACK ───────────
  const ents = aiResult.document?.entities ?? [];
  const idEnt   = pickEntity(ents, 'invoice_id');
  const dateEnt = pickEntity(ents, 'invoice_date');
  const amtEnt  = pickEntity(ents, 'total_amount') || pickEntity(ents, 'amount');
  const recvEnt = pickEntity(ents, 'receiver_name');
  const sortEnt = pickEntity(ents, 'sort_code');
  const accEnt  = pickEntity(ents, 'account_number');

  const invoice_id     = idEnt?.mentionText ?? '';
  const invoice_date   = dateEnt?.normalizedValue?.text ?? dateEnt?.mentionText ?? '';
  const amount         = parseFloat(amtEnt?.normalizedValue?.text ?? amtEnt?.mentionText ?? '0');
  const payee_name     = recvEnt?.mentionText ?? '';
  const sort_code      = sortEnt?.mentionText ?? '';
  const account_number = accEnt?.mentionText ?? '';

  // ─── SAVE TO DB ────────────────────────────
  try {
    const record = {
      invoice_id,
      payee_name,
      account_sort_code: sort_code,
      account_number,
      invoice_date,
      amount,
      raw_extracted_json: aiResult.document,
    };
    const { data, error } = await supabase.from('invoice_data').insert(record);
    if (error) {
      console.error('❌ Supabase insert error:', error);
      return NextResponse.json({ error: 'Failed to save.' }, { status: 500 });
    }
    return NextResponse.json({ data, extractedFields: record });
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Unknown DB error');
    console.error('❌ Saving to DB failed:', error);
    return NextResponse.json({ error: 'Database save failed', detail: error.message }, { status: 500 });
  }
}
