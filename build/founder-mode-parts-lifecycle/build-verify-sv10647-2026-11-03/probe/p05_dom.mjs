// Probe 05 (read-only): element shapes for selectors. Nothing saved.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const OUT = process.env.OUT; fs.mkdirSync(OUT, { recursive: true });
const A = 'https://sv10647.qa.shopview.com';
const r = await boot('sv10647', '/parts/inventory', 'admin'); const page = r.page; page.setDefaultTimeout(12000);
const go = async p => { await page.goto(A + p, { waitUntil: 'domcontentloaded' }); await page.waitForLoadState('networkidle', { timeout: 8000 }).catch(() => {}); await page.waitForTimeout(1500); };
const html = async (sel, n) => { const h = await page.evaluate(s => [...document.querySelectorAll(s)].map(e => e.outerHTML.slice(0, 1500)).join('\n=====\n'), sel); fs.writeFileSync(`${OUT}/${n}.html`, h); console.log(n, h.length); };
const found = async (txt, n) => { const h = await page.evaluate(t => { const out = []; document.querySelectorAll('*').forEach(e => { if ([...e.childNodes].some(c => c.nodeType === 3 && c.textContent.trim() === t)) { let p = e; for (let i = 0; i < 3 && p.parentElement; i++) p = p.parentElement; out.push(`${e.tagName} visible=${!!(e.offsetParent)} :: ${p.outerHTML.slice(0, 700)}`); } }); return out.join('\n=====\n'); }, txt); fs.writeFileSync(`${OUT}/${n}.html`, h); console.log(n, h.split('=====').length); };
await go('/parts/inventory?search=ZZAUTOTEST-PLBV-A'); await page.waitForTimeout(2000);
await page.locator('main td').filter({ hasText: 'ZZAUTOTEST PLBV PART A' }).first().click(); await page.waitForTimeout(2500);
await found('Part Status', 'part-status'); await found('Inactive', 'inactive-btn');
await page.keyboard.press('Escape');
await found('Staging Heavy Duty - 9919', 'location-box'); await found('AS', 'avatar');
await go('/parts/part-sales'); await found('New Part Sale', 'new-part-sale');
await go('/administration/roles-permissions'); await found('Create Custom Role', 'create-role');
await go('/parts/parts-catalogue'); await html('main tbody tr:first-child', 'library-row');
await r.browser.close();
