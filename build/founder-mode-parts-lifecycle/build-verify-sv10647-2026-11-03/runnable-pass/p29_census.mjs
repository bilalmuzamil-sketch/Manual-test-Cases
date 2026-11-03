// Probe 29 (read-only): does this QA site hold the "from before this release" records eight tests need? Reads lists the app's own screens use.
import { start } from '../probe/lib.mjs';
import fs from 'fs';
const OUT = process.env.OUT; const { r, page } = await start(OUT);
const get = async u => page.evaluate(async u => { const x = await fetch('https://sv10647api.qa.shopview.com/api/' + u, { credentials: 'include', headers: { accept: 'application/json' } }); return { s: x.status, j: await x.json().catch(() => null) }; }, u);
const out = {};
const cat = await get('parts-catalogue/catalogue-parts'); const C = cat.j?.data?.collection || []; out.catalogue = { status: cat.s, n: C.length, meta: cat.j?.data?.meta || cat.j?.meta || null };
const by = {}; for (const e of C) (by[e.part_number] ||= []).push(e);
out.exactDupes = Object.entries(by).filter(([k, v]) => v.length > 1 && new Set(v.map(x => x.name.trim())).size > 1).slice(0, 10).map(([k, v]) => ({ number: k, names: v.map(x => x.name), created: v.map(x => x.created_at) }));
const st = {}; for (const e of C) (st[e.part_number_stripped] ||= []).push(e);
out.strippedPairs = Object.values(st).filter(v => v.length > 1 && new Set(v.map(x => x.part_number)).size > 1).slice(0, 10).map(v => v.map(x => x.part_number + ' | ' + x.name + ' | deletable=' + x.deletable));
out.manufacturerMissing = C.filter(e => e.manufacturer_id && !e.manufacturer_name).slice(0, 10).map(e => e.part_number + ' | ' + e.name + ' | deletable=' + e.deletable);
out.noCategory = C.filter(e => !e.category).slice(0, 10).map(e => e.part_number + ' | ' + e.name + ' | deletable=' + e.deletable);
out.noCategoryCount = C.filter(e => !e.category).length; out.deletableCount = C.filter(e => e.deletable).length;
out.deletableSample = C.filter(e => e.deletable && !e.part_number.startsWith('ZZAUTOTEST')).slice(0, 5).map(e => e.part_number + ' | ' + e.name + ' | ' + e.created_at);
out.createdRange = [C.map(e => e.created_at).sort()[0], C.map(e => e.created_at).sort().slice(-1)[0]];
const org = C[0]?.organization_id; const roles = await get(`organizations/${org}/roles`); const R = roles.j?.data?.collection || roles.j?.data || [];
out.roles = { status: roles.s, n: Array.isArray(R) ? R.length : 0, custom: (Array.isArray(R) ? R : []).filter(x => (x.type || x.role_type || '').toString().toLowerCase().includes('custom') || x.is_system === false || x.system === false).map(x => ({ name: x.name, created: x.created_at })).slice(0, 30), catalogNamed: (Array.isArray(R) ? R : []).filter(x => /catalog/i.test(x.name)).map(x => x.name) };
const inv = await get('inventory/parts?search=Catalog'); const I = inv.j?.data?.collection || []; out.partsCatalog = { status: inv.s, n: I.length, sample: I.slice(0, 5).map(p => (p.part_number || p.catalogue_part?.part_number) + ' | ' + (p.name || p.description || p.catalogue_part?.name)) };
for (const d of ['2026-10-20', '2026-10-26', '2026-10-27', '2026-10-28', '2026-11-02']) { const v = await get(`reporting/reports/inventory-value?asOfDate=${d}`); const rows = v.j?.data?.collection || v.j?.data?.rows || v.j?.data || []; out['ivr_' + d] = { status: v.s, n: Array.isArray(rows) ? rows.length : JSON.stringify(v.j).slice(0, 200), negative: Array.isArray(rows) ? rows.filter(x => x.qty < 0).slice(0, 3).map(x => x.part_number + ' ' + x.qty) : null }; }
fs.writeFileSync(`${OUT}/census.json`, JSON.stringify(out, null, 1)); console.log(JSON.stringify(out).slice(0, 4000));
await r.browser.close();
