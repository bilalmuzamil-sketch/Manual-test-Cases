import { boot2 } from '/home/user/Manual-test-Cases/build/testing-tools/staging-boot2.mjs';
const WP='39522bc6-abca-4f67-bd12-2840043c2d68', TZN='America/Toronto';
const { browser, page } = await boot2('admin', { workplaceId: WP, timezone: TZN, contextOptions:{timezoneId:TZN} });
await page.evaluate(([w,z]) => { localStorage.setItem('location', JSON.stringify(w)); localStorage.setItem('timezone', JSON.stringify(z)); }, [WP,TZN]);
const hits=[]; page.on('response', async r => { if (r.request().method()==='GET' && /\/api\//.test(r.url())) { const t=await r.text().catch(()=>''); const i=t.indexOf('P2B'); if (i>=0) hits.push([r.url().replace(/^.*\/api\//,'').slice(0,120), t.slice(Math.max(0,i-1200), i+60)]); } });
await page.goto('https://app.staging.shopview.com/parts/returns',{waitUntil:'domcontentloaded',timeout:90000}); await page.waitForTimeout(12000);
console.log(JSON.stringify(hits,null,1).slice(0,3000)); await browser.close();
