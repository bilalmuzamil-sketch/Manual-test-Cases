/** probe: how to reach a technician's row on the staging Schedule (magnifier at the top right; scrolling). */
import fs from 'node:fs'; import path from 'node:path';
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
import { EV } from './wob.mts';
const { browser, page: p } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/schedule', key: 'admin' }) as any;
await p.locator('a, .q-item, .q-tab, button').filter({ hasText: /^\s*Schedule\s*$/ }).first().click(); await p.waitForTimeout(8000);
const o: any = {};
o.scrollers = await p.evaluate(`[...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 50 && /(auto|scroll)/.test(getComputedStyle(e).overflowY)).map(e => ({ cls: String(e.className).slice(0, 80), tid: e.getAttribute('data-test-id'), w: Math.round(e.getBoundingClientRect().width), sh: e.scrollHeight, ch: e.clientHeight }))`);
o.docScroll = await p.evaluate(`[document.scrollingElement.scrollHeight, innerHeight]`);
o.topButtons = await p.evaluate(`[...document.querySelectorAll('button')].filter(b => b.getBoundingClientRect().top < 110 && b.getBoundingClientRect().left > 1200).map(b => ({ t: b.innerText.trim().slice(0, 30), aria: b.getAttribute('aria-label'), tid: b.getAttribute('data-test-id'), x: Math.round(b.getBoundingClientRect().left) }))`);
const mag = p.locator('button').filter({ has: p.locator('i, svg') }).and(p.locator(':near(:text("Day"))')).first();
await p.mouse.click(1300, 84); await p.waitForTimeout(1500);
o.afterMag = await p.evaluate(`[...document.querySelectorAll('input')].filter(i => i.getBoundingClientRect().width > 0).map(i => ({ ph: i.placeholder, tid: i.getAttribute('data-test-id'), x: Math.round(i.getBoundingClientRect().left), y: Math.round(i.getBoundingClientRect().top) }))`);
await p.screenshot({ path: path.join(EV, 'sched-probe-mag.png') });
const inp = p.locator('input').filter({ hasNot: p.locator('xx') });
const cand = (o.afterMag as any[]).find((i) => i.y < 120 && i.x > 1000);
if (cand) { await p.mouse.click(cand.x + 20, cand.y + 10); await p.keyboard.type('Esther', { delay: 50 }); await p.waitForTimeout(3000); await p.screenshot({ path: path.join(EV, 'sched-probe-esther.png') });
  o.namesAfter = await p.evaluate(`[...document.querySelectorAll('*')].filter(e => e.children.length === 0 && e.getBoundingClientRect().left < 520 && e.getBoundingClientRect().left > 300 && /^[A-Z][a-z]+ [A-Z]/.test((e.textContent||'').trim())).map(e => e.textContent.trim()).slice(0, 20)`); }
fs.writeFileSync(path.join(EV, 'sched-probe.json'), JSON.stringify(o, null, 1)); console.log(JSON.stringify(o, null, 1)); await browser.close(); process.exit(0);
