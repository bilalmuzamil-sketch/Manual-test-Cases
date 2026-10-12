/** Read-only: does production's Work Orders page offer Board View / Tech View? (12 Oct 2026, for C97022's production comparison) */
import path from 'path';
import { bootProdLogin } from '../../testing-tools/prod-login-boot.mjs';
const EV = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'prod-2026-10-12');
const { browser, page: p, APP } = await bootProdLogin('/work-orders', { viewport: { width: 1600, height: 1000 } });
p.setDefaultTimeout(20000); const R = {};
await p.goto(`${APP}/`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(7000); await p.getByText('Work Orders', { exact: true }).first().click(); await p.waitForTimeout(9000); R.url = p.url();
R.version = await p.evaluate(`document.querySelector('meta[name=app-version]')?.content || null`);
R.switchers = await p.evaluate(`[...document.querySelectorAll('[aria-label],[title],[data-test-id]')].map(e => (e.getAttribute('aria-label')||'')+'|'+(e.getAttribute('title')||'')+'|'+(e.getAttribute('data-test-id')||'')).filter(t => /board|tech view|list view|display/i.test(t)).slice(0, 20)`);
R.tabs = (await p.locator('body').innerText()).replace(/\s+/g, ' ').slice(0, 400); R.text = (await p.locator('body').innerText()).replace(/\s+/g, ' ').match(/.{0,60}(Board View|Tech View).{0,60}/g)?.slice(0, 5) ?? null;
await p.screenshot({ path: path.join(EV, 'prod-wo-page.png') });
console.log('LOOK', JSON.stringify(R)); await Promise.race([browser.close(), new Promise((r) => setTimeout(r, 8000))]); process.exit(0);
