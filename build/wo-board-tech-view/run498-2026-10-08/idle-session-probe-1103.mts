/** idle-session-probe-1103.mts — 3 Nov 2026. Production v26.45.0: three C682419 runs were signed out ~60 s after sign-in.
 *  Does the session end on its own (doing nothing), or does something the minimap script does end it?
 *  PROBE_RELOAD=1: reload the page by its address first (the minimap script does), to see whether that is what ends the session.
 *  Signs in, opens Work Orders, then only asks the Work Orders preference (a real address; /api/users/me answers 404 even signed in) every 5 s for 180 s; logs status + page URL. Output EV/idle-probe.json */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api } from './data.mts'; import { EV } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all');
const RELOAD = (process.env.PROBE_RELOAD === '1' || process.env.L5_GAP_MS === 'reload') /* wob-run.sh passes only known names: L5_GAP_MS=reload */; if (RELOAD) { await p.goto(process.env.GS_APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); console.log('reloaded by address'); }
console.log('cookies', JSON.stringify((await p.context().cookies()).filter(c => /sess|sso/i.test(c.name)).map(c => ({ n: c.name, d: c.domain, exp: c.expires })))); const a = api(p); const t0 = Date.now(); const log: any[] = [];
for (let i = 0; i <= 36; i++) {
  const r = await a.get('/api/users/me/preferences/work-orders-list').catch((e: any) => ({ status: 'ERR ' + String(e).slice(0, 80) }));
  log.push({ s: Math.round((Date.now() - t0) / 1000), status: (r as any).status, url: p.url().replace(/\?.*/, '') });
  console.log(JSON.stringify(log.at(-1)));
  if ((r as any).status === 401) break;
  await p.waitForTimeout(5000);
}
fs.writeFileSync(path.join(EV, 'idle-probe.json'), JSON.stringify(log, null, 1));
await done(browser);
