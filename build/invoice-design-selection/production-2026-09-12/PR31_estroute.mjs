// PRODUCTION -- find how the app renders the estimate document for a NEVER-INVOICED estimate job.
// No estimate-status work order carries invoice_id, so the preview route cannot be called from the
// list payload. Walk the screen and read the network log; do not guess routes.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), net:[], clickables:[], after:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR31.json`, JSON.stringify(R,null,1));
const WO='f7fc549d-5b80-439b-b610-a64fdabe8c68', NUM='S1-860';
const { browser, page } = await bootProdLogin('/');
page.on('request', r=>{ const u=r.url(); if(/api\.shopview\.com/.test(u)) R.net.push({m:r.method(), u:u.replace('https://api.shopview.com','')}); });
R.build=await page.evaluate(()=>{const m=document.querySelector('meta[name="app-version"]');return m?m.content:null;});
for(const tab of ['','/finance']){
  const url=`${APP}/workorders/${WO}${tab}`;
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
  await page.waitForTimeout(9000);
  const id=await page.evaluate((n)=>{const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return {url:location.href, onRightRecord:t.includes(n), len:t.length, head:t.slice(0,220)};}, NUM);
  L('%s -> %s onRecord=%s len=%s', tab||'(overview)', id.url, id.onRightRecord, id.len);
  R.after[tab||'overview']=id;
  await page.screenshot({path:`${EV}/PR31-${tab?'finance':'overview'}.png`, fullPage:true});
  if(!id.onRightRecord){ L('  NOT on the record -- stopping, this is not a product finding'); save(); await browser.close(); process.exit(0); }
}
// enumerate every visible clickable on the finance screen, NO container exclusion (L0060)
R.clickables=await page.evaluate(()=>{
  const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  return [...document.querySelectorAll('button,[role=button],a,[data-test-id]')].filter(ok)
    .map(e=>({tag:e.tagName, tid:e.getAttribute('data-test-id')||null,
      txt:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,60),
      aria:e.getAttribute('aria-label')||null, href:e.getAttribute('href')||null}))
    .filter(x=>x.txt||x.tid||x.aria);
});
L('clickables %d', R.clickables.length);
L('print/estimate-ish: %s', JSON.stringify(R.clickables.filter(c=>/print|estimate|pdf|email|send|preview|document/i.test(`${c.txt} ${c.tid} ${c.aria}`))));
R.netBefore=R.net.length;
save();
// click anything that looks like it renders the estimate document
const target=await page.evaluate(()=>{
  const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
  const c=[...document.querySelectorAll('button,[role=button],a,[data-test-id]')].filter(ok)
    .find(e=>/print|preview/i.test(`${e.textContent||''} ${e.getAttribute('data-test-id')||''} ${e.getAttribute('aria-label')||''}`));
  if(!c) return null; c.click();
  return {txt:(c.textContent||'').trim().slice(0,60), tid:c.getAttribute('data-test-id')||null};
});
R.clicked=target; L('clicked %s', JSON.stringify(target));
await page.waitForTimeout(12000);
await page.screenshot({path:`${EV}/PR31-after-click.png`, fullPage:true});
R.netAfter=R.net.slice(R.netBefore);
L('calls after the click:'); for(const n of R.netAfter) L('   %s %s', n.m, n.u.slice(0,140));
R.docCalls=R.net.filter(n=>/preview|estimate|document|pdf|print/i.test(n.u));
L('document-ish calls seen all session: %s', JSON.stringify(R.docCalls.slice(0,25)));
save(); await browser.close();
