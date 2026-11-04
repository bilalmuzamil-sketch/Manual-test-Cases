import {sess} from './common.mjs'; import fs from 'fs';
const W=JSON.parse(fs.readFileSync(process.env.WOJ,'utf8'));
const s=await sess(); const p=s.page; await s.go(`/workorders/${W.wo}/lines`); await p.waitForTimeout(6000);
await p.locator('[data-test-id="line_title"]').first().click({button:'right'}); await p.waitForTimeout(1000);
await p.click(`[data-test-id="menu-item_request_part_${W.line}"]`); await p.waitForTimeout(3000);
const js=await p.evaluate(()=>performance.getEntriesByType('resource').map(e=>e.name).filter(n=>/\.js(\?|$)/.test(n)&&!/maps|sentry|intercom|google/.test(n)));
fs.writeFileSync(`/tmp/sv12039/js-${process.env.ENV||'branch'}.txt`,js.join('\n')); console.log(js.length);
await s.close(); process.exit(0);
