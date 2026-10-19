/** c96912-inbox.mts — 19 Oct 2026, C96912 step 7 route finder: can a brand-new staff user get a password on staging? A new Admin-role staff
 *  member is created with a PUBLIC yopmail address (no real person); then the yopmail inbox is read in a separate, cookie-free browser for an
 *  invitation from ShopView for up to ~4 minutes. Records the inbox list and, if found, the invitation's link host/path (no tokens printed).
 *  Creating the user is set-up (Rule 107). Output EV/c96912-inbox.json, pictures EV/C96912-inbox-*.png. */
import fs from 'node:fs'; import path from 'node:path';
import { chromium } from 'playwright';
import { open, done } from './session.mts';
import { api } from './data.mts';
import { EV } from './wob.mts';
import { person, roleIds, staffRows } from './staff.mts';
const { browser, page: p } = await open('/workorders'); const a = api(p); const o: any = {};
const tag = String(Date.now()).slice(-6); const box = `zzwob-c96912-${tag}`; const email = `${box}@yopmail.com`; o.inbox = box;
const roles = await roleIds(a); o.roleUsed = roles['Admin'] ? 'Admin' : Object.keys(roles)[0];
try { o.created = await person(a, 'ZZAUTOTEST', `C96912 Inbox ${tag}`, { role: roles['Admin'] ?? Object.values(roles)[0], email }); } catch (e: any) { o.createError = String(e?.message || e).slice(0, 200); }
const row = (await staffRows(a, email)).find((x: any) => String(x.email).toLowerCase() === email); o.row = row ? { staff_id: row.staff_id, active: row.is_active, confirmed: row.confirmed_invitation_on ?? null } : null;
await browser.close().catch(() => {});
const PORT = fs.readFileSync('/tmp/atlassian/bridge-port.txt', 'utf8').trim(); const b2 = await chromium.launch({ executablePath: process.env.CHROME_BIN || '/opt/pw-browsers/chromium-1194/chrome-linux/chrome', headless: true, proxy: { server: `http://127.0.0.1:${PORT}` }, args: ['--no-sandbox', '--ignore-certificate-errors'] });
const pg = await (await b2.newContext({ viewport: { width: 1400, height: 900 } })).newPage(); o.reads = [];
for (let i = 0; i < 8; i++) {
  await pg.goto(`https://yopmail.com/en/?login=${box}`, { waitUntil: 'domcontentloaded' }).catch((e: any) => o.reads.push('goto ' + String(e).slice(0, 80))); await pg.waitForTimeout(5000);
  const fr = pg.frame({ name: 'ifinbox' }); const list = fr ? await fr.evaluate(`[...document.querySelectorAll('.m, .lm')].map(e => e.innerText.replace(/\\s+/g, ' ').trim()).slice(0, 5)`).catch(() => []) : 'no inbox frame';
  o.reads.push({ at: new Date().toISOString(), list }); if (Array.isArray(list) && list.length) break; await pg.waitForTimeout(25000);
}
await pg.screenshot({ path: path.join(EV, 'C96912-inbox-list.png') }).catch(() => {});
const fm = pg.frame({ name: 'ifmail' }); if (fm) { o.mail = await fm.evaluate(`(() => ({ text: document.body.innerText.replace(/\\s+/g, ' ').slice(0, 600), links: [...document.querySelectorAll('a')].map(x => { try { const u = new URL(x.href); return u.host + u.pathname.replace(/[0-9a-f]{16,}|[A-Za-z0-9_-]{30,}/g, '<token>'); } catch (e) { return null; } }).filter(Boolean).slice(0, 10) }))()`).catch(() => null); await pg.screenshot({ path: path.join(EV, 'C96912-inbox-mail.png') }).catch(() => {}); }
await b2.close();
fs.writeFileSync(path.join(EV, 'c96912-inbox.json'), JSON.stringify(o, null, 1)); console.log('INBOX', JSON.stringify(o).slice(0, 2500)); process.exit(0);
