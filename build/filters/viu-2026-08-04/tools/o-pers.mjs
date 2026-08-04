import * as H from './h.mjs';
import fs from 'fs';
const R={}; const S=n=>{fs.writeFileSync('/tmp/fviu/o-pers.json',JSON.stringify(R,null,1));console.log('..'+n);};
const T=async(k,fn)=>{try{R[k]=await fn();}catch(e){R[k]={ERROR:e.message.slice(0,220)};}S(k);};
// ---- session A: set filters, read the saved-preferences payload
let A=await H.open(); let {page,netlog}=A;
await H.resetFilters(page);
await T('setup',async()=>{
  await H.openChip(page,'Status');
  await page.locator('[data-test-id="filter_option_status_invoiced"]').first().click({timeout:15000});await page.waitForTimeout(3500);
  await H.openChip(page,'Asset on Site');
  await page.locator('[data-test-id="filter_option_vehicleHere_1"]').first().click({timeout:15000});await page.waitForTimeout(4000);
  return {url:page.url(),chips:await H.chips(page),rows:(await H.rows(page)).n};});
await H.shot(page,'pe-01-setup');
await T('prefGET',async()=>{const r=await H.api('GET','/api/users/me/preferences/work-orders-list');
  return {status:r.status,body:JSON.stringify(r.body).slice(0,1200)};});
await T('navAwayAndBack',async()=>{
  await page.goto(H.APP+'/customers',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(6000);
  await page.goto(H.APP+'/workorders',{waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(12000);
  return {url:page.url(),chips:await H.chips(page),rows:(await H.rows(page)).n,
    backBtn:await page.evaluate(()=>[...document.querySelectorAll('button,a')].filter(e=>/back to/i.test(e.innerText||'')).map(e=>({t:e.innerText.trim(),testid:e.getAttribute('data-test-id')})))};});
await H.shot(page,'pe-02-navback');
await T('reloadPage',async()=>{await page.reload({waitUntil:'domcontentloaded',timeout:60000});await page.waitForTimeout(12000);
  return {url:page.url(),chips:await H.chips(page),rows:(await H.rows(page)).n,
    backBtn:await page.evaluate(()=>[...document.querySelectorAll('button,a')].filter(e=>/back to/i.test(e.innerText||'')).map(e=>e.innerText.trim()))};});
await A.browser.close();
// ---- session B: BRAND NEW browser context (simulates closing the tab/window) — SV-8828
await T('freshContext',async()=>{
  const B=await H.open();
  const r={url:B.page.url(),chips:await H.chips(B.page),rows:(await H.rows(B.page)).n,
    backBtn:await B.page.evaluate(()=>[...document.querySelectorAll('button,a')].filter(e=>/back to/i.test(e.innerText||'')).map(e=>({t:e.innerText.trim(),testid:e.getAttribute('data-test-id'),vis:e.offsetParent!==null}))),
    bodyTop:await B.page.evaluate(()=>document.body.innerText.slice(0,600))};
  await H.shot(B.page,'pe-03-fresh-context');
  await B.browser.close(); return r;});
// ---- session C: URL-driven state + Back to my view
await T('urlDriven',async()=>{
  const C=await H.open({path:'/workorders?status=declined&tab=all'});
  const r={url:C.page.url(),chips:await H.chips(C.page),rows:await H.rows(C.page),
    backBtn:await C.page.evaluate(()=>[...document.querySelectorAll('button,a')].filter(e=>/back to/i.test(e.innerText||'')).map(e=>({t:e.innerText.trim(),testid:e.getAttribute('data-test-id'),vis:e.offsetParent!==null}))),
    prefCalls:H.prefCalls(C.netlog)};
  await H.shot(C.page,'pe-04-url-driven');
  // click Back to my view if present
  const b=C.page.locator('button:has-text("Back To"), button:has-text("Back to"), a:has-text("Back to")').first();
  if(await b.count()){ await b.click({timeout:15000}); await C.page.waitForTimeout(5000);
    r.afterBack={url:C.page.url(),chips:await H.chips(C.page),rows:(await H.rows(C.page)).n,
      backBtnStill:await C.page.evaluate(()=>[...document.querySelectorAll('button,a')].filter(e=>/back to/i.test(e.innerText||'')).length)};
    await H.shot(C.page,'pe-05-after-back'); }
  else r.afterBack={notPresent:true};
  await C.browser.close(); return r;});
// ---- session D: malformed URL
await T('malformedUrl',async()=>{
  const D=await H.open({path:'/workorders?status=%%%&company_id=not-a-uuid&tab=zzz&vehicleHere=banana'});
  const r={url:D.page.url(),chips:await H.chips(D.page),rows:(await H.rows(D.page)).n,
    listCalls:H.listCalls(D.netlog).slice(-2),
    err:await D.page.evaluate(()=>{const t=document.body.innerText;return /error|something went wrong|oops/i.test(t)?t.slice(0,300):null;}),
    tabs:await D.page.evaluate(()=>[...document.querySelectorAll('.q-tab')].map(e=>({t:e.innerText.trim(),sel:e.className.includes('active')||e.getAttribute('aria-selected')})))};
  await H.shot(D.page,'pe-06-malformed');
  await D.browser.close(); return r;});
// ---- session E: URL with a deleted/unknown customer id
await T('unknownIdUrl',async()=>{
  const E=await H.open({path:'/workorders?company_id=00000000-0000-4000-8000-000000000000&status=paid&tab=all'});
  const r={url:E.page.url(),chips:await H.chips(E.page),rows:(await H.rows(E.page)).n,
    listCalls:H.listCalls(E.netlog).slice(-2),
    err:await E.page.evaluate(()=>{const t=document.body.innerText;return /error|something went wrong/i.test(t)?t.slice(0,300):null;})};
  await H.shot(E.page,'pe-07-unknown-id');
  await E.browser.close(); return r;});
// ---- session F: Estimates-tab URL round trip (the missing tab param)
await T('estimatesUrlRoundTrip',async()=>{
  const F=await H.open();
  await H.resetFilters(F.page);
  await F.page.locator('.q-tab:has-text("Estimates")').first().click({timeout:20000});
  await F.page.waitForTimeout(5000);
  const urlOnEstimates=F.page.url();
  await F.browser.close();
  const G=await H.open({path:urlOnEstimates.replace(H.APP,'')});
  const r={urlOnEstimates,reopenedUrl:G.page.url(),
    selectedTab:await G.page.evaluate(()=>{const t=[...document.querySelectorAll('.q-tab')].find(e=>e.className.includes('q-tab--active')||e.getAttribute('aria-selected')==='true');return t?t.innerText.trim():null;}),
    chips:await H.chips(G.page),rows:(await H.rows(G.page)).n,statuses:(await H.rows(G.page)).statuses.slice(0,4)};
  await H.shot(G.page,'pe-08-estimates-url');
  await G.browser.close(); return r;});
console.log('DONE');
