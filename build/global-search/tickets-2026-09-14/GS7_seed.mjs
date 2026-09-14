// RE-SEEDABLE Global Search test data for sv9160.
// The 14 Sep branch rebuild destroyed the seed and the previous session had recorded only its IDs,
// never a script -- so this exists. Idempotent: each record is looked up by its ZZAUTOTEST marker
// and only created if absent, making a post-reset run a replay rather than a rebuild.
// Records are created THROUGH THE SCREEN (the API's /api/companies is GET-only -- guessing a POST
// route wasted a pass), and the write each form makes is logged so the routes are captured too.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const STATE=`${DIR}/GS7-seed-state.json`;
const APP='https://sv9160.qa.shopview.com', API='sv9160api.qa.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const S=fs.existsSync(STATE)?JSON.parse(fs.readFileSync(STATE,'utf8')):{};
S.at=S.at||new Date().toISOString(); S.ids=S.ids||{}; S.routes=S.routes||[]; S.notes=S.notes||[];
const save=()=>fs.writeFileSync(STATE, JSON.stringify(S,null,1));
const { browser, page } = await boot('sv9160','/','admin');
page.on('request', r=>{const u=r.url(); if(/sv9160api/.test(u)&&r.method()!=='GET'){
  const e=`${r.method()} ${u.split('sv9160api.qa.shopview.com')[1]}`;
  if(!S.routes.includes(e)) S.routes.push(e);}});
const req=(m,p)=>page.evaluate(async({a,m,p})=>{const r=await fetch(`https://${a}${p}`,{method:m,credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:API,m,p});
const rows=(o)=>{const pick=x=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(x&&x[k]))return x[k];}
  if(Array.isArray(x))return x; for(const k of Object.keys(x||{})){const v=pick(x[k]); if(v&&v.length)return v;} return [];};return pick(o);};
const findCompany=async(name)=>{ for(let p=1;p<=20;p++){
  const r=await req('GET',`/api/companies?limit=100&pagination%5Bpage%5D=${p}&pagination%5BrowsPerPage%5D=100`);
  const rs=rows(r.j); if(!rs.length) return null;
  const hit=rs.find(x=>String(x.name||x.company_name||'').trim().toLowerCase()===name.toLowerCase());
  if(hit) return hit; } return null;};
const fill=async(tid,val)=>page.evaluate(({t,v})=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop()||document;
  const el=d.querySelector(`[data-test-id="${t}"]`); if(!el) return false;
  const inp=el.tagName==='INPUT'||el.tagName==='TEXTAREA'?el:el.querySelector('input,textarea');
  if(!inp) return false;
  const proto=inp.tagName==='TEXTAREA'?window.HTMLTextAreaElement.prototype:window.HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto,'value').set.call(inp,v);
  inp.dispatchEvent(new Event('input',{bubbles:true})); inp.dispatchEvent(new Event('change',{bubbles:true}));
  return true;},{t:tid,v:val});

const CUSTNAME='ZZAUTOTEST Bridgeport Hauling';
let cust=await findCompany(CUSTNAME);
if(cust){ L('customer already present -> %s', cust.id); S.ids.customer=cust.id; }
else {
  await page.goto(`${APP}/customers`,{waitUntil:'domcontentloaded',timeout:60000}).catch(()=>{});
  await page.waitForTimeout(8000);
  await page.evaluate(()=>{const b=document.querySelector('[data-test-id="button_new_customer"]'); b&&b.click();});
  await page.waitForTimeout(4000);
  const f=[['input_customer_name',CUSTNAME],['input_customer_postal_code','44872-9931'],
           ['input_customer_website','bridgeporthauling-zzt.com'],['input_customer_city','Fernvale'],
           ['input_customer_address_1','1450 Kestrelway Industrial']];
  for(const [t,v] of f) L('   fill %s -> %s', t, await fill(t,v));
  await page.waitForTimeout(1200);
  const btns=await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop();
    return d?[...d.querySelectorAll('button')].filter(vis).map(b=>(b.innerText||'').trim()).filter(Boolean):[];});
  L('   dialog buttons: %s', JSON.stringify(btns));
  await page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const d=[...document.querySelectorAll('.q-dialog,[role=dialog]')].filter(vis).pop(); if(!d) return;
    const b=[...d.querySelectorAll('button')].filter(vis).find(x=>/^(save|create|add|save & close)$/i.test((x.innerText||'').trim()));
    b&&b.click();});
  await page.waitForTimeout(12000);
  cust=await findCompany(CUSTNAME);
  if(cust){ S.ids.customer=cust.id; L('customer CREATED -> %s', cust.id); }
  else { S.notes.push('customer not created via the New customer form'); L('customer NOT created'); }
}
save();
L('ids: %s', JSON.stringify(S.ids));
L('write routes observed: %s', JSON.stringify(S.routes));
await browser.close();
