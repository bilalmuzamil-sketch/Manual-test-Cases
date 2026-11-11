// d3g_cm.mjs — 11 Nov 2026 ~19:45: C715538 step 1 asks for a customer group with an invoice (blue link) AND a credit memo (plain text) after Expand all;
// d3b2's pictures show only invoice-only groups. Here: A/R Aging Collection, Customer = "Andrews' Truck & Trailer Repair LLC" (credit memos CM11315-4190…
// and invoices), header chevron (Expand all), read each ID cell (link? colour) and picture at 1440, light theme.
import { start, REPORTS } from './lib.mjs'; import { mkFilt } from './filt.mjs'; import fs from 'fs';
const OUT = new URL('./d3g/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const F = mkFilt(p); const o = { id: 'C715538b' };
const settle = async () => { for (let i = 0; i < 30; i++) { if (!(await p.locator('main .q-linear-progress').count())) break; await p.waitForTimeout(500); } await p.waitForTimeout(900); };
try { await s.go(REPORTS.arc); await p.waitForTimeout(3500); await settle(); await F.pick('Customer', "Andrews' Truck & Trailer Repair LLC"); await settle();
  await p.locator('main thead th').first().locator('button').first().click(); await settle();
  o.dark = await p.evaluate(() => document.body.classList.contains('body--dark'));
  o.rows = await p.evaluate(() => [...document.querySelectorAll('main tbody tr')].map((tr) => { const tds = [...tr.querySelectorAll('td')]; const id = tds.find((td) => /^(S|CM|DEP|P)[\w-]*\d$/.test(td.innerText.trim()));
    return { text: tr.innerText.replace(/\s+/g, ' ').slice(0, 150), id: id ? id.innerText.trim() : null, link: id ? !!id.querySelector('a, [role=link]') : null, color: id ? getComputedStyle(id.querySelector('a, span, div') || id).color : null }; }));
  await p.mouse.move(5, 890); await p.screenshot({ path: OUT + 'C715538-cm.png' });
} catch (e) { o.err = String(e).slice(0, 300); await p.screenshot({ path: OUT + 'error.png' }).catch(() => {}); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('C715538b', o.err || 'ok', JSON.stringify(o).slice(0, 600)); await s.close(); process.exit(0);
