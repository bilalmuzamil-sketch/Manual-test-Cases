/** read-only: find the Roles & Permissions page on staging and the Create custom role form */
import fs from 'node:fs'; import path from 'node:path';
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence/staging-full-2026-10-14/setup');
const { browser, page: p, APP } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/customers', key: 'admin' }) as any;
const o: any = {}; const txt = async () => (await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`)).replace(/\s+/g, ' ').slice(0, 600);
for (const u of ['/administration/roles', '/administration/roles-and-permissions', '/administration/roles-permissions', '/administration']) { await p.goto(APP + u, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); o[u] = await txt(); }
o.adminLinks = await p.evaluate(`[...document.querySelectorAll('a')].map(a => a.getAttribute('href')).filter(h => h && /administration|settings|role/i.test(h)).slice(0, 40)`);
await p.locator('[data-test-id="profile_menu_button"]').click().catch(() => {}); await p.waitForTimeout(1500);
o.profileMenu = (await p.evaluate(`[...document.querySelectorAll('.q-menu')].map(m => m.innerText.replace(/\\s+/g, ' ')).join(' || ')`)).slice(0, 600);
fs.writeFileSync(`${EV}/probe2.json`, JSON.stringify(o, null, 1)); console.log(JSON.stringify(o, null, 1)); await browser.close(); process.exit(0);
