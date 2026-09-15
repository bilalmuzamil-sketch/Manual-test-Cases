// Does the version people use today HAVE a recently viewed list at all? SV-10059 says the new
// version's list does not come back after a search that matches nothing. Before that report is
// rewritten with a live-product half, the live product has to be asked whether it has such a list -
// if it does not, there is no half to take, and saying so is better than inventing one.
//
// Read-only: open the search box, type nothing, photograph what is there. Then type something that
// matches nothing, clear it, and photograph again.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/prod-recents`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, version } = await bootProdLogin('/workorders',{settle:13000});
R.appVersion=version; L('the live product is', version);
const SEL='[data-test-id="select_global_search"]';
const panel=()=>page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const p=[...document.querySelectorAll('.q-menu,[role=listbox]')].filter(vis)
    .sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height)[0];
  return {found:!!p, text:p?(p.innerText||'').replace(/\s+/g,' ').trim().slice(0,300):null,
    items:p?[...p.querySelectorAll('.q-item')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,60)):[]};});
const clip=()=>page.evaluate(()=>{const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const p=[...document.querySelectorAll('.q-menu,[role=listbox]')].filter(vis)
    .sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height)[0];
  const s=document.querySelector('[data-test-id="select_global_search"]');
  if(!s) return null; const sb=s.getBoundingClientRect();
  const y=Math.max(0,sb.y-14);
  const w=p?Math.max(p.getBoundingClientRect().width,sb.width):sb.width;
  const h=p?(p.getBoundingClientRect().y+p.getBoundingClientRect().height)-y+14:sb.height+28;
  return {x:Math.max(0,(p?Math.min(p.getBoundingClientRect().x,sb.x):sb.x)-14), y:Math.round(y),
          width:Math.round(Math.min(1400,w+28)), height:Math.round(Math.min(1000,h))};});

// 1 - opened, nothing typed
await page.click(SEL).catch(()=>{}); await page.waitForTimeout(6000);
R.emptyBox=await panel();
{ const c=await clip(); if(c) await page.screenshot({path:`${EV}/V1-empty-box.png`,clip:c}); }
L('with nothing typed, the box shows:', JSON.stringify(R.emptyBox).slice(0,260));

// 2 - something that matches nothing
await page.fill(SEL,'').catch(()=>{});
await page.type(SEL,'zzzqqqxxx',{delay:50}); await page.waitForTimeout(8000);
R.noMatch=await panel();
{ const c=await clip(); if(c) await page.screenshot({path:`${EV}/V1-no-match.png`,clip:c}); }
L('with something that matches nothing:', JSON.stringify(R.noMatch).slice(0,240));

// 3 - cleared again
await page.fill(SEL,'').catch(()=>{}); await page.waitForTimeout(7000);
R.cleared=await panel();
{ const c=await clip(); if(c) await page.screenshot({path:`${EV}/V1-cleared.png`,clip:c}); }
L('after clearing it again:', JSON.stringify(R.cleared).slice(0,240));
R.hasARecentList = !!(R.emptyBox.found && (R.emptyBox.items||[]).length);
L('does the live product have a recently viewed list?', R.hasARecentList);
fs.writeFileSync(`${DIR}/PROD-RECENTS.json`,JSON.stringify(R,null,1));
L('DONE'); await browser.close();
