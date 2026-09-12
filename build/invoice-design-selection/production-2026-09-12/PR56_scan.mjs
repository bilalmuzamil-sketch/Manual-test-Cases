// PRODUCTION -- C53537 material hunt. A work order must pass a foreman/manager REVIEW before it can
// be invoiced, so Approved ones cannot simply be pushed through. Find customers that already have
// two work orders sitting at Complete / Ready for Review, or two unpaid invoices already.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), byStatus:{}, byCustomer:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR56.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const wos=rowsOf((await call('/api/work-orders?limit=300')).j);
for(const w of wos){ const s=String(w.status||'?'); R.byStatus[s]=(R.byStatus[s]||0)+1; }
L('statuses: %s', JSON.stringify(R.byStatus));
const ready=wos.filter(w=>/^(complete|ready_for_review)$/i.test(String(w.status||'')));
L('complete / ready-for-review: %d', ready.length);
for(const w of ready){
  const d=await call(`/api/work-orders/view/${w.id}`); let x=(d.j&&(d.j.data||d.j))||{}; if(x.work_order) x=x.work_order;
  const cid=x.company_id||x.customer_id||'?';
  (R.byCustomer[cid]=R.byCustomer[cid]||[]).push({n:w.number, id:w.id, st:x.status, total:x.total||x.grand_total||null});
}
const pairs=Object.entries(R.byCustomer).filter(([,v])=>v.length>=2);
L('customers with TWO OR MORE ready work orders: %s', JSON.stringify(pairs.map(([c,v])=>({c:c.slice(0,8), n:v.length, wos:v.map(x=>`${x.n}/${x.st}`)}))));
R.pairs=pairs.map(([c,v])=>({customer:c, wos:v}));
save(); await browser.close();
