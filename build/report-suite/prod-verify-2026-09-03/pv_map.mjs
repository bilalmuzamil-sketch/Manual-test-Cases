// C30354 build verification on PRODUCTION. Step one: get to Parts Velocity the way the case says a
// tester does - top nav "Reports" -> left menu "PARTS" -> "Parts Velocity" - and MAP the real controls
// and the data-fetch call. Nothing is asserted yet; this run only reads.
// PRODUCTION: reads and per-user view state only. No business data is created, edited or deleted.
import { bootProd } from '/home/user/Manual-test-Cases/build/testing-tools/prod-boot.mjs';
import fs from 'fs';
const OUT='build/report-suite/prod-verify-2026-09-03';
const prof=JSON.parse(fs.readFileSync('/tmp/shopview/iam_view-profile_.json','utf8')).data.user;
const fep =JSON.parse(fs.readFileSync('/tmp/shopview/auth_me_fe-permissions.json','utf8')).data;
const { browser, page, APIH, version } = await bootProd('/reports', { settle: 14000 });
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const lab='e=>{const c=e.cloneNode(true);c.querySelectorAll("svg,i[class*=icon]").forEach(n=>n.remove());return (c.textContent||"").replace(/\\s+/g," ").trim();}';
const fetches=[]; page.on('response',r=>{const u=r.url();
  if(u.includes(APIH) && /report|parts-velocity|velocity/i.test(u)) fetches.push({t:Date.now(), s:r.status(), u:u.replace(`https://${APIH}`,'')});});
log('landed', page.url(), '| build', version);
// the location picker can intercept; establish context through the UI, never by guessing an org id
if (/administration\/locations/.test(page.url())) {
  const cards = await page.evaluate(L=>{ const lab=eval(L);
    return [...document.querySelectorAll('.q-card,.q-item,button')].map((e,i)=>{e.setAttribute('data-qa-loc',String(i));return lab(e);})
      .map((t,i)=>({i,t})).filter(x=>x.t && x.t.length<40).slice(0,14); }, lab);
  console.log('location picker offers:', JSON.stringify(cards).slice(0,500));
  const pick = cards.find(c=>/Trucks Hill 2|Truck Hill 1|QA Testing/i.test(c.t));
  if (pick) { log('clicking location', pick.t); await page.locator(`[data-qa-loc="${pick.i}"]`).first().click({force:true}); await page.waitForTimeout(9000); }
  await page.goto('https://app.shopview.com/reports',{waitUntil:'domcontentloaded'}); await page.waitForTimeout(12000);
}
log('now at', page.url());
const menu = await page.evaluate(L=>{ const lab=eval(L);
  return { headings:[...new Set([...document.querySelectorAll('.q-item-label--header,.q-list .text-caption,aside .text-uppercase,aside div')].map(lab).filter(x=>x&&x.length<24))].slice(0,25),
    items:[...new Set([...document.querySelectorAll('aside .q-item,.q-drawer .q-item,aside a,.q-drawer a')].map(lab).filter(x=>x&&x.length<40))] };}, lab);
console.log('LEFT REPORT MENU:', JSON.stringify(menu).slice(0,900));
const pv = page.locator('.q-item:has-text("Parts Velocity"), a:has-text("Parts Velocity")').first();
if (!(await pv.count())) { log('no "Parts Velocity" item in the left menu'); await page.screenshot({path:`${OUT}/no-pv.png`,fullPage:true}); await browser.close(); process.exit(2); }
fetches.length=0;
await pv.click(); await page.waitForTimeout(15000);
log('url', page.url());
console.log('DATA FETCHES on first open:'); fetches.forEach(f=>console.log('  ', f.s, decodeURIComponent(f.u).slice(0,220)));
const ui = await page.evaluate(L=>{ const lab=eval(L);
  const tb=document.querySelector('table');
  return { chips:[...new Set([...document.querySelectorAll('.q-chip,.q-btn--outline,.q-select')].map(lab).filter(x=>x&&x.length<40))],
    buttons:[...new Set([...document.querySelectorAll('button,.q-btn')].map(lab).filter(x=>x&&x.length<26))],
    columns: tb? [...tb.querySelectorAll('thead th')].map(lab):null,
    rows: tb? tb.querySelectorAll('tbody tr').length:0 };}, lab);
console.log('PARTS VELOCITY UI:', JSON.stringify(ui,null,1).slice(0,2000));
fs.writeFileSync(`${OUT}/pv-map.json`, JSON.stringify({version, url:page.url(), menu, ui, fetches},null,1));
await page.screenshot({path:`${OUT}/pv-first-open.png`, fullPage:true});
await browser.close();
