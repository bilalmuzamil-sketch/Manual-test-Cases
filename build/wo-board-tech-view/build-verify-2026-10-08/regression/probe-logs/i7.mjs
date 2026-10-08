import {start,mk,L,menu,notes,B,OUT} from './h.mjs';
const log=L('i7'); const b=await start('/workorders','admin'); const {page}=b; const {dump,esc,body}=mk(page); page.setDefaultTimeout(20000);
const api=(p,opt={})=>page.evaluate(async([p,opt])=>{const tok=localStorage.getItem('token'); const h={'Content-Type':'application/json'}; if(tok) h.Authorization='Bearer '+tok.replace(/"/g,''); const r=await fetch('https://sv10043api.qa.shopview.com/api/'+p,{credentials:'include',headers:h,...opt}); return r.status+' '+(await r.text());},[p,opt]);
try{
 for(const q of ['ZZAUTOTEST','Tech','Admin']){ const r=await api('staff?limit=100&search='+q); const j=JSON.parse(r.slice(4)); const arr=j.data.collection; log(q,'N',arr.length, JSON.stringify(j.data.pagination)); log(q, arr.map(x=>({id:x.id,staff_id:x.staff_id,n:x.first_name+' '+x.last_name,email:x.email,role:x.role_label,active:x.is_active,conf:x.confirmed_invitation_on,clock:x.clockable}))); }
}catch(e){log('ERR',e.message.slice(0,300));}
await b.browser.close();
