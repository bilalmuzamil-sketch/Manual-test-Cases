// SV-12351 extra matrix. MODE=holdest: PO typed and saved, the preview's render request is HELD (TEST-ONLY delay) and the user clicks
// Work Orders in the top menu while it is held. MODE=init: the Finance tab is opened and the user clicks Work Orders before the first
// details request answers (TEST-ONLY delay). Both: what does the page do after the held answer arrives?
import {sess} from './common.mjs'; import fs from 'fs';
const WO=process.env.WO, TAG=process.env.TAG, MODE=process.env.MODE, HOLD=+(process.env.HOLD||5000);
const s=await sess(); const p=s.page; const log=[]; const t0=Date.now(); const T=()=>((Date.now()-t0)/1000).toFixed(2);
const watch=/\/api\/(invoices|work-orders\/(invoices|change-customer-po))/;
p.on('request',r=>{ if(watch.test(r.url())) log.push(`${T()} REQ ${r.method()} ${r.url().replace(/^https:\/\/[^/]+/,'').slice(0,120)}`)});
p.on('response',r=>{ if(watch.test(r.url())) log.push(`${T()} RES ${r.status()} ${r.request().method()} ${r.url().replace(/^https:\/\/[^/]+/,'').slice(0,120)}`)});
p.on('pageerror',e=>log.push(`${T()} PAGEERROR ${e.message.slice(0,160)}`));
log.push('marker '+JSON.stringify(await s.marker()));
const seen=new Set(); const poll=setInterval(async()=>{ try{ const t=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(x=>!/IBS Location/.test(x))); t.forEach(x=>{ if(!seen.has(x)){ seen.add(x); log.push(`${T()} TOAST-SHOWN ${x}`);} }); [...seen].forEach(k=>{ if(!t.includes(k)) seen.delete(k); }); }catch(e){} },150);
let armed=false;
const hold=async(r,what)=>{ if(!armed) return r.continue(); armed=false; log.push(`${T()} TEST-ONLY: holding ${what} ${HOLD} ms`); await new Promise(x=>setTimeout(x,HOLD)); const resp=await r.fetch().catch(e=>null); log.push(`${T()} TEST-ONLY: ${what} released (${resp?resp.status():'no response'})`); return resp?r.fulfill({response:resp}):r.abort(); };
if(MODE==='holdest') await p.route('**/api/work-orders/invoices/estimate', r=>hold(r,'the preview render'));
if(MODE==='init') await p.route(new RegExp(`/api/invoices/${WO}/details`), r=>hold(r,'the first details load'));
const navList=async()=>{ const h=await p.evaluate(()=>{ const e=[...document.querySelectorAll('[data-test-id="button_desktop_nav_link"]')].find(x=>/Work Orders/.test(x.innerText)); const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2}; }); await p.mouse.click(h.x,h.y); log.push(`${T()} clicked Work Orders in the top menu`); };
const DEST=process.env.DEST, DESTNUM=process.env.DESTNUM;
if(DEST){ await s.go(`/workorders/${DEST}/lines`); await p.waitForTimeout(2500); log.push(`${T()} opened the destination work order ${DESTNUM} first (so it is in the search box's recent list)`); }
const navDest=async()=>{ await s.glideClick('global_search_trigger'); await p.waitForTimeout(1500); const hit=await p.evaluate(o=>{ const e=[...document.querySelectorAll('[data-test-id^=search_result_row_]')].find(x=>x.innerText.includes(o)); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText.replace(/\s+/g,' ').slice(0,80)}; },DESTNUM); log.push(`${T()} opened another work order from the search box: ${JSON.stringify(hit)}`); await p.mouse.click(hit.x,hit.y); };
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(2000);
if(MODE==='init'){ armed=true; await s.glideClick('link_finance_tab'); log.push(`${T()} opened the Finance tab`); await p.waitForTimeout(1200); await p.screenshot({path:`../ev/${TAG}-1-loading.png`}); await (DEST?navDest():navList()); }
if(MODE==='holdest'){ await s.glideClick('link_finance_tab'); await p.waitForTimeout(5000); log.push(`${T()} on ${p.url().replace(/^https:\/\/[^/]+/,'')}`);
  const inp=p.locator('input[aria-label="Customer PO"]').first(); const b=await inp.boundingBox(); await p.mouse.click(b.x+b.width/2,b.y+b.height/2); await p.keyboard.press('Control+A'); await p.keyboard.type('ZZ12351-holdest-'+(Date.now()%100000),{delay:30});
  armed=true; await p.mouse.click(800,860); log.push(`${T()} clicked elsewhere (PO saves, preview refresh starts)`);
  for(let i=0;i<40 && armed;i++) await p.waitForTimeout(100); await p.waitForTimeout(400); await p.screenshot({path:`../ev/${TAG}-1-render-held.png`});
  if(process.env.QUEUE){ await p.mouse.click(b.x+b.width/2,b.y+b.height/2); await p.keyboard.press('Control+A'); await p.keyboard.type('ZZ12351-queued-'+(Date.now()%100000),{delay:30}); await p.mouse.click(800,860); log.push(`${T()} changed the PO again while the preview was still loading (a second refresh is queued)`); await p.waitForTimeout(800); }
  await (DEST?navDest():navList()); }
await p.waitForTimeout(HOLD+5000); await p.screenshot({path:`../ev/${TAG}-2-after.png`}); log.push(`${T()} URL ${p.url().replace(/^https:\/\/[^/]+/,'')}`);
clearInterval(poll); fs.writeFileSync(`../ev/${TAG}-log.txt`,log.join('\n')+'\n'); console.log(log.join('\n')); await s.close();
