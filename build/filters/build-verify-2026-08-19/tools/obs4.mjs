import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const { browser, page, ctx } = await boot2('admin', { workplaceId:'b3c8c820-f815-4cf1-8938-10956c5ee71a' });
const T=(s)=>page.waitForTimeout(s);
await page.goto('https://app.staging.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000}); await T(6000);
await page.click('[data-test-id=filter_chip_status]'); await T(1000);
await page.click('[data-test-id=filter_option_status_estimate]'); await T(1500);
await page.keyboard.press('Escape'); await T(1200);
const url1=page.url();
console.log('URL_after_estimate', url1);
console.log('CHIP', JSON.stringify(await page.textContent('[data-test-id=filter_chip_status]').catch(()=>null)));
const style=await page.evaluate(()=>{const c=document.querySelector('[data-test-id=filter_chip_status]'); return c?{bg:getComputedStyle(c).backgroundColor,color:getComputedStyle(c).color,cls:c.className}:null;});
console.log('CHIP_STYLE', JSON.stringify({bg:style.bg,color:style.color, hasClear: !!document.querySelector}));
console.log('HAS_CLEAR_X', await page.evaluate(()=>!!document.querySelector('[data-test-id^=filter_chip_clear_status], [data-test-id=filter_chip_clear_status]')));
// persistence: reload
await page.reload({waitUntil:'domcontentloaded'}); await T(5000);
console.log('URL_reload', page.url(), 'CHIP_reload', JSON.stringify(await page.textContent('[data-test-id=filter_chip_status]').catch(()=>null)));
// share: 2nd page in SAME authed context (localStorage shared per-context)
const p2=await ctx.newPage();
await p2.goto(url1,{waitUntil:'domcontentloaded',timeout:60000}); await p2.waitForTimeout(6000);
console.log('SHARE_p2_url', p2.url(), 'SHARE_chip', JSON.stringify(await p2.textContent('[data-test-id=filter_chip_status]').catch(()=>null)));
await p2.close();
// empty: apply a status with no rows via UI (Paid maybe empty) - use the interactive filter
await page.goto('https://app.staging.shopview.com/workorders?tab=all',{waitUntil:'domcontentloaded',timeout:60000}); await T(5000);
await page.click('[data-test-id=filter_chip_status]'); await T(800);
await page.click('[data-test-id=filter_option_status_review]').catch(()=>{}); await T(1500); await page.keyboard.press('Escape'); await T(1500);
const empty=await page.evaluate(()=>{const rows=document.querySelectorAll('[data-test-id=button_vehicle_here_toggle]').length; const t=document.body.innerText; const m=(t.match(/no work orders[^\n]*|no results[^\n]*|no matching[^\n]*|nothing[^\n]*/i)||[])[0]; return {rows,url:location.href,msg:m||null}; });
console.log('EMPTY_review', JSON.stringify(empty));
await browser.close();
