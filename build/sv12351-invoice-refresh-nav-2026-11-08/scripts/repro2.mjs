// SV-12351 matrix: MODE=otherwo (PO typed, then open another work order via the top search) | stay (PO typed, click elsewhere on the
// Finance tab; then Lines tab and back to Finance) | forced500 (TEST-ONLY: the browser turns this work order's own details request into a 500
// while the user stays on Finance - the error must still be shown).
import {sess} from './common.mjs'; import fs from 'fs';
const WO=process.env.WO, TAG=process.env.TAG, MODE=process.env.MODE, OTHER=process.env.OTHER||'S2-16273';
const s=await sess(); const p=s.page; const log=[]; const t0=Date.now(); const T=()=>((Date.now()-t0)/1000).toFixed(2);
const watch=/\/api\/(invoices|work-orders\/(invoices|change-customer-po))/;
p.on('request',r=>{ if(watch.test(r.url())) log.push(`${T()} REQ ${r.method()} ${r.url().replace(/^https:\/\/[^/]+/,'').slice(0,120)}`)});
p.on('response',r=>{ if(watch.test(r.url())) log.push(`${T()} RES ${r.status()} ${r.request().method()} ${r.url().replace(/^https:\/\/[^/]+/,'').slice(0,120)}`)});
p.on('pageerror',e=>log.push(`${T()} PAGEERROR ${e.message.slice(0,160)}`));
log.push('marker '+JSON.stringify(await s.marker()));
const seen=new Set(); const poll=setInterval(async()=>{ try{ const t=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(x=>!/IBS Location/.test(x))); t.forEach(x=>{ if(!seen.has(x)){ seen.add(x); log.push(`${T()} TOAST-SHOWN ${x}`);} }); [...seen].forEach(k=>{ if(!t.includes(k)) seen.delete(k); }); }catch(e){} },150);
if(process.env.HOLDPO) await p.route('**/api/work-orders/change-customer-po', async r=>{ log.push(`${T()} TEST-ONLY: holding the PO save ${process.env.HOLDPO} ms`); await new Promise(x=>setTimeout(x,+process.env.HOLDPO)); const resp=await r.fetch(); log.push(`${T()} TEST-ONLY: PO save released (${resp.status()})`); return r.fulfill({response:resp}); });
if(MODE==='forced500') await p.route(new RegExp(`/api/invoices/${WO}/details`), r=>r.fulfill({status:500,contentType:'application/json',body:'{"errors":[{"error":"ZZ test-only server error"}]}'}));
if(process.env.WOA){ await s.go(`/workorders/${process.env.WOA}/lines`); await p.waitForTimeout(1500); await s.glideClick('link_finance_tab'); await p.waitForTimeout(4000); log.push(`${T()} first opened work order A ${process.env.WOA} Finance`); }
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(1500); await s.glideClick('link_finance_tab'); await p.waitForTimeout(4500);
log.push(`${T()} on ${p.url().replace(/^https:\/\/[^/]+/,'')}`);
const typePO=async v=>{ const inp=p.locator('input[aria-label="Customer PO"]').first(); const b=await inp.boundingBox(); await p.mouse.click(b.x+b.width/2,b.y+b.height/2); await p.keyboard.press('Control+A'); await p.keyboard.type(v,{delay:30}); };
const PO='ZZ12351-'+MODE+'-'+(Date.now()%100000);
if(MODE==='otherwo'){ await typePO(PO); await p.screenshot({path:`../ev/${TAG}-1-typed.png`});
  await s.glideClick('global_search_trigger'); await p.waitForTimeout(1500);
  const hit=await p.evaluate(o=>{ const e=[...document.querySelectorAll('[data-test-id^=search_result_row_]')].find(x=>x.innerText.includes(o)); if(!e) return null; const r=e.getBoundingClientRect(); return {x:r.x+r.width/2,y:r.y+r.height/2,t:e.innerText.replace(/\s+/g,' ').slice(0,80)}; },OTHER);
  log.push(`${T()} search hit ${JSON.stringify(hit)}`); if(hit) await p.mouse.click(hit.x,hit.y); else await p.keyboard.press('Enter');
  await p.waitForTimeout(7000); await p.screenshot({path:`../ev/${TAG}-2-other-wo.png`}); log.push(`${T()} URL ${p.url().replace(/^https:\/\/[^/]+/,'')}`); }
if(MODE==='back'){ await typePO(PO); await p.screenshot({path:`../ev/${TAG}-1-typed.png`}); await p.goBack(); log.push(`${T()} pressed the browser Back button`); await p.waitForTimeout(7000); await p.screenshot({path:`../ev/${TAG}-2-after-back.png`}); log.push(`${T()} URL ${p.url().replace(/^https:\/\/[^/]+/,'')}`); }
if(MODE==='stay'){ await typePO(PO); await p.mouse.click(800,860); log.push(`${T()} clicked elsewhere on the Finance tab`); await p.waitForTimeout(5000);
  await s.glideClick('link_lines_tab'); await p.waitForTimeout(2500); await s.glideClick('link_finance_tab'); log.push(`${T()} Lines tab -> back to Finance`); await p.waitForTimeout(5000);
  await p.screenshot({path:`../ev/${TAG}-1-stay.png`}); }
if(MODE==='forced500'){ await p.waitForTimeout(1500); await p.screenshot({path:`../ev/${TAG}-1-forced500.png`}); }
const v=await s.api(`/api/work-orders/view/${WO}`); log.push('saved customer PO on this work order: '+JSON.stringify((JSON.stringify(v.json).match(/"customer_?[pP][oO][a-zA-Z_]*":"[^"]*"/g)||[]).slice(0,2))+' typed '+PO);
clearInterval(poll); fs.writeFileSync(`../ev/${TAG}-log.txt`,log.join('\n')+'\n'); console.log(log.join('\n')); await s.close();
