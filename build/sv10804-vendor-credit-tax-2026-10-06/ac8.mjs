import fs from 'fs'; import {ob,j} from './lib.mjs';
const s=await ob(); await s.go('/accounting');
const je=async id=>{const r=await s.api('/api/accounting/journal-entries/'+id); const e=r.json.entry; return {no:e.entry_number, date:(e.entry_date||'').slice(0,10), lines:(e.lines||[]).map(l=>`${l.account_number} ${l.account_name} Dr ${l.debit_amount} Cr ${l.credit_amount}`)};};
const out={bills:{},credits:{}};
const b=await s.api('/api/accounting/vendor-bills?page=1&per_page=25');
for(const x of b.json.vendor_bills.filter(x=>/ZZ10804/.test(x.bill_number))){ const e=await je(x.journal_entry_id); out.bills[x.bill_number]={id:x.id,sub:x.subtotal,tax:x.tax_total,total:x.total,je:e}; console.log('BILL',x.bill_number,x.subtotal,x.tax_total,x.total,'#'+e.no,e.lines.join(' ; '));}
const c=await s.api('/api/accounting/vendor-credits?page=1&per_page=25'); console.log('credits total',c.json.pagination.total, j(c.json.vendor_credits[0],600));
for(const x of c.json.vendor_credits){ const d=await s.api('/api/accounting/vendor-credits/'+x.id); const v=d.json.vendor_credit||d.json; if(!/ZZ10804/.test(JSON.stringify(v))) continue; const e=v.journal_entry_id||v.journal_entry?.id; const E=e?await je(e):null; out.credits[v.memo||v.credit_number]={id:x.id,no:v.credit_number,amount:v.amount,tax:v.tax_total??v.tax,je:E}; console.log('CREDIT',v.credit_number,v.memo,v.amount,'tax',JSON.stringify(v.tax||v.taxes||v.tax_total), E?('#'+E.no+' '+E.lines.join(' ; ')):'no JE');}
fs.writeFileSync('acct-'+Date.now()+'.json',JSON.stringify(out,null,1));
await s.close();
