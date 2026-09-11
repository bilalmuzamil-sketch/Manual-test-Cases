// Walk the UI to find the real document routes for a Part Sale and a Credit Invoice,
// by recording every API call the app itself makes. (Rule: find a route by walking, not guessing.)
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P09.json`, JSON.stringify(R,null,1));
const s=await boot('sv9872','/administration/settings','admin'); const page=s.page;
await page.setViewportSize({width:1600,height:1100});
const calls=[]; page.on('request',r=>{const u=r.url(); if(/\/api\//.test(u)) calls.push(r.method()+' '+u.replace(/^https?:\/\/[^/]+/,''));});
const seen=()=>{const c=calls.slice(); calls.length=0; return c;};
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const txtAll=()=>page.evaluate(()=> (document.body.innerText||'').replace(/\s+/g,' ').slice(0,1200));
const go=async(u,ms=7000)=>{await page.goto(APP+u,{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(ms);};
const clickText=(re)=>page.evaluate(({vis,re})=>{const isVis=eval(vis);const rx=new RegExp(re,'i');
  const t=e=>(e.innerText||e.textContent||'').replace(/\s+/g,' ').trim();
  const el=[...document.querySelectorAll('button,a,[role=tab],.q-tab,.q-item,td,div')].filter(isVis)
    .filter(e=>rx.test(t(e))&&t(e).length<60).sort((a,b)=>t(a).length-t(b).length)[0];
  if(el){el.click();return t(el);} return null;},{vis:VIS,re:re.source||re});

// ---------- PART SALES ----------
await go('/part-sales'); R.partSalesList={url:page.url(), calls:seen().slice(-12), text:(await txtAll()).slice(0,300)};
log('part-sales list ->', page.url());
if (!/part-sale/i.test(page.url())){ await go('/parts/part-sales'); R.partSalesList2={url:page.url(), text:(await txtAll()).slice(0,300)}; log('try2 ->', page.url()); }
// open the first row
const opened = await page.evaluate(vis=>{const isVis=eval(vis);
  const rows=[...document.querySelectorAll('tr.cursor-pointer,tbody tr,.q-table tbody tr')].filter(isVis);
  if(rows[0]){rows[0].click(); return (rows[0].innerText||'').replace(/\s+/g,' ').slice(0,120);} return null;},VIS);
await page.waitForTimeout(7000);
R.partSaleOpened={rowText:opened, url:page.url(), calls:seen().slice(-25)};
log('opened part sale row:', opened, '->', page.url());
// find a Finance / document tab inside it
const fin = await clickText(/^(Finance|Invoice|Documents?)$/);
await page.waitForTimeout(7000);
R.partSaleFinance={clicked:fin, url:page.url(), calls:seen().filter(c=>/preview|invoice|document|pdf/i.test(c)),
  text:(await txtAll()).slice(0,500)};
log('part sale finance tab:', fin, '->', page.url());
log('  doc calls:', R.partSaleFinance.calls);
await page.screenshot({path:`${DIR}/evidence/P09-partsale.png`, fullPage:false});
save();

// ---------- CREDIT INVOICE: a customer's Invoices tab ----------
await go('/customers'); seen();
const custRow = await page.evaluate(vis=>{const isVis=eval(vis);
  const rows=[...document.querySelectorAll('tbody tr')].filter(isVis);
  if(rows[0]){rows[0].click(); return (rows[0].innerText||'').replace(/\s+/g,' ').slice(0,100);} return null;},VIS);
await page.waitForTimeout(7000);
const invTab = await clickText(/^Invoices?$/); await page.waitForTimeout(6000);
R.customerInvoices={row:custRow, tab:invTab, url:page.url(), calls:seen().slice(-20),
  text:(await txtAll()).slice(0,700)};
log('customer invoices tab:', invTab, '->', page.url());
await page.screenshot({path:`${DIR}/evidence/P09-customer-invoices.png`});
// look for an Issue Credit control
R.issueCredit = await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('button,a,.q-item')].filter(isVis).map(t)
    .filter(x=>x&&x.length<45).slice(0,40);},VIS);
log('controls on customer invoices:', R.issueCredit);
save();

// ---------- a WORK ORDER Finance tab: what the app calls to render the document ----------
seen(); await go('/workorders/04ab678b-a2c2-4fd7-bcd9-76b6a23a419f/finance', 12000);
R.woFinance={url:page.url(), calls:seen().filter(c=>/preview|pdf|invoice|history|email/i.test(c)),
  text:(await txtAll()).slice(0,400)};
log('WO finance doc calls:', R.woFinance.calls);
R.woFinanceControls = await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('button,.q-btn,[role=button]')].filter(isVis)
    .map(e=>((e.getAttribute('aria-label')||'')+'|'+(e.innerText||'').replace(/\s+/g,' ').trim()).slice(0,50))
    .filter(x=>x!=='|').slice(0,40);},VIS);
log('WO finance controls:', R.woFinanceControls);
await page.screenshot({path:`${DIR}/evidence/P09-wo-finance.png`});
save();
log('done'); await s.browser.close(); process.exit(0);
