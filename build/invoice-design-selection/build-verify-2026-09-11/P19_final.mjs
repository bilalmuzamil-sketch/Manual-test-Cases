// The Customer Portal link found in the profile menu, the location switcher done properly,
// and a work order with an approving contact invoiced so the Authorizer column can be read.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P19.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/administration/settings','admin'); const page=s.page;
await page.setViewportSize({width:1600,height:1100});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push({m:r.method(),u:u.replace(/^https?:\/\/[^/]+/,'')});});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
const api=(m,p,b)=>page.evaluate(async({api,m,p,b})=>{const r=await fetch(`https://${api}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t.slice(0,400)};},{api:API,m,p,b:b||null});
const rowsOf=(j)=>{const pick=o=>{for(const k of ['collection','data','rows','items','results']){if(Array.isArray(o&&o[k]))return o[k];}
  if(Array.isArray(o))return o; for(const k of Object.keys(o||{})){const v=pick(o[k]); if(v&&v.length)return v;} return [];};return pick(j);};
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};
const openProfile=async()=>{ await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).find(e=>/Staging .* - \d+/.test(t(e))); if(b)b.click();},VIS);
  await page.waitForTimeout(3000); };

// ===== A. the Customer Portal link -- is the portal actually reachable from this branch? =====
await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(7000);
await openProfile();
const pages0=page.context().pages().length;
const portalHref=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e=[...document.querySelectorAll('a,.q-item')].filter(isVis).find(x=>/customer portal/i.test(t(x)));
  return e?{text:t(e), href:e.getAttribute('href')||e.closest('a')?.getAttribute('href')||null}:null;},VIS);
log('Customer Portal menu item:', JSON.stringify(portalHref));
await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e=[...document.querySelectorAll('a,.q-item')].filter(isVis).find(x=>/customer portal/i.test(t(x))); if(e)e.click();},VIS);
await page.waitForTimeout(9000);
const pgs=page.context().pages();
const newPage=pgs.length>pages0?pgs[pgs.length-1]:null;
R.portal={menuItem:portalHref, newTabOpened:!!newPage,
  url: newPage?newPage.url():page.url(),
  text: newPage? await newPage.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,500))
               : await page.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,500))};
log('PORTAL -> newTab=%s url=%s', R.portal.newTabOpened, R.portal.url);
log('   text:', R.portal.text.slice(0,300));
if(newPage){ await newPage.screenshot({path:`${DIR}/evidence/P19-portal.png`}); await newPage.close(); }
else await page.screenshot({path:`${DIR}/evidence/P19-portal.png`});
save();

// ===== B. the location switcher, properly =====
await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(7000);
await openProfile();
const dump=async(tag)=>{const d=await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu,.q-dialog')].filter(isVis)
    .map(m=>({items:[...m.querySelectorAll('.q-item,[role=option],li')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,25)}));},VIS);
  log('  menus[%s]: %s', tag, JSON.stringify(d)); return d;};
await dump('profile');
// hover, then click, the Change Location row
await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e=[...document.querySelectorAll('.q-item')].filter(isVis).filter(x=>/^Change Location/.test(t(x)))
    .sort((a,b)=>t(a).length-t(b).length)[0];
  if(e){ e.dispatchEvent(new MouseEvent('mouseenter',{bubbles:true}));
         e.dispatchEvent(new MouseEvent('mouseover',{bubbles:true})); e.click(); }},VIS);
await page.waitForTimeout(4000);
R.locMenus=await dump('after change-location');
await page.screenshot({path:`${DIR}/evidence/P19-location-submenu.png`});
const picked=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const o=[...document.querySelectorAll('.q-menu .q-item,.q-dialog .q-item,[role=option],li')].filter(isVis)
    .find(e=>/Lethbridge/i.test(t(e))&&t(e).length<60); if(o){o.click(); return t(o);} return null;},VIS);
await page.waitForTimeout(10000);
await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:60000});
await page.waitForTimeout(6000);
await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(isVis).find(e=>t(e)==='Invoice'); if(el)el.click();},VIS);
await page.waitForTimeout(5000);
R.location={picked,
  bar:await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(t).find(x=>/Staging .* - \d+/.test(x))||null;},VIS),
  onScreen:await page.evaluate(vis=>{const isVis=eval(vis);
    const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis).find(x=>/invoice design/i.test(x.innerText||''));
    const i=f&&f.querySelector('input'); return i?i.value:null;},VIS),
  controls:await page.evaluate(vis=>{const isVis=eval(vis);
    return [...document.querySelectorAll('.q-field,.q-select,.q-toggle')].filter(isVis)
      .filter(x=>/invoice design|legacy invoice layout/i.test(x.innerText||'')).length;},VIS),
  stored:await stored()};
log('LOCATION picked=%s | bar=%s | setting=%s | copies of the control=%d',
  picked, R.location.bar, R.location.onScreen, R.location.controls);
await page.screenshot({path:`${DIR}/evidence/P19-second-location-setting.png`});
save();

// ===== C. seed an invoiced work order that carries an approving contact (C53570) =====
const wos=rowsOf((await api('GET','/api/work-orders?limit=200')).json);
R.seed={candidates:[]};
for(const w of wos.slice(0,60)){const d=(await api('GET',`/api/work-orders/view/${w.id}`)).json;
  let x=(d&&(d.data||d))||{}; if(x.work_order)x=x.work_order;
  if((x.authorizer_contact_id||x.authorizer_full_name)&&!x.invoice_id)
    R.seed.candidates.push({id:w.id,num:x.number,contact:x.authorizer_full_name,status:x.status});
  if(R.seed.candidates.length>=3) break;}
log('un-invoiced work orders carrying an approving contact:', JSON.stringify(R.seed.candidates));
save();
log('ended at', await stored()); log('done'); await s.browser.close(); process.exit(0);
