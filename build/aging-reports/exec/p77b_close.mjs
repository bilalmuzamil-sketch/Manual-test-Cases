// p77b (from p77_close.mjs) 11 Nov ~18:50: p77 timed out on getByText("Close") inside the message (the button text did not match exactly); click the message's own button instead.
// p77_close.mjs — 11 Nov 2026 ~16:55: C715537 step 2 ("Click Close on the message" -> it closes). d3a caught the message but did not click Close
// before it faded. Here: A/P Unpaid Invoices (13,918 lines), Download (PDF); the moment the message shows, count messages, click its "Close",
// read the count 300 ms and 1 s later; also check the report's Totals before and after (it must not change). Output p77/out.json + pictures.
import { start, REPORTS } from './lib.mjs'; import fs from 'fs';
const OUT = new URL('./p77b/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT); const p = s.page; const o = {};
const tot = async () => (await p.evaluate(() => { const t = [...document.querySelectorAll('main tr')].filter((r) => /^\s*Totals(\s|$)/.test(r.innerText)).pop(); return t ? t.innerText : ''; })).replace(/\s+/g, ' ');
try { await s.go(REPORTS.apu); await p.waitForTimeout(5000); o.t0 = await tot(); let dl = null; p.on('download', (d) => { dl = d.suggestedFilename(); });
  await p.locator('main button[aria-label="Export report"]').first().click(); await p.waitForTimeout(800); await p.locator('.q-menu:visible').getByText('Download (PDF)', { exact: true }).click();
  const n = p.locator('.q-notification'); for (let i = 0; i < 60 && !(await n.count()); i++) await p.waitForTimeout(100); o.count = await n.count(); o.text = (await n.first().innerText().catch(() => '')).replace(/\s+/g, ' '); await s.shot('1-message');
  o.btns = await n.first().locator('button').allInnerTexts(); await n.first().locator('button').last().click(); await p.waitForTimeout(300); o.after300 = await p.locator('.q-notification').count(); await p.waitForTimeout(700); o.after1s = await p.locator('.q-notification').count(); await s.shot('2-closed'); o.t1 = await tot(); o.download = dl;
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p77', JSON.stringify(o).slice(0, 600)); await s.close(); process.exit(0);
