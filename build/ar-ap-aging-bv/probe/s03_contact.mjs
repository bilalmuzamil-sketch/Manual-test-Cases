import { start, A } from './libs.mjs';
import fs from 'fs';
const OUT = new URL('./s03/', import.meta.url).pathname;
const { r, page, dump, step, go } = await start(OUT);
const log = (...a) => console.log(...a); const T = s => (s || '').replace(/\s+/g, ' ').trim();
const CU = fs.readFileSync(new URL('./s02/customer-url.txt', import.meta.url), 'utf8').trim().replace(A, '');
await step('find', async () => { await go(CU); await page.waitForTimeout(3500); log('CONTACT-ish', JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('button,a,[role=button],.cursor-pointer,span,div')].filter(e => /^\s*Add Contact\s*$/.test(e.textContent) && e.children.length < 3).map(e => ({ tag: e.tagName, cls: String(e.className).slice(0, 60), vis: e.getBoundingClientRect().width > 0 })).slice(0, 6))));
  log('TABS', JSON.stringify((await page.locator('main .q-tab').allInnerTexts()).map(T))); await dump('customer-page', true); });
await r.browser?.close?.(); process.exit(0);
