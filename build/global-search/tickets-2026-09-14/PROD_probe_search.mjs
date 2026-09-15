// The QA lead has seeded the same records on the live product, so the old-version pictures can use
// the very same words as the new-version ones - the comparison becomes like for like.
//
// Before photographing anything: confirm the seeded records really are there, and find out WHERE the
// old search draws its results, so the picture can be cropped to that area. A full screen shrunk to
// fit is why the current ticket images have to be clicked to be read.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const EV=`${DIR}/prod-evidence`; fs.mkdirSync(EV,{recursive:true});
const R={at:new Date().toISOString()};
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APP, version } = await bootProdLogin('/workorders',{settle:13000});
R.appVersion=version; L('live product version:', version);

const type=async q=>{
  await page.evaluate(()=>{ const el=document.querySelector('[data-test-id="select_global_search"]');
    if(el){ el.focus(); el.value=''; el.dispatchEvent(new Event('input',{bubbles:true})); } });
  await page.click('[data-test-id="select_global_search"]').catch(()=>{});
  await page.fill('[data-test-id="select_global_search"]','').catch(()=>{});
  await page.type('[data-test-id="select_global_search"]',q,{delay:60});
  await page.waitForTimeout(9000);
};
await type('ZZAUTOTEST');
R.afterTyping = await page.evaluate(()=>{
  const vis=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const menus=[...document.querySelectorAll('.q-menu,.q-dialog,[role=listbox],.q-item__section')].filter(vis);
  const box=(e)=>{const r=e.getBoundingClientRect();return {x:Math.round(r.x),y:Math.round(r.y),w:Math.round(r.width),h:Math.round(r.height)};};
  const panel=[...document.querySelectorAll('.q-menu,[role=listbox]')].filter(vis)
    .sort((a,b)=>b.getBoundingClientRect().height-a.getBoundingClientRect().height)[0];
  return {
    menusFound:menus.length,
    panelBox: panel?box(panel):null,
    panelText: panel?(panel.innerText||'').replace(/\s+/g,' ').trim().slice(0,600):null,
    items: panel?[...panel.querySelectorAll('.q-item')].map(e=>(e.innerText||'').replace(/\s+/g,' ').trim().slice(0,70)).slice(0,14):[],
    searchBoxBox: (()=>{const e=document.querySelector('[data-test-id="select_global_search"]'); return e?box(e):null;})(),
  };});
L('the old search panel:', JSON.stringify({box:R.afterTyping.panelBox, n:R.afterTyping.items.length}));
L('what it lists:', JSON.stringify(R.afterTyping.items));
await page.screenshot({path:`${EV}/prod-ZZAUTOTEST-full.png`});
if(R.afterTyping.panelBox){
  const b=R.afterTyping.panelBox, sb=R.afterTyping.searchBoxBox||b;
  const x=Math.max(0,Math.min(b.x,sb.x)-16), y=Math.max(0,Math.min(b.y,sb.y)-16);
  await page.screenshot({path:`${EV}/prod-ZZAUTOTEST-panel.png`,
    clip:{x, y, width:Math.min(1200,Math.max(b.w,sb.w)+32), height:Math.min(900,b.h+(b.y-y)+32)}});
  R.cropUsed={x,y,w:Math.min(1200,Math.max(b.w,sb.w)+32),h:Math.min(900,b.h+(b.y-y)+32)};
}
fs.writeFileSync(`${DIR}/PROD-SEARCH-PROBE.json`,JSON.stringify(R,null,1));
await browser.close();
