/** 16 Oct 2026 (batch 40) — read only: what the Analyst 1 browser needs in localStorage to open the app (the person record shape), and
 *  whether that account's sign-in could reach company A ("my workplaces"). No writes except the page's own localStorage. */
import fs from 'node:fs'; import path from 'node:path';
import { analystBrowser } from './analyst.mts'; import { EV, t } from './wob.mts';
const A = await analystBrowser('/404-zz'); const p = A.page, a = A.api; const o: any = {};
const prof = (await a.get('/api/iam/view-profile/')).body?.data?.user; o.profKeys = prof ? Object.keys(prof) : null; o.profDetailsKeys = prof?.details ? Object.keys(prof.details) : null;
const sw = await a.get('/api/switch-user'); o.switchState = { status: sw.status, keys: sw.body?.data ? Object.keys(sw.body.data).slice(0, 20) : JSON.stringify(sw.body).slice(0, 120) };
await p.evaluate((u) => localStorage.setItem('user', JSON.stringify({ data: u })), prof);
await p.goto(A.APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }).catch(() => {}); await p.waitForTimeout(8000);
o.url = p.url().replace(A.APP, ''); o.top = await p.locator('[data-test-id="profile_menu_button"]').innerText().then((x) => x.replace(/\s+/g, ' ')).catch(() => null);
await p.screenshot({ path: path.join(EV, 'analyst-probe2.png') });
fs.writeFileSync(path.join(EV, 'analyst-probe2.json'), JSON.stringify(o, null, 1)); console.log(t(), 'ANALYST2', JSON.stringify(o).slice(0, 3000)); await A.browser.close(); process.exit(0);
