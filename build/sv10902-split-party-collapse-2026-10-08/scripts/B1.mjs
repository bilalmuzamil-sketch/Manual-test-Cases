import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const R=JSON.parse(fs.readFileSync('ids.json'));
const api=(u,m,b)=>s.api(u,m?{method:m,headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify(b||{})}:null);
const P={}; for(const n of ['Acme','Bob','Carol']){ const r=await api('/api/accounting/customers','POST',{name:'ZZ '+n}); P[n]={type:'customer',id:r.json?.customer?.id}; console.log('customer',n,r.status); } R.P=P;
await p.goto(s.host.app+'/accounting/banking/transactions',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(5000);
const menu='button_card_menu_accounting_bank_transactions_'+R.bank; await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center',inline:'center'}),menu); await p.waitForTimeout(500); let bx=await s.box(menu); await p.mouse.click(bx.x,bx.y); await p.waitForTimeout(1000);
bx=await s.box('button_card_import_accounting_bank_transactions_'+R.bank); await p.mouse.click(bx.x,bx.y); await p.waitForTimeout(2000);
await p.setInputFiles('input[type=file]','rows-gh.csv'); await p.waitForTimeout(800);
const ib=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-dialog button')].find(x=>x.innerText.trim()==='Import'); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}); await p.mouse.click(ib.x,ib.y); await p.waitForTimeout(5000);
const list=async()=>(await api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=30')).json.bank_transactions;
for(const t of await list()){ const k=t.description.slice(8,9); if('GH'.includes(k)) R.rows[k]=t.id; } fs.writeFileSync('ids.json',JSON.stringify(R,null,1)); console.log('rows',R.rows.G,R.rows.H);
const get=async x=>(await list()).find(t=>t.id===R.rows[x]);
const CAT={supplies:'01a1107a-df57-739d-b551-d93b26c87f4e',ins:'01a1107a-df5d-73a4-b7c1-540c015c9081',wages:'01a1107a-df59-7379-88d9-f25ebaf5929d'};
const partyRule=async(x,who)=>{ const r=await api('/api/accounting/bank-transaction-rules','POST',{name:`ZZAUTOTEST SV-10902 ${x} set ${who}`,priority:100,match_mode:'contains',match_pattern:`ZZ10902-${x} `,is_active:true,auto_add:false,party_action:'set',set_party:P[who]}); const id=r.json?.bank_transaction_rule?.id; const ap=await api(`/api/accounting/bank-transaction-rules/${id}/apply`,'POST'); await api(`/api/accounting/bank-transaction-rules/${id}`,'DELETE'); return `rule ${r.status} apply ${ap.status} ${ap.json?.result?.applied}`; };
const split=async(x,lines)=>{ const t=await get(x); const r=await api(`/api/accounting/bank-transactions/${t.id}/splits`,'POST',{mutation_version:t.mutation_version,splits:lines}); return 'splits '+r.status; };
const two=[{account_id:CAT.supplies,amount:'60.00'},{account_id:CAT.ins,amount:'40.00'}];
console.log('G',await partyRule('G','Acme')); console.log('G',await split('G',two)); console.log('G',await partyRule('G','Bob'));
{ const t=await get('G'); console.log('G',await split('G',[{id:t.splits[0].id,account_id:CAT.supplies,amount:'50.00'},{id:t.splits[1].id,account_id:CAT.ins,amount:'30.00'},{account_id:CAT.wages,amount:'20.00'}])); }
console.log('H',await partyRule('H','Acme')); console.log('H',await split('H',two)); console.log('H',await partyRule('H','Bob'));
for(const x of 'GH'){ const t=await get(x); console.log('STATE',x,JSON.stringify(t.splits.map(sp=>sp.party?.name||null))); }
await s.close();
