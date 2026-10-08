import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const R=JSON.parse(fs.readFileSync('ids.json'));
// E: user clears its splits (what the split editor sends when every line is removed)
const tx=async x=>(await s.api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=20')).json.bank_transactions.find(t=>t.id===R.rows[x]);
let e=await tx('E'); const c=await s.api(`/api/accounting/bank-transactions/${e.id}/splits`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({mutation_version:e.mutation_version,splits:[]})}); console.log('E clear',c.status);
// category-only rule
const r=await s.api('/api/accounting/bank-transaction-rules',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:'ZZAUTOTEST SV-10902 category only',priority:100,match_mode:'contains',match_pattern:'ZZ10902-',is_active:true,auto_add:false,party_action:'none',set_category_account_id:'01a1107a-df5f-71ad-9796-fac248918631'})});
R.catRule=r.json?.bank_transaction_rule?.id; console.log('cat rule',r.status,R.catRule); fs.writeFileSync('ids.json',JSON.stringify(R,null,1));
await p.goto(s.host.app+'/accounting/banking/transactions',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(4000);
const card='card_account_accounting_bank_transactions_'+R.bank; await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center',inline:'center'}),card); await p.waitForTimeout(500); let b=await s.box(card); await p.mouse.click(b.x,b.y); await p.waitForTimeout(3000);
await p.screenshot({path:'U1-list-before.png',fullPage:true});
console.log('rows',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('tbody tr')].map(tr=>tr.innerText.replace(/\s+/g,' ').trim()).slice(0,10))));
console.log('row tids',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('tbody tr [data-test-id]')].slice(0,12).map(e=>e.getAttribute('data-test-id')))));
await p.goto(s.host.app+'/accounting/banking/rules',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(4000); console.log('rules url',p.url());
console.log('rules tids',JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('[data-test-id]')].map(e=>e.getAttribute('data-test-id')).filter(t=>/rule/i.test(t)).slice(0,30))));
await p.screenshot({path:'U1-rules.png'});
await s.close();
