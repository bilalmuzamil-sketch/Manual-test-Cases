import {ob} from './lib.mjs';
const s=await ob({dpr:1,vp:{width:1600,height:1000}}); const p=s.page;
await p.goto(s.host.app+'/accounting/banking/rules',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(4000);
let b=await s.box('button_new_accounting_bank_rules'); await p.mouse.click(b.x,b.y); await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')+'|'+e.tagName+'|'+(e.innerText||e.value||'').replace(/\s+/g,' ').slice(0,30)))));
await s.close();
