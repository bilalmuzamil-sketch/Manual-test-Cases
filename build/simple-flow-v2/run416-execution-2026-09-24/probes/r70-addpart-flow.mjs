// Learn the Add Part flow. Every remaining data state depends on it: a part with a core, a
// vendor-sourced part, a vendor with two purchase orders, parts in each state.
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import { openWo } from './lib3.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const {browser,ctx,page,APIH}=await bootProdLogin('/workorders',{settle:13000,viewport:{width:1680,height:1000},deviceScaleFactor:2});
page.setDefaultTimeout(30000);
const R={};
const call=async p=>{const q=await ctx.request.get(`https://${APIH}${p}`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true});
  const t=await q.text();let j=null;try{j=JSON.parse(t);}catch{}return j;};
const wos=(await call('/api/work-orders?pagination%5BrowsPerPage%5D=60&pagination%5Bpage%5D=1&search=&showMyWorkOrders=0'))?.data?.work_orders||[];
const open=wos.filter(w=>/approved|estimate/i.test(w.status?.label||w.status?.value||w.status||''));
console.log('open work orders to work with:',open.length);
let used=null;
for(const w of open.slice(0,8)){
  await openWo(page,w.id); await page.waitForTimeout(7000);
  const has=await page.evaluate(()=>{const onWO=!!([...document.querySelectorAll('tr')].find(t=>/Name\/Description/.test(t.innerText||'')));
    if(!onWO)return false;
    return [...document.querySelectorAll('*')].some(e=>/^\+?\s*Add Part$/i.test((e.textContent||'').trim())&&e.getBoundingClientRect().width);});
  if(has){ used=w; break; }
}
if(!used){ console.log('no work order offers Add Part'); await browser.close(); process.exit(1); }
R.wo=used.work_order_number; R.woId=used.id;
console.log('using',R.wo, used.id);
const clicked=await page.evaluate(()=>{const e=[...document.querySelectorAll('*')].filter(x=>/^\+?\s*Add Part$/i.test((x.textContent||'').trim())&&x.getBoundingClientRect().width)
    .sort((a,b)=>a.getBoundingClientRect().y-b.getBoundingClientRect().y)[0];
  if(!e)return 'not found'; e.click(); return 'pressed Add Part';});
console.log(clicked); await page.waitForTimeout(6000);
R.ui=await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width&&r.height;};
  const d=[...document.querySelectorAll('.q-dialog')].filter(x=>x.getBoundingClientRect().width>150).pop();
  const scope=d||document.body;
  return { asDialog:!!d,
    text:(scope.innerText||'').replace(/\s+/g,' ').trim().slice(0,400),
    inputs:[...scope.querySelectorAll('input')].filter(vis).map((i,ix)=>({ix,
      label:((i.closest('.q-field')||{}).innerText||'').replace(/\s+/g,' ').trim().slice(0,40),
      ph:i.getAttribute('placeholder')||'',val:i.value})),
    buttons:[...scope.querySelectorAll('button,.q-btn')].filter(vis).map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(Boolean).slice(0,16) };});
console.log('\nthe Add Part row/dialog:');
console.log('  as a dialog:',R.ui.asDialog);
console.log('  reads  :',JSON.stringify(R.ui.text.slice(0,260)));
console.log('  inputs :',JSON.stringify(R.ui.inputs));
console.log('  buttons:',JSON.stringify(R.ui.buttons));
await page.screenshot({path:`${EV}/r70-addpart.png`}).catch(()=>{});
// type something and see what it offers
if(R.ui.inputs.length){
  const box=page.locator((R.ui.asDialog?'.q-dialog ':'')+'input:visible').first();
  await box.click().catch(()=>{}); await box.type('a',{delay:60}); await page.waitForTimeout(3500);
  R.suggestions=await page.evaluate(()=>{const m=[...document.querySelectorAll('.q-menu,.q-select__dialog,[role=listbox]')].filter(x=>x.getBoundingClientRect().width);
    const out=[]; m.forEach(mm=>[...mm.querySelectorAll('.q-item')].filter(i=>i.getBoundingClientRect().width).forEach(i=>out.push((i.innerText||'').replace(/\s+/g,' ').trim().slice(0,70))));
    return out.slice(0,14);});
  console.log('\n  typing "a" offers:',JSON.stringify(R.suggestions));
  await page.screenshot({path:`${EV}/r70-suggestions.png`}).catch(()=>{});
}
fs.writeFileSync(`${EV}/r70-addpart.json`,JSON.stringify(R,null,1));
await browser.close();
