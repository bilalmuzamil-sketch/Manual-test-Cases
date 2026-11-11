// p64_card_check.mjs — 11 Nov 2026: C715445 step 2. s78b read the A/R Collection rows (A = Monroe Truck Service & Repair: "Phone: 733-101-4929
// Credit term: Net 60"; B = ZZAUTOTEST S1R5 Alpha: "Credit term: COD") but its customer lookup matched "Monroe Truck Repair" (a different
// customer). Here: open each customer's own card from the report (the group name link) or by exact-name search on Customers, and read the
// card's phone and credit term on screen; picture of each card. Output p64/out.json.
import { start, REPORTS } from './lib.mjs'; import { mk } from './api.mjs'; import fs from 'fs';
const OUT = new URL('./p64/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const a = mk(p); const o = {};
for (const [k, name] of [['A', 'Monroe Truck Service & Repair'], ['B', 'ZZAUTOTEST S1R5 Alpha']]) { const r = (o[k] = { name });
  try { const res = await a.get('/api/customers?search=' + encodeURIComponent(name) + '&pagination%5BrowsPerPage%5D=50'); const d = res.j?.data; const list = Array.isArray(d) ? d : d?.collection || []; const hit = list.find((c) => (c.name || c.company_name) === name);
    r.matches = list.map((c) => c.name || c.company_name).slice(0, 8); if (!hit) { r.err = 'no exact match'; continue; } r.id = hit.id || hit.company_id; r.apiPhone = hit.telephone || hit.phone; r.apiTerm = hit.credit_term || hit.credit_terms || hit.creditTerm || null;
    await s.go('/customers/' + r.id); await p.waitForTimeout(4000); r.card = (await p.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 1200); await s.shot('card-' + k);
    const edit = p.locator('main').locator('button, i').filter({ hasText: /^edit|edit_note|mode_edit$/ }).first(); if (await edit.count()) { await edit.click().catch(() => {}); await p.waitForTimeout(2000); r.edit = (await p.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 1500); r.editTerm = await p.locator('.q-dialog .q-field').filter({ hasText: /Credit Terms?/ }).first().innerText().catch(() => null); await s.shot('edit-' + k); await p.keyboard.press('Escape'); }
  } catch (e) { r.err = String(e).slice(0, 200); } }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p64', JSON.stringify({ A: [o.A?.apiPhone, o.A?.apiTerm, o.A?.editTerm, o.A?.err], B: [o.B?.apiPhone, o.B?.apiTerm, o.B?.editTerm, o.B?.err] })); await s.close(); process.exit(0);
