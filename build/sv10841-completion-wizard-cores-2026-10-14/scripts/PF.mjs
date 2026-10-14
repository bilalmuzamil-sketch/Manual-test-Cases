import {op,J} from './lib.mjs'; import {loc} from './seed.mjs'; import {toCores,dlgButtons} from './wiz.mjs'; import fs from 'fs';
const A=JSON.parse(fs.readFileSync('PR1.json')); const s=await op(); const p=s.page; await loc(s);
await toCores(s,A); const b=await dlgButtons(p); const no=b.find(x=>x.startsWith('button_resolve_core_not_ok_')).split('|')[0];
await p.locator(`[data-test-id="${no}"]`).click(); await p.waitForTimeout(900);
console.log('dlg',J(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].pop()?.innerText.replace(/\s+/g,' ').slice(0,700)),800));
await p.screenshot({path:'ev/PR1-decided.png'});
const n=s.writes.length; await p.locator('[data-test-id="button_complete_work_order"]').click(); await p.waitForTimeout(4000);
console.log('writes',J(s.writes.slice(n).filter(w=>!/sentry|recent-entities/.test(w)),900));
await s.close();
