import pw from '/opt/node22/lib/node_modules/playwright/index.js';
import { login, api } from '/home/user/Manual-test-Cases/build/testing-tools/staging-admin.mjs';
const { chromium } = pw;
const t=await login('admin');
await api(t.sessCookie,'POST','/api/iam/change-location',{workplace_id:'b3c8c820-f815-4cf1-8938-10956c5ee71a',workplace_timezone:'America/Edmonton'});
const fe=await api(t.sessCookie,'GET','/api/auth/me/fe-permissions');
const cookies=t.sessCookie.split('; ').map(p=>{const i=p.indexOf('='); return {name:p.slice(0,i),value:p.slice(i+1),domain:'.staging.shopview.com',path:'/'};});
const browser=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',headless:true,proxy:{server:process.env.HTTPS_PROXY},args:['--no-sandbox','--ignore-certificate-errors','--ssl-version-max=tls1.2']});
const ctx=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:3,ignoreHTTPSErrors:true});
await ctx.addCookies(cookies); const page=await ctx.newPage();
await page.goto('https://app.staging.shopview.com/login',{waitUntil:'domcontentloaded',timeout:60000});
await page.evaluate(({u,f})=>{localStorage.setItem('user',JSON.stringify(u));localStorage.setItem('fe_permissions_wrapper',JSON.stringify(f));},{u:{data:t.data},f:fe.body.data});
const T=(s)=>page.waitForTimeout(s);
await page.goto('https://app.staging.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000}); await T(7000);
// Asset sheet: single select + deferred
await page.click('[data-test-id=filter_chip_vehicleHere]').catch(()=>{}); await T(1200);
const asset=await page.evaluate(()=>{const opts=[...document.querySelectorAll('[data-test-id^=filter_option_vehicleHere]')].map(e=>e.getAttribute('data-test-id')); const apply=[...document.querySelectorAll('button')].some(b=>/apply/i.test(b.textContent||'')); return {opts,apply};});
console.log('ASSET_SHEET', JSON.stringify(asset));
const u0=page.url(); await page.click('[data-test-id=filter_option_vehicleHere_1]').catch(()=>{}); await T(800);
console.log('ASSET_deferred urlUnchanged', page.url()===u0);
await page.keyboard.press('Escape').catch(()=>{}); await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/close|cancel/i.test(x.textContent||'')); if(b)b.click();}); await T(1000);
// Assigned toggle on mobile (in chips row, toggles immediately)
await page.goto('https://app.staging.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000}); await T(5000);
const uA=page.url(); await page.click('[data-test-id=filter_chip_assigned_to_me]').catch(()=>{}); await T(1200);
console.log('ASSIGNED_mobile url', page.url(), 'changedImmediately', page.url()!==uA);
// mobile page search (C38889): toggle search
await page.goto('https://app.staging.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000}); await T(5000);
const ps=await page.evaluate(()=>{const t=!!document.querySelector('[data-test-id=page_search_toggle]'); return {hasSearchToggle:t, iconBtns:[...document.querySelectorAll('[data-test-id=button_column_selection],[data-test-id=button_new_work_order],[data-test-id=page_search_toggle]')].map(e=>e.getAttribute('data-test-id'))};});
console.log('MOBILE_PAGESEARCH', JSON.stringify(ps));
await page.click('[data-test-id=page_search_toggle]').catch(()=>{}); await T(1000);
const psExpanded=await page.evaluate(()=>{const inp=document.querySelector('input[type=text]:not([style*="display: none"])'); return {hasInput:!!inp, ph:inp?inp.getAttribute('placeholder'):null};});
console.log('MOBILE_SEARCH_EXPANDED', JSON.stringify(psExpanded));
await browser.close();
