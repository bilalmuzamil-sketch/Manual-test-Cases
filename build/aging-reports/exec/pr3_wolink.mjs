// pr3_wolink.mjs — 11 Nov 2026 ~16:10: C715477 "before the release" side on PRODUCTION (v26.45.3). On the QA build (p65b) a work order link from
// Staging Lethbridge - 4310, pasted while at Staging Heavy Duty - 9919, shows NO switch prompt: it lands on /workorders?tab=estimate with "WorkOrder
// not found" and "Request failed with status code 400". The case says the prompt shows "as before the release". Here, on production: read the
// header and its user menu ("Change Location"), switch to a second location on screen, open its first work order, copy the address, switch back,
// paste the address, Enter - picture, dialog text, messages, where it lands; Cancel if a prompt shows. Restores the first location.
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs'; import fs from 'fs';
const OUT = new URL('./prod/', import.meta.url).pathname; const o = {}; let k = 40; const save = () => fs.writeFileSync(OUT + 'pr3.json', JSON.stringify(o, null, 1));
const B = await bootProdLogin('/workorders', { viewport: { width: 1440, height: 900 } }); const p = B.page; o.version = B.version;
const shot = async (n) => { const f = `${OUT}${String(++k).padStart(2, '0')}-${n}.png`; await p.screenshot({ path: f }); return f; };
const notes = async () => (await p.locator('.q-notification').allInnerTexts().catch(() => [])).map((t) => t.replace(/\s+/g, ' ').trim());
async function changeTo(pick) { const hdr = (await p.locator('header').innerText()).split('\n').map((t) => t.trim()).filter(Boolean); o.header ||= hdr;
  const cands = [p.locator('header').getByText(/Change Location/), p.locator('header .q-avatar').last(), p.locator('header button').last()];
  let opened = false; for (const c of cands.slice(1)) { try { await c.click({ timeout: 5000 }); await p.waitForTimeout(1200); if (await p.getByText(/Change Location/).count()) { opened = true; break; } await p.keyboard.press('Escape'); } catch {} }
  if (!opened) { const locEl = p.locator('header').getByText(/ - \d{4}|Location|Heavy|Lethbridge/).first(); await locEl.click().catch(() => {}); await p.waitForTimeout(1200); }
  await p.getByText(/Change Location/).first().click(); await p.waitForTimeout(2500); /* 16:00: production's user menu holds "Change Location: <current>"; the location list opens after it (dialog or sub-menu) - read the newest popup that is NOT the user menu */
  const pops = p.locator('.q-dialog:visible, .q-menu:visible'); const n = await pops.count(); let dlg = pops.nth(n - 1); let lines = (await dlg.innerText()).split('\n').map((t) => t.trim()).filter(Boolean);
  if (lines.includes('Edit Profile') && n > 1) { dlg = pops.nth(n - 2); lines = (await dlg.innerText()).split('\n').map((t) => t.trim()).filter(Boolean); } o.locLists = [...(o.locLists || []), lines]; await shot('C715477-prod-loc-list');
  if (lines.includes('Edit Profile')) throw new Error('location list did not open: ' + lines.slice(0, 8).join(' | '));
  const target = typeof pick === 'function' ? pick(lines) : pick; await dlg.getByText(target, { exact: true }).first().click(); await p.waitForTimeout(1500); const ok = p.locator('.q-dialog').last().getByRole('button', { name: /Change|Confirm|Save|Switch/i }); if (await ok.count()) { await ok.first().click(); } await p.waitForTimeout(5000); return target; }
try { await p.waitForTimeout(4000); o.start = (await p.locator('header').innerText()).replace(/\s+/g, ' ').slice(-120); await shot('C715477-prod-0-start');
  const hd = (await p.locator('header').innerText()).split('\n').map((t) => t.trim()).filter(Boolean); const startLoc = hd[hd.indexOf('notifications') + 1]; o.startLoc = startLoc;
  const other = await changeTo((ls) => ls.find((l) => l !== startLoc && !/^(Change Location|Cancel|Save|close|search|check|radio)/i.test(l) && l.length > 3)); o.other = other; o.atOther = (await p.locator('header').innerText()).replace(/\s+/g, ' ').slice(-120);
  await p.goto(B.APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); const wo = p.getByText(/^[A-Z]*\d*-?\d+$/).first(); await wo.click(); await p.waitForTimeout(5000); o.copied = p.url(); await shot('C715477-prod-1-wo-at-other');
  await changeTo(startLoc); o.back = (await p.locator('header').innerText()).replace(/\s+/g, ' ').slice(-120); await p.goto(B.APP + '/workorders', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(4000);
  await p.goto(o.copied, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o.url1 = p.url(); o.dialog = (await p.locator('.q-dialog').allInnerTexts().catch(() => [])).join(' | ').replace(/\s+/g, ' '); o.notes1 = await notes(); await shot('C715477-prod-2-pasted');
  const cancel = p.locator('.q-dialog').getByRole('button', { name: /^Cancel$/ }); o.cancel = await cancel.count(); if (o.cancel) { await cancel.first().click(); await p.waitForTimeout(3000); } o.url3 = p.url(); o.notes3 = await notes(); o.main3 = (await p.locator('main').innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 200); await shot('C715477-prod-3-after-cancel');
} catch (e) { o.err = String(e).slice(0, 300); try { await shot('C715477-prod-error'); } catch {} }
save(); console.log('pr3', JSON.stringify({ v: o.version, start: o.startLoc, other: o.other, copied: o.copied, url1: o.url1, dialog: o.dialog, notes1: o.notes1, url3: o.url3, err: o.err }).slice(0, 900)); await B.browser.close(); process.exit(0);
