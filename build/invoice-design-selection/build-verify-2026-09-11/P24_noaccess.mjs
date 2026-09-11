// C53529: a user WITHOUT settings access. Technician via quick-login, with the admin as the
// positive control (an instrument that shows nothing to everyone proves nothing).
import { boot } from '/home/user/Manual-test-Cases/build/testing-tools/qa-branch-boot.mjs';
import fs from 'fs';
const DIR='/home/user/Manual-test-Cases/build/invoice-design-selection/build-verify-2026-09-11';
const APP='https://sv9872.qa.shopview.com';
const log=(...a)=>console.log(new Date().toISOString().slice(11,19),a.map(x=>typeof x==='string'?x:JSON.stringify(x)).join(' '));
const R={}; const save=()=>fs.writeFileSync(`${DIR}/evidence/P24.json`, JSON.stringify(R,null,1));
const VIS=`(e)=>{const r=e.getBoundingClientRect();const c=getComputedStyle(e);
  return r.width>0&&r.height>0&&c.display!=='none'&&c.visibility!=='hidden'&&parseFloat(c.opacity)>0.01;}`;

const check = async (who)=>{
  const s=await boot('sv9872','/administration/settings',who); const page=s.page;
  await page.setViewportSize({width:1600,height:1100});
  await page.waitForTimeout(9000);
  const o={who, url:page.url(),
    perms: await page.evaluate(()=>{try{const u=JSON.parse(localStorage.getItem('user')||'{}');
      return {fe:(u.fe_permissions||[]).length, role:(u.role&&u.role.name)||null, slug:u.template_slug||null};}catch(e){return null;}}),
    sidebar: await page.evaluate(vis=>{const isVis=eval(vis);
      return [...document.querySelectorAll('.q-item,a,nav *')].filter(isVis)
        .map(e=>(e.innerText||'').replace(/\s+/g,' ').trim()).filter(x=>x&&x.length<32).slice(0,30);},VIS),
    bodyText: await page.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,350))};
  // try to reach the Invoice tab
  await page.evaluate(vis=>{const isVis=eval(vis);const t=e=>(e.innerText||'').replace(/\s+/g,' ').trim();
    const el=[...document.querySelectorAll('a,div,[role=tab],.q-tab')].filter(isVis).find(e=>t(e)==='Invoice'); if(el)el.click();},VIS);
  await page.waitForTimeout(6000);
  o.afterInvoiceTab = {
    url: page.url(),
    designControls: await page.evaluate(vis=>{const isVis=eval(vis);
      return [...document.querySelectorAll('.q-field,.q-select,.q-toggle')].filter(isVis)
        .filter(x=>/invoice design|legacy invoice layout/i.test(x.innerText||''))
        .map(x=>(x.innerText||'').replace(/\s+/g,' ').trim().slice(0,60));},VIS),
    anyDesignWordOnPage: await page.evaluate(()=>/invoice design/i.test(document.body.innerText||'')),
    settingsControlCount: await page.evaluate(vis=>{const isVis=eval(vis);
      return [...document.querySelectorAll('.q-field,.q-select,.q-toggle,input')].filter(isVis).length;},VIS),
    text: await page.evaluate(()=>(document.body.innerText||'').replace(/\s+/g,' ').slice(0,400))};
  await page.screenshot({path:`${DIR}/evidence/P24-${who}.png`, fullPage:false});
  await s.browser.close();
  return o;
};

R.tech = await check('tech');
log('TECH: url=%s perms=%s', R.tech.url, JSON.stringify(R.tech.perms));
log('  sidebar: %s', JSON.stringify(R.tech.sidebar).slice(0,400));
log('  after Invoice tab: url=%s designControls=%s anyDesignWord=%s controlsOnPage=%d',
  R.tech.afterInvoiceTab.url, JSON.stringify(R.tech.afterInvoiceTab.designControls),
  R.tech.afterInvoiceTab.anyDesignWordOnPage, R.tech.afterInvoiceTab.settingsControlCount);
log('  text: %s', R.tech.afterInvoiceTab.text.slice(0,220));
save();

R.admin = await check('admin');   // THE POSITIVE CONTROL
log('ADMIN: perms=%s', JSON.stringify(R.admin.perms));
log('  after Invoice tab: designControls=%s anyDesignWord=%s controlsOnPage=%d',
  JSON.stringify(R.admin.afterInvoiceTab.designControls),
  R.admin.afterInvoiceTab.anyDesignWordOnPage, R.admin.afterInvoiceTab.settingsControlCount);
save();
R.verdict={techSeesIt:R.tech.afterInvoiceTab.anyDesignWordOnPage, adminSeesIt:R.admin.afterInvoiceTab.anyDesignWordOnPage,
  instrumentProven:R.admin.afterInvoiceTab.anyDesignWordOnPage===true};
log('VERDICT %s', JSON.stringify(R.verdict));
save(); log('done'); process.exit(0);
