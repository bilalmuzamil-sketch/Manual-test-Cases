/** Read the Service Advisor control's label on a work order page (v26.40.14-e84b3d1), for C154884's precondition. Read-only. */
import fs from 'fs'; import path from 'path';
import { boot } from '../../testing-tools/qa-branch-boot.mjs';
const EVD = path.join(path.dirname(new URL(import.meta.url).pathname), 'evidence', 'retest-e84b3d1-2026-10-12');
const { browser, page: p, APP } = await boot('sv10043', '/workorders?tab=all', 'admin'); await p.waitForTimeout(6000);
const r = await p.evaluate(async () => (await fetch('https://sv10043api.qa.shopview.com/api/work-orders?search=S10043-17602&pagination[rowsPerPage]=5', { credentials: 'include', headers: { Accept: 'application/json' } })).json());
const id = (r?.data?.work_orders ?? [])[0]?.id;
await p.goto(`${APP}/workorders/${id}`, { waitUntil: 'domcontentloaded' }); await p.waitForTimeout(8000);
const R = await p.evaluate(() => { const out = []; for (const e of document.querySelectorAll('label, .q-field__label, [data-test-id*="advisor"], [data-test-id*="service"]')) { const t = (e.innerText || e.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim(); if (/advisor/i.test(t) || /advisor/i.test(e.getAttribute('data-test-id') || '')) out.push({ tag: e.tagName, tid: e.getAttribute('data-test-id'), text: t.slice(0, 80) }); } return out; });
await p.screenshot({ path: path.join(EVD, 'C154884-wo-page-service-advisor.png') });
console.log(JSON.stringify({ wo: 'S10043-17602', found: !!id, R }, null, 1)); await browser.close(); process.exit(0);
