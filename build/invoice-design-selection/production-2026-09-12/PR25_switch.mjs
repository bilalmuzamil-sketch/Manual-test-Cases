// Open the profile menu, dump it, click Trucks Hill 2 properly, then find an estimate whose
// Create Invoice button is actually ENABLED.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`;
const APP='https://app.shopview.com', APIH='api.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), scan:[]};
const save=()=>fs.writeFileSync(`${DIR}/PR25.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
const call=(p)=>page.evaluate(async({a,p})=>{const r=await fetch(`https://${a}${p}`,{credentials:'include',headers:{Accept:'application/json'}});
  const t=await r.text(); let j=null; try{j=JSON.parse(t)}catch(e){} return {s:r.status,j};},{a:APIH,p});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const bar=()=>page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('button,.q-btn')].filter(ok).map(t).find(x=>/Hrs Today/.test(x))||null;});
R.barBefore=await bar(); L('location before: %s', R.barBefore);
// open the menu and DUMP everything in it, so the click is aimed at something real
await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button,.q-btn')].filter(ok).find(e=>/Hrs Today/.test(t(e))); if(b) b.click();});
await page.waitForTimeout(4000);
R.menu=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const m=[...document.querySelectorAll('.q-menu,[role=menu]')].filter(ok).pop();
  if(!m) return {found:false, bodyTail:(document.body.innerText||'').replace(/\s+/g,' ').slice(-300)};
  return {found:true, text:(m.innerText||'').replace(/\s+/g,' ').slice(0,300),
    items:[...m.querySelectorAll('*')].filter(ok).filter(e=>e.children.length===0||e.tagName==='BUTTON')
      .map(e=>({tag:e.tagName, cls:String(e.className||'').slice(0,40), txt:(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,28)}))
      .filter(x=>x.txt).slice(0,22)};});
L('menu found: %s', R.menu.found);
(R.menu.items||[]).forEach(i=>L('   %s', JSON.stringify(i)));
await page.screenshot({path:`${EV}/PR25-menu.png`, fullPage:false});
// click anything whose text contains Trucks Hill 2
R.clicked=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.height>0;};
  const m=[...document.querySelectorAll('.q-menu,[role=menu]')].filter(ok).pop()||document;
  const cands=[...m.querySelectorAll('*')].filter(ok).filter(e=>/Trucks Hill 2/.test(e.innerText||''));
  const el=cands[cands.length-1];
  if(el){ (el.closest('button')||el).click(); return (el.innerText||'').replace(/\s+/g,' ').trim().slice(0,40);} return null;});
L('clicked: %s', R.clicked);
await page.waitForTimeout(16000);
R.barAfter=await bar(); L('location after: %s', R.barAfter);
await page.screenshot({path:`${EV}/PR25-after-switch.png`, fullPage:false});
save();
// now scan estimates for one whose Create Invoice is ENABLED
const wos=rowsOf((await call('/api/work-orders?limit=200')).j);
const ests=wos.filter(w=>/estimate|approved|complete|ready_for_review/i.test(String(w.status||'')));
L('candidates to scan: %d', ests.length);
for(const e of ests.slice(0,10)){
  await page.goto(`${APP}/workorders/${e.id}/finance`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(13000);
  const d=await page.evaluate((num)=>{const ok=x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0;};
    const body=(document.body.innerText||'').replace(/\s+/g,' ');
    const b=[...document.querySelectorAll('button')].filter(ok).find(x=>/Create Invoice/i.test((x.innerText||'').trim()));
    return {onPage:body.includes(num), present:!!b, disabled:b?b.disabled:null,
      badges:(body.match(/Over Limit|Valid VIN Required|Estimate|Approved|Complete/g)||[]).slice(0,4),
      errors:(body.match(/Ooooops! An error occurred/g)||[]).length};}, e.number||'');
  R.scan.push({n:e.number, id:e.id, st:e.status, ...d});
  L('  %-8s %-16s onPage=%s button=%s disabled=%s badges=%s errors=%d',
    e.number, e.status, d.onPage, d.present, d.disabled, JSON.stringify(d.badges), d.errors);
  save();
  if(d.onPage && d.present && d.disabled===false){ R.invoiceable={n:e.number,id:e.id,st:e.status}; L('  >>> INVOICEABLE: %s', e.number); break; }
}
L('done'); save(); await browser.close(); process.exit(0);
