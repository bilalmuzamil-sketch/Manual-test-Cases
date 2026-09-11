// The route, given by the QA lead: /administration/settings -> Settings -> the INVOICE tab.
// Read what is actually on it: the control, its options, the helper text, and the exact labels,
// each from the smallest element that owns it.
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),...a);
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;
const R={};
const s = await boot('sv9872','/administration/settings','admin');
const page = s.page;
await page.setViewportSize({width:1600,height:1100});
await page.waitForTimeout(7000);

R.tabs = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  return [...document.querySelectorAll('[role=tab],.q-tab,.q-tabs a,.q-tabs div')].filter(isVis)
    .map(t).filter(Boolean).slice(0,12);}, VIS);
log('tabs across the top: %s', JSON.stringify(R.tabs));

R.clicked = await page.evaluate(vis=>{const isVis=eval(vis); const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
  const el=[...document.querySelectorAll('[role=tab],.q-tab,.q-tabs a,.q-tabs div,a,div')].filter(isVis)
    .find(e=>t(e)==='Invoice');
  if(!el) return false; el.click(); return true;}, VIS);
await page.waitForTimeout(6000);
log('clicked the Invoice tab: %s | now on %s', R.clicked, page.url());

R.page = await page.evaluate(vis=>{const isVis=eval(vis);
  const t=e=>(e.textContent||'').replace(/\s+/g,' ').trim();
  const body=(document.body.innerText||'').replace(/\s+/g,' ');
  // the control itself, read from the element that owns each part
  const field=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis)
    .find(f=>/invoice design/i.test(f.innerText||''));
  let ctl=null;
  if (field){
    const inp=field.querySelector('input');
    const lab=field.querySelector('.q-field__label');
    ctl={label: lab?t(lab):null, value: inp?inp.value:null,
         tid: (inp&&inp.getAttribute('data-test-id'))||field.getAttribute('data-test-id')||'',
         box: field.getBoundingClientRect().toJSON()};
  }
  // the helper text is the sibling caption under the field
  let helper=null;
  if (field){
    let n=field.parentElement;
    for (let i=0;i<3 && n && !helper;i++){
      const cand=[...n.querySelectorAll('div,p,span')].filter(e=>isVis(e)
        && /uses the selected design/i.test(e.textContent||''));
      if (cand.length) helper=t(cand[cand.length-1]);
      n=n.parentElement;
    }
  }
  return {url:location.href, invoiceDesign:/invoice design/i.test(body), control:ctl, helper,
    headings:[...document.querySelectorAll('h1,h2,h3,h4,.text-h6,.text-subtitle1,strong')].filter(isVis)
      .map(t).filter(Boolean).slice(0,25),
    body: body.slice(0,700)};}, VIS);
log('Invoice Design control: %s', JSON.stringify(R.page.control));
log('helper text: %s', JSON.stringify(R.page.helper));
log('other settings on the tab: %s', JSON.stringify(R.page.headings).slice(0,320));
await page.screenshot({path:`${DIR}/evidence/P03-invoice-tab.png`, fullPage:true}).catch(()=>{});

// open the pick list and read the options
R.options = await page.evaluate(vis=>{const isVis=eval(vis);
  const f=[...document.querySelectorAll('.q-field,.q-select')].filter(isVis)
    .find(x=>/invoice design/i.test(x.innerText||''));
  if(!f) return {opened:false};
  (f.querySelector('input')||f).click(); return {opened:true};}, VIS);
await page.waitForTimeout(2500);
R.optionList = await page.evaluate(vis=>{const isVis=eval(vis);
  return [...document.querySelectorAll('.q-menu .q-item,[role=option]')].filter(isVis)
    .map(e=>({text:(e.innerText||'').replace(/\s+/g,' ').trim(),
      selected: e.classList.contains('q-item--active')||e.getAttribute('aria-selected')==='true'}));}, VIS);
log('the pick list offers: %s', JSON.stringify(R.optionList));
await page.screenshot({path:`${DIR}/evidence/P03-options.png`, fullPage:true}).catch(()=>{});
await page.keyboard.press('Escape');
fs.writeFileSync(`${DIR}/evidence/P03.json`, JSON.stringify(R,null,1));
log('done');
await s.browser.close();
process.exit(0);
