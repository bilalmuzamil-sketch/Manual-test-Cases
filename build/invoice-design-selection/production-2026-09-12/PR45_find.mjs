// PRODUCTION -- C53570 precondition, take 3. Contacts are embedded in /api/customers/view/{id}
// (the Contacts tab makes no separate call). Find an un-invoiced work order whose customer has
// at least one contact, so the Authorizer dropdown has something to offer.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), usable:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR45.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const contactsOf=(x)=>{for(const k of ['contacts','company_contacts','customerContacts']){ if(Array.isArray(x[k])) return x[k]; }
  return null;};
const wos=rowsOf((await call('/api/work-orders?limit=300')).j);
const open=wos.filter(w=>/estimate|approved|in_progress|complete|ready/i.test(String(w.status||'')));
L('open work orders %d', open.length);
const seen=new Map();
for(const w of open){
  if(R.usable.length>=5) break;
  const d=await call(`/api/work-orders/view/${w.id}`); let x=(d.j&&(d.j.data||d.j))||{}; if(x.work_order) x=x.work_order;
  const cid=x.company_id||x.customer_id; if(!cid) continue;
  if(!seen.has(cid)){
    const c=await call(`/api/customers/view/${cid}`);
    let y=(c.j&&(c.j.data||c.j))||{}; if(Array.isArray(y)) y=y[0]||{};
    const ct=contactsOf(y);
    seen.set(cid,{name:y.name||y.company_name, keys:ct?null:Object.keys(y).filter(k=>/contact/i.test(k)), n:ct?ct.length:0,
      sample:ct?ct.slice(0,3).map(z=>z.full_name||`${z.first_name||''} ${z.last_name||''}`.trim()):null});
  }
  const info=seen.get(cid);
  if(info.n>0) R.usable.push({wo:w.number, id:w.id, st:x.status, customer:info.name, contacts:info.n, names:info.sample});
}
R.customersChecked=[...seen.entries()].slice(0,14).map(([id,v])=>({id:id.slice(0,8), name:v.name, contacts:v.n, contactKeys:v.keys}));
L('customers checked: %s', JSON.stringify(R.customersChecked));
L('USABLE: %s', JSON.stringify(R.usable));
save(); await browser.close();
