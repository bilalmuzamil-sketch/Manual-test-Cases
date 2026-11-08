// New Part Request dialog: inventory part, part quantity Q, bin quantity BQ -> Save & Close. Records request, response, toasts,
// dialog state, unhandled page errors (SV-12340) and leftover part requests (SV-12341).
import {sess} from './common.mjs'; import fs from 'fs';
const WO=process.env.WO, PN=process.env.PN||'SV-4162B', Q=process.env.Q||'2', BQ=process.env.BQ||'1', TAG=process.env.TAG||'run';
const s=await sess(); const p=s.page; const ev=[]; const t0=Date.now(); const T=()=>((Date.now()-t0)/1000).toFixed(2); const L=x=>{ev.push(`${T()} ${x}`);};
p.on('request',r=>{ if(/\/api\/work-orders\/part\//.test(r.url())&&r.method()!=='GET') L(`REQ ${r.method()} ${new URL(r.url()).pathname} ${r.postData()}`); });
p.on('response',async r=>{ if(/\/api\/work-orders\/part\//.test(r.url())&&r.request().method()!=='GET') L(`RES ${r.status()} ${(await r.text().catch(()=>'')).slice(0,200)}`); });
p.on('pageerror',e=>L(`PAGEERROR (uncaught in page) ${e.message.slice(0,200)}`));
p.on('console',m=>{ if(m.type()==='error') L(`CONSOLE.error ${m.text().slice(0,200)}`); });
L('marker '+JSON.stringify(await s.marker()));
const reqs=async()=>{ const r=await s.api(`/api/work-orders/lines/${WO}`); const ids=[]; for(const l of (r.json?.data?.collection||[])) for(const q of (l.part_requests||[])) ids.push(q.id); return ids; };
const before=await reqs();
await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(2500);
await s.glideClick('button_add_part'); await p.waitForTimeout(1200); await s.glideClick('button_more_options_inline_part'); await p.waitForTimeout(1500);
const sp=p.locator('.q-dialog [data-test-id="select_part"]').first(); { const b=await sp.boundingBox(); await p.mouse.click(b.x+b.width/2,b.y+b.height/2); } await p.keyboard.type(PN,{delay:60}); await p.waitForTimeout(3000);
const items=p.locator('.q-menu .q-item'); const n=await items.count(); let pick=0;
for(let i=0;i<n;i++){ const t=await items.nth(i).innerText(); if(t.includes(PN+'\n')||new RegExp(PN.replace(/[-.]/g,'\\$&')+'\\s+Inventory').test(t.replace(/\s+/g,' '))){ pick=i; break; } }
L('pick '+(await items.nth(pick).innerText()).replace(/\s+/g,' '));
const bb=await items.nth(pick).boundingBox(); await p.mouse.click(bb.x+bb.width/2,bb.y+bb.height/2); await p.waitForTimeout(2500);
const setv=async(sel,v)=>{ const e=p.locator(sel).first(); if(!(await e.count())) return false; await e.click({clickCount:3}); await p.keyboard.press('Control+A'); await p.keyboard.type(String(v)); return true; };
L('fields '+await p.evaluate(()=>[...document.querySelectorAll('.q-dialog input')].map(e=>`${e.getAttribute('data-test-id')||e.closest('[data-test-id]')?.getAttribute('data-test-id')}=${e.value}`).join(' ; ')));
await setv('.q-dialog [data-test-id="input_workorder_part_quantity"] input, .q-dialog input[data-test-id="input_workorder_part_quantity"]',Q);
const bq=await setv('.q-dialog [data-test-id^="input_bin_quantity_"] input, .q-dialog input[data-test-id^="input_bin_quantity_"]',BQ);
await p.waitForTimeout(800);
L(`set part qty ${Q}, bin qty ${BQ} (bin field found=${bq})`);
L('fields2 '+await p.evaluate(()=>[...document.querySelectorAll('.q-dialog input')].map(e=>`${e.getAttribute('data-test-id')||e.closest('[data-test-id]')?.getAttribute('data-test-id')}=${e.value}`).join(' ; ')));
L('buttons '+await p.evaluate(()=>[...document.querySelectorAll('.q-dialog button')].map(e=>`${e.innerText.trim().replace(/\s+/g,' ')}|${e.getAttribute('data-test-id')}|dis=${e.disabled||e.getAttribute('aria-disabled')}`).join(' ; ')));
await p.screenshot({path:`../ev/${TAG}-1-before-save.png`});
const btn=p.locator('.q-dialog button').filter({hasText:/^\s*save & close\s*$/i}).first();
const b2=await (await btn.count()? btn : p.locator('[data-test-id="button_workorder_part_save"]').first()).boundingBox();
await p.mouse.click(b2.x+b2.width/2,b2.y+b2.height/2);
const toasts=new Set(); for(let i=0;i<30;i++){ await p.waitForTimeout(150); const t=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim())); t.forEach(x=>{ if(!toasts.has(x)){toasts.add(x); L('TOAST '+x);} }); if(i===6) await p.screenshot({path:`../ev/${TAG}-2-after-save.png`}); }
const open=await p.evaluate(()=>!!document.querySelector('.q-dialog [data-test-id="dialog_title"]'));
L(`dialog still open after save: ${open}`);
const val=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog .q-field--error, .q-dialog .q-field__messages')].map(e=>e.innerText.trim()).filter(Boolean).join(' | '));
L(`inline validation text: ${val}`);
await p.waitForTimeout(2000);
const after=await reqs(); L(`part requests before ${before.length} after ${after.length} new=${JSON.stringify(after.filter(x=>!before.includes(x)))}`);
await p.screenshot({path:`../ev/${TAG}-3-end.png`});
fs.writeFileSync(`../ev/${TAG}-dlg-log.txt`,ev.join('\n')+'\n'); console.log(ev.join('\n')); await s.close();
