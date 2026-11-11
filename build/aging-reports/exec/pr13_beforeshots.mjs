// pr13_beforeshots.mjs — 11 Nov 2026 19:50 UTC: "before the release" record for C715471 / C715472 (release-day: untouched A/R and A/P reports show
// the same rows and amounts). On PRODUCTION (still before the release), open each of the six aging reports from the Reports list WITHOUT touching
// a filter, at today's as-of date: a picture, the chips, the column headings, every row's text the page shows (Summary reports: scrolled to load
// all), the Totals row, and the CSV/PDF if the ⋯ menu offers them. Output exec/prod/before-release/<report>.json + pictures + files. Read-only.
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs'; import fs from 'fs';
const OUT = new URL('./prod/before-release/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true });
const B = await bootProdLogin('/reports', { viewport: { width: 1440, height: 900 } }); const p = B.page; const all = { version: B.version, at: new Date().toISOString() };
for (const [k, label] of [['ars', 'A/R Aging Summary'], ['ard', 'A/R Aging Detail'], ['arc', 'A/R Aging Collection'], ['aps', 'A/P Aging Summary'], ['apd', 'A/P Aging Detail'], ['apu', 'A/P Unpaid Invoices']]) { const o = (all[k] = { label });
  try { await p.goto(B.APP + '/reports', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000); await p.getByText(label, { exact: true }).first().click(); await p.waitForTimeout(7000); o.url = p.url();
    o.chips = await p.evaluate(() => [...document.querySelectorAll('main button')].map((b) => b.innerText.replace(/\s+/g, ' ').trim()).filter((t) => /:/.test(t) && t.length < 90));
    o.heads = await p.evaluate(() => [...document.querySelectorAll('main thead th')].map((t) => t.innerText.replace(/\s+/g, ' ').trim()));
    await p.screenshot({ path: OUT + k + '-1-open.png' }); const seen = new Set(); const rows = [];
    for (let i = 0; i < 120; i++) { const r = await p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((tr) => tr.innerText.replace(/\s+/g, ' ').trim()).filter(Boolean)); let add = 0; for (const x of r) if (!seen.has(x)) { seen.add(x); rows.push(x); add++; }
      const moved = await p.evaluate(() => { const sc = [...document.querySelectorAll('main *')].filter((e) => e.scrollHeight > e.clientHeight + 50 && /auto|scroll/.test(getComputedStyle(e).overflowY)).sort((a, b) => b.scrollHeight - a.scrollHeight)[0]; if (!sc) return false; const b = sc.scrollTop; sc.scrollTop += 800; return sc.scrollTop !== b; }); await p.waitForTimeout(700); if (!moved && !add) break; }
    o.rows = rows; o.nRows = rows.length; o.totals = rows.filter((x) => /^Totals(\s|$)/.test(x)).pop() || null; await p.screenshot({ path: OUT + k + '-2-bottom.png' });
  } catch (e) { o.err = String(e).slice(0, 300); }
  fs.writeFileSync(OUT + 'before-release.json', JSON.stringify(all, null, 1)); console.log('pr13', k, o.err || 'ok', o.nRows, JSON.stringify(o.chips), (o.totals || '').slice(0, 160)); }
await B.browser.close(); process.exit(0);
