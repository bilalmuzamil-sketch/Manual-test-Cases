// q11_477.mjs — 12 Nov 2026: C715477 re-run with the report's own link form (QA lead 12 Nov, "2. I will follow your recommendation"; the case's
// preconditions were rewritten the same day, case-edits-1112). At Staging Heavy Duty - 9919 (current location, read back on screen): open A/R Aging Detail,
// customer ZZAUTOTEST LOC MIX, expand every bucket, read the invoice-number link of S11315-17724 (Staging Lethbridge - 4310 = location B) - the
// "Copy link address" value; click Work Orders in the top menu; paste the link; Enter -> picture + the dialog's own text; Cancel -> where it lands +
// message. Positive control: the link carries ?locationId=<Lethbridge code>, and the header names Heavy Duty before the paste. Output q11/out.json.
import { start, REPORTS, A as APP } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs';
const OUT = new URL('./q11/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p); const o = { id: 'C715477' };
const save = () => fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1));
const hdr = async () => (await p.locator('header').innerText()).replace(/\s+/g, ' ').slice(-60);
const dialog = async () => (await p.locator('.q-dialog').allInnerTexts().catch(() => [])).join(' | ').replace(/\s+/g, ' ');
const expandAll = async () => { const b = p.locator('main thead th').first().locator('button').first(); if (!(await b.count())) return; await b.hover(); await p.waitForTimeout(600); if (/Expand all/.test((await p.locator('.q-tooltip').allInnerTexts().catch(() => [])).join())) { await b.click(); await p.waitForTimeout(2500); } };
try {
  await ensureLoc(p, 'Staging Heavy Duty - 9919'); o.hdr0 = await hdr();
  await s.go(REPORTS.ard); await p.waitForTimeout(3000); await F.pick('Customer', 'ZZAUTOTEST LOC MIX'); await expandAll();
  const row = p.locator('main tbody tr').filter({ hasText: 'S11315-17724' }).first(); await row.scrollIntoViewIfNeeded(); o.row = (await row.innerText()).replace(/\s+/g, ' ');
  const link = row.locator('a').first(); o.href = await link.getAttribute('href'); await link.hover(); await p.waitForTimeout(500);
  o.rowBox = await row.evaluate((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; });
  o.linkBox = await link.evaluate((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; });
  o.pic0 = await s.shot('C715477-0-report-link'); save();
  o.full = new URL(o.href, APP).toString(); o.hasLoc = /[?&]locationId=f8a8b802-7780-4b16-bf10-343caeb616b2/.test(o.full);
  await p.locator('header').getByText(/^Work Orders$/).first().click(); await p.waitForTimeout(4000); o.url0 = p.url(); o.hdr1 = await hdr(); o.pic1 = await s.shot('C715477-1-work-orders');
  await p.goto(o.full, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.url2 = p.url(); o.dialog2 = await dialog();
  o.dlgBox = await p.locator('.q-dialog .q-card').last().evaluate((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }).catch(() => null);
  o.buttons2 = await p.locator('.q-dialog button').allInnerTexts().catch(() => []); o.pic2 = await s.shot('C715477-2-prompt'); save();
  const c = p.locator('.q-dialog').getByRole('button', { name: /^Cancel$/ }); o.cancel = await c.count(); if (o.cancel) { await c.first().click(); await p.waitForTimeout(2500); }
  o.url3 = p.url(); o.notes3 = await p.locator('.q-notification').allInnerTexts().catch(() => []); o.hdr3 = await hdr(); o.dialog3 = await dialog();
  o.noteBox = await p.locator('.q-notification').first().evaluate((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; }).catch(() => null);
  o.pic3 = await s.shot('C715477-3-after-cancel');
} catch (e) { o.err = String(e).slice(0, 400); await s.shot('C715477-error'); }
save(); console.log(JSON.stringify({ hasLoc: o.hasLoc, href: o.href, hdr0: o.hdr0, dialog2: o.dialog2, url3: o.url3, notes3: o.notes3, err: o.err })); await s.close(); process.exit(0);
