/** 14 Oct 2026 — staging set-up for the second pass (Rule 107), each step only if missing, read back:
 *  (1) role "ZZAUTOTEST WO View Only" = Work orders > View only (no Create & Edit, no financial data) — Administration >
 *      Roles & Permissions > Create Custom Role > Skip > name + area_workorders_view > Create;
 *  (2) location "ZZAUTOTEST F2 Empty Shop" (no technicians) — Administration > Locations > New Location > Name, Timezone > Save & Close. */
import fs from 'node:fs'; import path from 'node:path';
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
import { api } from './data.mts';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence/staging-full-2026-10-14/setup');
const { browser, page: p, APP } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/customers', key: 'admin' }) as any;
const a = api(p); const o: any = {};
const toasts = () => p.evaluate(`[...document.querySelectorAll('.q-notification')].map(e => e.innerText.replace(/\\s+/g, ' ').slice(0, 150))`);
// (1) role
await p.goto(APP + '/administration/roles-permissions', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
const has = async () => (await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`)).includes('ZZAUTOTEST WO View Only');
o.roleBefore = await has();
if (!o.roleBefore) {
  await p.locator('button').filter({ hasText: /Create Custom Role/i }).first().click(); await p.waitForTimeout(3000);
  await p.locator('.q-dialog button').filter({ hasText: /^\s*Skip\s*$/i }).first().click(); await p.waitForTimeout(5000);
  await p.locator('[data-test-id="role_name_input"]').fill('ZZAUTOTEST WO View Only');
  await p.locator('[data-test-id="area_workorders_view"]').click(); await p.waitForTimeout(800);
  o.financialText = await p.evaluate(`(document.body.innerText.match(/[^\\n]*[Ff]inancial[^\\n]*/g) || []).slice(0, 6)`);
  await p.screenshot({ path: `${EV}/role-filled.png`, fullPage: true });
  await p.locator('button').filter({ hasText: /^\s*Create\s*$/ }).last().click(); await p.waitForTimeout(3000);
  const conf = p.locator('.q-dialog button').filter({ hasText: /Create|Continue|Yes|Confirm/i }).last(); if (await conf.count()) { o.confirm = (await p.locator('.q-dialog').last().innerText()).replace(/\s+/g, ' ').slice(0, 200); await conf.click(); await p.waitForTimeout(3000); }
  o.roleToasts = await toasts();
  await p.goto(APP + '/administration/roles-permissions', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
}
o.roleAfter = await has(); await p.screenshot({ path: `${EV}/roles-after.png` });
// (2) location
await p.goto(APP + '/administration/locations', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
const hasLoc = async () => (await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`)).includes('ZZAUTOTEST F2 Empty Shop');
o.locBefore = await hasLoc();
if (!o.locBefore) {
  await p.locator('button').filter({ hasText: /New Location/i }).first().click(); await p.waitForTimeout(3000);
  const d = p.locator('.q-dialog').last();
  await d.locator('.q-field').filter({ hasText: /Name \*/ }).first().locator('input').fill('ZZAUTOTEST F2 Empty Shop');
  const fill = async (lab: string, v: string) => { const i = d.getByLabel(lab, { exact: true }).first(); await i.click(); await i.fill(v); await p.keyboard.press('Escape').catch(() => {}); await p.waitForTimeout(300); };
  await fill('Address 1', '1 ZZAUTOTEST Way'); await fill('City', 'Las Vegas'); { const z = d.getByLabel(/ZIP/i).first(); await z.click(); await z.fill('89135'); } { const ph = d.getByLabel(/Telephone/i).first(); await ph.click(); await p.keyboard.type('7025550199', { delay: 30 }); }
  const st = d.getByLabel('State/Province').first(); await st.click(); await p.waitForTimeout(800); await p.keyboard.type('Nevada', { delay: 40 }); await p.waitForTimeout(1200);
  await p.locator('.q-menu .q-item').filter({ hasText: 'Nevada' }).first().click().catch(() => {}); await p.waitForTimeout(800);
  const tz = d.locator('.q-field').filter({ hasText: /Timezone/ }).first(); await tz.click(); await p.waitForTimeout(800); await p.keyboard.type('Karachi', { delay: 50 }); await p.waitForTimeout(1500);
  await p.locator('.q-menu .q-item').filter({ hasText: 'Asia/Karachi' }).first().click().catch(() => {}); await p.waitForTimeout(800);
  await p.screenshot({ path: `${EV}/location-filled.png` });
  o.locClicked = await p.evaluate(`(() => { const b = [...document.querySelectorAll('.q-dialog button')].filter(x => x.innerText.replace(/\\s+/g,' ').trim() === 'Save & Close').pop(); if (!b) return false; b.scrollIntoView(); b.click(); return true; })()`);
  await p.waitForTimeout(4000); o.locToasts = await toasts(); o.locDialog = (await p.locator('.q-dialog').last().innerText().catch(() => '')).replace(/\s+/g, ' ').slice(0, 300);
  await p.reload({ waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
}
o.locAfter = await hasLoc();
o.workplaces = ((await a.get('/api/workplaces')).body?.data?.collection ?? []).map((x: any) => `${x.name} ${String(x.id).slice(0, 8)} ${x.timezone}`);
o.myWorkplaces = JSON.stringify((await a.get('/api/staff/my-workplaces')).body).slice(0, 600);
fs.writeFileSync(`${EV}/setup.json`, JSON.stringify(o, null, 1)); console.log(JSON.stringify(o, null, 1)); await browser.close(); process.exit(0);
