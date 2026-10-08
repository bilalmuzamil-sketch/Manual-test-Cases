import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const R=JSON.parse(fs.readFileSync('ids.json')); const L=[];
const api=(u,m,b)=>s.api(u,m?{method:m,headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify(b||{})}:null);
for(const [k,amt] of [['4',104],['6',106]]){ const je=await api('/api/accounting/journal-entries','POST',{entry_date:`2026-10-0${k}`,memo:`ZZAUTOTEST SV-10903 match target ${k}`,lines:[{account_id:'01a1107a-df5d-73a4-b7c1-540c015c9081',debit_amount:amt,credit_amount:0},{account_id:R.chart,debit_amount:0,credit_amount:amt}]}); R['je'+k]=je.json?.entry?.id; L.push('JE '+k+' '+je.status+' #'+je.json?.entry?.entry_number); }
fs.writeFileSync('ids.json',JSON.stringify(R,null,1));
const box=async t=>{ await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center',inline:'center'}),t); await p.waitForTimeout(200); return p.evaluate(t=>{const e=[...document.querySelectorAll(`[data-test-id="${t}"]`)].map(x=>x.getBoundingClientRect()).filter(q=>q.width>0).pop(); return e?{x:e.x+e.width/2,y:e.y+e.height/2}:null;},t); };
const click=async t=>{ const b=await box(t); if(!b) throw new Error('no '+t); await p.mouse.click(b.x,b.y); await p.waitForTimeout(700); };
await p.goto(s.host.app+'/accounting/banking/transactions',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(4500); await click('card_account_accounting_bank_transactions_'+R.bank); await p.waitForTimeout(2500);
const id=R.rows['4']; await click('button_actions_accounting_bank_transactions_'+id); await click('button_match_menu_accounting_bank_transactions_'+id); await p.waitForTimeout(1500);
L.push('after Match transaction: '+JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id], .q-menu [data-test-id], .q-menu .q-item')].filter(e=>e.getBoundingClientRect().width>0).map(e=>(e.getAttribute('data-test-id')||'')+'|'+(e.innerText||'').replace(/\s+/g,' ').slice(0,60)))));
L.push('dialog text: '+(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog')].map(d=>d.innerText.replace(/\s+/g,' ')).join(' || '))).slice(0,600));
await p.screenshot({path:'W1-match.png'});
console.log(L.join('\n')); await s.close();
