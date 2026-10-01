/**
 * FIRST QUESTION ON A NEW ENVIRONMENT: does the thing we are testing even exist here?
 *
 * Run 415 is the Global Search V2 suite. V2 is an unreleased feature that has been tested on a QA
 * branch and on staging. Before running 306 checks against production, establish:
 *   1. does the account sign in?
 *   2. what build is production on?
 *   3. is the V2 search panel present at all, or is production still on the old dropdown?
 *   4. what can THIS account see - it is a service advisor WITHOUT reports, so permission-scoped
 *      checks will behave differently from the admin the suite was run with on staging.
 *
 * Reporting "306 failures" because a feature is not deployed would be worthless and alarming.
 */
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
// PROD_ENVF must be set in the ENVIRONMENT before node starts - prod-login-boot.mjs reads it at
// MODULE LOAD, so assigning process.env AFTER the import is too late and it silently falls back to
// the default file. That mistake signed in as the QA lead's own production account on 2026-10-01
// and, per the documented trap, expired his live session.
const { page, browser } = await bootProdLogin('/customers', { settle: 12000 });
page.setDefaultTimeout(25000);
const out={};
out.url = page.url();
out.build = await page.evaluate(()=>{
  const m=document.body.innerText.match(/v\d+\.\d+\.\d+-[0-9a-f]+/); return m?m[0]:'not on page';
});
// 1. is there a search trigger in the header at all, and what does it say?
out.trigger = await page.evaluate(()=>{
  const b=document.querySelector('.global-search__trigger');
  if(b) return {found:'V2 trigger', text:b.innerText.replace(/\s+/g,' ').trim(), aria:b.getAttribute('aria-label')};
  const any=[...document.querySelectorAll('input,button')].find(e=>/search/i.test(e.placeholder||e.getAttribute('aria-label')||e.innerText||''));
  return any?{found:'something else', tag:any.tagName, text:(any.innerText||any.placeholder||'').slice(0,60)}:{found:'NOTHING'};
});
// 2. does Ctrl+K open the V2 panel?
await page.keyboard.press('Control+k'); await page.waitForTimeout(2000);
out.panel = await page.evaluate(()=>{
  const m=document.querySelector('.search-modal');
  if(!m) return {v2Panel:false};
  return {v2Panel:true, placeholder:m.querySelector('input')?.placeholder,
          tabs:[...document.querySelectorAll('.search-tabs__tab')].map(t=>t.innerText.replace(/\s+/g,' ').trim())};
});
// 3. what is this account allowed to see?
out.account = await page.evaluate(()=>{
  try{ const u=JSON.parse(localStorage.getItem('user')||'{}').data||{};
    return {role:u.role?.name, permissions:(u.fe_permissions||[]).length, workplace:u.workplace?.name||u.company?.name};
  }catch(e){ return {error:String(e)}; }
});
console.log(JSON.stringify(out,null,1));
await browser.close();
