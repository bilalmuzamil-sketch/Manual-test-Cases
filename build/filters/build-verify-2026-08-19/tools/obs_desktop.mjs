import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const { browser, page, ctx } = await boot2('admin', { workplaceId:'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const T=(s)=>page.waitForTimeout(s);
const reqs=[]; page.on('request',r=>{const u=r.url(); if(u.includes('/api/work-orders?')) reqs.push(u.replace(/^https:\/\/[^/]+/,''));});
// 1. All tab, apply Status=Estimate + Asset=Yes
await page.goto('https://app.staging.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
await (await page.$('[data-test-id=filter_chip_status]')).click(); await T(1000);
// click Estimate option
const est=await page.evaluate(()=>{const b=[...document.querySelectorAll('button,[role=option],.q-item')].find(e=>/^Estimate$/.test((e.textContent||'').trim())); if(b){b.click();return true;}return false;});
await T(1500); await page.keyboard.press('Escape'); await T(800);
console.log('URL_after_status', page.url());
const chipTxt=await page.evaluate(()=>({status:(document.querySelector('[data-test-id=filter_chip_status]')||{}).textContent, cls:(document.querySelector('[data-test-id=filter_chip_status]')||{}).className}));
console.log('STATUS_CHIP', JSON.stringify(chipTxt).slice(0,200));
// 2. reload -> persistence
const urlBefore=page.url();
await page.reload({waitUntil:'domcontentloaded'}); await T(5000);
console.log('URL_after_reload', page.url(), 'PERSISTED', page.url()===urlBefore);
const chipAfter=await page.evaluate(()=>(document.querySelector('[data-test-id=filter_chip_status]')||{}).textContent);
console.log('STATUS_CHIP_after_reload', JSON.stringify(chipAfter).slice(0,120));
// 3. shareable link in fresh context
const share=page.url();
const ctx2=await browser.newContext({viewport:{width:1600,height:1000},ignoreHTTPSErrors:true});
const cookies=(await ctx.cookies()); await ctx2.addCookies(cookies);
const p2=await ctx2.newPage();
await p2.goto(share,{waitUntil:'domcontentloaded',timeout:60000}); await p2.waitForTimeout(6000);
const sc=await p2.evaluate(()=>(document.querySelector('[data-test-id=filter_chip_status]')||{}).textContent);
console.log('SHARED_LINK_status_chip', JSON.stringify(sc).slice(0,120), 'url', p2.url());
await ctx2.close();
// 4. empty state: filter to a combo unlikely to match (e.g. status=paid + asset=no on estimates? use a rare status)
await page.goto('https://app.staging.shopview.com/workorders?tab=all&filters[0][field]=status&filters[0][value]=declined&filters[1][field]=vehicleHere&filters[1][value]=1',{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
const empty=await page.evaluate(()=>{const t=document.body.innerText; const rows=document.querySelectorAll('[data-test-id=button_vehicle_here_toggle]').length; return {rows, hasNoResults:/no work orders|no results|nothing|no data/i.test(t)}; });
console.log('EMPTY_STATE', JSON.stringify(empty));
// 5. entity panel search box: Parts category
await page.goto('https://app.staging.shopview.com/parts/inventory',{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
await (await page.$('[data-test-id=filter_chip_category]')).click(); await T(1200);
const search=await page.evaluate(()=>{const pops=[...document.querySelectorAll('.q-menu,.q-card')]; const pp=pops[pops.length-1]; if(!pp)return null; const ins=[...pp.querySelectorAll('input')].map(i=>({ph:i.getAttribute('placeholder'),aria:i.getAttribute('aria-label')})); const foot=[...pp.querySelectorAll('button')].map(b=>(b.textContent||'').trim()).filter(Boolean); return {inputs:ins, footer:foot}; });
console.log('PARTS_CATEGORY_SEARCH', JSON.stringify(search));
console.log('---WO_REQS---'); console.log([...new Set(reqs)].slice(0,10).join('\n'));
await browser.close();
