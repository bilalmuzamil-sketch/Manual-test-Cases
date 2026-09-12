// PRODUCTION -- C53541. Reverse a Modern-captured invoice, switch the setting to Legacy, recreate
// the invoice for the SAME work order, and compare the two documents' designs.
// Step 1 here: find the reverse action by WALKING the finance screen (never guessing a route).
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53541', steps:[], net:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR35.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
page.on('request', r=>{const u=r.url(); if(/api\.shopview\.com/.test(u)&&r.method()!=='GET') R.net.push({m:r.method(),u:u.replace('https://api.shopview.com','')});});
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{for(let i=0;i<4;i++){const r=await call('/api/organizations/invoice-settings/view');
  try{const v=r.j.data.documentDesign; if(v) return v;}catch(e){} await page.waitForTimeout(900);} return null;};
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
R.designNow=await stored(); L('build %s design %s', R.build, R.designNow);
// pick an invoiced work order that is NOT the ticket's evidence record (S1-764)
const wos=rowsOf((await call('/api/work-orders?limit=300')).j);
const cand=wos.filter(w=>/invoiced/i.test(String(w.status||'')) && w.number!=='S1-764');
R.candidates=cand.slice(0,8).map(w=>({n:w.number,id:w.id,st:w.status}));
L('invoiced candidates %s', JSON.stringify(R.candidates));
const subj=cand[0]; if(!subj){ L('no invoiced work order available'); save(); await browser.close(); process.exit(0); }
R.subject={n:subj.number,id:subj.id}; L('subject %s', subj.number);
await page.goto(`${APP}/workorders/${subj.id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(13000);
const onRec=await page.evaluate(n=>(document.body.innerText||'').includes(n), subj.number);
R.onRecord=onRec; L('on record: %s', onRec);
if(!onRec){ L('not on the record -- stop (L0069: assert identity before blaming a control)'); save(); await browser.close(); process.exit(0); }
await page.screenshot({path:`${EV}/PR35-finance.png`, fullPage:true});
// enumerate every visible control, no container exclusion (L0060)
R.controls=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('button,[role=button],[data-test-id],a')].filter(ok)
    .map(e=>({tid:e.getAttribute('data-test-id')||null, aria:e.getAttribute('aria-label')||null,
      txt:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,45)})).filter(x=>x.tid||x.aria||x.txt);});
L('controls %d', R.controls.length);
L('menu-ish: %s', JSON.stringify(R.controls.filter(c=>/more|dots|menu|reverse|void|action/i.test(`${c.tid} ${c.aria} ${c.txt}`))));
save();
// open every menu-looking control and record what it offers
R.menus=[];
const openers=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('button,[role=button],[data-test-id]')].filter(ok)
    .map((e,i)=>({i, tid:e.getAttribute('data-test-id')||null, aria:e.getAttribute('aria-label')||null,
      txt:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,40)}))
    .filter(x=>/more|dots|menu|settings|action/i.test(`${x.tid} ${x.aria} ${x.txt}`));});
L('openers %s', JSON.stringify(openers));
for(const o of openers){
  await page.evaluate((idx)=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const all=[...document.querySelectorAll('button,[role=button],[data-test-id]')].filter(ok); all[idx]&&all[idx].click();}, o.i);
  await page.waitForTimeout(2500);
  const items=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    return [...document.querySelectorAll('.q-menu, [role=menu], .q-list')].filter(ok)
      .flatMap(m=>[...m.querySelectorAll('.q-item,[role=menuitem],li,button')].filter(ok)
        .map(e=>({txt:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,50), tid:e.getAttribute('data-test-id')||null})))
      .filter(x=>x.txt);});
  if(items.length){ R.menus.push({opener:o, items}); L('  menu from %s -> %s', o.tid||o.txt, JSON.stringify(items.map(i=>i.txt))); }
  await page.keyboard.press('Escape').catch(()=>{}); await page.waitForTimeout(900);
}
await page.screenshot({path:`${EV}/PR35-menus.png`, fullPage:true});
save(); await browser.close();
