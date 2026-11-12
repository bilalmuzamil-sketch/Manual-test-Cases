// q18_org.mjs — 12 Nov 2026: C797943 and C715468 in the QA lead's new empty organization (ORG_LOGIN=1; seeded by q17).
// C797943: A/P Summary, Vendor chip -> the menu read top to bottom (search box? "All vendors" row, the native line, the vendors); the org's vendor count.
// C715468: A/R Summary as of 11/10/2026 (date A, 2,000 customers) -> row count from the report's own reply + screen; Export > Download (PDF) ->
//          messages + file + seconds; as of 11/11/2026 (date B, 2,001) -> count; Download (PDF) -> messages, and NO file within 30 s.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./q18/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/reports/ap-aging-summary'); const p = s.page; const F = mkFilt(p); const o = {};
const ONLY = process.env.ONLY?.split(',');
const notesNow = async () => (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((x) => x.replace(/\s+/g, ' ').trim());
const lastTotal = (re) => { const r = [...s.net].reverse().find((x) => re.test(x.u) && x.body?.data?.pagination); return r?.body?.data?.pagination?.total ?? r?.body?.data?.pagination?.rowsNumber ?? null; };
async function pdf(tag, waitS) { const q = { notes: [] }; const t0r = {}; const onReq = (r) => { if (/export/.test(r.url())) t0r[r.url()] = Date.now(); }; const onRes = (r) => { if (/export/.test(r.url())) (q.calls ||= []).push({ st: r.status(), ms: Date.now() - (t0r[r.url()] || Date.now()) }); };
  p.on('request', onReq); p.on('response', onRes); let file = null; p.waitForEvent('download', { timeout: waitS * 1000 }).then((d) => { file = d.suggestedFilename(); d.saveAs(OUT + tag + '-' + d.suggestedFilename()).catch(() => {}); }).catch(() => {});
  await p.locator('main button[aria-label="Export report"]').first().click(); await p.waitForTimeout(900); await p.locator('.q-menu:visible').getByText('Download (PDF)', { exact: true }).click(); const t0 = Date.now(); let shotMsg = false;
  while (Date.now() - t0 < waitS * 1000 && !file) { const ns = await notesNow(); const sec = Math.round((Date.now() - t0) / 1000); for (const n of ns) if (!q.notes.some((x) => x.text === n)) { q.notes.push({ text: n, atS: sec }); if (!shotMsg) { q.pic = await s.shot(tag + '-message'); shotMsg = true; } } await p.waitForTimeout(700); }
  await p.waitForTimeout(1500); q.file = file; q.secs = Math.round((Date.now() - t0) / 1000); if (file) q.picFile = await s.shot(tag + '-after-download'); for (const n of await notesNow()) if (!q.notes.some((x) => x.text === n)) q.notes.push({ text: n, atS: q.secs }); p.off('request', onReq); p.off('response', onRes); return q; }
if (!ONLY || ONLY.includes('C797943')) { const q = (o.C797943 = {});
  try { await s.go(REPORTS.aps); await p.waitForTimeout(3000); q.rows = await p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((tr) => tr.innerText.replace(/\s+/g, ' ').trim()));
    q.vendorCount = await p.evaluate(async () => { const x = await fetch('https://sv11315api.qa.shopview.com/api/parts-catalogue/vendors?search=', { credentials: 'include', headers: { Accept: 'application/json' } }); const j = await x.json(); return (Array.isArray(j?.data) ? j.data : j?.data?.collection ?? []).map((v) => v.name || v.vendor_name); });
    await p.locator('main button', { hasText: /Vendor:/ }).first().click(); await p.waitForTimeout(1500); const m = p.locator('.q-menu').last();
    q.menu = await m.evaluate((e) => ({ inputs: [...e.querySelectorAll('input:not([type=checkbox])')].map((i) => i.getAttribute('placeholder')), lines: e.innerText.split('\n').map((t) => t.trim()).filter(Boolean), box: (() => { const r = e.getBoundingClientRect(); return [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)]; })() }));
    q.pic = await s.shot('C797943-menu'); await p.keyboard.press('Escape'); } catch (e) { q.err = String(e).slice(0, 300); await s.shot('C797943-error'); } }
if (!ONLY || ONLY.includes('C715468')) { const q = (o.C715468 = {});
  try { await s.go(REPORTS.ars); await p.waitForTimeout(3000); await F.asOf('10'); await p.waitForTimeout(3000); q.chipA = (await F.chips()).find((c) => /As of/.test(c)); q.totalA = lastTotal(/ar-aging-summary\?/); q.screenA = (await p.locator('main').innerText()).replace(/\s+/g, ' ').match(/[^.]{0,40}\b2,?000\b[^.]{0,40}/g)?.slice(0, 3); q.picA = await s.shot('C715468-1-dateA');
    q.pdfA = await pdf('C715468-2-pdfA', 150);
    await F.asOf('11'); await p.waitForTimeout(3000); q.chipB = (await F.chips()).find((c) => /As of/.test(c)); q.totalB = lastTotal(/ar-aging-summary\?/); q.picB = await s.shot('C715468-3-dateB');
    q.pdfB = await pdf('C715468-4-pdfB', 30);
  } catch (e) { q.err = String(e).slice(0, 300); await s.shot('C715468-error'); } }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(JSON.stringify({ C797943: o.C797943 && { menu: o.C797943.menu?.lines?.slice(0, 6), inputs: o.C797943.menu?.inputs, vendors: o.C797943.vendorCount, err: o.C797943.err }, C715468: o.C715468 && { chipA: o.C715468.chipA, totalA: o.C715468.totalA, pdfA: o.C715468.pdfA, chipB: o.C715468.chipB, totalB: o.C715468.totalB, pdfB: o.C715468.pdfB, err: o.C715468.err } }).slice(0, 2500)); await s.close(); process.exit(0);
