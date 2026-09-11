// The one question that decides the whole pass: is the Invoice Design setting on this branch?
// The cases were authored on 2026-09-10 against a DRAFT spec for a feature recorded as NOT BUILT.
// Positive control: the same reader must find the OTHER controls on the same settings page — if it
// cannot see those either, a "not there" reading says nothing (Rule 104).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
const s = await boot('sv9872','/administration/settings','admin');
const page = s.page;
R.build = s.buildMarker || null;
const settle=async(ms=6000)=>{ await page.waitForTimeout(ms); };
await settle(7000);

const readPage = async (label)=> page.evaluate(({vis,label})=>{
  const isVis=eval(vis);
  const body=(document.body.innerText||'').replace(/\s+/g,' ');
  const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return {label, url:location.href, chars:body.length,
    mentionsInvoiceDesign:/invoice design/i.test(body),
    mentionsModern:/\bmodern\b/i.test(body), mentionsLegacy:/\blegacy\b/i.test(body),
    // the positive control: can this reader see ANY setting control on this page at all?
    controls:[...document.querySelectorAll('.q-toggle,.q-select,.q-radio,.q-checkbox,select,input')]
      .filter(isVis).length,
    headings:[...document.querySelectorAll('h1,h2,h3,h4,.text-h5,.text-h6,.q-item__label--header')]
      .filter(isVis).map(t).filter(Boolean).slice(0,30),
    tabs:[...document.querySelectorAll('[role=tab],.q-tab,a.q-item')].filter(isVis).map(t)
      .filter(Boolean).slice(0,40),
    firstText: body.slice(0,300)};
}, {vis:VIS, label});

R.settings = await readPage('settings landing');
log('ON %s', R.settings.url);
log('  says "Invoice Design": %s | Modern: %s | Legacy: %s',
  R.settings.mentionsInvoiceDesign, R.settings.mentionsModern, R.settings.mentionsLegacy);
log('  CONTROL — settings controls this reader can see: %d', R.settings.controls);
log('  headings: %s', JSON.stringify(R.settings.headings).slice(0,300));
log('  sidebar/tabs: %s', JSON.stringify(R.settings.tabs).slice(0,400));
await page.screenshot({path:`${DIR}/evidence/P01-settings.png`, fullPage:true}).catch(()=>{});

// walk the settings areas looking for an invoice-settings page
R.walk=[];
for (const route of ['/administration/settings','/administration/invoice-settings','/administration/finance',
                     '/administration/documents','/administration/organization','/administration/app']){
  try{
    await page.goto(`https://sv9872.qa.shopview.com${route}`,{waitUntil:'domcontentloaded',timeout:45000});
    await settle(5000);
    const r = await readPage(route);
    R.walk.push(r);
    log('%s -> %s | Invoice Design: %s | controls %d', route, r.url.split('.com')[1], r.mentionsInvoiceDesign, r.controls);
  }catch(e){ R.walk.push({label:route, error:String(e).slice(0,90)}); log('%s -> %s', route, String(e).slice(0,70)); }
}
fs.writeFileSync(`${DIR}/evidence/P01.json`, JSON.stringify(R,null,1));
log('done');
await s.browser.close();
process.exit(0);
