// p65_wo_link.mjs — 11 Nov 2026: C715477 re-run. s78b built the work-order link wrongly ("Invalid UUID"), so no prompt could show. Work order 1 =
// the Lethbridge work order of invoice S11315-17724 (/workorders/ed4c09be-b44c-4b71-99b6-2d4c3cee975c, seen in C715416). Signed in at Heavy
// Duty (on screen, read back): Work Orders from the top menu, then the link entered in the address bar; picture of the prompt; Cancel; read
// where you land and the messages. Output p65/out.json.
import { start } from './lib.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs';
const OUT = new URL('./p65/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/workorders'); const p = s.page; const o = { id: 'C715477' };
const LINK = 'https://sv11315.qa.shopview.com/workorders/ed4c09be-b44c-4b71-99b6-2d4c3cee975c';
try { await p.waitForTimeout(3000); await ensureLoc(p, 'Staging Heavy Duty - 9919'); await p.locator('header, .q-header').getByText('Work Orders', { exact: true }).first().click(); await p.waitForTimeout(3000); o.url0 = p.url(); await s.shot('C715477-0-workorders');
  await p.goto(LINK, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.url1 = p.url(); o.dialog = (await p.locator('.q-dialog').allInnerTexts().catch(() => [])).join(' | ').replace(/\s+/g, ' '); o.notes1 = await p.locator('.q-notification').allInnerTexts().catch(() => []); await s.shot('C715477-2-prompt');
  const c = p.locator('.q-dialog').getByRole('button', { name: /^Cancel$/ }); o.cancel = await c.count(); if (o.cancel) { await c.first().click(); await p.waitForTimeout(3000); }
  o.url3 = p.url(); o.notes3 = (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ')); o.main3 = (await p.locator('main').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); o.top3 = (await p.locator('header, .q-header').innerText()).replace(/\s+/g, ' ').slice(-40); await s.shot('C715477-3-after-cancel');
} catch (e) { o.err = String(e).slice(0, 300); }
fs.writeFileSync(OUT + 'C715477.json', JSON.stringify(o, null, 1)); console.log('p65', JSON.stringify({ dialog: o.dialog, url3: o.url3, notes3: o.notes3, err: o.err })); await s.close(); process.exit(0);
