// Does the new version's code even TRY to record a search-usage event?
//
// The click capture saw only page_view. That is one of two very different things: the app sends
// nothing, or it sends something the capture missed. Reading the shipped code separates them.
//
// The earlier scan read <script src> tags and found four files. This app loads most of its code as
// chunks fetched on demand, so the search panel's own code is not in a script tag at all -- the
// search modal is OPENED FIRST, then every JavaScript resource the browser has actually fetched is
// listed from its own performance record and read.
import fs from 'fs';
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/global-search/tickets-2026-09-14';
const R={at:new Date().toISOString()};
const L=(...a)=>console.log(a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const { browser, page, APP } = await boot('sv9160','/workorders','admin');
await page.waitForTimeout(6000);
// open the panel and run a search, so its chunk is definitely fetched
await page.evaluate(()=>{const b=document.querySelector('[data-test-id="global_search_trigger"]'); b&&b.click();});
await page.waitForSelector('[data-test-id="search_modal_input"]',{state:'visible',timeout:20000}).catch(()=>{});
await page.fill('[data-test-id="search_modal_input"]','Bridgeport').catch(()=>{});
await page.waitForTimeout(9000);
R.scan=await page.evaluate(async ()=>{
  const urls=[...new Set(performance.getEntriesByType('resource')
    .map(e=>e.name).filter(u=>/\.m?js(\?|$)/i.test(u)))];
  const words=['global_search_use','globalSearchUse','global_search','search_use','searchUse',
               'gtag(','logEvent','trackEvent','analytics'];
  const out={jsFilesLoaded:urls.length, sameOrigin:0, scanned:0, failed:[], hits:[]};
  for(const u of urls){
    if(!u.startsWith(location.origin)) continue;
    out.sameOrigin++;
    try{ const t=await (await fetch(u)).text(); out.scanned++;
      for(const w of words) if(t.includes(w)){
        const i=t.indexOf(w);
        out.hits.push({file:u.split('/').pop().slice(0,50), word:w,
          around:t.slice(Math.max(0,i-90), i+90).replace(/\s+/g,' ')}); }
    }catch(e){ out.failed.push(u.split('/').pop().slice(0,40)); }
  }
  return out;});
L('javascript files the browser fetched:', R.scan.jsFilesLoaded,
  '| from this app:', R.scan.sameOrigin, '| read:', R.scan.scanned);
for(const h of R.scan.hits.slice(0,14)) L('  HIT', h.word, 'in', h.file, '::', h.around.slice(0,120));
if(!R.scan.hits.length) L('  no mention of any search-usage event, and none of the analytics words above');
fs.writeFileSync(`${DIR}/C45160-CODE-SCAN.json`,JSON.stringify(R,null,1));
await browser.close();
