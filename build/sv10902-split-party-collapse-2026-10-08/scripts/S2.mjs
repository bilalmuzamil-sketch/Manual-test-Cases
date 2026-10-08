import {ob,j} from './lib.mjs'; import fs from 'fs';
const s=await ob({dpr:1}); const R=JSON.parse(fs.readFileSync('ids.json')); R.bank='01a11ac6-c8e0-739d-a043-5d5296f36981';
const r=await s.ctx.request.post(s.host.api+'/api/accounting/bank-accounts/'+R.bank+'/import',{headers:{accept:'application/json',origin:s.host.app,referer:s.host.app+'/'},multipart:{file:{name:'zz10902.csv',mimeType:'text/csv',buffer:fs.readFileSync('rows.csv')},date_column:'Date',description_column:'Description',amount_mode:'single',amount_column:'Amount',sign_convention:'deposits_positive',date_format:'MM/DD/YYYY'}});
console.log('import',r.status(),(await r.text()).slice(0,400));
const t=await s.api('/api/accounting/bank-transactions?account_id='+R.chart+'&per_page=20'); const rows=t.json.bank_transactions||[]; R.rows=Object.fromEntries(rows.map(x=>[x.description.replace(/^ZZ10902-(\w).*/,'$1'),x.id]));
console.log(rows.length, JSON.stringify(rows[0]||{}).slice(0,1400));
fs.writeFileSync('ids.json',JSON.stringify(R,null,1)); await s.close();
