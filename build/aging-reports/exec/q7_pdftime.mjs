// q7_pdftime.mjs — 11 Nov 2026 19:40 UTC: is the ~31 s cut-off on Inventory Value PDFs (q6/q6b/q6c: every PDF slower than 30 s answers 500
// "An error occurred…") a limit of the QA SITE (any export over ~30 s dies) or of Inventory Value? Time other big PDF exports on the same site:
// the six aging reports and Sales By Customer Expanded View / Work In Progress, each with every location ticked; status, ms, error body.
import { start, REPORTS } from './lib.mjs'; import { settle, oneLoc } from './q3_common.mjs'; import fs from 'fs';
const OUT = new URL('./q7/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const o = {};
const T = {}; const ans = []; p.on('request', (r) => { if (/\/export\?|\/pdf|format=pdf/.test(r.url())) T[r.url()] = Date.now(); });
p.on('response', async (r) => { const u = r.url(); if (!T[u]) return; const e = { st: r.status(), ms: Date.now() - T[u], url: u.replace(/^https?:\/\/[^/]+/, '').slice(0, 160) }; if (r.status() >= 400) { try { e.body = (await r.text()).slice(0, 300); } catch {} } ans.push(e); });
for (const [k, path, re] of [['ard', REPORTS.ard, /^Download \(PDF\)$/], ['apd', REPORTS.apd, /^Download \(PDF\)$/], ['apu', REPORTS.apu, /^Download \(PDF\)$/], ['arc', REPORTS.arc, /^Download \(PDF\)$/], ['sbcx', '/reports/sales-by-customer', /Expanded View \(PDF\)/], ['wip', '/reports/work-in-progress', /PDF/]]) { const q = (o[k] = {}); ans.length = 0;
  try { await s.go(path); await p.waitForTimeout(4000); await settle(p); if (k === 'sbcx' || k === 'wip') await oneLoc(p, 'ALL'); const t0 = Date.now();
    await p.locator('main button[aria-label="Export report"]').or(p.locator('main button').filter({ hasText: /more_(horiz|vert)/ })).first().click(); await p.waitForTimeout(800);
    const w = p.waitForEvent('download', { timeout: 150000 }).catch(() => null); await p.locator('.q-menu:visible').last().getByText(re).first().click(); const d = await w; q.secs = Math.round((Date.now() - t0) / 1000); q.file = d ? d.suggestedFilename() : null;
    await p.waitForTimeout(1500); q.notes = (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ').trim()); q.answers = [...ans];
  } catch (e) { q.err = String(e).slice(0, 200); q.answers = [...ans]; }
  fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('q7', k, JSON.stringify({ secs: q.secs, file: q.file, notes: q.notes, answers: (q.answers || []).map((a) => [a.st, a.ms, (a.body || '').slice(0, 80)]), err: q.err })); }
await s.close(); process.exit(0);
