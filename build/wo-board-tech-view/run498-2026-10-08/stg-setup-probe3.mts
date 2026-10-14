/** read-only: the Create Custom Role form on staging (template modal -> Skip -> form) */
import fs from 'node:fs'; import path from 'node:path';
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence/staging-full-2026-10-14/setup');
const { browser, page: p, APP } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/customers', key: 'admin' }) as any;
const o: any = {};
await p.goto(APP + '/administration/roles-permissions', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(6000);
o.existing = (await p.evaluate(`[...document.querySelectorAll('tbody tr')].map(r => r.innerText.split('\\n')[0].trim())`));
await p.locator('button').filter({ hasText: /Create Custom Role/i }).first().click(); await p.waitForTimeout(3000);
o.modal = (await p.evaluate(`[...document.querySelectorAll('.q-dialog')].map(d => d.innerText.replace(/\\s+/g, ' ')).join(' || ')`)).slice(0, 900); await p.screenshot({ path: `${EV}/role-template-modal.png` });
await p.locator('.q-dialog button').filter({ hasText: /^\s*Skip\s*$/i }).first().click().catch(() => {}); await p.waitForTimeout(5000);
o.url = p.url();
o.form = (await p.evaluate(`(document.querySelector('main, .q-page') || document.body).innerText`)).replace(/\s+/g, ' ').slice(0, 3000);
o.inputs = await p.evaluate(`[...document.querySelectorAll('input, [role=checkbox], .q-toggle, .q-checkbox')].slice(0, 60).map(e => ({ tag: e.tagName, tid: e.getAttribute('data-test-id'), aria: e.getAttribute('aria-label'), label: (e.closest('.q-item, label, .row, tr') || e).innerText?.replace(/\\s+/g, ' ').slice(0, 80) }))`);
await p.screenshot({ path: `${EV}/role-form.png`, fullPage: true });
fs.writeFileSync(`${EV}/probe3.json`, JSON.stringify(o, null, 1)); await browser.close(); process.exit(0);
