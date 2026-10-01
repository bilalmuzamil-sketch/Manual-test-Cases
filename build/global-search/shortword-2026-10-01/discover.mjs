/**
 * SHORT-WORD FUZZY FAILURE - discovery across ALL tabs, All included.
 *
 * The question is the USER's, not the algorithm's: if I mistype a short word, I get an empty
 * screen that says only "No results for X". It does not say a longer query would work, and it does
 * not say why. Either the result should come back, or the screen should tell me what to do.
 *
 * Per tab: find a SHORT distinctive token (<=7 letters) that exists exactly, then damage it by one
 * letter and record what the user is shown - including the exact wording of the empty state.
 */
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/staging-cookie-boot.mjs';
import fs from 'fs';
const OUT='/home/user/Manual-test-Cases/build/global-search/shortword-2026-10-01/';
const { page, browser } = await boot('/customers', { key:'admin', settle:12000 });
page.setDefaultTimeout(25000);
const t0=Date.now();
const beat=m=>console.log(`[${new Date().toISOString().slice(11,19)} +${Math.round((Date.now()-t0)/1000)}s] ${m}`);

async function search(term, tab){
  return await Promise.race([_s(term,tab), new Promise((_,r)=>setTimeout(()=>r(new Error('deadline '+term)),70000))]);
}
async function _s(term, tab){
  await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  await page.keyboard.press('Control+k'); await page.waitForTimeout(1000);
  await page.fill('.search-modal input',''); await page.waitForTimeout(220);
  await page.type('.search-modal input', term, {delay:30}); await page.waitForTimeout(3000);
  if(tab && tab!=='All'){ const ok=await page.evaluate(l=>{const t=[...document.querySelectorAll('.search-tabs__tab')]
      .find(e=>e.innerText.replace(/\s*\(\d+\)/,'').trim().toLowerCase()===l.toLowerCase());
      if(!t)return false;t.click();return true;},tab);
    if(!ok) return {missing:true,rows:[]}; await page.waitForTimeout(2000); }
  await page.mouse.move(0,0); await page.waitForTimeout(200);
  return await page.evaluate(()=>({
    panel: document.querySelector('.search-modal')?.innerText.replace(/\s*\n\s*/g,' | ').slice(0,300),
    rows: [...document.querySelectorAll('.search-row')].slice(0,10).map(r=>({
      title:(r.querySelector('.search-row__title')?.innerText||'').replace(/\s+/g,' ').trim(),
      text:r.innerText.replace(/\s*\n\s*/g,' ').replace(/\s+/g,' ').trim()})),
  }));
}
const idOf=r=>(r.title||r.text).replace(/^\s*≈?\s*close match:\s*/i,'').replace(/\s+/g,' ').trim().toLowerCase();
const transpose=w=>{for(let i=1;i<w.length;i++) if(w[i].toLowerCase()!==w[i-1].toLowerCase()){
  const a=[...w];[a[i-1],a[i]]=[a[i],a[i-1]];return a.join('');} return null;};

const TABS=['All','Work orders','Customers','Assets','Parts','Vendors','Part sales','Purchase orders','Vendor invoices'];
const SEED={'All':'repair','Work orders':'repair','Customers':'truck','Assets':'truck','Parts':'brake',
            'Vendors':'supply','Part sales':'truck','Purchase orders':'diesel','Vendor invoices':'repair'};
const found={};
for(const tab of TABS){
  const r=await search(SEED[tab],tab);
  if(r.missing){ beat(`${tab}: TAB NOT PRESENT`); continue; }
  const words=new Set();
  for(const row of r.rows) for(const w of (row.text.match(/[A-Za-z][A-Za-z]{3,6}\b/g)||[]))
    if(!/^(open|close|match|Avail|Order|Paid|Date|Total|Repair|Truck|Parts|Diesel|Brake|Supply)$/i.test(w)) words.add(w);
  found[tab]={candidates:[...words].slice(0,8)};
  beat(`${tab}: short-word candidates -> ${found[tab].candidates.join(', ')||'NONE'}`);
}
fs.writeFileSync(OUT+'candidates.json', JSON.stringify(found,null,1));
console.log('DISCOVERY DONE');
await browser.close();
