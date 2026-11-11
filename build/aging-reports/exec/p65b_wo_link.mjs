// p65b_wo_link.mjs — 11 Nov 2026: C715477 instrument proof (Rule 104). p65 pasted /workorders/ed4c09be… (taken from a report link) while at Heavy
// Duty and got "WorkOrder not found" + "Request failed with status code 400", no prompt. Is the link itself good? (1) On screen, switch to
// Staging Lethbridge - 4310, Work Orders, open the first work order in the list, copy the address bar; open ed4c09be… there too. (2) Switch back
// to Staging Heavy Duty - 9919 on screen, Work Orders, paste the copied Lethbridge link, Enter: picture; Cancel if a prompt shows; read where
// you land. (3) Same with the ed4c09be… link. Restores Heavy Duty. Output p65b/out.json + pictures.
import { start } from './lib.mjs'; import { ensureLoc } from './locsw.mjs'; import fs from 'fs';
const OUT = new URL('./p65b/', import.meta.url).pathname; fs.mkdirSync(OUT, { recursive: true }); const s = await start(OUT, '/workorders'); const p = s.page; const o = {};
const OLD = 'https://sv11315.qa.shopview.com/workorders/ed4c09be-b44c-4b71-99b6-2d4c3cee975c';
const notes = async () => (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ').trim());
const top = async () => (await p.locator('header, .q-header').innerText()).replace(/\s+/g, ' ').slice(-40);
const woMenu = async () => { await p.locator('header, .q-header').getByText('Work Orders', { exact: true }).first().click(); await p.waitForTimeout(3500); };
async function paste(tag, link) { const r = {}; await woMenu(); r.url0 = p.url(); await p.goto(link, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); r.url1 = p.url();
  r.dialog = (await p.locator('.q-dialog').allInnerTexts().catch(() => [])).join(' | ').replace(/\s+/g, ' '); r.notes1 = await notes(); await s.shot(tag + '-2-pasted');
  const c = p.locator('.q-dialog').getByRole('button', { name: /^Cancel$/ }); r.cancel = await c.count(); if (r.cancel) { await c.first().click(); await p.waitForTimeout(3000); }
  r.url3 = p.url(); r.notes3 = await notes(); r.top3 = await top(); await s.shot(tag + '-3-after'); return r; }
try { await p.waitForTimeout(2500); await ensureLoc(p, 'Staging Lethbridge - 4310'); o.atB = await top(); await woMenu(); await s.shot('1-lethbridge-list');
  /* 11 Nov 15:00: the Work Orders list is not a main tbody table; click the first work order NUMBER (S3-13537 form) */ const first = p.getByText(/^S\d+-\d+$/).first(); o.firstRow = (await first.innerText()).trim(); await first.click(); await p.waitForTimeout(4500); o.copied = p.url(); o.openedAtB = (await p.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 160); o.notesAtB = await notes(); await s.shot('1b-lethbridge-wo-open');
  await p.goto(OLD, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4500); o.oldAtB = { url: p.url(), main: (await p.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 160), notes: await notes() }; await s.shot('1c-old-link-at-lethbridge');
  await ensureLoc(p, 'Staging Heavy Duty - 9919'); o.atA = await top();
  if (/\/workorders\/[0-9a-f-]{36}/.test(o.copied)) o.newLink = await paste('A-copied', o.copied); o.oldLink = await paste('B-old', OLD);
} catch (e) { o.err = String(e).slice(0, 300); try { await s.shot('error'); } catch {} }
try { await ensureLoc(p, 'Staging Heavy Duty - 9919'); } catch {}
fs.writeFileSync(OUT + 'out.json', JSON.stringify(o, null, 1)); console.log('p65b', JSON.stringify({ copied: o.copied, openedAtB: o.openedAtB?.slice(0, 60), oldAtB: o.oldAtB?.notes, newLink: o.newLink && { d: o.newLink.dialog, n: o.newLink.notes1, u3: o.newLink.url3 }, err: o.err })); await s.close(); process.exit(0);
