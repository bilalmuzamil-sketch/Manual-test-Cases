import {ob} from './lib.mjs'; import fs from 'fs'; import {mk} from './h.mjs';
const X=JSON.parse(fs.readFileSync('ids-repro.json')); const s=await ob({dpr:1,vp:{width:1600,height:1000}}); const p=s.page; const A=mk(s,p);
await A.open(); const id=X.rows['12']; await A.click('button_actions_accounting_bank_transactions_'+id); await A.click('button_match_menu_accounting_bank_transactions_'+id); await p.waitForTimeout(1500);
console.log(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ')).join(' || ').slice(0,700)));
console.log('select for JE:', await p.evaluate(j=>!!document.querySelector(`[data-test-id="button_pick_entry_accounting_bank_match_${j}"]`),X.je12));
await s.close();
