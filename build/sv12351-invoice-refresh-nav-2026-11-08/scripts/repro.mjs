// Sentry steps: Finance tab of an un-invoiced work order -> type in Customer PO -> click Work Orders in the side menu.
import {sess} from './common.mjs'; import fs from 'fs';
const WO=process.env.WO, TAG=process.env.TAG||'run', PO=process.env.PO||('ZZ12351-'+Date.now()%100000), ROUNDS=+(process.env.ROUNDS||1);
const s=await sess(); const p=s.page; const ev='../ev';
const log=[]; const t0=Date.now(); const T=()=>((Date.now()-t0)/1000).toFixed(2);
p.on('request',r=>{const u=r.url(); if(/\/api\/(invoices|work-orders\/(invoices|change-customer-po))/.test(u)) log.push(`${T()} REQ ${r.method()} ${u.replace(/^https:\/\/[^/]+/,'')}`)});
p.on('response',r=>{const u=r.url(); if(/\/api\/(invoices|work-orders\/(invoices|change-customer-po))/.test(u)) log.push(`${T()} RES ${r.status()} ${r.request().method()} ${u.replace(/^https:\/\/[^/]+/,'')}`)});
p.on('pageerror',e=>log.push(`${T()} PAGEERROR ${e.message.slice(0,160)}`));
p.on('console',m=>{ if(m.type()==='error') log.push(`${T()} CONSOLE.error ${m.text().slice(0,160)}`)});
const marker=await s.marker(); log.push('marker '+JSON.stringify(marker));
const toasts=new Map();
const poll=setInterval(async()=>{ try{ const t=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(e=>e.innerText.replace(/\s+/g,' ').trim())); t.forEach(x=>{ if(!toasts.has(x)) { toasts.set(x,true); log.push(`${T()} TOAST-SHOWN ${x}`);} }); [...toasts.keys()].forEach(k=>{ if(!t.includes(k)) { toasts.delete(k); } }); }catch(e){} },150);
for(let r=1;r<=ROUNDS;r++){
  log.push(`--- round ${r}`);
  await s.go(`/workorders/${WO}/lines`); await p.waitForTimeout(1500); await s.glideClick('link_finance_tab'); await p.waitForTimeout(4000); log.push(`${T()} on ${p.url().replace(/^https:\/\/[^/]+/,'')}`);
  const inp=p.locator('input[aria-label="Customer PO"]').first();
  if(!(await inp.count())){ log.push('NO Customer PO input'); break; }
  await inp.scrollIntoViewIfNeeded(); const b=await inp.boundingBox(); await p.mouse.click(b.x+b.width/2,b.y+b.height/2);
  await p.keyboard.press('Control+A'); await p.keyboard.type(PO+'-'+r,{delay:40});
  if(r===1) await p.screenshot({path:`${ev}/${TAG}-1-po-typed.png`});
  // side menu "Work Orders"
  const nav=await p.evaluate(()=>{ const c=[...document.querySelectorAll('aside a, nav a, .q-drawer a, .q-drawer .q-item, a[href="/workorders"]')]
     .filter(e=>/^work orders$/i.test((e.innerText||'').trim()) || e.getAttribute('href')==='/workorders');
     const e=c[0]; if(!e) return null; const q=e.getBoundingClientRect(); return {x:q.x+q.width/2,y:q.y+q.height/2,tid:e.getAttribute('data-test-id'),txt:(e.innerText||'').trim(),href:e.getAttribute('href')}; });
  log.push(`${T()} CLICK side menu ${JSON.stringify(nav)}`);
  if(!nav){ log.push('no nav'); break; }
  await p.mouse.click(nav.x,nav.y);
  await p.waitForTimeout(6000);
  if(r===1) await p.screenshot({path:`${ev}/${TAG}-2-after-nav.png`});
  log.push(`${T()} URL ${p.url().replace(/^https:\/\/[^/]+/,'')}`);
}
clearInterval(poll);
const out=log.filter(l=>!/IBS Location ID/.test(l));
const rounds=out.join('\n').split('--- round').slice(1).map((x,i)=>`round ${i+1}: emptyId404=${/RES 404 GET \/api\/invoices\/\/details/.test(x)} errorToast=${/TOAST-SHOWN .*Error fetching draft invoice details/.test(x)}`); out.push('SUMMARY',...rounds);
fs.writeFileSync(`${ev}/${TAG}-log.txt`,out.join('\n')+'\n'); console.log(out.join('\n'));
await s.close();
