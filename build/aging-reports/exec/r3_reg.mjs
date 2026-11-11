// r3_reg.mjs — 11 Nov 2026: V1-regression tests that need the p52 data (ZZR customers / ZZRV vendors, SFX " R1"): as-of history (C1078984-87,
// C1078993), bucketing by date (C1078995-98), credits and nets (C1079003, C1079014, C1079015, C1079025, C1079031), Collection content
// (C1079018, C1079019, C1079021, C1079024), Past Due for a bill not yet due (C1079030), overpaid bill (C1079000). Dates are set through the
// date chip's calendar (back N months, then the day). Output exec/r3/<id>.json + pictures. ONLY=<ids>.
import { start } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./r3/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p);
const D = JSON.parse(fs.readFileSync(new URL('./p52/out.json', import.meta.url))).sets; const nm = (k) => { if (!D[k]) throw new Error('no ' + k + ' seeded' + (D[k + '-err'] ? ': ' + D[k + '-err'] : '')); return D[k][0].name; };
const ONLY = process.env.ONLY ? process.env.ONLY.split(',') : null;
const rows = () => p.evaluate(() => [...document.querySelectorAll('main tr')].map((tr) => [...tr.children].map((td) => td.innerText.replace(/\s+/g, ' ').trim()).join(' | ')).filter((t) => t.replace(/[ |]/g, '')));
const groups = async () => (await rows()).filter((r) => /^keyboard_arrow_(right|down)/.test(r));
const shot = async (o, n) => { const f = await s.shot(o.id + '-' + n); (o.shots ||= []).push(f); return f; };
const snap = async (o, n, extra = {}) => { const st = { n, chips: await F.chips(), rows: await rows(), ...extra }; st.shot = await shot(o, n); (o.steps ||= []).push(st); fs.writeFileSync(OUT + o.id + '.json', JSON.stringify(o, null, 1)); return st; };
const nav = async (label) => { await s.go('/reports'); await p.waitForTimeout(2000); await p.locator('aside, .q-drawer, nav').getByText(label, { exact: true }).first().click(); await p.waitForTimeout(3500); };
const headBtn = () => p.locator('main thead th').first().locator('button').first();
async function expandAll() { for (let i = 0; i < 4; i++) { const r = await rows(); if (!r.some((x) => /^keyboard_arrow_right/.test(x))) return true; await headBtn().hover(); await p.waitForTimeout(500); const tip = (await p.locator('.q-tooltip').allInnerTexts().catch(() => [])).join(' '); if (/Expand all/i.test(tip)) { await headBtn().click(); await p.waitForTimeout(3000); continue; } await p.locator('main tr').filter({ hasText: 'keyboard_arrow_right' }).first().locator('button').first().click(); await p.waitForTimeout(2000); } return false; }
const toggle = async (label) => { await p.locator('main tbody tr').filter({ hasText: new RegExp('^\\s*(keyboard_arrow_\\w+\\s*)?' + label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')) }).first().locator('button').first().click(); await p.waitForTimeout(2500); };
const TODAY = Date.UTC(2026, 10, 11);
async function setDaysAgo(n) { const d = new Date(TODAY - n * 864e5); const back = (2026 - d.getUTCFullYear()) * 12 + (10 - d.getUTCMonth()); if (back === 0) await F.asOf(String(d.getUTCDate())); else await F.asOfBack(back, d.getUTCDate()); await p.waitForTimeout(1500); return d.toISOString().slice(0, 10); }
const T = {};
// as-of history
T.C1078984 = async (o) => { const c = nm('H1'); await nav('A/R Aging Detail'); await F.pick('Customer', c); o.dD = await setDaysAgo(20); await expandAll(); await snap(o, '5-6-day-D'); o.dPrev = await setDaysAgo(21); await expandAll(); await snap(o, '9-day-before'); };
T.C1078985 = async (o) => { const v = nm('VE'); await nav('A/P Aging Detail'); await F.pick('Vendor', v); o.dD = await setDaysAgo(20); await expandAll(); await snap(o, '5-6-day-D'); };
T.C1078986 = async (o) => { const c = nm('H3'); await nav('A/R Aging Detail'); await F.pick('Customer', c); o.d2 = await setDaysAgo(18); await expandAll(); await snap(o, '5-day-D+2'); o.d5 = await setDaysAgo(15); await expandAll(); await snap(o, '8-day-D+5'); };
T.C1078987 = async (o) => { const c = nm('H4'); await nav('A/R Aging Summary'); await F.pick('Customer', c); o.dBefore = await setDaysAgo(11); await snap(o, '4-day-before-P'); o.dP = await setDaysAgo(10); await snap(o, '6-day-P'); };
T.C1078993 = async (o) => { const v = nm('VF'); await nav('A/P Aging Detail'); await F.pick('Vendor', v); o.d1 = await setDaysAgo(19); await expandAll(); await snap(o, '5-day-D+1'); o.d4 = await setDaysAgo(16); await expandAll(); await snap(o, '8-day-D+4'); };
// bucketing by the as-of date (D = due day 100 days ago)
T.C1078995 = async (o) => { const c = nm('G1'); await nav('A/R Aging Summary'); await F.pick('Customer', c); o.dates = [];
  for (const [k, ago] of [['4-D', 100], ['6-D+30', 70], ['8-D+31', 69], ['10-D+60', 40], ['12-D+61', 39], ['14-D+90', 10], ['16-D+91', 9]]) { o.dates.push(await setDaysAgo(ago)); await snap(o, k); } };
T.C1078996 = async (o) => { const c = nm('G2'); await nav('A/R Aging Summary'); await F.pick('Customer', c); o.d1 = await setDaysAgo(39); await snap(o, '4-C+1'); o.d31 = await setDaysAgo(9); await snap(o, '6-C+31'); };
T.C1078997 = async (o) => { const v = nm('VA'); await nav('A/P Aging Summary'); await F.pick('Vendor', v); o.d1 = await setDaysAgo(69); await snap(o, '4-C+1'); o.d61 = await setDaysAgo(9); await snap(o, '6-C+61'); };
T.C1078998 = async (o) => { const c = nm('G3'); await nav('A/R Aging Detail'); await F.pick('Customer', c); await expandAll(); await snap(o, '4-invoice'); };
// credits, nets, single lines
T.C1079003 = async (o) => { const c = nm('G4'); await nav('A/R Aging Summary'); await F.pick('Customer', c); await snap(o, '4-6-row'); };
T.C1079014 = async (o) => { const c = nm('G5'); await nav('A/R Aging Detail'); await F.pick('Customer', c); await expandAll(); await snap(o, '5-6-line'); };
T.C1079015 = async (o) => { const c = nm('G6'); await nav('A/R Aging Detail'); await F.pick('Customer', c); await expandAll(); const cell = p.locator('main tbody tr').filter({ hasText: 'Credit Memo' }).first().locator('td').nth(3); o.idTag = await cell.evaluate((e) => e.querySelector('a') ? 'link' : 'text').catch(() => null); await snap(o, '5-7-line'); const u0 = p.url(); await cell.click().catch(() => {}); await p.waitForTimeout(2500); o.urlAfter = p.url(); o.stayed = o.urlAfter === u0; o.dialog = (await p.locator('.q-dialog').allInnerTexts().catch(() => [])).join(' ').slice(0, 200); await snap(o, '8-clicked'); };
T.C1079025 = async (o) => { const v = nm('VB'); await nav('A/P Aging Summary'); o.heads = (await p.locator('main thead th').allInnerTexts()).map((t) => t.replace(/arrow_drop_\w+/g, '').trim()); await F.pick('Vendor', v); await snap(o, '5-row'); };
T.C1079030 = async (o) => { const v = nm('VC'); await nav('A/P Aging Detail'); await F.pick('Vendor', v); await toggle('Current'); await snap(o, '5-past-due'); };
T.C1079031 = async (o) => { const v = nm('VD'); await nav('A/P Aging Detail'); await F.pick('Vendor', v); await toggle('1-30 days past due'); await snap(o, '5-7-credit'); };
T.C1079000 = async (o) => { const v = nm('VG'); await nav('A/P Aging Detail'); await F.pick('Vendor', v); await expandAll(); await snap(o, '4-5-bill'); };
// A/R Collection content
T.C1079018 = async (o) => { const c = nm('G8'); await nav('A/R Aging Collection'); await F.pick('Customer', c); await toggle(c); await snap(o, '4-lines'); };
T.C1079019 = async (o) => { const c = nm('G9'); await nav('A/R Aging Collection'); await F.pick('Customer', c); o.group = (await groups())[0]; await toggle(c); await snap(o, '3-4-group'); };
T.C1079021 = async (o) => { const c = nm('G10'); await nav('A/R Aging Collection'); await F.pick('Customer', c); await toggle(c); await snap(o, '4-5-lines'); };
T.C1079024 = async (o) => { const c = nm('G11'); await nav('A/R Aging Collection'); const before = (await groups()).length; o.before = before; await F.pick('Customer', c); o.msg = (await p.locator('main').innerText()).replace(/\s+/g, ' ').slice(-260); o.date1 = (await F.chips()).find((x) => /As of/.test(x)); await snap(o, '4-message');
  await p.getByRole('button', { name: /Clear all filters/i }).first().click().catch((e) => { o.clearErr = String(e).slice(0, 120); }); await p.waitForTimeout(3500); o.after = (await groups()).length; o.date2 = (await F.chips()).find((x) => /As of/.test(x)); await snap(o, '6-cleared'); };
for (const [id, fn] of Object.entries(T)) { if (ONLY && !ONLY.includes(id)) continue; const o = { id };
  try { await fn(o); } catch (e) { o.err = String(e).slice(0, 300); try { await shot(o, 'error'); } catch {} }
  fs.writeFileSync(OUT + id + '.json', JSON.stringify(o, null, 1)); console.log(id, o.err || 'ok'); }
await s.close(); process.exit(0);
