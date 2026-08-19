import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const { browser, page, ctx } = await boot2('admin', { workplaceId:'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const T=(s)=>page.waitForTimeout(s);
await page.goto('https://app.staging.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
await page.click('[data-test-id=filter_chip_status]'); await T(1000);
await page.click('[data-test-id=filter_option_status_estimate]'); await T(1500);
await page.keyboard.press('Escape'); await T(1200);
const url1=page.url();
const info=await page.evaluate(()=>{
  const c=document.querySelector('[data-test-id=filter_chip_status]');
  return { bg:getComputedStyle(c).backgroundColor, color:getComputedStyle(c).color,
    hasClear: !!document.querySelector('[data-test-id=filter_chip_clear_status]'),
    clearDti: [...document.querySelectorAll('[data-test-id*=clear]')].map(e=>e.getAttribute('data-test-id')) };
});
console.log('URL', url1, 'CHIP_STYLE', JSON.stringify(info));
// persistence
await page.reload({waitUntil:'domcontentloaded'}); await T(5000);
console.log('RELOAD url', page.url(), 'chip', JSON.stringify(await page.textContent('[data-test-id=filter_chip_status]').catch(()=>null)));
// share via new page same context
const p2=await ctx.newPage();
await p2.goto(url1,{waitUntil:'domcontentloaded',timeout:60000}); await p2.waitForTimeout(6000);
console.log('SHARE url', p2.url(), 'chip', JSON.stringify(await p2.textContent('[data-test-id=filter_chip_status]').catch(()=>null)));
await p2.close();
// clear-per-chip: click the cancel X
await page.click('[data-test-id=filter_chip_clear_status]').catch(async()=>{ console.log('trying alt clear'); });
await T(1500);
console.log('AFTER_CLEAR url', page.url(), 'chip', JSON.stringify(await page.textContent('[data-test-id=filter_chip_status]').catch(()=>null)));
// empty state via review status
await page.goto('https://app.staging.shopview.com/workorders?tab=all&status=review',{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
const empty=await page.evaluate(()=>{const rows=document.querySelectorAll('[data-test-id=button_vehicle_here_toggle]').length; const t=document.body.innerText; const m=(t.match(/no work orders[^\n]*|no results[^\n]*|no matching[^\n]*|nothing[^\n]*|no data[^\n]*/i)||[])[0]; return {rows,msg:m||null,tail:t.slice(-150)}; });
console.log('EMPTY_review', JSON.stringify(empty));
await browser.close();
