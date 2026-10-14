/** 14 Oct 2026 staging, C96965 steps 8-12 on the SCREEN: Schedule (top menu) > the arrow next to Today > read every shift on
 *  WO-1/WO-2 tomorrow and WO-3 the day after, in each technician's row. The staff list is virtual and ~200 long, so the rows
 *  pane is scrolled until the name is drawn. WO numbers from stg6.json (C96965.numbers). */
import fs from 'node:fs'; import path from 'node:path';
import { bootOrigin } from '../../testing-tools/qa-branch-boot.mjs';
import { EV } from './wob.mts';
const R = JSON.parse(fs.readFileSync(path.join(EV, 'stg6.json'), 'utf8')); const nums: string[] = R.C96965.numbers.map((x: string) => x.split(' ')[1]);
const { browser, page: p, APP } = await bootOrigin({ app: 'https://app.staging.shopview.com', apiHost: 'api.staging.shopview.com', ssoFile: '/tmp/qa-cookies/staging-sso.txt', label: 'staging', route: '/schedule', key: 'admin' }) as any;
await p.locator('a, .q-item, .q-tab, button').filter({ hasText: /^\s*Schedule\s*$/ }).first().click(); await p.waitForTimeout(8000);
const fwd = async () => { const ok = await p.evaluate(`(() => { const vis = (e) => e.getBoundingClientRect().width > 0; const today = [...document.querySelectorAll('button')].find(b => vis(b) && b.innerText.trim() === 'Today'); const tr = today.getBoundingClientRect();
  const near = [...document.querySelectorAll('button')].filter(b => vis(b) && b !== today && Math.abs(b.getBoundingClientRect().top - tr.top) < 20 && b.getBoundingClientRect().left > tr.left && b.getBoundingClientRect().left < tr.right + 200).sort((x, y) => x.getBoundingClientRect().left - y.getBoundingClientRect().left); near[1].click(); return 'ok'; })()`); await p.waitForTimeout(6000); return ok; };
const date = () => p.evaluate(`([...document.querySelectorAll('*')].find(e => e.children.length === 0 && /^(Mon|Tue|Wed|Thu|Fri|Sat|Sun), [A-Z][a-z]{2} \\d{1,2}$/.test((e.textContent || '').trim()) && e.getBoundingClientRect().width > 0) || {}).textContent || null`);
async function row(who: string, tag: string) {
  await p.evaluate(`(() => { const s = [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 50 && /(auto|scroll)/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().width > 600).sort((a, b) => b.scrollHeight - a.scrollHeight)[0]; if (s) s.scrollTop = 0; })()`); await p.waitForTimeout(800);
  let found = false;
  for (let i = 0; i < 400 && !found; i++) {
    found = await p.evaluate(`(() => { const nm = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && (e.textContent || '').trim() === ${JSON.stringify(who)} && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().left < 520); if (nm) { nm.scrollIntoView({ block: 'center' }); return true; }
      const s = [...document.querySelectorAll('*')].filter(e => e.scrollHeight > e.clientHeight + 50 && /(auto|scroll)/.test(getComputedStyle(e).overflowY) && e.getBoundingClientRect().width > 600).sort((a, b) => b.scrollHeight - a.scrollHeight)[0]; if (!s) return false; s.scrollTop += 500; return false; })()`);
    await p.waitForTimeout(found ? 1500 : 250);
  }
  if (!found) return { who, found };
  const r = await p.evaluate(`(() => { const nm = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && (e.textContent || '').trim() === ${JSON.stringify(who)} && e.getBoundingClientRect().width > 0 && e.getBoundingClientRect().left < 520);
    let rowEl = nm; while (rowEl && rowEl.getBoundingClientRect().height < 50) rowEl = rowEl.parentElement; const rb = (rowEl || nm).getBoundingClientRect(); const top = rb.top, bot = rb.bottom;
    const out = []; for (const e of document.querySelectorAll('*')) { const b = e.getBoundingClientRect(); if (b.left < 520 || b.width <= 0 || b.top < top - 2 || b.bottom > bot + 2) continue; const t = (e.innerText || '').replace(/\\s+/g, ' ').trim(); if (/[A-Z]+\\d*-\\d+/.test(t) && t.length < 250 && ![...e.children].some(c => /[A-Z]+\\d*-\\d+/.test(c.innerText || ''))) out.push(t); }
    return { top: Math.round(top), bottom: Math.round(bot), blocks: [...new Set(out)] }; })()`);
  await p.screenshot({ path: path.join(EV, `C96965-${tag}-${who.replace(' ', '')}.png`), clip: { x: 0, y: Math.max(0, Math.min(r.top - 150, 700)), width: 1600, height: 300 } }).catch(() => {});
  return { who, found, ...r };
}
const o: any = { numbers: R.C96965.numbers };
o.step9 = { arrow: await fwd(), date: await date() };
o.step10 = [await row('Esther Howard', 'step10'), await row('Dana Ortiz', 'step10'), await row('Ralph Edwards', 'step10')];
o.step11 = { arrow: await fwd(), date: await date() };
o.step12 = [await row('Esther Howard', 'step12')];
R.C96965.schedule = o; fs.writeFileSync(path.join(EV, 'stg6.json'), JSON.stringify(R, null, 1));
console.log(JSON.stringify(o, null, 1)); await browser.close(); process.exit(0);
