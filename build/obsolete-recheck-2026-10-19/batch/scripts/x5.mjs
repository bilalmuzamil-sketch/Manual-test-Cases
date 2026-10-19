// SV-11123: part sale status card — change Sales representative, reload, restore
import {session} from './rec.mjs'; import {open} from '/home/user/Manual-test-Cases/build/testing-tools/qa-session.mjs'; import fs from 'fs';
const env=process.argv[2]; const SH=`/tmp/qa11310/ex19/${env}-ps-`;
const s= env==='prod'? await open({env:'prod',user:'bilal.muzamil@shopview.com',dir:'/tmp/qa11310',vp:{width:1440,height:900}}) : await session({vp:{width:1440,height:900}});
const p=s.page; const log={mk:await s.marker()}; const reqs=[]; p.on('response',async r=>{const q=r.request(); if(q.method()!=='GET'&&/\/api\//.test(q.url())) reqs.push({m:q.method(),u:q.url().replace(/^https:\/\/[^/]+/,''),st:r.status(),b:(q.postData()||'').slice(0,300)});});
const val=()=>p.evaluate(()=>{const e=document.querySelector('[data-test-id=select_sales_rep]'); return e?e.innerText.replace(/\s+/g,' ').trim():null;});
const card=()=>p.evaluate(()=>{const e=document.querySelector('[data-test-id=select_sales_rep]'); const c=e?.closest('.q-card'); return c?c.innerText.replace(/\s+/g,' ').slice(0,400):null;});
try{
 const ps=(await s.api('/api/part-sales?pagination[page]=1&pagination[rowsPerPage]=20')).json.data.partSales; const PS=ps.find(x=>!['invoiced','paid'].includes(x.status))||ps[0]; log.ps={n:PS.number,status:PS.status,id:PS.id};
 await s.go(`/parts/part-sale/${PS.id}/part-requests`); await p.waitForTimeout(5000); log.url=await p.evaluate(()=>location.pathname); log.v0=await val(); log.card0=await card(); await p.screenshot({path:SH+'0.png'});
 if(env!=='prod'&&log.v0!==null){ await p.click('[data-test-id=select_sales_rep]'); await p.waitForTimeout(1200); log.opts=await p.evaluate(()=>[...document.querySelectorAll('.q-menu .q-item')].map(i=>i.innerText.trim()).slice(0,12));
  const pick=log.opts.find(o=>o&&o!==log.v0&&!/unassigned/i.test(o)); log.pick=pick; if(pick){ await p.click(`.q-menu .q-item:has-text("${pick}")`); await p.waitForTimeout(2500);} await p.keyboard.press('Escape').catch(()=>{}); log.v1=await val(); log.toasts=await p.evaluate(()=>[...document.querySelectorAll('.q-notification')].map(n=>n.innerText.replace(/\s+/g,' ').trim())); await p.screenshot({path:SH+'1-changed.png'});
  await p.reload(); await p.waitForTimeout(6000); log.v2=await val(); await p.screenshot({path:SH+'2-reloaded.png'});
  // restore
  if(log.v2!==log.v0){ await p.click('[data-test-id=select_sales_rep]'); await p.waitForTimeout(1200); await p.click(`.q-menu .q-item:has-text("${log.v0}")`).catch(()=>{}); await p.waitForTimeout(2500); await p.keyboard.press('Escape').catch(()=>{}); await p.reload(); await p.waitForTimeout(5000); log.v3=await val(); }
 }
}catch(e){ log.err=e.message.slice(0,300); }
log.reqs=reqs; fs.writeFileSync(`/tmp/qa11310/ex19/x5-${env}.json`,JSON.stringify(log,null,1)); console.log('DONE'); await s.close();
