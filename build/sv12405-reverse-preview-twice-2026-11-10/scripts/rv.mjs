// SV-12405: on the Finance tab, Create Invoice (if needed) -> close payment window -> ⋮ -> Reverse -> Reverse; count the preview
// render requests (POST work-orders/invoices/estimate) sent after Reverse and how many were in flight at the same time.
import {sess} from './common.mjs'; import fs from 'fs';
const ENV=process.env.ENV||'branch', WO=process.env.WO, N=+(process.env.N||5), TAG=process.env.TAG||ENV;
const s=await sess(); const p=s.page; const t0=Date.now(); const T=()=>(Date.now()-t0)/1000;
let reqs=[]; const live=new Map();
p.on('request',r=>{ if(/\/api\/work-orders\/invoices\/estimate/.test(r.url())){ const o={start:T(),end:null}; live.set(r,o); reqs.push(o);} });
const done=r=>{ const o=live.get(r); if(o&&o.end===null) o.end=T(); };
p.on('requestfinished',done); p.on('requestfailed',done);
const errs=[]; p.on('pageerror',e=>errs.push(e.message.slice(0,120)));
const out=[]; const marker=await s.marker(); out.push('marker '+JSON.stringify(marker));
const vis=async tid=>p.evaluate(t=>[...document.querySelectorAll(`[data-test-id="${t}"]`)].some(e=>{const r=e.getBoundingClientRect(); return r.width>0&&r.height>0&&getComputedStyle(e).visibility!=='hidden';}),tid).catch(()=>false);
const fin=async()=>{ await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(2500); await s.glideClick('link_finance_tab'); await p.waitForTimeout(6000); };
await fin();
for(let i=1;i<=N;i++){
  let created=false;
  if(i>1) await fin();
  const bTxt=async()=>p.evaluate(()=>[...document.querySelectorAll('[data-test-id=badge_wo_status]')].map(e=>e.innerText.trim()).filter(Boolean).join('|'));
  const bt0=await bTxt(); console.log('try',i,'badge-at-start',JSON.stringify(bt0)); if(/complete/i.test(bt0)){ await s.glideClick('button_create_invoice'); await p.waitForTimeout(5000); created=true; await p.screenshot({path:`../ev/${TAG}-try${i}-a-after-create.png`}); console.log('after create badge',await bTxt());
    for(let k=0;k<4;k++){ const ids=await p.evaluate(()=>[...document.querySelectorAll('.q-dialog [data-test-id]')].filter(e=>{const r=e.getBoundingClientRect(); return r.width>0;}).map(e=>e.getAttribute('data-test-id')));
      if(!ids.length||ids.includes('title_new_payment')) break;
      const c=['button_confirm_over_discount','button_close','button_close_dialog'].find(t=>ids.includes(t));
      console.log('dialog -> ',c||'Escape',ids.slice(0,4).join(',')); if(c) await s.glideClick(c).catch(()=>p.keyboard.press('Escape')); else await p.keyboard.press('Escape'); await p.waitForTimeout(3000); }
    // The New Customer Payment window is NOT closed with X (closing it now cancels the new invoice on both builds); the page is reloaded instead.
    await fin(); }
  for(let k=0;k<30;k++){ if(await s.box('button_wo_invoice_menu').catch(()=>null)) break; await p.waitForTimeout(500); }
  const badgeBefore=await bTxt();
  await p.screenshot({path:`../ev/${TAG}-try${i}-0-before-menu.png`}); await s.glideClick('button_wo_invoice_menu'); await p.waitForTimeout(1200); if(!(await vis('menu_item_reverse'))){ await p.keyboard.press('Escape'); await p.waitForTimeout(3000); await s.glideClick('button_wo_invoice_menu'); await p.waitForTimeout(1500);} const mt=await p.evaluate(()=>[...document.querySelectorAll('.q-menu [data-test-id], .q-dialog [data-test-id]')].map(e=>e.getAttribute('data-test-id')).join(',')); console.log('menu/dialog tids:',mt); if(!(await vis('menu_item_reverse'))){ await p.screenshot({path:`../ev/${TAG}-try${i}-menu.png`}); console.log('no reverse; badge',badgeBefore); break; } await s.glideClick('menu_item_reverse'); await p.waitForTimeout(1500);
  reqs=[]; const tc=T();
  const r=await s.confirm('button_confirm_reverse_invoice'); await p.waitForTimeout(12000);
  const after=reqs.filter(o=>o.start>=tc);
  let maxc=0; for(const a of after){ const c=after.filter(b=>b.start<=a.start && (b.end===null||b.end>a.start)).length; maxc=Math.max(maxc,c); }
  const badge=await bTxt();
  const prev=await p.evaluate(()=>{ return ((document.body.innerText.match(/(Invoice|Estimate):?\s*(INV|EST)?-?[A-Z0-9-]+/)||['?'])[0]).replace(/\s+/g,' '); }).catch(()=>'?');
  await p.screenshot({path:`../ev/${TAG}-try${i}.png`});
  const line=`try ${i}: created=${created} before=${badgeBefore} after=${badge} estimateReqs=${after.length} maxAtOnce=${maxc} times=${after.map(o=>o.start.toFixed(2)+'-'+(o.end?o.end.toFixed(2):'open')).join(',')} preview="${prev}"`;
  out.push(line); console.log(line);
}
out.push('pageerrors '+JSON.stringify(errs)); out.push('marker-end '+JSON.stringify(await s.marker()));
fs.writeFileSync(`../ev/${TAG}-log.txt`,out.join('\n')+'\n'); await s.close(); process.exit(0);
