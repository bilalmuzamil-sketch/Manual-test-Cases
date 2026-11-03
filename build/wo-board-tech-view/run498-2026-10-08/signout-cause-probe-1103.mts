/** signout-cause-probe-1103.mts — 3 Nov 2026, production v26.45.0. sv11835-minimap-1028.mts is signed out before its step 2, three
 *  times; an idle session and a full sideways walk are NOT signed out. This does the minimap script's opening actions one at a time,
 *  each followed by a 12 s wait and a check for the sign-in form + any 401/403/419 response:
 *   A preference read + PUT pinnedTechnicianIds [] (value restored after) · B page.goto reload + Board View · C the "every element's
 *   computed style" scan of the whole page (fixedBR) · D wait 60 s more. Output EV/cause-probe.json */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api } from './data.mts'; import { EV, display, tab } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p); const t0 = Date.now(); const s = () => Math.round((Date.now() - t0) / 1000);
const bad: any[] = []; p.on('response', (r) => { if ([401, 403, 419, 440].includes(r.status())) bad.push({ s: s(), st: r.status(), m: r.request().method(), u: r.url().slice(0, 160) }); });
const o: any = { checks: [], bad }; const PREF = '/api/users/me/preferences/work-orders-list';
const check = async (tag: string) => { await p.waitForTimeout(12000); const c = { tag, s: s(), login: await p.locator('.login-container').count(), url: p.url().replace(/\?.*/, ''), bad: bad.length }; o.checks.push(c); console.log(JSON.stringify(c)); return c.login > 0; };
await display(p, 'Board View').catch(() => {}); if (await check('start')) throw 0;
const g = await a.get(PREF); const ORIGINAL = g.body?.data?.value ?? {}; o.prefGet = g.status;
o.pinOff = (await a.put(PREF, { value: { ...ORIGINAL, pinnedTechnicianIds: [] } })).status; const A = await check('A pref PUT');
if (!A) { await p.goto(process.env.GS_APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All').catch(() => {}); await display(p, 'Board View').catch(() => {});
  const B = await check('B reload + Board View');
  if (!B) { o.scanMs = await p.evaluate(`(() => { const t = performance.now(); const n = [...document.querySelectorAll('body *')].filter(e => getComputedStyle(e).position === 'fixed').length; return [Math.round(performance.now() - t), n]; })()`);
    const C = await check('C full computed-style scan'); if (!C) { await p.waitForTimeout(48000); await check('D +60 s'); } } }
o.restore = (await a.put(PREF, { value: ORIGINAL }).catch(() => ({ status: 'ERR' }))).status;
fs.writeFileSync(path.join(EV, 'cause-probe.json'), JSON.stringify(o, null, 1)); console.log('BAD', JSON.stringify(bad).slice(0, 1200), 'restore', o.restore, 'scan', JSON.stringify(o.scanMs));
await done(browser);
