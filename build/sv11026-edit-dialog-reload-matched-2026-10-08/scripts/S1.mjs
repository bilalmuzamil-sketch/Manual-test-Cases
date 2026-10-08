import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:1,vp:{width:1600,height:1000}}); const p=s.page; const O=JSON.parse(fs.readFileSync('/tmp/qa10903/ids.json')); const R={chart:O.chart,bank:O.bank};
const api=(u,m,b)=>s.api(u,m?{method:m,headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify(b||{})}:null);
await p.goto(s.host.app+'/accounting/banking/transactions',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(5000);
const box=async t=>{ await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center',inline:'center'}),t); await p.waitForTimeout(300); return s.box(t); };
let bx=await box('button_card_menu_accounting_bank_transactions_'+R.bank); await p.mouse.click(bx.x,bx.y); await p.waitForTimeout(900);
bx=await box('button_card_import_accounting_bank_transactions_'+R.bank); await p.mouse.click(bx.x,bx.y); await p.waitForTimeout(1500);
await p.setInputFiles('input[type=file]','rows.csv'); await p.waitForTimeout(600);
const ib=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-dialog button')].find(x=>x.innerText.trim()==='Import'); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}); await p.mouse.click(ib.x,ib.y); await p.waitForTimeout(4000);
console.log('import',await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')).join('|')));
const rows=(await api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=50')).json.bank_transactions.filter(t=>t.description.startsWith('ZZ11026'));
R.rows=Object.fromEntries(rows.map(t=>[t.description.match(/ZZ11026-(\d+)/)[1],t.id]));
for(const k of ['7','8','9']){ const amt=200+Number(k); const je=await api('/api/accounting/journal-entries','POST',{entry_date:`2026-10-0${1+(Number(k)%8)}`,memo:`ZZAUTOTEST SV-11026 match target ${k}`,lines:[{account_id:'01a1107a-df5d-73a4-b7c1-540c015c9081',debit_amount:amt,credit_amount:0},{account_id:R.chart,debit_amount:0,credit_amount:amt}]}); R['je'+k]=je.json?.entry?.id; console.log('JE',k,je.status,'#'+je.json?.entry?.entry_number); }
console.log(JSON.stringify(rows.map(t=>[t.description,t.amount,t.status,t.mutation_version])));
fs.writeFileSync('ids.json',JSON.stringify(R,null,1));
await s.close();
