// PRODUCTION -- C53568. Contrary to what I was about to write in a report, this account DOES have an
// invoice IMPORT tab under Settings and an "IBS Batches" report. Walk both and find out whether any
// batch or imported invoice actually exists, and whether one can be produced.
import fs from 'fs';
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/production-2026-09-12';
const EV=`${DIR}/evidence`, APP='https://app.shopview.com';
const L=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={at:new Date().toISOString(), case:'C53568', net:[], screens:{}};
const save=()=>fs.writeFileSync(`${DIR}/PR61.json`, JSON.stringify(R,null,1));
const { browser, page } = await bootProdLogin('/');
page.on('request', r=>{const u=r.url(); if(/api\.shopview\.com/.test(u)) R.net.push(`${r.method()} ${u.replace('https://api.shopview.com','')}`);});
const dump=async(tag)=>{ const d=await page.evaluate(()=>{const ok=e=>{const r=e.getBoundingClientRect();return r.width>2&&r.height>2;};
    const t=(document.body.innerText||'').replace(/\s+/g,' ');
    return {url:location.href, len:t.length, body:t.slice(0,700),
      rows:[...document.querySelectorAll('tr')].filter(ok).map(tr=>(tr.textContent||'').replace(/\s+/g,' ').trim().slice(0,100)).slice(0,12),
      controls:[...document.querySelectorAll('button,[data-test-id],input[type=file]')].filter(ok)
        .map(e=>({tid:e.getAttribute('data-test-id')||null, txt:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,30), tag:e.tagName}))
        .filter(x=>x.tid||x.txt).slice(0,40)};});
  await page.screenshot({path:`${EV}/PR61-${tag}.png`, fullPage:true});
  R.screens[tag]=d; L('%s -> %s', tag, d.url); L('   body: %s', d.body.slice(0,260));
  L('   rows: %s', JSON.stringify(d.rows.slice(0,6)));
  save(); return d; };
// 1. Settings -> the invoices import tab
await page.goto(`${APP}/administration/settings`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(12000);
const clicked=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="link_invoices_import_tab"]');
  if(!b) return false; b.click(); return true;});
L('invoices import tab clicked: %s', clicked);
await page.waitForTimeout(11000);
const imp=await dump('invoices-import');
L('   import controls: %s', JSON.stringify(imp.controls.filter(c=>/import|upload|file|browse|download|template/i.test(`${c.tid} ${c.txt} ${c.tag}`))));
// 2. Reports -> IBS Batches
await page.goto(`${APP}/reports`,{waitUntil:'domcontentloaded',timeout:90000}).catch(()=>{});
await page.waitForTimeout(11000);
const b2=await page.evaluate(()=>{const b=document.querySelector('[data-test-id="report_nav_batch_transactions"]');
  if(!b) return false; b.click(); return true;});
L('IBS Batches clicked: %s', b2);
await page.waitForTimeout(13000);
const bat=await dump('ibs-batches');
R.batchRowCount=bat.rows.filter(r=>r && !/^\s*$/.test(r)).length;
L('IBS batches rows: %d', R.batchRowCount);
R.calls=R.net.filter(u=>/batch|import/i.test(u)).slice(0,15);
L('batch/import calls seen: %s', JSON.stringify(R.calls));
save(); await browser.close();
