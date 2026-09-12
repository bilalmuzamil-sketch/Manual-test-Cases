// PRODUCTION -- C53570. Find the Authorizer control on a work order, set it, invoice under Legacy,
// and check: (a) does the value print on the Legacy document, (b) is it still on the work order
// afterwards, (c) is it locked once invoiced, (d) does a Modern document print it at all.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53570', steps:{}, drift:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR41.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.location=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="profile_menu_button"]');
  return b?(b.textContent||'').replace(/\s+/g,' ').trim().slice(0,20):null;});
L('build %s location %s', R.build, R.location);
// find a work order that is NOT yet invoiced so the Authorizer is still editable
const wos=rowsOf((await call('/api/work-orders?limit=300')).j);
const open=wos.filter(w=>/estimate|approved|in_progress|complete|ready/i.test(String(w.status||'')));
R.steps.candidates=open.slice(0,6).map(w=>({n:w.number,id:w.id,st:w.status}));
L('open work orders: %s', JSON.stringify(R.steps.candidates));
// walk one and hunt the Authorizer field on every tab
const subj=open[0]; R.subject={n:subj.number,id:subj.id,st:subj.status};
for(const tab of ['lines','details','finance']){
  await page.goto(`${APP}/workorders/${subj.id}/${tab}`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(11000);
  const f=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return {url:location.href, mentions:/authoriz/i.test(t),
      fields:[...document.querySelectorAll('input,[data-test-id],label,.q-field')].filter(ok)
        .map(e=>({tid:e.getAttribute('data-test-id')||null, lab:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,40),
                  val:e.value!==undefined?String(e.value).slice(0,40):null}))
        .filter(x=>/authoriz|ibs|approval/i.test(`${x.tid} ${x.lab}`)).slice(0,10)};});
  R.steps[`tab_${tab}`]=f;
  L('%s: mentions=%s fields=%s', tab, f.mentions, JSON.stringify(f.fields));
  await page.screenshot({path:`${EV}/PR41-${tab}.png`, fullPage:true});
  save();
}
// also read the API record for an authorizer-shaped field
const d=await call(`/api/work-orders/view/${subj.id}`);
let x=(d.j&&(d.j.data||d.j))||{}; if(x.work_order) x=x.work_order;
R.steps.apiFields=Object.keys(x).filter(k=>/auth|ibs|approv/i.test(k)).map(k=>({k, v:x[k]}));
L('API fields matching auth/ibs/approval: %s', JSON.stringify(R.steps.apiFields));
// and on an already-invoiced one, to see whether the field is locked
const invd=wos.find(w=>/invoiced/i.test(String(w.status||'')));
if(invd){ const d2=await call(`/api/work-orders/view/${invd.id}`);
  let y=(d2.j&&(d2.j.data||d2.j))||{}; if(y.work_order) y=y.work_order;
  R.steps.invoicedSample={n:invd.number, fields:Object.keys(y).filter(k=>/auth|ibs|approv/i.test(k)).map(k=>({k,v:y[k]})), editable:y.editable};
  L('invoiced sample %s: %s editable=%s', invd.number, JSON.stringify(R.steps.invoicedSample.fields), y.editable); }
save(); await browser.close();
