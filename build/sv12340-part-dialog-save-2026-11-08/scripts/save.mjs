// SV-12340 — New Part Request "Save Part": does the dialog wait for the save, keep the draft on failure, and not leak an uncaught error?
// TEST-ONLY: the browser holds back (MODE=delay) or replaces (MODE=fail) the server's reply to the save. Not something a user can do.
import {sess} from './common.mjs'; import fs from 'fs';
const WO=process.env.WO, PN=process.env.PN||'SV-4162B', MODE=process.env.MODE||'delay', TAG=process.env.TAG||MODE, HOLD=+(process.env.HOLD||5000);
const s=await sess(); const p=s.page; const ev=[]; const t0=Date.now(); const T=()=>((Date.now()-t0)/1000).toFixed(2); const L=x=>ev.push(`${T()} ${x}`);
await p.addInitScript(()=>{ window.__unh=[]; window.addEventListener('unhandledrejection',e=>{ window.__unh.push(String(e.reason&&(e.reason.message||e.reason)).slice(0,200)); }); });
p.on('pageerror',e=>L(`PAGEERROR ${e.message.slice(0,200)}`));
p.on('request',r=>{ if(/sentry|envelope/.test(r.url())) L('ERROR REPORT sent to Sentry'); });
let saves=0; p.on('request',r=>{ if(/part\/(make|change)-request/.test(r.url())) saves++; });
L('marker '+JSON.stringify(await s.marker()));
const reqs=async()=>{ const r=await s.api(`/api/work-orders/lines/${process.env.PS||WO}`); const ids=[]; for(const l of (r.json?.data?.collection||[])) for(const q of (l.part_requests||[])) ids.push(q.id); return ids; };
const before=await reqs();
const ACTION=process.env.ACTION||'create', PART=process.env.PART;
await p.route(ACTION==='edit'?'**/api/work-orders/part/change-request':'**/api/work-orders/part/make-request', async route=>{
  L(`SAVE request sent (${MODE})`);
  if(MODE==='fail500'){ await new Promise(r=>setTimeout(r,1500)); L('SAVE reply: test-only 500 (HTML error page)');
    return route.fulfill({status:500,contentType:'text/html',body:'<html><body>ZZ test-only server error</body></html>'}); }
  if(MODE==='fail'){ await new Promise(r=>setTimeout(r,1500)); L('SAVE reply: test-only 400 {"errors":[{"error":"ZZ test-only rejection"}]}');
    return route.fulfill({status:400,contentType:'application/json',body:JSON.stringify({errors:[{error:'ZZ test-only rejection'}]})}); }
  await new Promise(r=>setTimeout(r,HOLD)); const resp=await route.fetch(); L(`SAVE reply released: real ${resp.status()}`); return route.fulfill({response:resp}); });
const PS=process.env.PS, BTN=process.env.BTN||'button_workorder_part_save';
await s.go(PS?`/parts/part-sale/${PS}/part-requests`:`/workorders/${WO}/lines`); await p.waitForTimeout(2500);
if(ACTION==='edit'){ await s.glideClick('button_edit_part_'+PART); await p.waitForTimeout(2500);
  L('edit dialog: '+await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(' ')));
  const sp2=p.locator('.q-dialog [data-test-id="input_workorder_part_sell_price"]').first(); await sp2.click({clickCount:3}); await p.keyboard.press('Control+A'); await p.keyboard.type(process.env.PRICE||'181'); await p.waitForTimeout(600);
} else {
await s.glideClick('button_add_part'); await p.waitForTimeout(1500); if(!PS){ await s.glideClick('button_more_options_inline_part'); await p.waitForTimeout(1500); }
const sp=p.locator('.q-dialog [data-test-id="select_part"]').first(); { const b=await sp.boundingBox(); await p.mouse.click(b.x+b.width/2,b.y+b.height/2); }
await p.keyboard.type(PN,{delay:60}); await p.waitForTimeout(3000);
const items=p.locator('.q-menu .q-item'); const n=await items.count(); let pick=0;
for(let i=0;i<n;i++){ if(/Inventory/.test(await items.nth(i).innerText())){ pick=i; break; } }
const bb=await items.nth(pick).boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(2500);
const bq=p.locator('.q-dialog [data-test-id^="input_bin_quantity_"]').first(); await bq.click({clickCount:3}); await p.keyboard.press('Control+A'); await p.keyboard.type('1'); await p.waitForTimeout(600);
}
if(process.env.BLANK){ const f=p.locator(`.q-dialog [data-test-id^="${process.env.BLANK}"]`).first(); await f.click({clickCount:3}); await p.keyboard.press('Control+A'); await p.keyboard.press('Delete'); await p.waitForTimeout(500); L('cleared '+process.env.BLANK); }
await p.screenshot({path:`../ev/${TAG}-1-filled.png`});
const save=await s.box(BTN); L('click '+BTN); await p.mouse.click(save.x,save.y);
const toasts=new Set(); let lastOpen=null, lastLoad=null;
for(let i=0;i<Math.ceil((HOLD+4000)/200);i++){ await p.waitForTimeout(200);
  const st=await p.evaluate(()=>({open:!!document.querySelector('.q-dialog [data-test-id="dialog_title"]'),
    loading:!!document.querySelector('.q-dialog [data-test-id="button_workorder_part_save"] .q-spinner, .q-dialog [data-test-id="button_workorder_part_save"].q-btn--loading, .q-dialog .q-inner-loading'),
    toasts:[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim()).filter(t=>!/IBS Location/.test(t))}));
  if(st.open!==lastOpen){ L(`dialog ${st.open?'OPEN':'CLOSED'}`); lastOpen=st.open; if(i>0) await p.screenshot({path:`../ev/${TAG}-2-dialog-${st.open?'open':'closed'}-${T()}.png`}); }
  if(st.loading!==lastLoad){ L(`save button loading=${st.loading}`); lastLoad=st.loading; }
  st.toasts.forEach(t=>{ if(!toasts.has(t)){ toasts.add(t); L('TOAST '+t); } });
}
await p.screenshot({path:`../ev/${TAG}-3-end.png`});
L('dialog fields at end: '+await p.evaluate(()=>[...document.querySelectorAll('.q-dialog input')].map(e=>`${(e.getAttribute('data-test-id')||e.closest('[data-test-id]')?.getAttribute('data-test-id')||'').replace('input_','')}=${e.value}`).filter(x=>!/=$/.test(x)).join(' ; ')));
L('unhandled promise rejections in page: '+JSON.stringify(await p.evaluate(()=>window.__unh)));
L('save requests sent: '+saves); L('validation messages: '+JSON.stringify(await p.evaluate(()=>[...document.querySelectorAll('.q-dialog .q-field__messages')].map(e=>e.innerText.trim()).filter(Boolean))));
const after=await reqs(); L(`part requests before ${before.length} after ${after.length}`);
fs.writeFileSync(`../ev/${TAG}-log.txt`,ev.join('\n')+'\n'); console.log(ev.join('\n')); await s.close();
