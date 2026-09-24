// Which three permissions actually came off? Before calling "money is shown to someone who may not see
// it", prove the financial one is genuinely gone (Rule 104).
import { bootProdLogin } from '/home/user/Manual-test-Cases/build/testing-tools/prod-login-boot.mjs';
import fs from 'fs';
const EV='/home/user/Manual-test-Cases/build/simple-flow-v2/run416-execution-2026-09-24/evidence';
const { browser, page, ctx, APIH } = await bootProdLogin('/workorders', { settle: 10000, viewport:{width:1680,height:1000} });
page.setDefaultTimeout(25000);
const j = await (await ctx.request.get(`https://${APIH}/api/auth/me/fe-permissions`,{headers:{Accept:'application/json'},ignoreHTTPSErrors:true})).json();
const now = j?.data?.fe_permissions || [];
fs.writeFileSync(`${EV}/fe-permissions-limited.json`, JSON.stringify(now,null,1));
const before = JSON.parse(fs.readFileSync(`${EV}/fe-permissions-before.json`,'utf8'));
console.log('as Admin:', before.length, '| now:', now.length);
const key = p => (typeof p === 'string') ? p : (p.name || p.slug || p.code || JSON.stringify(p));
const b = new Set(before.map(key)), n = new Set(now.map(key));
console.log('\nREMOVED:'); for (const k of b) if (!n.has(k)) console.log('  -', k);
console.log('ADDED:'); for (const k of n) if (!b.has(k)) console.log('  +', k);
// and what the money columns look like on the lines page right now
await page.goto('https://app.shopview.com/workorders/068f9856-9d28-4500-a3dd-dd6d7aafb15a/lines',{waitUntil:'domcontentloaded'});
await page.waitForTimeout(9000);
const cols = await page.evaluate(()=>[...document.querySelectorAll('th')].map(h=>(h.innerText||'').trim()).filter(Boolean));
console.log('\ncolumns on the lines page:', JSON.stringify(cols));
const money = await page.evaluate(()=>{ const t=document.body.innerText; return { sample: (t.match(/\$[\d,]+\.?\d*/g)||[]).slice(0,8) }; });
console.log('money amounts visible:', JSON.stringify(money.sample));
await page.screenshot({ path: `${EV}/limited-money.png`, fullPage: true });
await browser.close();
