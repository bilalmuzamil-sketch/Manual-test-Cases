/**
 * Freeze diagnosis 2 (12 Oct 2026). diag 1: after Logout both tabs stop answering within ~3 s and never recover; the app sent
 * two crash reports just before; ordinary page files then never finish. Here: (A) ONE tab only — click Logout, then test
 * whether the page answers; (B) if frozen, pause it through the debugger (CDP Debugger.pause) and record the running
 * code's call stack (function names and files) — the proof of what is looping. Positive control: the same page answers
 * before the click. The crash-reporter requests are also captured (their error text) by reading the request body.
 */
import fs from 'node:fs'; import path from 'node:path';
import { open, APP } from './session.mts';
import { EV, t } from './wob.mts';
const R: any = {}; const save = () => fs.writeFileSync(path.join(EV, 'freeze-diag4.json'), JSON.stringify(R, null, 1));
setTimeout(() => { save(); console.log(t(), 'watchdog'); process.exit(0); }, 200_000);
const first = await open('/workorders?tab=all');
/* DIAG 4: the sign-in helper's context carries an init script that writes the session into localStorage on EVERY page load
   (boot.ts). Re-open the same signed-in state in a CLEAN context (cookies + storage, no init script) for both tabs. */
const st = await first.page.context().storageState(); const clean = await first.browser.newContext({ storageState: st, viewport: { width: 1600, height: 1000 }, ignoreHTTPSErrors: true });
const p = await clean.newPage(); p.setDefaultTimeout(8000); await first.page.close().catch(() => {});
const alive = async () => Promise.race([p.evaluate('1').then(() => true).catch(() => 'err'), new Promise((r) => setTimeout(() => r(false), 1000))]);
const cdp = await clean.newCDPSession(p); await cdp.send('Debugger.enable');
R.reports = [];
p.on('request', (q) => { if (/ingest\.sentry\.io/.test(q.url())) { const b = q.postData() || ''; const m = b.match(/"(value|message|type)":"([^"]{0,200})"/g); R.reports.push((m || []).slice(0, 6).join(' | ').replace(/[0-9a-f]{32,}/g, '<h>')); } });
try {
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  const t2 = await clean.newPage(); await t2.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await t2.waitForTimeout(6000);
  const cdp2 = await clean.newCDPSession(t2); await cdp2.send('Debugger.enable');
  R.aliveBefore = [await alive(), true];
  /* storage traffic between the tabs: count localStorage writes per second in each tab */
  for (const pg of [p, t2]) await pg.evaluate(`(() => { window.__w = 0; window.__keys = {}; const o = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { window.__w++; window.__keys[k] = (window.__keys[k] || 0) + 1; return o.apply(this, arguments); }; const r = Storage.prototype.removeItem; Storage.prototype.removeItem = function (k) { window.__w++; window.__keys['-' + k] = (window.__keys['-' + k] || 0) + 1; return r.apply(this, arguments); }; })()`);
  await t2.locator('[data-test-id="profile_menu_button"]').click(); await t2.waitForTimeout(800); await t2.locator('.q-menu').getByText('Logout', { exact: true }).last().click();
  R.alive = []; for (let i = 0; i < 6; i++) { await new Promise((r) => setTimeout(r, 2000)); R.alive.push(await alive()); }
  const stackOf = async (c: any) => { const pz = new Promise<any>((res) => c.once('Debugger.paused', res)); await c.send('Debugger.pause').catch(() => {}); const ev: any = await Promise.race([pz, new Promise((r) => setTimeout(() => r(null), 10000))]);
    if (!ev) return 'no answer to pause in 10 s';
    const frames = ev.callFrames.slice(0, 18).map((f: any) => `${f.functionName || '(anon)'} @ ${f.url.replace(APP, '')}:${f.location.lineNumber}:${f.location.columnNumber}`);
    const w = await c.send('Runtime.evaluate', { expression: 'JSON.stringify({w: window.__w, keys: window.__keys, url: location.pathname})', returnByValue: true }).catch(() => null);
    await c.send('Debugger.resume').catch(() => {}); return { frames, writes: w?.result?.value ?? null }; };
  R.urls = [p.url().replace(APP, ''), t2.url().replace(APP, '')]; if (R.alive.some((x: any) => x === false)) { R.tab1 = await stackOf(cdp); await new Promise((r) => setTimeout(r, 1000)); R.tab2 = await stackOf(cdp2);
  await new Promise((r) => setTimeout(r, 2000)); R.tab1again = await stackOf(cdp); }
} catch (e: any) { R.error = String(e?.message || e).slice(0, 200); }
save(); console.log(t(), 'DIAG4', JSON.stringify(R).slice(0, 4000)); process.exit(0);
