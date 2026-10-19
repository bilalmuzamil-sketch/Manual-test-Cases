/** probe-pill.mts — 19 Oct 2026, read-only: how the status pill and its red/blue count bubbles are built (List and Tech View), for C682440. */
import fs from 'node:fs'; import path from 'node:path';
import { open, done } from './session.mts'; import { api, workOrders } from './data.mts'; import { EV, t, display, tab, search } from './wob.mts';
const { browser, page: p } = await open('/workorders?tab=all'); const a = api(p);
const o: any = { wo: (await workOrders(a, 'S2-33351')).map((w: any) => ({ n: w.number, s: w.status })).slice(0, 3) };
await tab(p, 'All'); await p.locator('[data-test-id="clear_filters"]').click().catch(() => {}); await search(p, 'S2-33351'); await p.waitForTimeout(2500);
const dump = () => p.evaluate(`(() => { const all = [...document.querySelectorAll('*')].filter(e => e.children.length === 0 && /Ready For Review/i.test(e.textContent) && e.getBoundingClientRect().width > 0);
  return all.slice(0, 2).map(e => { let pill = e; for (let i = 0; i < 4 && pill.parentElement; i++) { if (pill.parentElement.innerText.replace(/\\s+/g, '').length <= 22) pill = pill.parentElement; }
    const host = pill.parentElement; return { text: e.textContent, leafTag: e.tagName, leafCls: e.className, pillHtml: (host || pill).outerHTML.slice(0, 1500) }; }); })()`);
await display(p, 'List'); await p.waitForTimeout(2500); o.list = await dump();
await display(p, 'Tech View'); await p.waitForTimeout(3000); o.tech = await dump();
fs.writeFileSync(path.join(EV, 'probe-pill.json'), JSON.stringify(o, null, 1)); console.log(t(), JSON.stringify(o).slice(0, 4000));
await search(p, ''); await done(browser);
