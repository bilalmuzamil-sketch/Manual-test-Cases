// p55b_sbc_pdf.mjs — 11 Nov 2026 (p55 re-done: these two reports name their menu items "Download Expanded View (PDF)" / "Download Summary (PDF)", not "Download (PDF)"): control for C1062581. PRD S3-R7a says the aging PDF "uses the app-wide report PDF format, the same as
// Sales By Customer and Inventory Value: ... dates print as "Nov 04 2026"". The aging A/R Detail PDF printed "Nov 4, 2026". This reads how
// the two named reports' own PDFs print dates on this build, so we know whether the PRD's example and its "same as" agree (if they do not,
// the source is ambiguous - Rule 58 - and the test is held, not failed). Read only. Output p55/out.json + PDFs + pictures.
import { start } from './lib.mjs'; import { mkExp } from './explib.mjs'; import fs from 'fs'; import { execFileSync } from 'child_process';
const OUT = new URL('./p55b/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const E = mkExp(p, OUT); const o = {};
const nav = async (label) => { await s.go('/reports'); await p.waitForTimeout(2000); await p.locator('a, .q-item').filter({ hasText: new RegExp('^\\s*\\S*\\s*' + label + '\\s*$') }).first().click(); await p.waitForTimeout(5000); };
for (const [k, label] of [['sbc', 'Sales By Customer'], ['iv', 'Inventory Value']]) { const r = (o[k] = { label });
  try { await nav(label); r.url = p.url(); r.chips = (await p.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 400); await p.screenshot({ path: OUT + k + '-screen.png' });
    r.exportBtn = await p.locator('main button[aria-label="Export report"]').count();
    if (!r.exportBtn) { r.buttons = await p.locator('main button').evaluateAll((b) => b.map((x) => (x.getAttribute('aria-label') || '') + '|' + x.innerText.trim()).slice(0, 30)); }
    else { await p.locator('main button[aria-label="Export report"]').first().click(); await p.waitForTimeout(900); r.menu = await p.locator('.q-menu:visible .q-item').allInnerTexts().catch(() => []);
      const item = r.menu.find((t) => /Expanded View \(PDF\)/.test(t)) || r.menu.find((t) => /\(PDF\)/.test(t)); r.item = item; const dl = p.waitForEvent('download', { timeout: 120000 }).catch(() => null);
      await p.locator('.q-menu:visible .q-item').filter({ hasText: item }).first().click(); const d = await dl; await p.waitForTimeout(1500); await p.screenshot({ path: OUT + k + '-after.png' });
      const x = d ? { file: OUT + k + '-' + d.suggestedFilename() } : null; if (d) await d.saveAs(x.file); r.file = x && x.file;
      if (r.file) { const t = execFileSync('pdftotext', ['-layout', r.file, '-']).toString().split('\n').filter((l) => l.trim()); r.top = t.slice(0, 12); r.dateLines = t.filter((l) => /\b[A-Z][a-z]{2} \d{1,2},? \d{4}\b/.test(l)).slice(0, 15); } }
  } catch (e) { r.err = String(e).slice(0, 300); try { await p.screenshot({ path: OUT + k + '-error.png' }); } catch {} }
  fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log(k, r.err || 'ok', JSON.stringify(r.dateLines || r.buttons || '').slice(0, 300)); }
await s.close(); process.exit(0);
