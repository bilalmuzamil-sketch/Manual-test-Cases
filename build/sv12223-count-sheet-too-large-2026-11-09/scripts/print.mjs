// usage: TAG=x SEARCH=str ENV=branch|prod node print.mjs
import {sess} from './common.mjs';
const TAG=process.env.TAG||'run', SEARCH=process.env.SEARCH||'';
const s=await sess(); const p=s.page;
const ver=await p.evaluate(()=>document.querySelector('meta[name="app-version"]')?.content);
await s.go('/parts/inventory'); await p.waitForTimeout(3500);
if(SEARCH){ await p.click('[data-test-id="page_search_toggle"]'); await p.waitForTimeout(500); await p.keyboard.type(SEARCH); await p.waitForTimeout(3000);}
if(process.env.BIN){ await p.click('[data-test-id="filter_chip_gridLocation"]'); await p.waitForTimeout(1200);
  await p.click(`[data-test-id="filter_option_gridLocation_${process.env.BIN}"]`); await p.waitForTimeout(800); await p.keyboard.press('Escape'); await p.waitForTimeout(2500);
  await p.screenshot({path:`../ev/${TAG}-0-filter.png`}); }
const kb=await p.evaluate(()=>{const e=[...document.querySelectorAll('button')].find(b=>b.querySelector('i')?.innerText==='more_vert'); if(!e)return null; const r=e.getBoundingClientRect(); return [r.x+r.width/2,r.y+r.height/2];});
await p.mouse.click(...(kb||[1362,99])); await p.waitForTimeout(800);
await p.screenshot({path:`../ev/${TAG}-0-menu.png`}); await p.locator('[data-test-id="menu_item_cycle_count"], .q-menu .q-item:has-text("Cycle count")').first().click(); await p.waitForTimeout(3000);
await p.screenshot({path:`../ev/${TAG}-1-cycle.png`});
if(process.env.FAULT){ const st=+process.env.FAULT; const body=process.env.FAULT_BODY||'{"errors":[{"error":"An error occurred. We\'re sorry for this inconvenience, please try again a bit later."}]}';
  await p.route('**/count-sheet-pdf*', r=>r.fulfill({status:st, contentType:'application/json', body})); }
let req=null,t0=0; p.on('request',r=>{ if(r.url().includes('count-sheet-pdf')){req=r.url();t0=Date.now();}});
const respP=p.waitForResponse(r=>r.url().includes('count-sheet-pdf'),{timeout:150000}).catch(e=>null);
const pb=await p.$('button[aria-label="Print"]'); await pb.click();
const resp=await respP; const ms=Date.now()-t0;
let body=''; try{ const b=await resp.body(); body=resp.headers()['content-type']?.includes('pdf')?`PDF ${b.length} bytes`:b.toString().slice(0,400);}catch(e){body='(no body) '+e.message}
const pages=s.ctx.pages().map(x=>x.url()); await p.waitForTimeout(+(process.env.WAIT||2500)); console.log('tabs',JSON.stringify(s.ctx.pages().map(x=>x.url())));
const toast=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()));
await p.screenshot({path:`../ev/${TAG}-2-after.png`});
const out={tag:TAG,env:process.env.ENV||'branch',ver,search:SEARCH,req,status:resp?.status(),ms,body,toast,at:new Date().toISOString()};
console.log(JSON.stringify(out,null,1)); 
const fs=await import('fs'); fs.appendFileSync('../ev/runs.jsonl',JSON.stringify(out)+'\n');
await s.browser.close();
