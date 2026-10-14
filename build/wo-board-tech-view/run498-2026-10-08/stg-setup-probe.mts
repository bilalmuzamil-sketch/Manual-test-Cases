/** read-only look at Settings > Roles & Permissions > Create custom role, and Administration > Locations > add (staging) */
import fs from 'node:fs';
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
const EV = 'evidence/staging-full-2026-10-14/setup';
const { browser, page: p, APP } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/customers', key: 'admin' }) as any;
const calls: string[] = []; p.on('request', (q: any) => { if (/\/api\//.test(q.url())) calls.push(`${q.method()} ${q.url().replace(/^https:\/\/[^/]+/, '').split('?')[0]}`); });
const o: any = {};
for (const u of ['/settings/roles', '/settings/roles-and-permissions', '/settings']) { await p.goto(APP + u, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000); o[u] = { url: p.url(), text: (await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`)).replace(/\s+/g, ' ').slice(0, 400) }; }
await p.locator('a, .q-item, button').filter({ hasText: /Roles/i }).first().click().catch(() => {}); await p.waitForTimeout(5000);
o.rolesPage = { url: p.url(), text: (await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`)).replace(/\s+/g, ' ').slice(0, 1200) }; await p.screenshot({ path: `${EV}/roles-list.png` });
await p.locator('button').filter({ hasText: /Create custom role/i }).first().click().catch(() => {}); await p.waitForTimeout(3000);
o.templateModal = (await p.evaluate(`[...document.querySelectorAll('.q-dialog')].map(d => d.innerText.replace(/\\s+/g, ' ')).join(' || ')`)).slice(0, 800); await p.screenshot({ path: `${EV}/roles-template.png` });
await p.locator('.q-dialog button').filter({ hasText: /^\s*Skip\s*$/i }).first().click().catch(() => {}); await p.waitForTimeout(4000);
o.newRole = { url: p.url(), text: (await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`)).replace(/\s+/g, ' ').slice(0, 2500),
  toggles: await p.evaluate(`[...document.querySelectorAll('[data-test-id]')].map(e => e.getAttribute('data-test-id')).filter(x => /perm|toggle|check|role/i.test(x)).slice(0, 80)`) };
await p.screenshot({ path: `${EV}/roles-new.png`, fullPage: true });
await p.goto(APP + '/administration/locations', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000);
o.locButtons = await p.evaluate(`[...document.querySelectorAll('button')].map(b => (b.innerText || b.getAttribute('aria-label') || '').trim()).filter(Boolean).slice(0, 30)`);
await p.locator('button').filter({ hasText: /Add|New|Create/i }).first().click().catch(() => {}); await p.waitForTimeout(3000);
o.locForm = (await p.evaluate(`[...document.querySelectorAll('.q-dialog')].map(d => d.innerText.replace(/\\s+/g, ' ')).join(' || ')`)).slice(0, 1500); await p.screenshot({ path: `${EV}/location-add.png` });
o.calls = [...new Set(calls)].slice(0, 60);
fs.writeFileSync(`${EV}/probe.json`, JSON.stringify(o, null, 1)); console.log(JSON.stringify(o, null, 1).slice(0, 6000)); await browser.close(); process.exit(0);
