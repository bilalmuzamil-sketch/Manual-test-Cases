import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const { browser, page, ctx } = await boot2('admin', { workplaceId:'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const T=(s)=>page.waitForTimeout(s);
// (a) INTERACTIVE: open Status panel, click Estimate via Playwright
await page.goto('https://app.staging.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
await page.click('[data-test-id=filter_chip_status]'); await T(1000);
try { await page.getByRole('button',{name:'Estimate',exact:true}).click({timeout:4000}); } catch(e){ console.log('estimate click err',e.message); }
await T(1500); await page.keyboard.press('Escape'); await T(1000);
console.log('A_URL_after_click', page.url());
const chip=await page.textContent('[data-test-id=filter_chip_status]').catch(()=>null);
console.log('A_STATUS_CHIP_TEXT', JSON.stringify(chip));
const active=await page.evaluate(()=>{const c=document.querySelector('[data-test-id=filter_chip_status]'); return c? {cls:c.className.includes('bg-')||/active|selected|primary/i.test(c.className), style:getComputedStyle(c).backgroundColor}:null;});
console.log('A_STATUS_CHIP_STYLE', JSON.stringify(active));
// (b) URL-DRIVEN persistence + share
const furl='https://app.staging.shopview.com/workorders?tab=all&filters[0][field]=status&filters[0][value]=estimate';
await page.goto(furl,{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
const chipB=await page.textContent('[data-test-id=filter_chip_status]').catch(()=>null);
console.log('B_chip_from_url', JSON.stringify(chipB), 'url', page.url());
await page.reload({waitUntil:'domcontentloaded'}); await T(5000);
const chipR=await page.textContent('[data-test-id=filter_chip_status]').catch(()=>null);
console.log('B_chip_after_reload', JSON.stringify(chipR), 'PERSISTED_url', page.url().includes('estimate'));
// share in fresh context
const ctx2=await browser.newContext({viewport:{width:1600,height:1000},ignoreHTTPSErrors:true});
await ctx2.addCookies(await ctx.cookies());
const p2=await ctx2.newPage();
await p2.goto(furl,{waitUntil:'domcontentloaded',timeout:60000}); await p2.waitForTimeout(6000);
const shared=await p2.textContent('[data-test-id=filter_chip_status]').catch(()=>null);
console.log('B_shared_context_chip', JSON.stringify(shared), 'url', p2.url());
await ctx2.close();
// (c) empty state
await page.goto('https://app.staging.shopview.com/workorders?tab=all&filters[0][field]=status&filters[0][value]=declined&filters[1][field]=vehicleHere&filters[1][value]=1',{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
const empty=await page.evaluate(()=>{const rows=document.querySelectorAll('[data-test-id=button_vehicle_here_toggle]').length; const t=document.body.innerText; const m=(t.match(/no work orders[^\n]*|no results[^\n]*|no data[^\n]*|nothing to show[^\n]*/i)||[])[0]; return {rows, emptyMsg:m||null, tail:t.slice(-200)}; });
console.log('C_EMPTY', JSON.stringify(empty));
// (d) entity panel search box - Parts category
await page.goto('https://app.staging.shopview.com/parts/inventory',{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
await page.click('[data-test-id=filter_chip_category]'); await T(1200);
const es=await page.evaluate(()=>{const pops=[...document.querySelectorAll('.q-menu,.q-card,.q-popup__content')]; const pp=pops[pops.length-1]; if(!pp)return null; const ins=[...pp.querySelectorAll('input')].map(i=>i.getAttribute('placeholder')||i.getAttribute('aria-label')); const foot=[...pp.querySelectorAll('button')].map(b=>(b.textContent||'').trim()).filter(Boolean).slice(0,5); return {inputs:ins, footer:foot}; });
console.log('D_PARTS_CATEGORY_PANEL', JSON.stringify(es));
await browser.close();
