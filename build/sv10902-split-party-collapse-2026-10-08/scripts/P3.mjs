import {op,j} from './lib.mjs'; import fs from 'fs';
const s=await op({dpr:2,vp:{width:1600,height:1000}}); const p=s.page; const R={};
const api=(u,m,b)=>s.api(u,m?{method:m,headers:{'content-type':'application/json',accept:'application/json'},body:JSON.stringify(b||{})}:null);
const sv=()=>fs.writeFileSync('prod-ids.json',JSON.stringify(R,null,1));
const P={}; for(const n of ['Acme','Bob','Carol']){ const r=await api('/api/accounting/customers','POST',{name:'ZZAUTOTEST SV-10902 '+n}); P[n]={type:'customer',id:r.json?.customer?.id||r.json?.data?.id}; console.log('customer',n,r.status,P[n].id||JSON.stringify(r.json).slice(0,200)); }
R.P=P; sv();
const a=await api('/api/accounting/accounts','POST',{account_number:'1095',name:'ZZAUTOTEST SV-10902 bank',type:'asset',sub_type:'bank'}); R.chart=a.json?.account?.id; console.log('chart',a.status);
const b=await api('/api/accounting/bank-accounts','POST',{account_type:'checking',account_id:R.chart,institution_name:'ZZ Test Bank',nickname:'ZZAUTOTEST SV-10902 bank',mask:'0902'}); R.bank=b.json?.bank_account?.id; console.log('bank',b.status); sv();
await p.goto(s.host.app+'/accounting/banking/transactions',{waitUntil:'domcontentloaded'}); await p.waitForTimeout(5000);
const menu='button_card_menu_accounting_bank_transactions_'+R.bank; await p.evaluate(t=>document.querySelector(`[data-test-id="${t}"]`)?.scrollIntoView({block:'center',inline:'center'}),menu); await p.waitForTimeout(500); let bx=await s.box(menu); await p.mouse.click(bx.x,bx.y); await p.waitForTimeout(1000);
bx=await s.box('button_card_import_accounting_bank_transactions_'+R.bank); await p.mouse.click(bx.x,bx.y); await p.waitForTimeout(2000);
await p.setInputFiles('input[type=file]','rows-prod.csv'); await p.waitForTimeout(800);
const ib=await p.evaluate(()=>{const e=[...document.querySelectorAll('.q-dialog button')].find(x=>x.innerText.trim()==='Import'); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2};}); await p.mouse.click(ib.x,ib.y); await p.waitForTimeout(5000);
console.log('import notif',await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ')).join('|')));
const list=async()=>(await api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=20')).json.bank_transactions;
R.rows=Object.fromEntries((await list()).map(t=>[t.description.slice(8,9),t.id])); sv(); console.log('rows',JSON.stringify(R.rows));
const get=async x=>(await list()).find(t=>t.id===R.rows[x]);
const CAT={supplies:'01a0d358-a29b-7250-9b62-975fbbf439ca',ins:'01a0d358-a2d5-73de-a98a-ec1daef96910',wages:'01a0d358-a2b2-7335-a4ab-31322e869df4',stx:'01a0d358-a2db-7120-8feb-4ac07838d421'};
const partyRule=async(x,who)=>{ const r=await api('/api/accounting/bank-transaction-rules','POST',{name:`ZZAUTOTEST SV-10902 ${x} set ${who}`,priority:100,match_mode:'contains',match_pattern:`ZZ10902-${x} `,is_active:true,auto_add:false,party_action:'set',set_party:P[who]}); const id=r.json?.bank_transaction_rule?.id; const ap=await api(`/api/accounting/bank-transaction-rules/${id}/apply`,'POST'); const d=await api(`/api/accounting/bank-transaction-rules/${id}`,'DELETE'); return `rule ${r.status} apply ${ap.status} ${JSON.stringify(ap.json?.result||ap.json).slice(0,100)} del ${d.status}`; };
const split=async(x,lines)=>{ const t=await get(x); const r=await api(`/api/accounting/bank-transactions/${t.id}/splits`,'POST',{mutation_version:t.mutation_version,splits:lines}); return 'splits '+r.status+(r.status>299?JSON.stringify(r.json).slice(0,200):''); };
const two=[{account_id:CAT.supplies,amount:'60.00'},{account_id:CAT.ins,amount:'40.00'}];
console.log('A',await partyRule('A','Acme')); console.log('A',await split('A',two)); console.log('A',await partyRule('A','Bob'));
{ const t=await get('A'); console.log('A',await split('A',[{id:t.splits[0].id,account_id:CAT.supplies,amount:'50.00'},{id:t.splits[1].id,account_id:CAT.ins,amount:'30.00'},{account_id:CAT.wages,amount:'20.00'}])); }
console.log('B',await partyRule('B','Acme')); console.log('B',await split('B',two)); console.log('B',await partyRule('B','Bob'));
for(const x of 'AB'){ const t=await get(x); console.log('STATE',x,JSON.stringify({party:t.party?.name||null,splits:t.splits.map(sp=>sp.party?.name||null)})); }
const cr=await api('/api/accounting/bank-transaction-rules','POST',{name:'ZZAUTOTEST SV-10902 category only',priority:100,match_mode:'contains',match_pattern:'ZZ10902-',is_active:true,auto_add:false,party_action:'none',set_category_account_id:CAT.stx}); R.catRule=cr.json?.bank_transaction_rule?.id; console.log('cat rule',cr.status); sv();
await s.close();
