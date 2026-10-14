/** 14 Oct 2026 staging: Status options and how many work orders each one lists (List, All tab), canned line keys. */
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
import { api } from './data.mts';
import { tab, display } from './wob.mts';
const { browser, page: p, APP } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/workorders', key: 'admin' }) as any;
const a = api(p); const R: any = {};
const c = (await a.get('/api/work-orders/canned-lines')).body?.data; const cl = Array.isArray(c) ? c : c?.collection ?? []; R.cannedKeys = Object.keys(cl[0] ?? {}); R.canned = cl.slice(0, 3).map((x: any) => JSON.stringify(x).slice(0, 200));
await p.goto(APP + '/workorders?tab=all', { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(5000); await tab(p, 'All'); await display(p, 'List');
await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(1000);
const opts = (await p.locator('.q-menu').last().innerText()).split('\n').map((x) => x.trim()).filter((x) => x && !/^(check_box|check_box_outline_blank|search)$/.test(x)); await p.keyboard.press('Escape'); R.opts = opts;
R.counts = {};
for (const s of opts.filter((x) => x && !/Clear selection/.test(x))) {
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(800);
  await p.locator('.q-menu').last().getByText(s, { exact: true }).first().click(); await p.waitForTimeout(3000); await p.keyboard.press('Escape'); await p.waitForTimeout(2500);
  R.counts[s] = await p.evaluate(`(document.body.innerText.match(/(\\d[\\d,]*)\\s*(results|work orders|records|of\\s+\\d+)/i) || [null])[0] + ' | rows ' + [...document.querySelectorAll('tbody tr')].filter(r => /\\bS\\d+-\\d+\\b|IMP/.test(r.innerText)).length`);
  await p.locator('[data-test-id="filter_chip_status"]').click(); await p.waitForTimeout(800); await p.locator('.q-menu').getByText('Clear selection').first().click().catch(() => {}); await p.keyboard.press('Escape'); await p.waitForTimeout(1500);
}
console.log(JSON.stringify(R, null, 1)); await browser.close(); process.exit(0);
