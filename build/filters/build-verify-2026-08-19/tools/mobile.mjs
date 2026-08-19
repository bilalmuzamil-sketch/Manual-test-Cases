import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
const { chromium } = pw;
const t=await login('admin');
if(t.status===409){ console.log('COOKIES_EXPIRED'); process.exit(2); }
await api(t.sessCookie,'POST','/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const fe=await api(t.sessCookie,'GET','/api/auth/me/fe-permissions');
const cookies=t.sessCookie.split('; ').map(p=>{const i=p.indexOf('='); return {name:p.slice(0,i),value:p.slice(i+1),domain:'.staging.shopview.com',path:'/'};});
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:true,proxy:{server:process.env.HTTPS_PROXY},args:['--no-sandbox','--ignore-certificate-errors','--ssl-version-max=tls1.2']});
const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3,ignoreHTTPSErrors:true});
await ctx.addCookies(cookies);
const page=await ctx.newPage();
await page.goto('https://app.staging.shopview.com/login',{waitUntil:'domcontentloaded',timeout:60000});
await page.evaluate(({u,f})=>{localStorage.setItem('user',JSON.stringify(u));localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f));},{u:{data:t.data},f:fe.body.data});
const T=(s)=>page.waitForTimeout(s);
await page.goto('https://app.staging.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000}); await T(7000);
// chips present on mobile
const chips=await page.evaluate(()=>[...document.querySelectorAll('[data-test-id^=filter_chip]')].map(e=>({id:e.getAttribute('data-test-id'),txt:(e.textContent||'').replace(/\s+/g,' ').trim().slice(0,30)})));
console.log('MOBILE_CHIPS', JSON.stringify(chips));
console.log('HAS_COLLAPSE', await page.evaluate(()=>!!document.querySelector('[data-test-id*=collapse i],[data-test-id*=expand i]')));
// open Status chip -> bottom sheet?
await page.click('[data-test-id=filter_chip_status]').catch(()=>{}); await T(1500);
const sheet=await page.evaluate(()=>{
  const bs=document.querySelector('.q-dialog, .q-bottom-sheet, [class*=bottom-sheet], .q-menu');
  const applyBtn=[...document.querySelectorAll('button')].find(b=>/apply/i.test(b.textContent||''));
  const opts=[...document.querySelectorAll('[data-test-id^=filter_option_status]')].length;
  const dim=!!document.querySelector('.q-dialog__backdrop, .q-menu, [class*=backdrop]');
  return {hasSheet:!!bs, sheetClass:bs?bs.className.slice(0,50):null, hasApply:!!applyBtn, applyTxt:applyBtn?applyBtn.textContent.trim():null, statusOpts:opts, dimmed:dim};
});
console.log('STATUS_SHEET', JSON.stringify(sheet));
// tick a status, check URL does NOT change until apply (deferred)
const urlBefore=page.url();
await page.click('[data-test-id=filter_option_status_estimate]').catch(()=>{}); await T(1200);
const urlAfterTick=page.url();
console.log('DEFERRED_CHECK urlBefore==afterTick:', urlBefore===urlAfterTick, 'afterTick', urlAfterTick);
// find + click apply
const applied=await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/apply/i.test(x.textContent||'')); if(b){b.click();return b.textContent.trim();}return null;});
await T(1500);
console.log('APPLY_BTN', JSON.stringify(applied), 'urlAfterApply', page.url());
await browser.close();
