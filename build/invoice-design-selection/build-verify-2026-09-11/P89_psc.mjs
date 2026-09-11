// Part Sale Credit: raise one from the part sale's Finance tab (kebab -> Issue Credit), then
// render it under both designs. Sixth document for C53543.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com', API='sv9872api.qa.shopview.com';
const PS='90a95f29-f405-4763-834d-6e3a237f8c33';   // P1-162
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P89.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872',`/parts/part-sale/${PS}/finance`,'admin'); const page=s.page;
await page.setViewportSize({width:1700,height:1200});
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const net=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) net.push({m:r.method(),u:u.replace(/^https?:\/\/[^/]+/,'')});});
const seen=()=>{const c=net.slice(); net.length=0; return c;};
const api=(m,p,b)=>page.evaluate(async({a,m,p,b})=>{const r=await fetch(`https://${a}${p}`,{method:m,
  headers:{'Content-Type':'application/json',Accept:'application/json'},credentials:'include',body:b?JSON.stringify(b):undefined});
  const t=await r.text();let j=null;try{j=JSON.parse(t)}catch(e){}return{status:r.status,json:j,text:t};},{a:API,m,p,b:b||null});
const stored=async()=>{const r=await api('GET','/api/organizations/invoice-settings/view');
  const d=(r.json&&(r.json.data||r.json))||{}; return d.documentDesign||null;};
await page.waitForTimeout(16000);
R.url=page.url(); R.design=await stored();
R.location=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('button,.q-btn')].filter(isVis).map(t).find(x=>/ - \d+/.test(x))||null;},VIS);
R.onScreen=await page.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,400));
log('url=%s | location=%s | design=%s', R.url, R.location, R.design);
log('page: %s', R.onScreen.slice(0,260));
await page.screenshot({path:`${DIR}/evidence/P89-partsale-finance.png`, fullPage:false});
save();
if(!/P1-162/.test(R.onScreen)){ log('part sale P1-162 not visible to this login - stopping'); save(); await s.browser.close(); process.exit(1); }
// open the kebab next to the gear
seen();
await page.evaluate(vis=>{const isVis=eval(vis);
  const b=[...document.querySelectorAll('button,.q-btn')].filter(isVis).filter(e=>/more_vert/.test(e.innerText||''));
  if(b.length) b[b.length-1].click();},VIS);
await page.waitForTimeout(3500);
R.kebab=await page.evaluate(vis=>{const isVis=eval(vis);
  const m=[...document.querySelectorAll('.q-menu')].filter(isVis).pop();
  return m?[...m.querySelectorAll('.q-item')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()):null;},VIS);
log('kebab menu: %s', JSON.stringify(R.kebab));
await page.screenshot({path:`${DIR}/evidence/P89-kebab.png`});
const clicked=await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const e2=[...document.querySelectorAll('.q-menu .q-item')].filter(isVis).find(x=>/issue credit/i.test(t(x)));
  if(e2){e2.click(); return t(e2);} return null;},VIS);
await page.waitForTimeout(7000);
R.creditDialog=await page.evaluate(vis=>{const isVis=eval(vis);
  const d=[...document.querySelectorAll('.q-dialog')].filter(isVis).pop(); if(!d) return null;
  return {text:(d.innerText||'').replace(/\s+/g,' ').slice(0,900),
    fields:[...d.querySelectorAll('.q-field')].map(f=>(f.innerText||'').replace(/\s+/g,' ').trim().slice(0,50)),
    inputs:[...d.querySelectorAll('input')].map(i=>({ph:i.getAttribute('placeholder'),val:i.value,type:i.type})),
    buttons:[...d.querySelectorAll('button')].map(b=>(b.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean),
    rows:[...d.querySelectorAll('tbody tr')].map(r=>(r.innerText||'').replace(/\s+/g,' ').slice(0,140))};},VIS);
log('Issue Credit clicked: %s', clicked);
log('dialog: %s', JSON.stringify(R.creditDialog).slice(0,1100));
await page.screenshot({path:`${DIR}/evidence/P89-issue-credit.png`, fullPage:true});
save(); log('done'); await s.browser.close(); process.exit(0);
