/** 14 Oct 2026 staging, C96965 steps 8-12 on the SCREEN, second route: Schedule > arrow next to Today > "Search schedule..."
 *  (magnifier, input_schedule_search) with each work order number > read every shift block drawn and the row it sits in. */
import fs from 'node:fs'; import path from 'node:path';
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
import { EV } from './wob.mts';
const R = JSON.parse(fs.readFileSync(path.join(EV, 'stg6.json'), 'utf8')); const nums: string[] = R.C96965.numbers.map((x: string) => x.split(' ')[1]);
const { browser, page: p } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/schedule', key: 'admin' }) as any;
await p.locator('a, .q-item, .q-tab, button').filter({ hasText: /^\s*Schedule\s*$/ }).first().click(); await p.waitForTimeout(8000);
const fwd = async () => { await p.evaluate(`(() => { const vis = (e) => e.getBoundingClientRect().width > 0; const today = [...document.querySelectorAll('button')].find(b => vis(b) && b.innerText.trim() === 'Today'); const tr = today.getBoundingClientRect();
  const near = [...document.querySelectorAll('button')].filter(b => vis(b) && b !== today && Math.abs(b.getBoundingClientRect().top - tr.top) < 20 && b.getBoundingClientRect().left > tr.left && b.getBoundingClientRect().left < tr.right + 200).sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left); near[1].click(); })()`); await p.waitForTimeout(6000); };
const date = () => p.evaluate(`([...document.querySelectorAll('*')].find(e => e.children.length === 0 && /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), [A-Z][a-z]{2} \\d{1,2}$/.test((e.textContent || '').trim()) && e.getBoundingClientRect().width > 0) || {}).textContent || null`);
async function look(num: string, tag: string) {
  if (!(await p.locator('[data-test-id="input_schedule_search"]').isVisible().catch(() => false))) { await p.locator('button').filter({ hasText: /^\s*search\s*$/ }).last().click().catch(() => p.mouse.click(1300, 84)); await p.waitForTimeout(1000); }
  const s = p.locator('[data-test-id="input_schedule_search"]'); await s.fill(''); await s.fill(num); await p.waitForTimeout(4000);
  const r = await p.evaluate(`(() => { const out = []; for (const ev of document.querySelectorAll('.fc-event, [class*="shift"], [data-test-id*="shift"]')) { const b = ev.getBoundingClientRect(); if (b.width <= 0 || b.left < 300) continue; const t = (ev.innerText || '').replace(/\\s+/g, ' ').trim(); if (!t) continue;
      const y = b.top + b.height / 2; const lane = [...document.querySelectorAll('.fc-datagrid-cell, [class*="resource"]')].find(c => { const cb = c.getBoundingClientRect(); return cb.left < 520 && cb.width > 0 && cb.top <= y && cb.bottom >= y && (c.innerText || '').trim(); });
      out.push({ text: t.slice(0, 160), row: lane ? lane.innerText.replace(/\\s+/g, ' ').trim().slice(0, 60) : null, x: Math.round(b.left), w: Math.round(b.width) }); }
    const seen = new Set(); return out.filter(o => { const k = o.text + o.row; if (seen.has(k)) return false; seen.add(k); return true; }); })()`);
  // open each drawn shift and read its details (who, when, which lines) — the screen's own answer to "whose shift is this"
  const evs = p.locator('.fc-event'); const n = await evs.count(); const details: any[] = [];
  for (let i = 0; i < n; i++) { const e = evs.nth(i); if (!(await e.isVisible().catch(() => false))) continue; await e.scrollIntoViewIfNeeded().catch(() => {}); await e.click().catch(() => {}); await p.waitForTimeout(2500);
    const pop = await p.evaluate(`(() => { const d = [...document.querySelectorAll('.q-dialog, .q-menu, .q-card, [role=dialog]')].filter(x => x.getBoundingClientRect().width > 0).pop(); return d ? d.innerText.replace(/\\s+/g, ' ').trim().slice(0, 600) : null; })()`);
    details.push({ block: (await e.innerText().catch(() => '')).replace(/\s+/g, ' '), pop }); await p.screenshot({ path: path.join(EV, `C96965-${tag}-${num}-shift${i + 1}.png`) });
    await p.keyboard.press('Escape'); await p.waitForTimeout(1200); }
  r.push({ details });
  const first = await p.locator('.fc-event').first().boundingBox().catch(() => null);
  if (first) await p.evaluate(`document.querySelector('.fc-event')?.scrollIntoView({ block: 'center' })`);
  await p.waitForTimeout(800); await p.screenshot({ path: path.join(EV, `C96965-${tag}-${num}.png`) });
  return { num, shifts: r };
}
const o: any = { numbers: R.C96965.numbers };
await fwd(); o.step9 = { date: await date() };
o.step10 = [await look(nums[0], 'step10'), await look(nums[1], 'step10')];
await p.locator('[data-test-id="input_schedule_search"]').fill(''); await p.waitForTimeout(1500);
await fwd(); o.step11 = { date: await date() };
o.step12 = [await look(nums[2], 'step12')];
R.C96965.schedule = o; fs.writeFileSync(path.join(EV, 'stg6.json'), JSON.stringify(R, null, 1));
console.log(JSON.stringify(o, null, 1)); await browser.close(); process.exit(0);
