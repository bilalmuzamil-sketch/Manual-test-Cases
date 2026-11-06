// open inspection page directly, dump test-ids, click first field body, dump again (to find answer buttons)
import {sess} from './common.mjs';
const s=await sess(); const p=s.page; await s.go('/inspections/'+process.env.INS); await p.waitForTimeout(8000);
const ids=async()=>p.evaluate(()=>{const m={}; for(const e of document.querySelectorAll('[data-test-id]')){const k=e.getAttribute('data-test-id').replace(/[0-9a-f-]{36}/g,'<id>'); m[k]=(m[k]||0)+1;} return m;});
console.log('A',JSON.stringify(await ids()));
const f=p.locator('[data-test-id^="field_collapsed_"]').first(); if(await f.count()){ await f.click(); await p.waitForTimeout(1500); console.log('B',JSON.stringify(await ids())); }
const btns=await p.evaluate(()=>[...document.querySelectorAll('main button, [data-test-id="inspection_page"] button')].slice(0,40).map(b=>(b.getAttribute('data-test-id')||'-')+':'+b.innerText.replace(/\s+/g,' ').slice(0,20)));
console.log('btns',JSON.stringify(btns)); await p.screenshot({path:'../ev/prod-disc.png'}); await s.close(); process.exit(0);
