import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:1}); const R=JSON.parse(fs.readFileSync('ids.json'));
const api=(u,m,b)=>s.api(u,m?{method:m,headers:{'content-type':'application/json'},body:JSON.stringify(b||{})}:null);
const tx=async x=>{ for(const tab of ['for_review','categorized','excluded']){ const l=(await api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=20&tab='+tab)).json?.bank_transactions||[]; const f=l.find(t=>t.id===R.rows[x]); if(f) return f; } };
// E: split again after the clear (second save)
let e=await tx('E'); let r=await api(`/api/accounting/bank-transactions/${e.id}/splits`,'POST',{mutation_version:e.mutation_version,splits:[{account_id:'01a1107a-df57-739d-b551-d93b26c87f4e',amount:'60.00'},{account_id:'01a1107a-df5d-73a4-b7c1-540c015c9081',amount:'40.00'}]});
e=await tx('E'); console.log('E re-split',r.status,JSON.stringify(e.splits.map(x=>x.party?.name||null)));
for(const x of ['A','B']){ const t=await tx(x); const p=await api(`/api/accounting/bank-transactions/${t.id}/post`,'POST',{mutation_version:t.mutation_version}); const t2=await tx(x)||{}; console.log('post',x,p.status,(p.json?JSON.stringify(p.json).slice(0,200):p.text?.slice(0,200)),'je',t2.journal_entry_id,t2.journal_entry_number);
  R['je'+x]=t2.journal_entry_id; if(t2.journal_entry_id){ const je=await api('/api/accounting/journal-entries/'+t2.journal_entry_id); console.log('JE',x,je.status,JSON.stringify(je.json).replace(/"(created|updated)_at":"[^"]*",?/g,'').slice(0,1200)); } }
fs.writeFileSync('ids.json',JSON.stringify(R,null,1)); await s.close();
