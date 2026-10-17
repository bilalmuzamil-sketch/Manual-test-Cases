/** probe-zzbreak.mts — 17 Oct 2026, LIVE read-only probe: the "ZZBREAK …" customer that sorts FIRST under Customer A–Z (C368209,
 *  C368245 Blocked). Reads from the server every customer whose name holds "ZZBREAK": the raw name, its first characters with their
 *  code points, its length, created time / creator fields if the answer carries them, and how many work orders it has; and the first
 *  rows of the Customers list sorted by name (server) with the same code points. Nothing is changed. Output EV/probe-zzbreak.json. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts';
import { api, workOrders } from './data.mts';
import { EV, t } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p);
const o: any = { exitSwitch: (await a.post('/api/exit-switch-user', {})).status };
const rows = (r: any) => r?.body?.data?.collection ?? r?.body?.data ?? [];
const codes = (s: string) => [...String(s ?? '').slice(0, 8)].map((c) => `${JSON.stringify(c)}=U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, '0')}`);
try {
  const found = rows(await a.get(`/api/customers?pagination[rowsPerPage]=200&search=${encodeURIComponent('ZZBREAK')}`)) as any[];
  o.zzbreak = [];
  for (const c of found) { const ws = await workOrders(a, 'ZZBREAK').catch(() => []);
    o.zzbreak.push({ id: c.id, raw: JSON.stringify(c.name), length: String(c.name ?? '').length, first: codes(c.name), fields: Object.fromEntries(Object.entries(c).filter(([k]) => /creat|updat|by|user|name|sort|display/i.test(k)).map(([k, v]) => [k, typeof v === 'string' ? v.slice(0, 80) : v])), workOrdersMatchingSearch: ws.length }); }
  // the Customers list ordered by name, first rows, as the server gives them
  for (const sort of ['name', 'company_name']) { const r = await a.get(`/api/customers?pagination[rowsPerPage]=8&pagination[page]=1&pagination[sortBy]=${sort}&pagination[descending]=false`); o[`firstBy_${sort}`] = { status: r.status, rows: (rows(r) as any[]).slice(0, 8).map((c) => ({ raw: JSON.stringify(c.name), first: codes(c.name).slice(0, 3) })) }; }
  console.log(t(), 'ZZBREAK probe', JSON.stringify(o).slice(0, 4000));
} catch (e: any) { o.error = String(e?.message || e).slice(0, 300); }
fs.writeFileSync(path.join(EV, 'probe-zzbreak.json'), JSON.stringify(o, null, 1)); await done(browser);
