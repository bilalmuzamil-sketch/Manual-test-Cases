/**
 * Why does the test browser freeze right after the session changes (sign-out in another tab: C368240; switching to
 * another user: C368238/C368239)? Logs every request both tabs start after the Logout click, which ones never finish,
 * and whether each tab still answers (a 1 s evaluate) every 2 s for 40 s. A request that never finishes while the page
 * stops answering points at a synchronous call that blocks the page; it can then be cut short by the test, not waited on.
 */
import fs from 'node:fs'; import path from 'node:path';
import { open, APP } from './session.mts';
import { EV, t } from './wob.mts';
setTimeout(() => { fs.writeFileSync(path.join(EV, 'freeze-diag.json'), JSON.stringify(R, null, 1)); console.log(t(), 'watchdog'); process.exit(0); }, 180_000);
const R: any = { log: [] };
const { page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(8000);
const t0 = Date.now(); const pend = new Map<string, any>(); let seq = 0;
const watch = (pg: any, tag: string) => {
  pg.on('request', (q: any) => { const id = `${tag}#${++seq}`; (q as any)._id = id; pend.set(id, { tag, ms: Date.now() - t0, m: q.method(), type: q.resourceType(), url: q.url().replace(/[0-9a-f]{32,}/g, '<hid>').slice(0, 120) }); });
  const fin = (q: any, how: string) => { const id = (q as any)._id; const e = pend.get(id); if (e) { e.end = Date.now() - t0; e.how = how; R.log.push(e); pend.delete(id); } };
  pg.on('requestfinished', (q: any) => fin(q, 'ok')); pg.on('requestfailed', (q: any) => fin(q, 'failed: ' + (q.failure()?.errorText ?? '')));
  pg.on('framenavigated', (f: any) => { if (f === pg.mainFrame()) R.log.push({ tag, ms: Date.now() - t0, nav: f.url().replace(APP, '').slice(0, 80) }); });
};
const alive = async (pg: any) => Promise.race([pg.evaluate('1').then(() => true).catch(() => 'err'), new Promise((r) => setTimeout(() => r(false), 1000))]);
try {
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000);
  const t2 = await p.context().newPage(); await t2.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await t2.waitForTimeout(5000);
  watch(p, 'tab1'); watch(t2, 'tab2'); R.clickAt = Date.now() - t0;
  await t2.locator('[data-test-id="profile_menu_button"]').click(); await t2.waitForTimeout(800); await t2.locator('.q-menu').getByText('Logout', { exact: true }).last().click();
  R.alive = [];
  for (let i = 0; i < 20; i++) { await new Promise((r) => setTimeout(r, 2000)); R.alive.push({ s: (i + 1) * 2, tab1: await alive(p), tab2: await alive(t2), pending: pend.size }); }
} catch (e: any) { R.error = String(e?.message || e).slice(0, 200); }
R.pendingAtEnd = [...pend.values()].slice(0, 30); R.log = R.log.filter((e: any) => e.nav || e.ms >= (R.clickAt ?? 0)).slice(-80);
fs.writeFileSync(path.join(EV, 'freeze-diag.json'), JSON.stringify(R, null, 1));
console.log(t(), 'ALIVE', JSON.stringify(R.alive)); console.log(t(), 'PENDING', JSON.stringify(R.pendingAtEnd).slice(0, 2500)); process.exit(0);
