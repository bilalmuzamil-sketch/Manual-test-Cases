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
const R: any = {}; const save = () => fs.writeFileSync(path.join(EV, 'freeze-diag2.json'), JSON.stringify(R, null, 1));
setTimeout(() => { save(); console.log(t(), 'watchdog'); process.exit(0); }, 200_000);
const { page: p } = await open('/workorders?tab=all'); p.setDefaultTimeout(8000);
const alive = async () => Promise.race([p.evaluate('1').then(() => true).catch(() => 'err'), new Promise((r) => setTimeout(() => r(false), 1000))]);
const cdp = await p.context().newCDPSession(p); await cdp.send('Debugger.enable');
R.reports = [];
p.on('request', (q) => { if (/ingest\.sentry\.io/.test(q.url())) { const b = q.postData() || ''; const m = b.match(/"(value|message|type)":"([^"]{0,200})"/g); R.reports.push((m || []).slice(0, 6).join(' | ').replace(/[0-9a-f]{32,}/g, '<h>')); } });
try {
  await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
  R.aliveBefore = await alive();
  await p.locator('[data-test-id="profile_menu_button"]').click(); await p.waitForTimeout(800); await p.locator('.q-menu').getByText('Logout', { exact: true }).last().click();
  R.alive = []; for (let i = 0; i < 8; i++) { await new Promise((r) => setTimeout(r, 2000)); R.alive.push(await alive()); }
  R.urlAfter = p.url().replace(APP, '');
  if (R.alive.slice(-3).every((x: any) => x === false)) {
    const paused = new Promise<any>((res) => cdp.once('Debugger.paused', res));
    await cdp.send('Debugger.pause'); const ev: any = await Promise.race([paused, new Promise((r) => setTimeout(() => r(null), 10000))]);
    R.stack = ev ? ev.callFrames.slice(0, 15).map((f: any) => `${f.functionName || '(anon)'} @ ${f.url.replace(APP, '')}:${f.location.lineNumber}:${f.location.columnNumber}`) : 'pause got no answer in 10 s';
    if (ev) { const ev2: any = await (async () => { await cdp.send('Debugger.resume'); await new Promise((r) => setTimeout(r, 1500)); const pz = new Promise<any>((res) => cdp.once('Debugger.paused', res)); await cdp.send('Debugger.pause'); return Promise.race([pz, new Promise((r) => setTimeout(() => r(null), 8000))]); })();
      R.stack2 = ev2 ? ev2.callFrames.slice(0, 15).map((f: any) => `${f.functionName || '(anon)'} @ ${f.url.replace(APP, '')}:${f.location.lineNumber}:${f.location.columnNumber}`) : null; }
  }
} catch (e: any) { R.error = String(e?.message || e).slice(0, 200); }
save(); console.log(t(), 'DIAG2', JSON.stringify(R).slice(0, 4000)); process.exit(0);
